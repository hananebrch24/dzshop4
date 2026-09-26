import { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export function CartProvider({ children }) {
  // Au démarrage, on relit le panier sauvegardé : un F5 ne le vide plus
  const [panier, setPanier] = useState(function() {
    try {
      const sauvegarde = localStorage.getItem('panier')
      return sauvegarde ? JSON.parse(sauvegarde) : []
    } catch (err) {
      return []
    }
  })

  // À chaque changement du panier, on le sauvegarde
  useEffect(function() {
    localStorage.setItem('panier', JSON.stringify(panier))
  }, [panier])

  function addToCart(produit) {
    const existe = panier.find(function(a){ return a._id === produit._id })
    if (existe) {
      setPanier(panier.map(function(a){
        if (a._id === produit._id) { return { ...a, qte: a.qte + 1 } }
        return a
      }))
    } else {
      setPanier([ ...panier, { ...produit, qte: 1 } ])
    }
  }

  function removeFromCart(id) {
    setPanier(panier.filter(function(a){ return a._id !== id }))
  }

  function updateQty(id, nouvelleQte) {
    setPanier(panier.map(function(a){
      if (a._id === id) { return { ...a, qte: nouvelleQte } }
      return a
    }))
  }

  function clearCart() { setPanier([]) }

  const total = panier.reduce(function(s, a){ return s + a.prix * a.qte }, 0)
  const nbItems = panier.reduce(function(s, a){ return s + a.qte }, 0)
  let livraison = 500
  if (total >= 10000) { livraison = 0 }

  return (
    <CartContext.Provider
      value={{ panier, addToCart, removeFromCart, updateQty, clearCart, total, nbItems, livraison }}>
      {children}
    </CartContext.Provider>
  )
}