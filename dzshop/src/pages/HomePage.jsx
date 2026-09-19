import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

function HomePage() {
  const [vedettes, setVedettes] = useState([])

  useEffect(function() {
    api.get('/products')
      .then(function(rep){ setVedettes(rep.data.slice(0, 3)) })
      .catch(function(){ setVedettes([]) })
  }, [])

  return (
    <>
      <section className="hero-dz text-white">

        {/* Décor animé (uniquement visuel) */}
        <span className="hero-dz-blob hero-dz-blob-1"></span>
        <span className="hero-dz-blob hero-dz-blob-2"></span>
        <span className="hero-dz-blob hero-dz-blob-3"></span>
        <span className="hero-dz-grille"></span>

        <span className="hero-dz-bulle hero-dz-bulle-1"></span>
        <span className="hero-dz-bulle hero-dz-bulle-2"></span>
        <span className="hero-dz-bulle hero-dz-bulle-3"></span>
        <span className="hero-dz-bulle hero-dz-bulle-4"></span>
        <span className="hero-dz-bulle hero-dz-bulle-5"></span>

        <div className="container text-center hero-dz-contenu">
          <h1 className="display-3 fw-bold hero-dz-anim hero-dz-d1">
            Bienvenue sur <span className="hero-dz-degrade">DZShop</span>
          </h1>
          <p className="lead mb-4 hero-dz-texte hero-dz-anim hero-dz-d2">
            L'électronique livrée partout en Algérie.
          </p>
          <div className="hero-dz-anim hero-dz-d3">
            <Link className="btn btn-light btn-lg hero-dz-bouton" to="/products">
              Découvrir nos produits
            </Link>
          </div>
        </div>

        {/* Vague en bas de la bannière */}
        <svg className="hero-dz-vague" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,64 C240,120 480,0 720,48 C960,96 1200,110 1440,50 L1440,120 L0,120 Z"
            fill="#f6f7fb"
          />
        </svg>
      </section>

      <section className="container py-5">
        <h2 className="mb-5 text-center section-title">Produits vedettes</h2>
        <div className="row g-4">
          {vedettes.map(function(produit){
            return (
              <div className="col-md-4" key={produit._id}>
                <ProductCard produit={produit} />
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
export default HomePage