import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [erreur, setErreur] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  async function envoyer(e) {
    e.preventDefault()
    try {
      // login est async : on l'attend avec await, et on attrape l'erreur du serveur
      await login(email, mdp)
      navigate('/')
    } catch (err) {
      setErreur(err.message)
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: '400px' }}>
      <h1 className="mb-4">Connexion</h1>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <form onSubmit={envoyer}>
        <input className="form-control mb-3" type="email" placeholder="Email"
          value={email} onChange={function(e){setEmail(e.target.value)}} required />
        <input className="form-control mb-3" type="password" placeholder="Mot de passe"
          value={mdp} onChange={function(e){setMdp(e.target.value)}} required />
        <button className="btn btn-primary w-100">Se connecter</button>
      </form>

      <p className="text-center mt-3 mb-0">
        Pas de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </div>
  )
}
export default LoginPage