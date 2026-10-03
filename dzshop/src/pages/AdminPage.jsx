import { useState } from 'react'
import AdminProduits from './admin/AdminProduits'
import AdminCommandes from './admin/AdminCommandes'
import AdminUtilisateurs from './admin/AdminUtilisateurs'
import AdminStatistiques from './admin/AdminStatistiques'

const ONGLETS = [
  { cle: 'produits', label: '📦 Produits' },
  { cle: 'commandes', label: '🧾 Commandes' },
  { cle: 'utilisateurs', label: '👥 Utilisateurs' },
  { cle: 'stats', label: '📊 Statistiques' }
]

function AdminPage() {
  const [onglet, setOnglet] = useState('produits')

  return (
    <div className="container py-5">
      <h1 className="mb-4">Espace admin</h1>

      <ul className="nav nav-tabs mb-4">
        {ONGLETS.map(function(o){
          return (
            <li className="nav-item" key={o.cle}>
              <button
                className={'nav-link' + (onglet === o.cle ? ' active' : '')}
                onClick={function(){ setOnglet(o.cle) }}
              >
                {o.label}
              </button>
            </li>
          )
        })}
      </ul>

      {onglet === 'produits' && <AdminProduits />}
      {onglet === 'commandes' && <AdminCommandes />}
      {onglet === 'utilisateurs' && <AdminUtilisateurs />}
      {onglet === 'stats' && <AdminStatistiques />}
    </div>
  )
}
export default AdminPage