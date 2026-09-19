import jwt from 'jsonwebtoken'

export function protect(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: 'Non autorisé' })
  try {
    const token = header.split(' ')[1]
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) { res.status(401).json({ message: 'Token invalide' }) }
}