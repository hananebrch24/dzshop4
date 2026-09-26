import express from 'express'
import Order from '../models/Order.js'
import { protect } from '../middleware/auth.js'
const router = express.Router()

// CRÉER une commande (protégé : il faut être connecté)
router.post('/', protect, async function(req, res) {
  // req.user.id vient du token (le videur l'a rempli)
  const commande = await Order.create({ ...req.body, user: req.user.id })
  res.status(201).json(commande)
})

// LISTER mes commandes
router.get('/my', protect, async function(req, res) {
  const commandes = await Order.find({ user: req.user.id })
  res.json(commandes)
})

export default router