import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Le fichier reste en MÉMOIRE (dans une variable), le temps de l'envoyer où on veut.
// Pas de passage par le disque : plus simple, et ça marche pareil en local et en ligne.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },   // 3 Mo maximum
  fileFilter: function(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seules les images sont acceptées'))
    }
    cb(null, true)
  }
})

// Envoie le buffer (l'image en mémoire) vers Cloudinary, et attend sa réponse.
// upload_stream travaille avec des "callbacks" : on l'enveloppe dans une Promise
// pour pouvoir écrire "await envoyerVersCloudinary(...)" plus bas.
function envoyerVersCloudinary(buffer) {
  return new Promise(function(resolve, reject) {
    const flux = cloudinary.uploader.upload_stream(
      { folder: 'dzshop' },
      function(err, resultat) {
        if (err) reject(err)
        else resolve(resultat)
      }
    )
    flux.end(buffer)
  })
}

// Seul un admin connecté peut envoyer une image. upload.single('image') lit
// le champ "image" du FormData envoyé par le front et remplit req.file.
router.post('/', protect, isAdmin, upload.single('image'), async function(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image envoyée' })
    }

    // 1) EN LIGNE (ou si tu as une vraie clé Cloudinary en local) : Cloudinary
    // cloudinary lit TOUT SEUL la variable d'environnement CLOUDINARY_URL
    if (process.env.CLOUDINARY_URL) {
      const resultat = await envoyerVersCloudinary(req.file.buffer)
      return res.status(201).json({ imageUrl: resultat.secure_url })
    }

    // 2) EN LOCAL sans Cloudinary : on écrit l'image dans un dossier uploads/
    // (pratique pour tester chez toi avant d'avoir un compte Cloudinary)
    fs.mkdirSync('uploads', { recursive: true })
    const nom = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(req.file.originalname)
    fs.writeFileSync(path.join('uploads', nom), req.file.buffer)

    // On renvoie une adresse COMPLÈTE : le front n'a rien à recoller
    res.status(201).json({ imageUrl: req.protocol + '://' + req.get('host') + '/uploads/' + nom })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Erreurs de multer (fichier trop gros, pas une image...) : message clair en JSON,
// jamais une page d'erreur HTML illisible
router.use(function(err, req, res, next) {
  res.status(400).json({ message: err.message })
})

export default router