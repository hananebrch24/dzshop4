// Utilisation (depuis le dossier dzshop-api) :  node makeAdmin.js ton-email@gmail.com
// (le compte doit déjà exister : inscris-toi d'abord sur le site)

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

const email = (process.argv[2] || '').toLowerCase().trim()

if (!email) {
  console.log('Utilisation : node makeAdmin.js ton-email@gmail.com')
  process.exit(1)
}

try {
  await mongoose.connect(process.env.MONGO_URI)

  const user = await User.findOneAndUpdate({ email: email }, { role: 'admin' }, { returnDocument: 'after' })

  if (!user) {
    console.log("Aucun compte avec l'email " + email + ". Inscris-toi d'abord sur le site.")
  } else {
    console.log(user.nom + ' (' + user.email + ') est maintenant admin.')
  }
} catch (err) {
  console.log('Erreur : ' + err.message)
} finally {
  await mongoose.disconnect()
}