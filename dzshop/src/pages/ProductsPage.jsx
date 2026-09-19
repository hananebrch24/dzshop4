import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

function ProductsPage() {
  const [produits, setProduits] = useState([])
  const [recherche, setRecherche] = useState('')
  const [categorie, setCategorie] = useState('')   // '' = toutes les catégories
  const [tri, setTri] = useState('')         // '' | 'prix-asc' | 'prix-desc' | 'nom'
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(function() {
    api.get('/products')
      .then(function(rep){ setProduits(rep.data) })
      .catch(function(){ setErreur('Serveur injoignable — le backend est-il lancé ?') })
      .finally(function(){ setChargement(false) })
  }, [])

  // Les catégories qui existent VRAIMENT dans les produits reçus
  const categories = [...new Set(produits.map(function(p){ return p.categorie }))]

  // On chaîne recherche + catégorie
  const resultats = produits
    .filter(function(p){ return p.nom.toLowerCase().includes(recherche.toLowerCase()) })
    .filter(function(p){ return categorie === '' || p.categorie === categorie })

  // Le tri s'applique APRÈS les filtres, sur une COPIE
  const resultatsTries = [...resultats].sort(function(a, b){
    if (tri === 'prix-asc')  return a.prix - b.prix
    if (tri === 'prix-desc') return b.prix - a.prix
    if (tri === 'nom')       return a.nom.localeCompare(b.nom)
    return 0
  })

  if (chargement) {
    return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>
  }
  if (erreur) {
    return <div className="alert alert-danger m-5">{erreur}</div>
  }

  return (
    <div className="container py-5">
      <h1>Nos produits</h1>

      <input
        className="form-control my-3"
        placeholder="Rechercher un produit..."
        value={recherche}
        onChange={function(e){ setRecherche(e.target.value) }}
      />

      <div className="row g-2 mb-3">
        <div className="col-sm-6">
          <select className="form-select" value={categorie}
            onChange={function(e){ setCategorie(e.target.value) }}>
            <option value="">Toutes les catégories</option>
            {categories.map(function(cat){
              return <option key={cat} value={cat}>{cat}</option>
            })}
          </select>
        </div>
        <div className="col-sm-6">
          <select className="form-select" value={tri}
            onChange={function(e){ setTri(e.target.value) }}>
            <option value="">Trier par...</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
            <option value="nom">Nom A-Z</option>
          </select>
        </div>
      </div>

      {resultatsTries.length === 0 ? (
        <p className="text-muted">Aucun produit ne correspond.</p>
      ) : (
        <div className="row g-4">
          {resultatsTries.map(function(produit){
            return (
              <div className="col-md-4" key={produit._id}>
                <ProductCard produit={produit} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default ProductsPage