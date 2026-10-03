import { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [erreur, setErreur] = useState('')
  const { login, loginGoogle } = useContext(AuthContext)
  const navigate = useNavigate()
  const boutonGoogleRef = useRef(null)

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

  // Appelée par Google quand l'utilisateur a choisi son compte
  async function surReponseGoogle(reponse) {
    try {
      setErreur('')
      await loginGoogle(reponse.credential)
      navigate('/')
    } catch (err) {
      setErreur(err.message)
    }
  }

  // Le script Google (chargé dans index.html) met du temps à arriver :
  // on vérifie toutes les 100ms qu'il est prêt avant de dessiner le bouton.
  useEffect(function() {
    let annule = false

    function essayerAfficherBouton() {
      if (annule) return
      if (window.google && window.google.accounts && window.google.accounts.id && boutonGoogleRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: surReponseGoogle
        })
        window.google.accounts.id.renderButton(boutonGoogleRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with'
        })
      } else {
        setTimeout(essayerAfficherBouton, 100)
      }
    }
    essayerAfficherBouton()

    return function() { annule = true }
  }, [])

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

      <div className="text-center my-3 text-muted">— ou —</div>

      {/* Google dessine lui-même son bouton ici, dès que son script est prêt */}
      <div ref={boutonGoogleRef}></div>

      <p className="text-center mt-3 mb-0">
        Pas de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </div>
  )
}
export default LoginPage