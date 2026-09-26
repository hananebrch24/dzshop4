import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  articles:[{ nom: String, prix: Number, qte: Number }],
  total:   { type: Number, required: true },
  adresse: { type: String, required: true },
  statut:  { type: String, enum: ['En attente','Expédiée','Livrée'], default: 'En attente' }
}, { timestamps: true })

export default mongoose.model('Order', schema)