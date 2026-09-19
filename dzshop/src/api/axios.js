import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5000/api' })

// Le token vit ici, en mémoire (pas de localStorage) — AuthContext le met à jour.
let token = null
export function setAuthToken(t) { token = t }

api.interceptors.request.use(function(config) {
  if (token) { config.headers.Authorization = 'Bearer ' + token }
  return config
})

export default api