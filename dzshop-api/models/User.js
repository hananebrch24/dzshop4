import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const schema = new mongoose.Schema({
  nom:      { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  // "client" par défaut. On ne devient admin que dans la base (voir makeAdmin.js)
  role:     { type: String, enum: ['client', 'admin'], default: 'client' }
}, {
  timestamps: true
})

// AVANT chaque sauvegarde : on brouille le mot de passe.
// Fonction async SANS "next" (Mongoose moderne, sinon "next is not a function").
schema.pre('save', async function() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

// Compare le mot de passe tapé avec la version hachée en base
schema.methods.verifierMotDePasse = function(motDePasse) {
  return bcrypt.compare(motDePasse, this.password)
}

// Ce qu'on a le droit de renvoyer au navigateur (JAMAIS le mot de passe)
schema.methods.versPublic = function() {
  return { id: this._id, nom: this.nom, email: this.email, role: this.role }
}

export default mongoose.model('User', schema)