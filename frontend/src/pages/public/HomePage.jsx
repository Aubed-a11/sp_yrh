// src/pages/public/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI, matchAPI } from '../../services/api';
import { FiArrowRight, FiMapPin, FiUsers, FiActivity } from 'react-icons/fi';

const SPORTS = [
  { name: 'Football', icon: '⚽', color: '#00d4aa', count: '2,400+ tournois' },
  { name: 'Basketball', icon: '🏀', color: '#ff6b35', count: '890+ tournois' },
  { name: 'Handball', icon: '🤾', color: '#8b5cf6', count: '340+ tournois' },
  { name: 'Volleyball', icon: '🏐', color: '#f59e0b', count: '520+ tournois' },
  { name: 'Tennis', icon: '🎾', color: '#22c55e', count: '210+ tournois' },
];

const COUNTRIES = ['Bénin', 'Maroc', 'Sénégal', 'Côte d\'Ivoire', 'Nigeria',
  'Ghana', 'Cameroun', 'Burkina Faso', 'Mali', 'Togo'];

export default function HomePage() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Refresh live every 30s
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [homeData, liveData] = await Promise.all([
        publicAPI.getHomepage(),
        matchAPI.getLive(),
      ]);
      setLiveMatches(liveData.data || []);
      setTournaments(homeData.data?.ongoingTournaments || []);
    } catch {
      // Use mock data if backend not available
      setLiveMatches(MOCK_LIVE);
      setTournaments(MOCK_TOURNAMENTS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '80px 0 60px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,170,0.08) 0%, transparent 70%)',
        borderBottom: '1px solid var(--c-border)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px',
            background: 'rgba(0,212,170,0.1)',
            border: '1px solid rgba(0,212,170,0.2)',
            borderRadius: '20px',
            fontSize: '13px', color: 'var(--c-primary)',
            marginBottom: '24px',
          }}>
            <span className="live-dot" />
            {liveMatches.length} matchs en cours
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, var(--c-text) 60%, var(--c-primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Le sport africain<br />en temps réel
          </h1>

          <p style={{
            fontSize: '18px', color: 'var(--c-text-2)',
            maxWidth: '520px', margin: '0 auto 36px',
            lineHeight: 1.7,
          }}>
            Suivez vos tournois locaux, découvrez les talents de votre région
            et ne manquez plus aucun match en Afrique.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/live" className="btn btn-primary" style={{ fontSize: '15px', padding: '12px 28px' }}>
              <FiActivity size={16} />
              Voir les matchs live
            </Link>
            <Link to="/tournaments" className="btn btn-outline" style={{ fontSize: '15px', padding: '12px 28px' }}>
              Explorer les tournois
              <FiArrowRight size={16} />
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '40px', justifyContent: 'center',
            marginTop: '56px', flexWrap: 'wrap',
          }}>
            {[
              { val: '54', label: 'Pays africains' },
              { val: '4,300+', label: 'Tournois actifs' },
              { val: '28K+', label: 'Équipes inscrites' },
              { val: '120K+', label: 'Joueurs suivis' },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '32px',
                  fontWeight: 800, color: 'var(--c-primary)',
                }}>{val}</div>
                <div style={{ fontSize: '13px', color: 'var(--c-text-3)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Filter */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => setSelectedSport(null)}
              style={{
                padding: '10px 18px', borderRadius: '10px', fontSize: '14px',
                fontWeight: 600, fontFamily: 'var(--font-display)',
                background: !selectedSport ? 'var(--c-primary)' : 'var(--c-surface)',
                color: !selectedSport ? '#000' : 'var(--c-text-2)',
                border: `1px solid ${!selectedSport ? 'transparent' : 'var(--c-border)'}`,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
            >
              Tous les sports
            </button>
            {SPORTS.map(sport => (
              <button
                key={sport.name}
                onClick={() => setSelectedSport(sport.name)}
                style={{
                  padding: '10px 18px', borderRadius: '10px', fontSize: '14px',
                  fontWeight: 600, fontFamily: 'var(--font-display)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: selectedSport === sport.name ? sport.color + '20' : 'var(--c-surface)',
                  color: selectedSport === sport.name ? sport.color : 'var(--c-text-2)',
                  border: `1px solid ${selectedSport === sport.name ? sport.color + '40' : 'var(--c-border)'}`,
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                }}
              >
                {sport.icon} {sport.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section style={{ padding: '0 0 40px' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="live-dot" />
                Matchs en direct
              </h2>
              <Link to="/live" style={{ fontSize: '13px', color: 'var(--c-primary)' }}>
                Tout voir →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
              {liveMatches.map(match => (
                <LiveMatchCard key={match.id || Math.random()} match={match} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tournaments */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px' }}>Tournois en cours</h2>
            <Link to="/tournaments" style={{ fontSize: '13px', color: 'var(--c-primary)' }}>
              Tout voir →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {tournaments.map((t, i) => (
              <TournamentCard key={t.id || i} tournament={t} />
            ))}
            {tournaments.length === 0 && !loading && (
              MOCK_TOURNAMENTS.map((t, i) => <TournamentCard key={i} tournament={t} />)
            )}
          </div>
        </div>
      </section>

      {/* African Coverage */}
      <section style={{
        padding: '60px 0',
        background: 'var(--c-surface)',
        borderTop: '1px solid var(--c-border)',
        borderBottom: '1px solid var(--c-border)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: '12px' }}>
            Présent dans toute l'Afrique
          </h2>
          <p style={{ color: 'var(--c-text-2)', marginBottom: '32px' }}>
            54 pays, des centaines de villes couvertes
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {COUNTRIES.map(country => (
              <Link key={country} to={`/tournaments?country=${country}`} style={{
                padding: '8px 16px',
                background: 'var(--c-surface-2)',
                border: '1px solid var(--c-border)',
                borderRadius: '20px',
                fontSize: '13px', color: 'var(--c-text-2)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <FiMapPin size={12} />
                {country}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Live Match Card ───────────────────────────────────────────
function LiveMatchCard({ match }) {
  return (
    <Link to={`/match/${match.id}`} style={{
      display: 'block',
      background: 'var(--c-surface)',
      border: '1px solid var(--c-border)',
      borderRadius: '14px',
      padding: '16px',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', color: 'var(--c-text-3)' }}>
          {match.tournament?.name || 'Tournoi'} • {match.tournament?.city || 'Ville'}
        </span>
        <span className="badge badge-live">
          <span className="live-dot" style={{ width: 6, height: 6 }} />
          LIVE
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏃</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' }}>
            {match.homeTeam?.name || 'Équipe A'}
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '0 16px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800,
            color: 'var(--c-text)',
          }}>
            {match.homeScore ?? 0} — {match.awayScore ?? 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--c-text-3)', marginTop: '4px' }}>
            {match.minute ? `${match.minute}'` : 'En cours'}
          </div>
        </div>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏃</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' }}>
            {match.awayTeam?.name || 'Équipe B'}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Tournament Card ───────────────────────────────────────────
function TournamentCard({ tournament }) {
  const sportColors = {
    Football: '#00d4aa', Basketball: '#ff6b35',
    Handball: '#8b5cf6', Volleyball: '#f59e0b', Tennis: '#22c55e',
  };
  const color = sportColors[tournament.sport?.name] || '#00d4aa';

  return (
    <Link to={`/tournament/${tournament.id}`} style={{
      display: 'block',
      background: 'var(--c-surface)',
      border: '1px solid var(--c-border)',
      borderRadius: '14px',
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>
      <div style={{
        height: '6px',
        background: `linear-gradient(90deg, ${color}, ${color}80)`,
      }} />
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '20px' }}>
            {tournament.sport?.icon || '🏆'}
          </span>
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: color,
            background: color + '20',
            padding: '2px 8px', borderRadius: '10px',
          }}>
            {tournament.sport?.name || 'Sport'}
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: '15px', marginBottom: '8px',
        }}>
          {tournament.name || 'Tournoi'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--c-text-3)', fontSize: '13px' }}>
          <FiMapPin size={12} />
          {tournament.city || 'Ville'}, {tournament.country || 'Pays'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--c-text-3)', fontSize: '13px', marginTop: '4px' }}>
          <FiUsers size={12} />
          {tournament.teams?.length || 0} équipes
        </div>
      </div>
    </Link>
  );
}

// Mock data
const MOCK_LIVE = [
  { id: 1, homeTeam: { name: 'FC Cotonou' }, awayTeam: { name: 'AS Parakou' },
    homeScore: 2, awayScore: 1, minute: 67,
    tournament: { name: 'Ligue Béninoise', city: 'Cotonou' } },
  { id: 2, homeTeam: { name: 'Raja Casablanca' }, awayTeam: { name: 'WAC' },
    homeScore: 0, awayScore: 0, minute: 34,
    tournament: { name: 'Championnat Maroc', city: 'Casablanca' } },
  { id: 3, homeTeam: { name: 'Ouakam FC' }, awayTeam: { name: 'Génération Foot' },
    homeScore: 1, awayScore: 3, minute: 82,
    tournament: { name: 'Ligue 1 Sénégal', city: 'Dakar' } },
];

const MOCK_TOURNAMENTS = [
  { id: 1, name: 'Coupe du Bénin 2026', city: 'Cotonou', country: 'Bénin',
    sport: { name: 'Football', icon: '⚽' }, teams: new Array(16) },
  { id: 2, name: 'Tournoi Maghrébin Basketball', city: 'Rabat', country: 'Maroc',
    sport: { name: 'Basketball', icon: '🏀' }, teams: new Array(8) },
  { id: 3, name: 'Ligue Africaine Handball', city: 'Dakar', country: 'Sénégal',
    sport: { name: 'Handball', icon: '🤾' }, teams: new Array(12) },
  { id: 4, name: 'Open Tennis Abidjan', city: 'Abidjan', country: 'Côte d\'Ivoire',
    sport: { name: 'Tennis', icon: '🎾' }, teams: new Array(32) },
];
