import express from 'express'
import Product from '../models/Product.js'
import { protect } from '../middleware/auth.js'

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
    const p = await Product.findById(req.params.id)
    if (!p) return res.status(404).json({ message: 'Introuvable' })
    res.json(p)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// CRÉER (protégé)
router.post('/', protect, async function (req, res) {
  try {
    const nouveau = await Product.create(req.body)
    res.status(201).json(nouveau)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

// MODIFIER (protégé)
router.put('/:id', protect, async function (req, res) {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(p)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

// SUPPRIMER (protégé)
router.delete('/:id', protect, async function (req, res) {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ message: 'Supprimé' })
})

export default router