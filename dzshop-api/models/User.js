import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const schema = new mongoose.Schema({
  nom:      { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  // Un compte Google n'a pas de mot de passe : obligatoire SEULEMENT pour un compte "local"
  password: {
    type: String,
    required: function() { return this.provider === 'local' },
    minlength: 6
  },
  // "local" = email + mot de passe. "google" = créé via le bouton Google (pas de mot de passe)
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, default: null },
  // "client" par défaut. On ne devient admin que dans la base (voir makeAdmin.js)
  role:     { type: String, enum: ['client', 'admin'], default: 'client' },
  // Un admin peut bloquer un compte (séparé du rôle : on peut bloquer un client SANS le rendre admin)
  status:   { type: String, enum: ['actif', 'bloque'], default: 'actif' }
}, {
  timestamps: true
})

// AVANT chaque sauvegarde : on brouille le mot de passe.
// Fonction async SANS "next" (Mongoose moderne, sinon "next is not a function").
schema.pre('save', async function() {
  if (!this.password || !this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

// Compare le mot de passe tapé avec la version hachée en base
schema.methods.verifierMotDePasse = function(motDePasse) {
  // Compte Google : pas de mot de passe en base, donc jamais valide
  if (!this.password) return false
  return bcrypt.compare(motDePasse, this.password)
}

// Ce qu'on a le droit de renvoyer au navigateur (JAMAIS le mot de passe)
schema.methods.versPublic = function() {
  return { id: this._id, nom: this.nom, email: this.email, role: this.role, status: this.status, provider: this.provider }
}

export default mongoose.model('User', schema)