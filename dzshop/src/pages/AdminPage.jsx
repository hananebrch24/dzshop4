import { useState, useEffect } from 'react'
import api from '../api/axios'
import AddProductForm from '../components/AddProductForm'

function AdminPage() {
  const [produits, setProduits] = useState([])

  function charger() {
    api.get('/products').then(function(rep){ setProduits(rep.data) })
  }

  useEffect(function(){ charger() }, [])

  async function supprimer(id) {
    await api.delete('/products/' + id)
    charger()
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Espace admin</h1>

      <AddProductForm onAjoute={charger} />

      <h4>Produits ({produits.length})</h4>
      <table className="table">
        <tbody>
          {produits.map(function(p){
            return (
              <tr key={p._id}>
                <td>{p.nom}</td>
                <td>{p.prix.toLocaleString('fr-DZ')} DZD</td>
                <td>
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
export default AdminPage