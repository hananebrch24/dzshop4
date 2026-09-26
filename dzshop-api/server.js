import dns from 'node:dns'
dns.setServers(['8.8.8.8', '8.8.4.4'])   // fix DNS MongoDB

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/orders.js'
dotenv.config()

// On importe les routes des produits
import productRoutes from './routes/products.js'

mongoose.connect(process.env.MONGO_URI)
  .then(function(){ console.log('✅ MongoDB connecté') })
  .catch(function(err){ console.log('❌ Erreur : ' + err.message) })

const app = express()
app.use(cors())
app.use(express.json())

// Toute adresse /api/products → gérée par routes/products.js
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)   // à côté de /api/products

app.get('/', function(req, res) {
  res.json({ message: 'API DZShop en ligne 🚀' })
})

app.listen(5000, function() {
  console.log('Serveur démarré sur http://localhost:5000')
})