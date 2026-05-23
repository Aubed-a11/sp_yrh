// src/pages/promoter/PromoterDashboard.jsx
import { useState, useEffect } from 'react';
import { tournamentAPI, sportAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiPlus, FiSettings, FiUsers, FiCalendar, FiActivity } from 'react-icons/fi';

const AFRICAN_COUNTRIES = [
  'Bénin', 'Maroc', 'Sénégal', 'Côte d\'Ivoire', 'Nigeria',
  'Ghana', 'Cameroun', 'Mali', 'Burkina Faso', 'Togo',
  'Niger', 'Guinée', 'Congo', 'Madagascar', 'Kenya',
];

export default function PromoterDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('tournaments');
  const [tournaments, setTournaments] = useState(MOCK_TOURNAMENTS);
  const [sports, setSports] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: '', sportId: '', country: '', city: '',
    format: 'POULES_PUIS_ELIMINATION', maxTeams: 16,
    playerConfig: '11v11', matchDuration: '2x45min',
    startDate: '', endDate: '', description: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sportAPI.getAll()
      .then(res => setSports(res.data))
      .catch(() => setSports(MOCK_SPORTS));
  }, []);

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tournamentAPI.create(form);
      toast.success('Tournoi créé !');
      setShowCreate(false);
    } catch {
      toast.error('Erreur création');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--c-text-3)', marginBottom: '6px' }}>
              SUPER ADMIN PROMOTEUR
            </div>
            <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>
              Bonjour, {user?.firstName} 👋
            </h1>
            <p style={{ color: 'var(--c-text-2)', fontSize: '14px' }}>
              Gérez vos tournois et suivez vos événements
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="btn btn-primary"
          >
            <FiPlus size={16} />
            Nouveau tournoi
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: '🏆', label: 'Tournois actifs', val: '3', color: '#00d4aa' },
            { icon: '⚽', label: 'Matchs programmés', val: '24', color: '#ff6b35' },
            { icon: '👥', label: 'Équipes inscrites', val: '48', color: '#8b5cf6' },
            { icon: '👁️', label: 'Spectateurs en ligne', val: '1,204', color: '#f59e0b' },
          ].map(({ icon, label, val, color }) => (
            <div key={label} className="card">
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color }}>
                {val}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--c-text-3)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--c-border)', paddingBottom: '1px' }}>
          {[
            { id: 'tournaments', label: 'Mes tournois', icon: <FiActivity /> },
            { id: 'matches', label: 'Matchs', icon: <FiCalendar /> },
            { id: 'teams', label: 'Équipes', icon: <FiUsers /> },
            { id: 'settings', label: 'Paramètres', icon: <FiSettings /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 16px',
                borderRadius: '10px 10px 0 0',
                fontSize: '14px', fontWeight: tab === id ? 600 : 400,
                color: tab === id ? 'var(--c-primary)' : 'var(--c-text-3)',
                background: tab === id ? 'rgba(0,212,170,0.08)' : 'transparent',
                borderBottom: tab === id ? '2px solid var(--c-primary)' : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Tournaments List */}
        {tab === 'tournaments' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {tournaments.map((t, i) => (
              <TournamentCard key={i} tournament={t} />
            ))}
          </div>
        )}

        {/* Matches */}
        {tab === 'matches' && (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Match</th>
                  <th>Tournoi</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_MATCHES.map((m, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>
                      {m.home} vs {m.away}
                    </td>
                    <td style={{ color: 'var(--c-text-3)', fontSize: '13px' }}>{m.tournament}</td>
                    <td style={{ color: 'var(--c-text-3)', fontSize: '13px' }}>{m.date}</td>
                    <td>
                      <span className={`badge badge-${m.status === 'LIVE' ? 'live' : m.status === 'FINISHED' ? 'success' : 'info'}`}>
                        {m.status === 'LIVE' && <span className="live-dot" style={{ width: 6, height: 6 }} />}
                        {m.status}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                      {m.score || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Tournament Modal */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', overflowY: 'auto',
        }}>
          <div style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '560px', width: '100%',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px' }}>Créer un tournoi</h2>
              <button onClick={() => setShowCreate(false)} style={{ fontSize: '20px', color: 'var(--c-text-3)', cursor: 'pointer' }}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTournament}>
              <div className="form-group">
                <label className="form-label">Nom du tournoi *</label>
                <input className="form-input" required placeholder="Coupe de Dakar 2026"
                  value={form.name} onChange={set('name')} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Sport *</label>
                  <select className="form-input" required value={form.sportId} onChange={set('sportId')}>
                    <option value="">Choisir...</option>
                    {sports.map(s => (
                      <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Format</label>
                  <select className="form-input" value={form.format} onChange={set('format')}>
                    <option value="ELIMINATION_DIRECTE">Élimination directe</option>
                    <option value="PHASE_LIGUE">Phase de ligue</option>
                    <option value="PHASE_POULES">Phase de poules</option>
                    <option value="POULES_PUIS_ELIMINATION">Poules + Élimination</option>
                    <option value="LIGUE_PUIS_ELIMINATION">Ligue + Élimination</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Pays *</label>
                  <select className="form-input" required value={form.country} onChange={set('country')}>
                    <option value="">Choisir...</option>
                    {AFRICAN_COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ville</label>
                  <input className="form-input" placeholder="Dakar"
                    value={form.city} onChange={set('city')} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Équipes max</label>
                  <select className="form-input" value={form.maxTeams} onChange={set('maxTeams')}>
                    {[4,8,12,16,24,32].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Config joueurs</label>
                  <select className="form-input" value={form.playerConfig} onChange={set('playerConfig')}>
                    {['11v11','7v7','5v5','3v3'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Durée match</label>
                  <select className="form-input" value={form.matchDuration} onChange={set('matchDuration')}>
                    {['2x45min','2x30min','2x20min','4x10min'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Date de début</label>
                  <input className="form-input" type="date"
                    value={form.startDate} onChange={set('startDate')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date de fin</label>
                  <input className="form-input" type="date"
                    value={form.endDate} onChange={set('endDate')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="Description du tournoi..."
                  value={form.description} onChange={set('description')}
                  style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowCreate(false)}
                  className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                  Annuler
                </button>
                <button type="submit" disabled={loading}
                  className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {loading ? 'Création...' : 'Créer le tournoi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TournamentCard({ tournament }) {
  return (
    <div className="card" style={{ borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '22px' }}>{tournament.icon}</span>
        <span className={`badge badge-${
          tournament.status === 'ONGOING' ? 'live' :
          tournament.status === 'DRAFT' ? 'warning' : 'success'
        }`}>
          {tournament.status}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>
        {tournament.name}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--c-text-3)', marginBottom: '12px' }}>
        📍 {tournament.city}, {tournament.country}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
        {[
          { label: 'Équipes', val: `${tournament.teams}/${tournament.maxTeams}` },
          { label: 'Matchs', val: tournament.matches },
          { label: 'Format', val: tournament.format },
          { label: 'Sport', val: tournament.sport },
        ].map(({ label, val }) => (
          <div key={label} style={{
            background: 'var(--c-surface-2)', borderRadius: '8px', padding: '8px 10px',
          }}>
            <div style={{ fontSize: '11px', color: 'var(--c-text-3)' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: 500 }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
          Gérer
        </button>
        <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
          Matchs
        </button>
      </div>
    </div>
  );
}

const MOCK_SPORTS = [
  { id: 1, name: 'Football', icon: '⚽' },
  { id: 2, name: 'Basketball', icon: '🏀' },
  { id: 3, name: 'Handball', icon: '🤾' },
  { id: 4, name: 'Volleyball', icon: '🏐' },
  { id: 5, name: 'Tennis', icon: '🎾' },
];

const MOCK_TOURNAMENTS = [
  { name: 'Coupe du Bénin 2026', icon: '⚽', sport: 'Football',
    city: 'Cotonou', country: 'Bénin', status: 'ONGOING',
    teams: 12, maxTeams: 16, matches: 8, format: 'Poules+Élim.' },
  { name: 'Ligue Basket Maroc', icon: '🏀', sport: 'Basketball',
    city: 'Casablanca', country: 'Maroc', status: 'DRAFT',
    teams: 0, maxTeams: 8, matches: 0, format: 'Ligue' },
  { name: 'Tournoi Volley Dakar', icon: '🏐', sport: 'Volleyball',
    city: 'Dakar', country: 'Sénégal', status: 'ONGOING',
    teams: 6, maxTeams: 8, matches: 3, format: 'Poules' },
];

const MOCK_MATCHES = [
  { home: 'FC Cotonou', away: 'AS Parakou', tournament: 'Coupe du Bénin', date: 'Auj. 14h', status: 'LIVE', score: '2 - 1' },
  { home: 'Etoile Sportive', away: 'Dragons FC', tournament: 'Coupe du Bénin', date: 'Auj. 16h30', status: 'SCHEDULED', score: null },
  { home: 'Tonnerre FC', away: 'Racing Club', tournament: 'Coupe du Bénin', date: 'Hier 15h', status: 'FINISHED', score: '1 - 0' },
];
