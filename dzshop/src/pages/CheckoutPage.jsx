import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'

function CheckoutPage() {
  const { total, livraison, clearCart, panier } = useContext(CartContext)
  const { user } = useContext(AuthContext)

  const [nom, setNom] = useState(user.nom || '')
  const [telephone, setTelephone] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [commune, setCommune] = useState('')
  const [adresse, setAdresse] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')
  const [commande, setCommande] = useState(null)   // la commande créée par le serveur

  async function commander(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)
    try {
      // On envoie SEULEMENT quel produit et combien : le serveur retrouve les vrais prix
      const rep = await api.post('/orders', {
        articles: panier.map(function(a) { return { produit: a._id, qte: a.qte } }),
        telephone: telephone,
        wilaya: wilaya,
        commune: commune,
        adresse: adresse
      })
      setCommande(rep.data)
      clearCart()
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErreur(err.response.data.message)
      } else {
        setErreur('Serveur injoignable, réessaie dans un instant')
      }
    }
    setEnvoi(false)
  }

  // Écran de confirmation (après la commande)
  if (commande) {
    return (
      <div className="container py-5 text-center">
        <div className="display-1">✅</div>
        <h1>Commande confirmée !</h1>
        <p className="text-muted">
          Merci {user.nom}. Numéro de commande : <b>CMD-{commande._id.slice(-6).toUpperCase()}</b>
        </p>
        <p className="text-muted">
          Total : {commande.total.toLocaleString('fr-DZ')} DZD, vous serez livré sous 48h.
        </p>
        <Link className="btn btn-primary me-2" to="/mes-commandes">Mes commandes</Link>
        <Link className="btn btn-outline-primary" to="/products">Continuer mes achats</Link>
      </div>
    )
  }

  // Si le panier est vide, pas de commande possible
  if (panier.length === 0) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Votre panier est vide.</p>
        <Link className="btn btn-primary" to="/products">Voir nos produits</Link>
      </div>
    )
  }

  // Le formulaire de livraison
  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h1 className="mb-4">Livraison</h1>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <form onSubmit={commander}>
        <input className="form-control mb-3" placeholder="Nom complet" required
          value={nom} onChange={function(e){ setNom(e.target.value) }} />
        <input className="form-control mb-3" placeholder="Téléphone" required
          value={telephone} onChange={function(e){ setTelephone(e.target.value) }} />
        <input className="form-control mb-3" placeholder="Wilaya (ex : Skikda)" required
          value={wilaya} onChange={function(e){ setWilaya(e.target.value) }} />
        <input className="form-control mb-3" placeholder="Commune"
          value={commune} onChange={function(e){ setCommune(e.target.value) }} />
        <textarea className="form-control mb-3" placeholder="Adresse détaillée" required
          value={adresse} onChange={function(e){ setAdresse(e.target.value) }}></textarea>

        {/* Récapitulatif du montant */}
        <ul className="list-group mb-3">
          <li className="list-group-item d-flex justify-content-between">
            <span>Sous-total</span><span>{total.toLocaleString('fr-DZ')} DZD</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Livraison</span>
            <span>{livraison === 0 ? 'Gratuite 🎉' : livraison.toLocaleString('fr-DZ') + ' DZD'}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between fw-bold">
            <span>Total à payer</span><span>{(total + livraison).toLocaleString('fr-DZ')} DZD</span>
          </li>
        </ul>

        <button className="btn btn-success btn-lg w-100" disabled={envoi}>
          {envoi ? 'Envoi en cours...' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  )
}
export default CheckoutPage