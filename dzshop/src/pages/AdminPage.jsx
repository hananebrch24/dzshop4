import { useState } from 'react'

import AdminProduits from './admin/AdminProduits'
import AdminCommandes from './admin/AdminCommandes'
import AdminUtilisateurs from './admin/AdminUtilisateurs'
import AdminStatistiques from './admin/AdminStatistiques'

import './AdminPage.css'

const ONGLETS = [
  {
    cle: 'dashboard',
    label: 'Tableau de bord',
    icon: '🏠'
  },
  {
    cle: 'produits',
    label: 'Produits',
    icon: '📦'
  },
  {
    cle: 'commandes',
    label: 'Commandes',
    icon: '🧾'
  },
  {
    cle: 'utilisateurs',
    label: 'Utilisateurs',
    icon: '👥'
  },
  {
    cle: 'stats',
    label: 'Statistiques',
    icon: '📊'
  }
]

function AdminPage() {
  const [onglet, setOnglet] = useState('dashboard')
  const [menuOuvert, setMenuOuvert] = useState(false)

  const ongletActuel = ONGLETS.find(function (o) {
    return o.cle === onglet
  })

  function afficherContenu() {
    if (onglet === 'produits') {
      return <AdminProduits />
    }

    if (onglet === 'commandes') {
      return <AdminCommandes />
    }

    if (onglet === 'utilisateurs') {
      return <AdminUtilisateurs />
    }

    if (onglet === 'stats') {
      return <AdminStatistiques />
    }

    return (
      <div className="admin-dashboard">

        <div className="admin-welcome">
          <div>
            <span className="admin-eyebrow">
              ESPACE ADMINISTRATEUR
            </span>

            <h2>
              Bienvenue dans votre espace de gestion 👋
            </h2>

            <p>
              Gérez vos produits, commandes et utilisateurs
              depuis votre tableau de bord.
            </p>
          </div>

          <div className="admin-welcome-icon">
            🛍️
          </div>
        </div>

        <div className="admin-cards">

          <button
            className="admin-stat-card"
            onClick={function () {
              setOnglet('produits')
            }}
          >
            <div className="admin-card-icon blue">
              📦
            </div>

            <div>
              <span>Gestion</span>
              <strong>Produits</strong>
              <small>Ajouter, modifier ou supprimer</small>
            </div>

            <span className="admin-card-arrow">
              →
            </span>
          </button>

          <button
            className="admin-stat-card"
            onClick={function () {
              setOnglet('commandes')
            }}
          >
            <div className="admin-card-icon orange">
              🧾
            </div>

            <div>
              <span>Gestion</span>
              <strong>Commandes</strong>
              <small>Suivre les commandes clients</small>
            </div>

            <span className="admin-card-arrow">
              →
            </span>
          </button>

          <button
            className="admin-stat-card"
            onClick={function () {
              setOnglet('utilisateurs')
            }}
          >
            <div className="admin-card-icon green">
              👥
            </div>

            <div>
              <span>Gestion</span>
              <strong>Utilisateurs</strong>
              <small>Gérer les comptes et les rôles</small>
            </div>

            <span className="admin-card-arrow">
              →
            </span>
          </button>

          <button
            className="admin-stat-card"
            onClick={function () {
              setOnglet('stats')
            }}
          >
            <div className="admin-card-icon purple">
              📊
            </div>

            <div>
              <span>Analyse</span>
              <strong>Statistiques</strong>
              <small>Consulter les performances</small>
            </div>

            <span className="admin-card-arrow">
              →
            </span>
          </button>

        </div>

        <div className="admin-info-panel">

          <div className="admin-info-icon">
            💡
          </div>

          <div>
            <h5>Administration DZShop</h5>

            <p>
              Utilisez le menu à gauche pour accéder rapidement
              aux différentes fonctionnalités de votre boutique.
            </p>
          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside
        className={
          'admin-sidebar' +
          (menuOuvert ? ' mobile-open' : '')
        }
      >

        <div className="admin-logo">

          <div className="admin-logo-icon">
            DZ
          </div>

          <div>
            <strong>DZShop</strong>
            <span>Administration</span>
          </div>

        </div>

        <div className="admin-menu-title">
          MENU PRINCIPAL
        </div>

        <nav className="admin-navigation">

          {ONGLETS.map(function (o) {
            return (
              <button
                key={o.cle}
                className={
                  'admin-nav-item' +
                  (onglet === o.cle ? ' active' : '')
                }
                onClick={function () {
                  setOnglet(o.cle)
                  setMenuOuvert(false)
                }}
              >

                <span className="admin-nav-icon">
                  {o.icon}
                </span>

                <span>
                  {o.label}
                </span>

                {onglet === o.cle && (
                  <span className="admin-nav-active">
                    ●
                  </span>
                )}

              </button>
            )
          })}

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-security">
            <span>🔐</span>

            <div>
              <strong>Espace sécurisé</strong>
              <small>Administrateur</small>
            </div>
          </div>

        </div>

      </aside>

      {/* OVERLAY MOBILE */}

      {menuOuvert && (
        <div
          className="admin-overlay"
          onClick={function () {
            setMenuOuvert(false)
          }}
        />
      )}

      {/* CONTENU */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <button
            className="admin-mobile-button"
            onClick={function () {
              setMenuOuvert(!menuOuvert)
            }}
          >
            ☰
          </button>

          <div>

            <div className="admin-breadcrumb">
              DZShop / Administration
            </div>

            <h1>
              {ongletActuel ? ongletActuel.label : 'Dashboard'}
            </h1>

          </div>

          <div className="admin-header-right">

            <div className="admin-status">
              <span></span>
              En ligne
            </div>

            <div className="admin-user">

              <div className="admin-avatar">
                A
              </div>

              <div>
                <strong>Administrateur</strong>
                <small>Compte admin</small>
              </div>

            </div>

          </div>

        </header>

        {/* CONTENU DE LA PAGE */}

        <section className="admin-content">

          {afficherContenu()}

        </section>

      </main>

    </div>
  )
}

export default AdminPage