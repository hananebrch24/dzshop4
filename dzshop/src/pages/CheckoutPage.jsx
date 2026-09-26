import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import api from '../api/axios'

function CheckoutPage() {
  const { panier, total, livraison, clearCart } = useContext(CartContext)
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [adresse, setAdresse] = useState('')
  const [valide, setValide] = useState(false)
  const [erreur, setErreur] = useState('')

  async function commander(e) {
    e.preventDefault()
    try {
      await api.post('/orders', {
        articles: panier.map(function(a){ return { nom: a.nom, prix: a.prix, qte: a.qte } }),
        total: total + livraison,
        adresse: adresse,
        wilaya: wilaya,
        telephone: telephone
      })
      clearCart()
      setValide(true)
    } catch (err) {
      setErreur('Erreur — es-tu connecté ?')
    }
  }

  if (valide) {
    return (
      <div className="container py-5 text-center">
        <div className="display-1">✅</div>
        <h1>Commande confirmée !</h1>
        <p className="text-muted">Merci {nom}, livraison sous 48h.</p>
        <Link className="btn btn-primary" to="/products">Continuer</Link>
      </div>
    )
  }

  if (panier.length === 0) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Votre panier est vide.</p>
        <Link className="btn btn-primary" to="/products">Voir nos produits</Link>
      </div>
    )
  }

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h1 className="mb-4">Livraison</h1>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      <form onSubmit={commander}>
        <input className="form-control mb-3" placeholder="Nom complet"
          value={nom} onChange={function(e){ setNom(e.target.value) }} required />
        <input className="form-control mb-3" placeholder="Téléphone"
          value={telephone} onChange={function(e){ setTelephone(e.target.value) }} required />
        <input className="form-control mb-3" placeholder="Wilaya"
          value={wilaya} onChange={function(e){ setWilaya(e.target.value) }} required />
        <textarea className="form-control mb-3" placeholder="Adresse détaillée"
          value={adresse} onChange={function(e){ setAdresse(e.target.value) }} required></textarea>
        <h4>Total : {(total + livraison).toLocaleString('fr-DZ')} DZD</h4>
        <button className="btn btn-success btn-lg w-100">Confirmer la commande</button>
      </form>
    </div>
  )
}
export default CheckoutPage