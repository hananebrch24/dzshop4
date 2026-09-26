import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// protect = "qui es-tu ?"  (401 si on ne sait pas)
export async function protect(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) return res.status(401).json({ message: 'Connexion requise' })

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET)

    // On relit l'utilisateur en base à chaque requête :
    // si son rôle change, ça marche tout de suite.
    const user = await User.findById(decode.id)
    if (!user) return res.status(401).json({ message: 'Compte introuvable' })

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token invalide ou expiré' })
  }
}

// isAdmin = "as-tu le droit ?"  (403 si non). À placer APRÈS protect.
export function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accès réservé à l'admin" })
  }
  next()
}