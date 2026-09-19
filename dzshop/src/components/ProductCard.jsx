import { useState } from 'react'
import { Link } from 'react-router-dom'

function ProductCard({ produit }) {
  const enRupture = produit.stock === 0
  const [imageChargee, setImageChargee] = useState(false)

  // Si la photo est introuvable, on affiche une image de secours
  function imageDeSecours(e) {
    e.target.onerror = null   // évite une boucle infinie
    e.target.src = 'https://placehold.co/600x400?text=' + encodeURIComponent(produit.nom)
  }

  return (
    <div className="card h-100">

      {/* Photo du produit */}
      <div className={'card-photo' + (enRupture ? ' card-photo-rupture' : '')}>
        <img
          src={produit.image}
          alt={produit.nom}
          className={'card-img-top' + (imageChargee ? ' img-chargee' : '')}
          loading="lazy"
          onLoad={function() { setImageChargee(true) }}
          onError={imageDeSecours}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <h5>{produit.nom}</h5>
        <p className="text-muted small mb-2">{produit.categorie}</p>
        <p className="fw-bold text-primary fs-5 mb-3">
          {produit.prix.toLocaleString('fr-DZ')} DZD
        </p>
        <div className="mt-auto">
          {enRupture ? (
            <span className="badge bg-danger">Rupture de stock</span>
          ) : (
            <Link className="btn btn-primary w-100 btn-voir" to={"/product/" + produit._id}>
              Voir le produit <span className="btn-fleche">→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
export default ProductCard