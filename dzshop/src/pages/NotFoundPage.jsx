import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="container py-5 text-center">
      <div className="display-1 fw-bold text-primary">404</div>
      <h2>Page introuvable</h2>
      <Link className="btn btn-primary" to="/">Retour à l'accueil</Link>
    </div>
  )
}
export default NotFoundPage