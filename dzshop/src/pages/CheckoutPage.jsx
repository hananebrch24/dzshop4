import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

function CheckoutPage() {
  const { total, livraison, clearCart, panier } = useContext(CartContext)
  const [valide, setValide] = useState(false)

  function commander(e) {
    e.preventDefault()
    clearCart()
    setValide(true)
  }

  // Écran de confirmation (après la commande)
  if (valide) {
    return (
      <div className="container py-5 text-center">
        <div className="display-1">✅</div>
        <h1>Commande confirmée !</h1>
        <p className="text-muted">Merci Ali, vous serez livré sous 48h.</p>
        <Link className="btn btn-primary" to="/products">Continuer mes achats</Link>
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
      <form onSubmit={commander}>
        <input className="form-control mb-3" placeholder="Nom complet" required />
        <input className="form-control mb-3" placeholder="Téléphone" required />
        <input className="form-control mb-3" placeholder="Wilaya (ex : Skikda)" required />
        <input className="form-control mb-3" placeholder="Commune" required />
        <textarea className="form-control mb-3" placeholder="Adresse détaillée" required></textarea>

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

        <button className="btn btn-success btn-lg w-100">Confirmer la commande</button>
      </form>
    </div>
  )
}
export default CheckoutPage