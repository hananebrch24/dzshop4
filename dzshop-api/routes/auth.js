import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'
const router = express.Router()

// Petite aide : fabrique le "bracelet" (token) de l'utilisateur.
// Il contient son id, signé avec la phrase secrète, valable 7 jours.
function creerToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// INSCRIPTION : crée le compte (le mot de passe est haché tout seul par le modèle)
router.post('/register', async function(req, res) {
  try {
    // On choisit les 3 champs autorisés. JAMAIS User.create(req.body) :
    // sinon un visiteur pourrait envoyer "role": "admin" et devenir admin.
    const { nom, email, password } = req.body

    if (!nom || !email || !password) {
      return res.status(400).json({ message: 'Nom, email et mot de passe obligatoires' })
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit faire au moins 6 caractères' })
    }

    const existe = await User.findOne({ email: String(email).toLowerCase().trim() })
    if (existe) return res.status(400).json({ message: 'Email déjà utilisé' })

    const user = await User.create({ nom: nom, email: email, password: String(password) })

    // on renvoie l'utilisateur + son token (déjà connecté)
    res.status(201).json({ token: creerToken(user), user: user.versPublic() })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// CONNEXION : vérifie email + mot de passe, renvoie un token si c'est bon
router.post('/login', async function(req, res) {
  try {
    // 1. On cherche l'utilisateur par son email
    const user = await User.findOne({ email: String(req.body.email || '').toLowerCase().trim() })

    // 2. On vérifie le mot de passe tapé vs la version hachée
    if (!user || !(await user.verifierMotDePasse(String(req.body.password || '')))) {
      // message volontairement vague (on ne dit pas lequel est faux)
      return res.status(401).json({ message: 'Identifiants incorrects' })
    }

    // 3. Tout est bon → on renvoie l'utilisateur + un token
    res.json({ token: creerToken(user), user: user.versPublic() })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// QUI SUIS-JE ? (le front s'en sert pour vérifier que le token est encore valable)
router.get('/me', protect, function(req, res) {
  res.json({ user: req.user.versPublic() })
})

export default router