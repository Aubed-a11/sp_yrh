// src/pages/public/LiveMatchPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { matchAPI } from '../../services/api';
import { useMatchWebSocket } from '../../hooks/useWebSocket';
import { FiClock, FiFlag, FiArrowRight } from 'react-icons/fi';

const EVENT_ICONS = {
  BUT: '⚽', PANIER_2PTS: '🏀', PANIER_3PTS: '🏀',
  CARTON_JAUNE: '🟨', CARTON_ROUGE: '🟥',
  REMPLACEMENT: '🔄', FAUTE: '⚠️',
  PENALTY: '🎯', CORNER: '📐',
  TEMPS_MORT: '⏸️', DEFAULT: '📝',
};

export default function LiveMatchPage() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scoreFlash, setScoreFlash] = useState(false);

  // Load initial data
  useEffect(() => {
    if (!id) return;
    Promise.all([matchAPI.getById(id), matchAPI.getEvents(id)])
      .then(([matchRes, eventsRes]) => {
        setMatch(matchRes.data);
        setEvents(eventsRes.data || []);
      })
      .catch(() => setMatch(MOCK_MATCH))
      .finally(() => setLoading(false));
  }, [id]);

  // WebSocket live updates
  useMatchWebSocket(id, (data) => {
    if (data.isEvent) {
      setEvents(prev => [data, ...prev]);
    } else {
      setMatch(prev => ({
        ...prev,
        homeScore: data.homeScore ?? prev.homeScore,
        awayScore: data.awayScore ?? prev.awayScore,
        status: data.status ?? prev.status,
      }));
      if (data.homeScore !== undefined || data.awayScore !== undefined) {
        setScoreFlash(true);
        setTimeout(() => setScoreFlash(false), 1000);
      }
    }
  });

  if (loading) return <LoadingSpinner />;
  if (!match) return <div className="container" style={{ padding: '40px 0' }}>Match introuvable</div>;

  const isLive = match.status === 'LIVE';

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        {/* Match Header */}
        <div style={{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '24px',
        }}>
          {/* Top bar */}
          <div style={{
            background: isLive
              ? 'linear-gradient(90deg, rgba(239,68,68,0.15), transparent)'
              : 'var(--c-surface-2)',
            padding: '12px 24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid var(--c-border)',
          }}>
            <div style={{ fontSize: '13px', color: 'var(--c-text-2)' }}>
              {match.tournament?.name} • {match.phase || 'Phase de poules'} • {match.city}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isLive ? (
                <span className="badge badge-live">
                  <span className="live-dot" style={{ width: 6, height: 6 }} />
                  EN DIRECT
                </span>
              ) : (
                <span className="badge badge-info">{match.status}</span>
              )}
            </div>
          </div>

          {/* Score */}
          <div style={{
            padding: '40px 24px',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '24px',
            alignItems: 'center',
          }}>
            {/* Home team */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>🏃</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '20px', marginBottom: '6px',
              }}>
                {match.homeTeam?.name || 'Équipe A'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--c-text-3)' }}>
                {match.homeTeam?.city}
              </div>
            </div>

            {/* Score center */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '64px', fontWeight: 900,
                color: 'var(--c-text)',
                letterSpacing: '-2px',
                transition: 'background 0.3s',
                padding: '10px 20px',
                borderRadius: '16px',
                background: scoreFlash ? 'rgba(0,212,170,0.15)' : 'transparent',
              }}>
                {match.homeScore ?? 0}
                <span style={{ color: 'var(--c-text-3)', margin: '0 8px' }}>—</span>
                {match.awayScore ?? 0}
              </div>

              {isLive && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  justifyContent: 'center', marginTop: '8px',
                  color: 'var(--c-live)', fontSize: '14px', fontWeight: 600,
                }}>
                  <FiClock size={14} />
                  {match.minute ? `${match.minute}'` : 'En cours'}
                </div>
              )}
            </div>

            {/* Away team */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>🏃</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '20px', marginBottom: '6px',
              }}>
                {match.awayTeam?.name || 'Équipe B'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--c-text-3)' }}>
                {match.awayTeam?.city}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
          {/* Events Timeline */}
          <div className="card">
            <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>
              Fil du match
            </h3>
            {events.length === 0 ? (
              <div style={{ color: 'var(--c-text-3)', textAlign: 'center', padding: '40px 0' }}>
                Aucun événement pour l'instant
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {events.map((ev, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: i === 0 ? 'rgba(0,212,170,0.05)' : 'transparent',
                    transition: 'background 0.3s',
                  }}>
                    <div style={{
                      minWidth: '36px', textAlign: 'right',
                      fontFamily: 'var(--font-display)', fontWeight: 700,
                      color: 'var(--c-text-3)', fontSize: '13px',
                    }}>
                      {ev.minute}'
                    </div>
                    <div style={{ fontSize: '20px' }}>
                      {EVENT_ICONS[ev.eventType] || EVENT_ICONS.DEFAULT}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>
                        {formatEventType(ev.eventType)}
                      </div>
                      {ev.description && (
                        <div style={{ fontSize: '13px', color: 'var(--c-text-3)' }}>
                          {ev.description}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--c-text-3)' }}>
                      {ev.team?.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Match Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card">
              <h4 style={{ fontSize: '14px', marginBottom: '14px', color: 'var(--c-text-2)' }}>
                INFORMATIONS
              </h4>
              {[
                { label: 'Compétition', val: match.tournament?.name },
                { label: 'Phase', val: match.phase || 'Poules' },
                { label: 'Lieu', val: match.venue || match.city },
                { label: 'Groupe', val: match.group },
                { label: 'Sport', val: match.tournament?.sport?.name },
              ].filter(r => r.val).map(({ label, val }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid var(--c-border)',
                  fontSize: '13px',
                }}>
                  <span style={{ color: 'var(--c-text-3)' }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{val}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <h4 style={{ fontSize: '14px', marginBottom: '14px', color: 'var(--c-text-2)' }}>
                BUTS
              </h4>
              {events
                .filter(e => e.eventType === 'BUT' || e.eventType === 'PANIER_2PTS' || e.eventType === 'PANIER_3PTS')
                .slice(0, 8)
                .map((e, i) => (
                  <div key={i} style={{
                    fontSize: '13px', padding: '6px 0',
                    borderBottom: '1px solid var(--c-border)',
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span>{e.player?.firstName || 'Joueur'} {e.minute}'</span>
                    <span style={{ color: 'var(--c-text-3)' }}>{e.team?.name}</span>
                  </div>
                ))}
              {events.filter(e => e.eventType === 'BUT').length === 0 && (
                <div style={{ color: 'var(--c-text-3)', fontSize: '13px' }}>Aucun but</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatEventType(type) {
  const labels = {
    BUT: 'But !', CARTON_JAUNE: 'Carton jaune',
    CARTON_ROUGE: 'Carton rouge', REMPLACEMENT: 'Remplacement',
    FAUTE: 'Faute', CORNER: 'Corner',
    PANIER_2PTS: 'Panier 2pts', PANIER_3PTS: 'Panier 3pts',
    PENALTY: 'Penalty', TEMPS_MORT: 'Temps mort',
  };
  return labels[type] || type;
}

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid var(--c-border)',
        borderTop: '3px solid var(--c-primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

const MOCK_MATCH = {
  id: 1, homeScore: 2, awayScore: 1, status: 'LIVE', minute: 67,
  homeTeam: { name: 'FC Cotonou', city: 'Cotonou' },
  awayTeam: { name: 'AS Parakou', city: 'Parakou' },
  tournament: { name: 'Ligue Béninoise', sport: { name: 'Football' } },
  phase: 'Quart de finale', venue: 'Stade de l\'Amitié',
};
