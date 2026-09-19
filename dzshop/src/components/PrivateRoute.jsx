import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext)

  // Si personne n'est connecté, on redirige vers la page de connexion
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Sinon, on affiche la page protégée
  return children
}

export default PrivateRoute