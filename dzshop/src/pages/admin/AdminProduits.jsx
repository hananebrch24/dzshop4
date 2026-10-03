import { useState, useEffect } from 'react'
import api from '../../api/axios'
import AddProductForm from '../../components/AddProductForm'

function AdminProduits() {
  const [produits, setProduits] = useState([])
  const [produitAModifier, setProduitAModifier] = useState(null)
  const [recherche, setRecherche] = useState('')
  const [chargement, setChargement] = useState(true)

  function charger() {
    setChargement(true)

    api.get('/products')
      .then(function (rep) {
        setProduits(rep.data)
      })
      .finally(function () {
        setChargement(false)
      })
  }

  useEffect(function () {
    charger()
  }, [])

  function terminerEdition() {
    setProduitAModifier(null)
    charger()
  }

  async function supprimer(id) {
    if (!window.confirm('Supprimer ce produit ?')) return

    await api.delete('/products/' + id)
    charger()
  }

  const produitsFiltres = produits.filter(function (p) {
    const texte = (
      (p.nom || '') +
      ' ' +
      (p.categorie || '')
    ).toLowerCase()

    return texte.includes(recherche.toLowerCase())
  })

  const stockTotal = produits.reduce(function (total, p) {
    return total + Number(p.stock || 0)
  }, 0)

  const produitsRupture = produits.filter(function (p) {
    return Number(p.stock || 0) === 0
  }).length

  return (
    <div className="admin-section">

      {/* HEADER */}

      <div className="admin-section-header">

        <div>
          <span className="admin-section-eyebrow">
            CATALOGUE
          </span>

          <h2>
            Produits
            <span className="admin-count">
              {produits.length}
            </span>
          </h2>

          <p>
            Gérez les produits disponibles dans votre boutique.
          </p>
        </div>

        <button
          className="admin-primary-btn"
          onClick={function () {
            setProduitAModifier(null)
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          }}
        >
          <span>＋</span>
          Ajouter un produit
        </button>

      </div>

      {/* MINI STATS */}

      <div className="admin-product-stats">

        <div className="admin-mini-card">
          <div className="admin-mini-icon blue">
            📦
          </div>

          <div>
            <small>Total produits</small>
            <strong>{produits.length}</strong>
          </div>
        </div>

        <div className="admin-mini-card">
          <div className="admin-mini-icon green">
            📊
          </div>

          <div>
            <small>Stock disponible</small>
            <strong>{stockTotal}</strong>
          </div>
        </div>

        <div className="admin-mini-card">
          <div className="admin-mini-icon red">
            ⚠️
          </div>

          <div>
            <small>Ruptures</small>
            <strong>{produitsRupture}</strong>
          </div>
        </div>

      </div>

      {/* FORMULAIRE */}

      <div className="admin-form-card">

        <div className="admin-form-card-header">
          <div>
            <span>
              {produitAModifier
                ? 'MODIFICATION'
                : 'NOUVEAU PRODUIT'}
            </span>

            <h3>
              {produitAModifier
                ? 'Modifier le produit'
                : 'Ajouter un produit'}
            </h3>
          </div>

          {produitAModifier && (
            <button
              className="admin-cancel-btn"
              onClick={function () {
                setProduitAModifier(null)
              }}
            >
              ✕ Annuler
            </button>
          )}
        </div>

        <AddProductForm
          key={
            produitAModifier
              ? produitAModifier._id
              : 'nouveau'
          }
          produitAModifier={produitAModifier}
          onTermine={terminerEdition}
          onAnnuler={function () {
            setProduitAModifier(null)
          }}
        />

      </div>

      {/* LISTE */}

      <div className="admin-list-card">

        <div className="admin-list-header">

          <div>
            <span className="admin-section-eyebrow">
              INVENTAIRE
            </span>

            <h3>
              Tous les produits
            </h3>
          </div>

          <div className="admin-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={recherche}
              onChange={function (e) {
                setRecherche(e.target.value)
              }}
            />

          </div>

        </div>

        {chargement ? (

          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <span>Chargement des produits...</span>
          </div>

        ) : produitsFiltres.length === 0 ? (

          <div className="admin-empty">
            <div>📦</div>
            <h4>Aucun produit trouvé</h4>
            <p>
              Aucun produit ne correspond à votre recherche.
            </p>
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>État</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {produitsFiltres.map(function (p) {

                  const stock = Number(p.stock || 0)

                  return (
                    <tr
                      key={p._id}
                      className="admin-table-row"
                    >

                      <td>

                        <div className="admin-product-cell">

                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.nom}
                              className="admin-product-image"
                            />
                          ) : (
                            <div className="admin-product-placeholder">
                              📦
                            </div>
                          )}

                          <div>
                            <strong>
                              {p.nom}
                            </strong>

                            <small>
                              ID : {String(p._id).slice(-8)}
                            </small>
                          </div>

                        </div>

                      </td>

                      <td>
                        <span className="admin-category">
                          {p.categorie || 'Sans catégorie'}
                        </span>
                      </td>

                      <td>
                        <strong className="admin-price">
                          {Number(p.prix || 0).toLocaleString('fr-DZ')}
                          <small> DZD</small>
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {stock}
                        </strong>
                      </td>

                      <td>

                        {stock === 0 ? (
                          <span className="admin-status-badge danger">
                            Rupture
                          </span>
                        ) : stock <= 5 ? (
                          <span className="admin-status-badge warning">
                            Stock faible
                          </span>
                        ) : (
                          <span className="admin-status-badge success">
                            Disponible
                          </span>
                        )}

                      </td>

                      <td>

                        <div className="admin-actions">

                          <button
                            className="admin-action edit"
                            title="Modifier"
                            onClick={function () {
                              setProduitAModifier(p)

                              window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                              })
                            }}
                          >
                            ✏️
                          </button>

                          <button
                            className="admin-action delete"
                            title="Supprimer"
                            onClick={function () {
                              supprimer(p._id)
                            }}
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}

export default AdminProduits