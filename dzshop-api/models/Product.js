import mongoose from 'mongoose'

// Le "modèle" = la fiche d'identité d'un produit dans la base.
// Chaque ligne décrit un champ : son type, s'il est obligatoire, sa valeur par défaut.
const schema = new mongoose.Schema({
  nom:       { type: String, required: true },          // texte, OBLIGATOIRE
  prix:      { type: Number, required: true, min: 0 },  // nombre, jamais négatif
  categorie: { type: String, default: 'Divers' },      // si rien fourni → "Divers"
  stock:     { type: Number, default: 0 },             // stock, 0 par défaut
  image:     String                                 // l'URL de l'image (facultatif)
}, {
  timestamps: true   // ajoute createdAt et updatedAt tout seul
})

// On exporte le MODÈLE (nommé 'Product') pour l'utiliser dans les routes.
export default mongoose.model('Product', schema)