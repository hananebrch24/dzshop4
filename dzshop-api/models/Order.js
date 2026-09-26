import mongoose from 'mongoose'

// Une ligne de commande = une "photo" du produit AU MOMENT de l'achat.
// Si le prix change demain, les anciennes commandes gardent l'ancien prix.
const ligneSchema = new mongoose.Schema({
  produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  nom:     { type: String, required: true },
  prix:    { type: Number, required: true, min: 0 },
  qte:     { type: Number, required: true, min: 1 }
}, { _id: false })

const schema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  client:    { type: String, required: true },
  articles:  { type: [ligneSchema], validate: function(a) { return a.length > 0 } },
  sousTotal: { type: Number, required: true },
  livraison: { type: Number, required: true },
  total:     { type: Number, required: true },
  telephone: { type: String, required: true, trim: true },
  wilaya:    { type: String, required: true, trim: true },
  commune:   { type: String, default: '', trim: true },
  adresse:   { type: String, required: true, trim: true },
  statut:    { type: String, enum: ['En attente', 'Livrée', 'Annulée'], default: 'En attente' }
}, {
  timestamps: true
})

export default mongoose.model('Order', schema)