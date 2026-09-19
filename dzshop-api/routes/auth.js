import express from 'express'
import bcrypt from 'bcryptjs'        // pour comparer les mots de passe
import jwt from 'jsonwebtoken'      // pour fabriquer le token
import User from '../models/User.js'
const router = express.Router()

// Petite aide : fabrique le "bracelet" (token) de l'utilisateur.
// Il contient son id + son rôle, signé avec la phrase secrète, valable 7 jours.
function creerToken(user) {
  return jwt.sign({ id: user._id, role: user.role },
    process.env.JWT_SECRET, { expiresIn: '7d' })
}

// INSCRIPTION : crée le compte (le mot de passe est haché tout seul par le modèle)
router.post('/register', async function(req, res) {
  try {
    const user = await User.create(req.body)
    // on renvoie l'utilisateur + son token (déjà connecté)
    res.status(201).json({ nom: user.nom, email: user.email, token: creerToken(user) })
  } catch (err) {
    res.status(400).json({ message: 'Email déjà utilisé' })   // email unique
  }
})

// CONNEXION : vérifie email + mot de passe, renvoie un token si c'est bon
router.post('/login', async function(req, res) {
  // 1. On cherche l'utilisateur par son email
  const user = await User.findOne({ email: req.body.email })

  // 2. bcrypt.compare vérifie le mot de passe tapé vs la version hachée
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    // message volontairement vague (on ne dit pas lequel est faux)
    return res.status(401).json({ message: 'Identifiants incorrects' })
  }

  // 3. Tout est bon → on renvoie l'utilisateur + un token
  res.json({ nom: user.nom, email: user.email, role: user.role, token: creerToken(user) })
})

export default router