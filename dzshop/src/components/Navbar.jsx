import { useState, useEffect, useRef, useContext } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'

function Navbar() {
  const { nbItems } = useContext(CartContext)
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()

  const [menuOuvert, setMenuOuvert] = useState(false)   // menu burger (mobile)
  const [userOuvert, setUserOuvert] = useState(false)   // menu utilisateur
  const [scrolled, setScrolled] = useState(false)       // page défilée ?
  const userRef = useRef(null)

  // La navbar rétrécit quand on descend dans la page
  useEffect(function() {
    function surScroll() { setScrolled(window.scrollY > 20) }
    surScroll()
    window.addEventListener('scroll', surScroll)
    return function() { window.removeEventListener('scroll', surScroll) }
  }, [])

  // On ferme les menus à chaque changement de page
  useEffect(function() {
    setMenuOuvert(false)
    setUserOuvert(false)
  }, [location.pathname])

  // On ferme le menu utilisateur si on clique ailleurs
  useEffect(function() {
    function clicDehors(e) {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOuvert(false)
      }
    }
    document.addEventListener('mousedown', clicDehors)
    return function() { document.removeEventListener('mousedown', clicDehors) }
  }, [])

  function classeLien(info) {
    return 'nav-link' + (info.isActive ? ' active' : '')
  }

  const initiale = user && user.nom ? user.nom.charAt(0).toUpperCase() : '?'

  return (
    <nav className={'navbar navbar-expand-lg navbar-dark nav-dz' + (scrolled ? ' scrolled' : '')}>
      <div className="container">

        <Link className="navbar-brand nav-dz-brand" to="/">
          <span className="nav-dz-logo">🛒</span> DZShop
        </Link>

        {/* Bouton burger (mobile) */}
        <button
          className={'nav-dz-toggler d-lg-none' + (menuOuvert ? ' open' : '')}
          onClick={function() { setMenuOuvert(!menuOuvert) }}
          aria-label="Ouvrir le menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={'nav-dz-collapse' + (menuOuvert ? ' open' : '')}>

          <div className="navbar-nav me-auto">
            <NavLink className={classeLien} to="/" end>Accueil</NavLink>
            <NavLink className={classeLien} to="/products">Produits</NavLink>
            {user && <NavLink className={classeLien} to="/mes-commandes">Mes commandes</NavLink>}
            {user && user.role === 'admin' && <NavLink className={classeLien} to="/admin">Admin</NavLink>}
          </div>

          <div className="d-flex align-items-center gap-3 nav-dz-actions">

            <Link className="btn btn-outline-light position-relative" to="/cart">
              🛒 Panier
              {nbItems > 0 && (
                <span
                  key={nbItems}
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {nbItems}
                </span>
              )}
            </Link>

            {!user ? (
              <>
                <Link className="btn btn-outline-light" to="/register">Inscription</Link>
                <Link className="btn btn-light" to="/login">Connexion</Link>
              </>
            ) : (
              <div className="nav-dz-user" ref={userRef}>
                <button
                  className="btn btn-light d-flex align-items-center gap-2"
                  onClick={function() { setUserOuvert(!userOuvert) }}
                >
                  <span className="nav-dz-avatar">{initiale}</span>
                  {user.nom}
                  <span className={'nav-dz-fleche' + (userOuvert ? ' open' : '')}>▾</span>
                </button>

                {userOuvert && (
                  <div className="nav-dz-menu">
                    <button className="nav-dz-menu-item" onClick={logout}>
                      🚪 Déconnexion
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar