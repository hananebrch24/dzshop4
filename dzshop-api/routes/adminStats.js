import express from 'express'
import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

// STATISTIQUES DE LA BOUTIQUE (admin)
router.get('/stats', protect, isAdmin, async function(req, res) {
  try {
    // --- Utilisateurs / produits ---
    const users = await User.countDocuments()
    const clients = await User.countDocuments({ role: 'client' })
    const products = await Product.countDocuments()

    // --- Commandes par statut ---
    const orders = await Order.countDocuments()
    const commandesLivrees = await Order.countDocuments({ statut: 'Livrée' })
    const commandesEnAttente = await Order.countDocuments({ statut: 'En attente' })
    const commandesAnnulees = await Order.countDocuments({ statut: 'Annulée' })

    // --- Chiffre d'affaires : seulement les commandes LIVRÉES ---
    // (une commande "En attente" n'est pas encore un vrai revenu, une "Annulée" n'en est pas un)
    const caResultat = await Order.aggregate([
      { $match: { statut: 'Livrée' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    const chiffreAffaires = caResultat.length ? caResultat[0].total : 0

    // --- Top 5 des produits les plus vendus (sur les commandes livrées) ---
    const topProduits = await Order.aggregate([
      { $match: { statut: 'Livrée' } },
      { $unwind: '$articles' },
      {
        $group: {
          _id: '$articles.produit',
          nom: { $first: '$articles.nom' },
          qte: { $sum: '$articles.qte' },
          revenu: { $sum: { $multiply: ['$articles.prix', '$articles.qte'] } }
        }
      },
      { $sort: { qte: -1 } },
      { $limit: 5 }
    ])

    // --- Ventes des 7 derniers jours (pour le graphique Recharts) ---
    // On prend TOUTES les commandes (pas seulement "Livrée") pour voir l'activité réelle du site.
    const commandes7j = await Order.find({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).select('total createdAt')

    const ventes7j = []
    for (let i = 6; i >= 0; i--) {
      const debut = new Date()
      debut.setHours(0, 0, 0, 0)
      debut.setDate(debut.getDate() - i)

      const fin = new Date(debut)
      fin.setDate(fin.getDate() + 1)

      const ventes = commandes7j
        .filter(function(c) { return c.createdAt >= debut && c.createdAt < fin })
        .reduce(function(somme, c) { return somme + c.total }, 0)

      ventes7j.push({ jour: JOURS[debut.getDay()], ventes: ventes })
    }

    res.json({
      users: users,
      clients: clients,
      products: products,
      orders: orders,
      commandesLivrees: commandesLivrees,
      commandesEnAttente: commandesEnAttente,
      commandesAnnulees: commandesAnnulees,
      chiffreAffaires: chiffreAffaires,
      topProduits: topProduits,
      ventes7j: ventes7j
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router