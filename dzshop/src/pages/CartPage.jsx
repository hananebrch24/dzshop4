import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

function CartPage() {
  const { panier, updateQty, removeFromCart, clearCart, total, livraison, nbItems } = useContext(CartContext)

  if (panier.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="fs-1">🛒</div>
        <p className="text-muted">Votre panier est vide.</p>
        <Link className="btn btn-primary" to="/products">Voir nos produits</Link>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h1>Votre panier <span className="text-muted fs-5">({nbItems} article{nbItems > 1 ? 's' : ''})</span></h1>

      <table className="table align-middle">
        <tbody>
          {panier.map(function(a){
            return (
              <tr key={a._id}>
                <td>{a.nom}</td>
                <td>{a.prix.toLocaleString('fr-DZ')} DZD</td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary"
                    onClick={function(){ updateQty(a._id, a.qte - 1) }} disabled={a.qte <= 1}>−</button>
                  <span className="mx-2 fw-bold">{a.qte}</span>
                  <button className="btn btn-sm btn-outline-secondary"
                    onClick={function(){ updateQty(a._id, a.qte + 1) }}>+</button>
                </td>
                <td>{(a.prix * a.qte).toLocaleString('fr-DZ')} DZD</td>
                <td>
                  <button className="btn btn-sm btn-danger"
                    onClick={function(){ removeFromCart(a._id) }}>Supprimer</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <ul className="list-group mb-3">
        <li className="list-group-item d-flex justify-content-between">
          <span>Sous-total</span><span>{total.toLocaleString('fr-DZ')} DZD</span>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>Livraison</span>
          <span>{livraison === 0 ? 'Gratuite 🎉' : livraison.toLocaleString('fr-DZ') + ' DZD'}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between fw-bold fs-5">
          <span>Total à payer</span><span>{(total + livraison).toLocaleString('fr-DZ')} DZD</span>
        </li>
      </ul>

      <Link className="btn btn-success w-100 mb-2" to="/checkout">Passer la commande</Link>
      <button className="btn btn-outline-danger w-100" onClick={clearCart}>Vider le panier</button>
    </div>
  )
}
export default CartPage