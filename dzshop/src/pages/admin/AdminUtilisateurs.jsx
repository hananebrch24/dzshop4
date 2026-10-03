import { useState, useEffect, useContext } from 'react'
import api from '../../api/axios'
import { AuthContext } from '../../context/AuthContext'

function AdminUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const { user } = useContext(AuthContext)   // moi-même, connecté

  function charger() {
    api.get('/admin/users').then(function(rep){ setUtilisateurs(rep.data) })
  }

  useEffect(function(){ charger() }, [])

  async function changerRole(u) {
    const nouveauRole = u.role === 'admin' ? 'client' : 'admin'
    try {
      await api.patch('/admin/users/' + u.id + '/role', { role: nouveauRole })
      charger()
    } catch (err) {
      alert(err.response && err.response.data ? err.response.data.message : 'Erreur')
    }
  }

  async function changerStatut(u) {
    const nouveauStatut = u.status === 'actif' ? 'bloque' : 'actif'
    try {
      await api.patch('/admin/users/' + u.id + '/status', { status: nouveauStatut })
      charger()
    } catch (err) {
      alert(err.response && err.response.data ? err.response.data.message : 'Erreur')
    }
  }

  return (
    <div>
      <h3 className="mb-3">Utilisateurs ({utilisateurs.length})</h3>

      <table className="table align-middle">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Connexion</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map(function(u){
            // On ne touche JAMAIS à son propre compte : ni le rôle, ni le blocage.
            const estMoiMeme = user && String(u.id) === String(user.id)
            return (
              <tr key={u.id}>
                <td>{u.nom}{estMoiMeme && <span className="text-muted"> (toi)</span>}</td>
                <td>{u.email}</td>
                <td>{u.provider === 'google' ? '🔵 Google' : '🔑 Mot de passe'}</td>
                <td><span className={'badge ' + (u.role === 'admin' ? 'bg-primary' : 'bg-secondary')}>{u.role}</span></td>
                <td><span className={'badge ' + (u.status === 'bloque' ? 'bg-danger' : 'bg-success')}>{u.status}</span></td>
                <td className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" disabled={estMoiMeme}
                    onClick={function(){ changerRole(u) }}>
                    {u.role === 'admin' ? 'Rétrograder' : 'Rendre admin'}
                  </button>
                  <button className="btn btn-sm btn-outline-danger" disabled={estMoiMeme}
                    onClick={function(){ changerStatut(u) }}>
                    {u.status === 'bloque' ? 'Débloquer' : 'Bloquer'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
export default AdminUtilisateurs