import { createContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const ProductsContext = createContext()

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  // Au démarrage du site, on charge les produits depuis l'API
  // (l'adresse de l'API est dans api/axios.js : plus rien en dur ici)
  useEffect(function() {
    api.get('/products')
      .then(function(rep) {
        setProducts(rep.data)
        setChargement(false)
      })
      .catch(function() {
        setErreur("Impossible de charger les produits. Vérifie que l'API tourne sur le port 5000.")
        setChargement(false)
      })
  }, [])

  return (
    <ProductsContext.Provider value={{ products, chargement, erreur }}>
      {children}
    </ProductsContext.Provider>
  )
}