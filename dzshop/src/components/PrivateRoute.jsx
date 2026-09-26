import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

// role est facultatif : <PrivateRoute role="admin"> réserve la page aux admins
function PrivateRoute({ children, role }) {
  const { user } = useContext(AuthContext)

  // Si personne n'est connecté, on redirige vers la page de connexion
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Connecté, mais pas le bon rôle : retour à l'accueil
  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  // Sinon, on affiche la page protégée
  return children
}

export default PrivateRoute