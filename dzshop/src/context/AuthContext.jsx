import { createContext, useState } from 'react'
import api, { setAuthToken } from '../api/axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Met à jour le token (pour axios) + l'utilisateur (pour l'app).
  function connecter(data) {
    setAuthToken(data.token)
    setUser(data)
  }

  async function login(email, password) {
    try {
      const rep = await api.post('/auth/login', { email, password })
      connecter(rep.data)
      return true
    } catch (err) { return false }
  }

  async function register(nom, email, password) {
    try {
      const rep = await api.post('/auth/register', { nom, email, password })
      connecter(rep.data)
      return true
    } catch (err) { return false }
  }

  function logout() {
    setAuthToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}