import { useState, useEffect } from 'react'
import api from '../../api/axios'

const STATUTS = ['En attente', 'Livrée', 'Annulée']

function classeStatut(statut) {
  if (statut === 'Livrée') return 'badge bg-success'
  if (statut === 'Annulée') return 'badge bg-danger'
  return 'badge bg-warning text-dark'
}

function AdminCommandes() {
  const [commandes, setCommandes] = useState([])
  const [chargement, setChargement] = useState(true)

  function charger() {
    api.get('/orders').then(function(rep){
      setCommandes(rep.data)
      setChargement(false)
    })
  }

  useEffect(function(){ charger() }, [])

  // Si on choisit "Annulée" dans la liste, le serveur restitue automatiquement le stock
  async function changerStatut(id, statut) {
    await api.patch('/orders/' + id + '/statut', { statut: statut })
    charger()
  }

  return (
    <div>
      <h3 className="mb-3">Commandes ({commandes.length})</h3>

      {chargement ? <p>Chargement...</p> : (
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Client</th>
              <th>Articles</th>
              <th>Total</th>
              <th>Wilaya</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map(function(c){
              return (
                <tr key={c._id}>
                  <td>{c.client}</td>
                  <td>
                    {c.articles.map(function(a){ return a.nom + ' ×' + a.qte }).join(', ')}
                  </td>
                  <td>{c.total.toLocaleString('fr-DZ')} DZD</td>
                  <td>{c.wilaya}</td>
                  <td>
                    <span className={classeStatut(c.statut) + ' me-2'}>{c.statut}</span>
                    <select
                      className="form-select form-select-sm d-inline-block"
                      style={{ width: 'auto' }}
                      value={c.statut}
                      onChange={function(e){ changerStatut(c._id, e.target.value) }}
                    >
                      {STATUTS.map(function(s){ return <option key={s} value={s}>{s}</option> })}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
export default AdminCommandes