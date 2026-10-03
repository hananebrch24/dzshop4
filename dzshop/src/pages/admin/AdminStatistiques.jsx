import { useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import api from '../../api/axios'

function AdminStatistiques() {
  const [stats, setStats] = useState(null)

  useEffect(function() {
    api.get('/admin/stats').then(function(rep){ setStats(rep.data) })
  }, [])

  if (!stats) return <p>Chargement des statistiques...</p>

  return (
    <div>
      <h3 className="mb-3">Statistiques</h3>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card card-body text-center">
            <div className="text-muted small">Chiffre d'affaires</div>
            <div className="fs-4 fw-bold">{stats.chiffreAffaires.toLocaleString('fr-DZ')} DZD</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card card-body text-center">
            <div className="text-muted small">Commandes</div>
            <div className="fs-4 fw-bold">{stats.orders}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card card-body text-center">
            <div className="text-muted small">Clients</div>
            <div className="fs-4 fw-bold">{stats.clients}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card card-body text-center">
            <div className="text-muted small">Produits</div>
            <div className="fs-4 fw-bold">{stats.products}</div>
          </div>
        </div>
      </div>

      <div className="card card-body mb-4">
        <h5>Ventes des 7 derniers jours</h5>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={stats.ventes7j}>
            <defs>
              <linearGradient id="ventesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="jour" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip formatter={function(v){ return v.toLocaleString('fr-DZ') + ' DZD' }} />
            <Area type="monotone" dataKey="ventes" stroke="#0d6efd" strokeWidth={3} fill="url(#ventesGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card card-body">
        <h5>Top produits vendus</h5>
        {stats.topProduits.length === 0 ? (
          <p className="text-muted mb-0">Aucune vente livrée pour l'instant</p>
        ) : (
          <ol className="mb-0">
            {stats.topProduits.map(function(p){
              return <li key={p._id}>{p.nom} — {p.qte} vendus ({p.revenu.toLocaleString('fr-DZ')} DZD)</li>
            })}
          </ol>
        )}
      </div>
    </div>
  )
}
export default AdminStatistiques