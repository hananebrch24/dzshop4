import { createContext, useState, useEffect } from 'react'

export const ProductsContext = createContext()

const API_URL = 'http://localhost:5000/api/products'

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  // Au démarrage du site, on charge les produits depuis l'API
  useEffect(function() {
    fetch(API_URL)
      .then(function(reponse) {
        if (!reponse.ok) { throw new Error('Erreur ' + reponse.status) }
        return reponse.json()
      })
      .then(function(donnees) {
        setProducts(donnees)
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