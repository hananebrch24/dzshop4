import dns from 'node:dns'
dns.setServers(['8.8.8.8', '8.8.4.4'])   // fix DNS MongoDB

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import uploadRoutes from './routes/upload.js'
import adminUsersRoutes from './routes/adminUsers.js'
import adminStatsRoutes from './routes/adminStats.js'
dotenv.config()

// Sans phrase secrète, on ne démarre pas : mieux vaut planter que d'être vulnérable
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET manquant dans le fichier .env')
}

// cloudinary lit TOUT SEUL la variable CLOUDINARY_URL si elle existe.
// Si elle n'existe pas (en local sans compte Cloudinary), upload.js bascule
// automatiquement sur un dossier "uploads/" en local : rien à faire ici.
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true })
}

mongoose.connect(process.env.MONGO_URI)
  .then(function(){ console.log('✅ MongoDB connecté') })
  .catch(function(err){ console.log('❌ Erreur : ' + err.message) })

const app = express()

// Qui a le droit d'appeler l'API depuis un navigateur ?
// En local : Vite (port 5173). En ligne : l'adresse de ton site (variable FRONTEND_URL).
const origines = ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean)
app.use(cors({ origin: origines }))
app.use(express.json())

// Images envoyées en local (sans Cloudinary) : servies directement depuis ce dossier
app.use('/uploads', express.static('uploads'))

// Toute adresse /api/products → gérée par routes/products.js
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminUsersRoutes)
app.use('/api/admin', adminStatsRoutes)
app.get('/', function(req, res) {
  res.json({ message: 'API DZShop en ligne 🚀' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, function() {
  console.log('Serveur démarré sur http://localhost:' + PORT)
})