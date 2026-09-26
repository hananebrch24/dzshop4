import express from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// LIRE tous (ouvert à tous)
router.get('/', async function (req, res) {
  try {
    const produits = await Product.find()
    res.json(produits)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// LIRE un seul (ouvert à tous)
router.get('/:id', async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Introuvable' })
    }
    const p = await Product.findById(req.params.id)
    if (!p) return res.status(404).json({ message: 'Introuvable' })
    res.json(p)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// CRÉER (ADMIN seulement : protect = connecté, isAdmin = a le droit)
router.post('/', protect, isAdmin, async function (req, res) {
  try {
    // On choisit les champs un par un (jamais Product.create(req.body))
    const { nom, prix, categorie, stock, image } = req.body
    const nouveau = await Product.create({ nom, prix, categorie, stock, image })
    res.status(201).json(nouveau)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

// MODIFIER (ADMIN seulement)
router.put('/:id', protect, isAdmin, async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Introuvable' })
    }
    const { nom, prix, categorie, stock, image } = req.body
    const p = await Product.findByIdAndUpdate(
      req.params.id,
      { nom, prix, categorie, stock, image },
      { returnDocument: 'after', runValidators: true }
    )
    if (!p) return res.status(404).json({ message: 'Introuvable' })
    res.json(p)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

// SUPPRIMER (ADMIN seulement)
router.delete('/:id', protect, isAdmin, async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Introuvable' })
    }
    const p = await Product.findByIdAndDelete(req.params.id)
    if (!p) return res.status(404).json({ message: 'Introuvable' })
    res.json({ message: 'Supprimé' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

export default router