import { Link, useParams } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import api from '../api/axios'
import { CartContext } from '../context/CartContext'

function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useContext(CartContext)
  const [produit, setProduit] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [ajoute, setAjoute] = useState(false)

  useEffect(function() {
    api.get('/products/' + id)
      .then(function(rep){ setProduit(rep.data) })
      .catch(function(){ setProduit(null) })
      .finally(function(){ setChargement(false) })
  }, [id])

  if (chargement) return <div className="container py-5 text-center"><div className="spinner-border"></div></div>
  if (!produit) return <div className="container py-5">Produit introuvable</div>

  function ajouterAuPanier() {
    addToCart(produit)
    setAjoute(true)
  }

  return (
    <div className="container py-5">
      <Link className="btn btn-link px-0 mb-3" to="/products">← Retour</Link>
      <h1>{produit.nom}</h1>
      <p className="text-muted">{produit.categorie}</p>
      <p className="fs-3 text-primary fw-bold">{produit.prix.toLocaleString('fr-DZ')} DZD</p>
      <button className="btn btn-primary btn-lg" onClick={ajouterAuPanier}>🛒 Ajouter au panier</button>
      {ajoute && (
        <div className="alert alert-success mt-3">
          ✅ Ajouté ! <Link to="/cart">Voir mon panier</Link>
        </div>
      )}
    </div>
  )
}
export default ProductDetailPage