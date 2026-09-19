import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const schema = new mongoose.Schema({
  nom:      { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, default: 'client' }
})

// AVANT chaque sauvegarde : on brouille le mot de passe.
// Fonction async SANS "next" (Mongoose moderne, sinon "next is not a function").
schema.pre('save', async function() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

export default mongoose.model('User', schema)