import { Link } from 'react-router-dom'

function Footer() {
  // new Date().getFullYear() = l'année actuelle, jamais périmée
  const annee = new Date().getFullYear()

  function remonter() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer-dz mt-5">
      <div className="container py-5">
        <div className="row g-4">

          {/* Présentation */}
          <div className="col-lg-4 fade-in-up">
            <h5 className="fw-bold text-white">🛒 DZShop</h5>
            <p className="footer-texte mt-3">
              Votre boutique d'électronique en ligne. Casques, claviers, webcams
              et accessoires, livrés partout en Algérie.
            </p>
            <div className="d-flex gap-2 mt-3">
              {/* Remplace les "#" par tes vrais liens */}
              <a className="footer-social" href="#">Facebook</a>
              <a className="footer-social" href="#">Instagram</a>
            </div>
          </div>

          {/* Navigation */}
          <div className="col-6 col-lg-2 fade-in-up hero-delay-1">
            <h6 className="footer-titre">Navigation</h6>
            <ul className="list-unstyled footer-liens">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/products">Produits</Link></li>
              <li><Link to="/cart">Panier</Link></li>
            </ul>
          </div>

          {/* Compte */}
          <div className="col-6 col-lg-2 fade-in-up hero-delay-2">
            <h6 className="footer-titre">Mon compte</h6>
            <ul className="list-unstyled footer-liens">
              <li><Link to="/login">Connexion</Link></li>
              <li><Link to="/checkout">Commande</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 fade-in-up hero-delay-3">
            <h6 className="footer-titre">Contact</h6>
            <ul className="list-unstyled footer-texte">
              <li className="mb-2">📍 Skikda, Algérie</li>
              <li className="mb-2">📞 +213 000 00 00 00</li>
              <li className="mb-2">✉️ contact@dzshop.dz</li>
              <li>🕘 Dimanche – Jeudi : 9h – 17h</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Barre du bas */}
      <div className="footer-bas">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-3">
          <span className="small">© {annee} DZShop — Tous droits réservés</span>
          <button className="footer-haut" onClick={remonter}>↑ Retour en haut</button>
        </div>
      </div>
    </footer>
  )
}

export default Footer