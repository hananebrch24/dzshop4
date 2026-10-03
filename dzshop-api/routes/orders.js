import express from 'express'
import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Livraison gratuite dès 10 000 DZD (la même règle que dans ton CartContext)
const SEUIL_LIVRAISON_GRATUITE = 10000
const FRAIS_LIVRAISON = 500

// CRÉER UNE COMMANDE (client connecté)
router.post('/', protect, async function(req, res) {
  try {
    const { articles, telephone, wilaya, commune, adresse } = req.body

    if (!Array.isArray(articles) || articles.length === 0) {
      return res.status(400).json({ message: 'Le panier est vide' })
    }
    if (!telephone || !wilaya || !adresse) {
      return res.status(400).json({ message: 'Téléphone, wilaya et adresse obligatoires' })
    }

    // Le navigateur envoie SEULEMENT { produit: _id, qte }.
    // Les prix, on va les chercher NOUS-MÊMES dans la base.
    const ids = articles.map(function(a) { return String(a.produit) })
    if (!ids.every(function(id) { return mongoose.isValidObjectId(id) })) {
      return res.status(400).json({ message: 'Produit invalide' })
    }
    const produits = await Product.find({ _id: { $in: ids } })

    let sousTotal = 0
    const lignes = []

    for (const a of articles) {
      const produit = produits.find(function(p) { return String(p._id) === String(a.produit) })
      const qte = Number(a.qte)

      if (!produit) return res.status(400).json({ message: 'Produit introuvable' })
      if (!Number.isInteger(qte) || qte < 1 || qte > 99) {
        return res.status(400).json({ message: 'Quantité invalide pour ' + produit.nom })
      }

      // Le stock doit suffire (on vérifie TOUT avant de toucher au stock)
      if (qte > produit.stock) {
        return res.status(400).json({ message: 'Stock insuffisant pour ' + produit.nom })
      }

      sousTotal += produit.prix * qte
      lignes.push({ produit: produit._id, nom: produit.nom, prix: produit.prix, qte: qte })
    }

    const livraison = sousTotal >= SEUIL_LIVRAISON_GRATUITE ? 0 : FRAIS_LIVRAISON

    const commande = await Order.create({
      user: req.user._id,
      client: req.user.nom,
      articles: lignes,
      sousTotal: sousTotal,
      livraison: livraison,
      total: sousTotal + livraison,
      telephone: telephone,
      wilaya: wilaya,
      commune: commune,
      adresse: adresse
    })

    // Commande enregistrée : on retire les articles vendus du stock
    for (const ligne of lignes) {
      await Product.updateOne({ _id: ligne.produit }, { $inc: { stock: -ligne.qte } })
    }

    res.status(201).json(commande)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// MES COMMANDES (client connecté)
router.get('/my', protect, async function(req, res) {
  try {
    const commandes = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(commandes)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// TOUTES LES COMMANDES (admin)
router.get('/', protect, isAdmin, async function(req, res) {
  try {
    const commandes = await Order.find().sort({ createdAt: -1 })
    res.json(commandes)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// CHANGER LE STATUT D'UNE COMMANDE (admin seulement)
// Si on passe la commande à "Annulée", on RESTITUE le stock des produits.
// Le garde-fou "etaitAnnulee" évite de recréditer le stock 2 fois si on
// re-clique sur "Annulée" alors qu'elle l'était déjà.
router.patch('/:id/statut', protect, isAdmin, async function(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Commande introuvable' })
    }

    const { statut } = req.body
    if (!['En attente', 'Livrée', 'Annulée'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' })
    }

    const commande = await Order.findById(req.params.id)
    if (!commande) return res.status(404).json({ message: 'Commande introuvable' })

    const etaitAnnulee = commande.statut === 'Annulée'

    commande.statut = statut
    await commande.save()

    // On ne restitue le stock QUE si elle passe à "Annulée" MAINTENANT
    // (si elle était déjà annulée, on ne touche plus au stock : pas de double restitution)
    if (statut === 'Annulée' && !etaitAnnulee) {
      for (const ligne of commande.articles) {
        await Product.updateOne({ _id: ligne.produit }, { $inc: { stock: ligne.qte } })
      }
    }

    res.json(commande)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router