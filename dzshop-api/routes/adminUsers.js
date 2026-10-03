import express from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// LISTE DES UTILISATEURS (admin)
router.get('/users', protect, isAdmin, async function(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users.map(function(u) { return u.versPublic() }))
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// CHANGER LE RÔLE D'UN UTILISATEUR (admin)
router.patch('/users/:id/role', protect, isAdmin, async function(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    const { role } = req.body
    if (!['client', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' })
    }

    // GARDE-FOU : un admin ne peut pas changer son PROPRE rôle
    // (sinon il pourrait se retirer les droits admin par erreur et se retrouver bloqué dehors)
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: 'Tu ne peux pas modifier ton propre rôle' })
    }

    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })

    user.role = role
    await user.save()

    res.json(user.versPublic())
  } catch (err) { res.status(400).json({ message: err.message }) }
})

// BLOQUER / DÉBLOQUER UN UTILISATEUR (admin)
router.patch('/users/:id/status', protect, isAdmin, async function(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    const { status } = req.body
    if (!['actif', 'bloque'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' })
    }

    // GARDE-FOU : un admin ne peut pas se bloquer lui-même
    // (sinon il perdrait l'accès à son propre espace admin, sans personne pour le débloquer)
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: 'Tu ne peux pas te bloquer toi-même' })
    }

    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })

    user.status = status
    await user.save()

    res.json(user.versPublic())
  } catch (err) { res.status(400).json({ message: err.message }) }
})

export default router