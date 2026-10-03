import { createContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const AuthContext = createContext()

// Le message d'erreur du serveur (ex. « Identifiants incorrects »), ou un message par défaut
function messageErreur(err) {
  if (err.response && err.response.data && err.response.data.message) {
    return err.response.data.message
  }
  return 'Serveur injoignable, réessaie dans un instant'
}

export function AuthProvider({ children }) {

  // Au démarrage, on relit l'utilisateur sauvegardé : un F5 ne déconnecte plus
  const [user, setUser] = useState(function() {
    try {
      const sauvegarde = localStorage.getItem('user')
      return sauvegarde ? JSON.parse(sauvegarde) : null
    } catch (err) {
      return null
    }
  })

  function sauvegarder(donnees) {
    localStorage.setItem('token', donnees.token)
    localStorage.setItem('user', JSON.stringify(donnees.user))
    setUser(donnees.user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  // Au démarrage, on demande au serveur « qui suis-je ? » :
  // si le token a expiré (ou si le compte a été bloqué entre-temps), on déconnecte proprement.
  useEffect(function() {
    if (!localStorage.getItem('token')) return

    api.get('/auth/me')
      .then(function(rep) {
        localStorage.setItem('user', JSON.stringify(rep.data.user))
        setUser(rep.data.user)
      })
      .catch(function(err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) { logout() }
      })
  }, [])

  // Renvoie l'utilisateur, ou lance une Error avec le message du serveur
  async function login(email, mdp) {
    try {
      // ton API attend le champ "password" (pas "mdp")
      const rep = await api.post('/auth/login', { email: email, password: mdp })
      sauvegarder(rep.data)
      return rep.data.user
    } catch (err) {
      throw new Error(messageErreur(err))
    }
  }

  async function register(nom, email, mdp) {
    try {
      const rep = await api.post('/auth/register', { nom: nom, email: email, password: mdp })
      sauvegarder(rep.data)
      return rep.data.user
    } catch (err) {
      throw new Error(messageErreur(err))
    }
  }

  // Connexion avec Google : credential = le jeton fabriqué par Google dans le navigateur.
  // Le serveur le vérifie lui-même avant de renvoyer un token DZShop classique.
  async function loginGoogle(credential) {
    try {
      const rep = await api.post('/auth/google', { credential: credential })
      sauvegarder(rep.data)
      return rep.data.user
    } catch (err) {
      throw new Error(messageErreur(err))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}