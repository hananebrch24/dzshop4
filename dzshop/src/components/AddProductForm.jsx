import { useState } from 'react'
import api from '../api/axios'

// produitAModifier : null = mode "Ajouter". Un objet produit = mode "Modifier".
// onTermine = fonction du parent, appelée après un ajout OU une modification (pour recharger)
// onAnnuler = fonction du parent, pour fermer le formulaire de modification
//
// IMPORTANT : le parent doit donner une "key" différente à ce composant selon le produit
// à modifier (ex. key={produitAModifier ? produitAModifier._id : 'nouveau'}). Comme ça,
// React recrée le formulaire à zéro à chaque changement, et useState() peut lire
// produitAModifier UNE SEULE FOIS, à la création, sans avoir besoin d'un useEffect.
function AddProductForm({ produitAModifier, onTermine, onAnnuler }) {
  const [nom, setNom] = useState(produitAModifier ? produitAModifier.nom : '')
  const [prix, setPrix] = useState(produitAModifier ? String(produitAModifier.prix) : '')
  const [categorie, setCategorie] = useState(produitAModifier ? (produitAModifier.categorie || '') : '')
  const [stock, setStock] = useState(produitAModifier ? String(produitAModifier.stock || 0) : '')
  const [image, setImage] = useState(produitAModifier ? (produitAModifier.image || '') : '')   // l'URL de l'image, une fois envoyée
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [message, setMessage] = useState('')

  const modeModification = Boolean(produitAModifier)

  // L'utilisateur choisit un fichier → on l'envoie TOUT DE SUITE à l'API,
  // qui nous répond avec l'adresse (URL) définitive de l'image.
  async function envoyerImage(e) {
    const fichier = e.target.files[0]
    if (!fichier) return

    setEnvoiEnCours(true)
    setMessage('')
    try {
      // FormData = la seule façon d'envoyer un vrai fichier en HTTP (pas du JSON)
      const donnees = new FormData()
      donnees.append('image', fichier)

      const rep = await api.post('/upload', donnees, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setImage(rep.data.imageUrl)
    } catch {
      setMessage("❌ Erreur à l'envoi de l'image (3 Mo maximum, images uniquement)")
    } finally {
      setEnvoiEnCours(false)
    }
  }

  async function valider(e) {
    e.preventDefault()
    const donnees = {
      nom: nom,
      prix: Number(prix),          // Number car un champ donne du texte
      categorie: categorie || 'Divers',
      stock: Number(stock) || 0,
      image: image
    }

    try {
      if (modeModification) {
        await api.put('/products/' + produitAModifier._id, donnees)
        setMessage('✅ Produit « ' + nom + ' » modifié !')
      } else {
        await api.post('/products', donnees)
        setMessage('✅ Produit « ' + nom + ' » ajouté !')
        setNom(''); setPrix(''); setCategorie(''); setStock(''); setImage('')
      }
      if (onTermine) { onTermine() }
    } catch {
      setMessage('❌ Erreur — es-tu connecté en admin ?')
    }
  }

  return (
    <form onSubmit={valider} className="card card-body mb-4" style={{ maxWidth: '450px' }}>
      <h4>{modeModification ? 'Modifier le produit' : 'Ajouter un produit'}</h4>
      {message && <div className="alert alert-info py-2">{message}</div>}

      <input className="form-control mb-2" placeholder="Nom"
        value={nom} onChange={function(e){ setNom(e.target.value) }} required />
      <input className="form-control mb-2" type="number" placeholder="Prix (DZD)"
        value={prix} onChange={function(e){ setPrix(e.target.value) }} required />
      <input className="form-control mb-2" placeholder="Catégorie (facultatif)"
        value={categorie} onChange={function(e){ setCategorie(e.target.value) }} />
      <input className="form-control mb-2" type="number" placeholder="Stock"
        value={stock} onChange={function(e){ setStock(e.target.value) }} />

      <label className="form-label mb-1">Photo du produit</label>
      <input className="form-control mb-2" type="file" accept="image/*" onChange={envoyerImage} />
      {envoiEnCours && <div className="text-muted mb-2">⏳ Envoi de l'image...</div>}
      {image && (
        <img src={image} alt="Aperçu" className="mb-2 rounded" style={{ maxWidth: '120px' }} />
      )}

      <div className="d-flex gap-2">
        <button className="btn btn-primary" disabled={envoiEnCours}>
          {modeModification ? 'Enregistrer' : 'Ajouter'}
        </button>
        {modeModification && (
          <button type="button" className="btn btn-outline-secondary" onClick={onAnnuler}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}
export default AddProductForm