import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function RegisterPage() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState('')
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  function envoyer(e) {
    e.preventDefault()
    // Les vérifications (validations)
    if (mdp.length < 6) {
      setErreur('Le mot de passe doit faire au moins 6 caractères')
      return
    }
    if (mdp !== confirmation) {
      setErreur('Les deux mots de passe ne sont pas identiques')
      return
    }
    register(nom, email)   // tout est bon
    navigate('/')
  }

  return (
    <div className="container py-5" style={{ maxWidth: '400px' }}>
      <h1 className="mb-4">Créer un compte</h1>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      <form onSubmit={envoyer}>
        <input className="form-control mb-3" placeholder="Nom complet"
          value={nom} onChange={function(e){setNom(e.target.value)}} required />
        <input className="form-control mb-3" type="email" placeholder="Email"
          value={email} onChange={function(e){setEmail(e.target.value)}} required />
        <input className="form-control mb-3" type="password" placeholder="Mot de passe (min. 6)"
          value={mdp} onChange={function(e){setMdp(e.target.value)}} required />
        <input className="form-control mb-3" type="password" placeholder="Confirmer le mot de passe"
          value={confirmation} onChange={function(e){setConfirmation(e.target.value)}} required />
        <button className="btn btn-primary w-100">Créer mon compte</button>
      </form>
      <p className="text-center mt-3 mb-0">
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  )
}
export default RegisterPage