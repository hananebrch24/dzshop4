import { useState } from 'react'
import api from '../api/axios'

// onAjoute = fonction du parent, appelée après un ajout (pour recharger la liste)
function AddProductForm({ onAjoute }) {
  const [nom, setNom] = useState('')
  const [prix, setPrix] = useState('')
  const [categorie, setCategorie] = useState('')
  const [message, setMessage] = useState('')

  async function ajouter(e) {
    e.preventDefault()
    try {
      await api.post('/products', {
        nom: nom,
        prix: Number(prix),          // Number car un champ donne du texte
        categorie: categorie || 'Divers'
      })
      setMessage('✅ Produit « ' + nom + ' » ajouté !')
      setNom(''); setPrix(''); setCategorie('')
      if (onAjoute) { onAjoute() }   // on prévient le parent
    } catch (err) {
      setMessage('❌ Erreur — es-tu connecté en admin ?')
    }
  }

  return (
    <form onSubmit={ajouter} className="card card-body mb-4" style={{ maxWidth: '450px' }}>
      <h4>Ajouter un produit</h4>
      {message && <div className="alert alert-info py-2">{message}</div>}
      <input className="form-control mb-2" placeholder="Nom"
        value={nom} onChange={function(e){ setNom(e.target.value) }} required />
      <input className="form-control mb-2" type="number" placeholder="Prix (DZD)"
        value={prix} onChange={function(e){ setPrix(e.target.value) }} required />
      <input className="form-control mb-2" placeholder="Catégorie (facultatif)"
        value={categorie} onChange={function(e){ setCategorie(e.target.value) }} />
      <button className="btn btn-primary">Ajouter</button>
    </form>
  )
}
export default AddProductForm