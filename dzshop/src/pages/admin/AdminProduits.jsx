import { useState, useEffect } from 'react'
import api from '../../api/axios'
import AddProductForm from '../../components/AddProductForm'

function AdminProduits() {
  const [produits, setProduits] = useState([])
  const [produitAModifier, setProduitAModifier] = useState(null)   // null = mode "ajouter"

  function charger() {
    api.get('/products').then(function(rep){ setProduits(rep.data) })
  }

  useEffect(function(){ charger() }, [])

  function terminerEdition() {
    setProduitAModifier(null)
    charger()
  }

  async function supprimer(id) {
    if (!window.confirm('Supprimer ce produit ?')) return
    await api.delete('/products/' + id)
    charger()
  }

  return (
    <div>
      <h3 className="mb-3">Produits ({produits.length})</h3>

      {/* key différente à chaque produit → le formulaire est recréé à zéro, bien rempli */}
      <AddProductForm
        key={produitAModifier ? produitAModifier._id : 'nouveau'}
        produitAModifier={produitAModifier}
        onTermine={terminerEdition}
        onAnnuler={function(){ setProduitAModifier(null) }}
      />

      <table className="table align-middle">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Nom</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {produits.map(function(p){
            return (
              <tr key={p._id}>
                <td>
                  {p.image
                    ? <img src={p.image} alt={p.nom} style={{ width: '48px', height: '48px', objectFit: 'cover' }} className="rounded" />
                    : <span className="text-muted">—</span>}
                </td>
                <td>{p.nom}</td>
                <td>{p.prix.toLocaleString('fr-DZ')} DZD</td>
                <td>{p.stock}</td>
                <td className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary"
                    onClick={function(){ setProduitAModifier(p) }}>Modifier</button>
                  <button className="btn btn-sm btn-danger"
                    onClick={function(){ supprimer(p._id) }}>Supprimer</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
export default AdminProduits