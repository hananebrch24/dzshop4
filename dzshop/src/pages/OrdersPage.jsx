import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function OrdersPage() {
  const [commandes, setCommandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  // Au chargement de la page, on demande MES commandes à l'API
  useEffect(function() {
    api.get('/orders/my')
      .then(function(rep) { setCommandes(rep.data) })
      .catch(function() { setErreur('Impossible de charger tes commandes') })
      .finally(function() { setChargement(false) })
  }, [])

  if (chargement) {
    return <div className="container py-5 text-center"><div className="spinner-border"></div></div>
  }
  if (erreur) {
    return <div className="alert alert-danger m-5">{erreur}</div>
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Mes commandes</h1>

      {commandes.length === 0 && (
        <div className="text-center">
          <p className="text-muted">Tu n'as pas encore passé de commande.</p>
          <Link className="btn btn-primary" to="/products">Voir nos produits</Link>
        </div>
      )}

      {commandes.map(function(c) {
        return (
          <div className="card mb-3" key={c._id}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5>CMD-{c._id.slice(-6).toUpperCase()}</h5>
                <span className="badge bg-secondary">{c.statut}</span>
              </div>
              <p className="text-muted mb-2">
                {new Date(c.createdAt).toLocaleDateString('fr-FR')} · {c.wilaya}
              </p>
              <ul className="mb-2">
                {c.articles.map(function(a) {
                  return <li key={a.produit}>{a.nom} × {a.qte}</li>
                })}
              </ul>
              <b>Total : {c.total.toLocaleString('fr-DZ')} DZD</b>
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default OrdersPage