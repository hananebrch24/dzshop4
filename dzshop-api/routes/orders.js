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

export default router