// src/pages/terrain/TerrainDashboard.jsx
import { useState, useEffect } from 'react';
import { matchAPI } from '../../services/api';
import { useMatchWebSocket } from '../../hooks/useWebSocket';
import toast from 'react-hot-toast';
import { FiWifi, FiWifiOff, FiPlay, FiSquare, FiClock } from 'react-icons/fi';

// Sport-specific event buttons
const SPORT_EVENTS = {
  Football: [
    { type: 'BUT', label: 'But', icon: '⚽', color: '#00d4aa', points: 1 },
    { type: 'CARTON_JAUNE', label: 'Carton J.', icon: '🟨', color: '#f59e0b', points: 0 },
    { type: 'CARTON_ROUGE', label: 'Carton R.', icon: '🟥', color: '#ef4444', points: 0 },
    { type: 'PENALTY', label: 'Penalty', icon: '🎯', color: '#8b5cf6', points: 0 },
    { type: 'CORNER', label: 'Corner', icon: '📐', color: '#3b82f6', points: 0 },
    { type: 'FAUTE', label: 'Faute', icon: '⚠️', color: '#64748b', points: 0 },
    { type: 'REMPLACEMENT', label: 'Remplacement', icon: '🔄', color: '#06b6d4', points: 0 },
    { type: 'TIR_CADRE', label: 'Tir cadré', icon: '🥅', color: '#22c55e', points: 0 },
  ],
  Basketball: [
    { type: 'PANIER_2PTS', label: '+2 pts', icon: '🏀', color: '#ff6b35', points: 2 },
    { type: 'PANIER_3PTS', label: '+3 pts', icon: '🏀', color: '#ff6b35', points: 3 },
    { type: 'LANCER_FRANC', label: 'Lancer F.', icon: '🎯', color: '#f59e0b', points: 1 },
    { type: 'FAUTE', label: 'Faute', icon: '⚠️', color: '#ef4444', points: 0 },
    { type: 'TEMPS_MORT', label: 'Temps mort', icon: '⏸️', color: '#64748b', points: 0 },
    { type: 'REMPLACEMENT', label: 'Remplacement', icon: '🔄', color: '#06b6d4', points: 0 },
  ],
};

export default function TerrainDashboard() {
  const [activeMatch, setActiveMatch] = useState(null);
  const [matches, setMatches] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [minute, setMinute] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [confirmEvent, setConfirmEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      syncPendingEvents();
      toast.success('Connexion rétablie - synchronisation...');
    };
    const handleOffline = () => {
      setOnline(false);
      toast.error('Connexion perdue - mode hors ligne');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-increment minute when live
  useEffect(() => {
    if (!activeMatch || activeMatch.status !== 'LIVE') return;
    const interval = setInterval(() => {
      setMinute(m => m + 1);
    }, 60000); // every minute
    return () => clearInterval(interval);
  }, [activeMatch?.status]);

  const syncPendingEvents = async () => {
    if (pendingEvents.length === 0) return;
    for (const event of pendingEvents) {
      try {
        await matchAPI.addEvent(event.matchId, event);
      } catch {}
    }
    setPendingEvents([]);
  };

  const startMatch = async () => {
    try {
      const res = await matchAPI.start(activeMatch.id);
      setActiveMatch(res.data);
      setMinute(0);
      toast.success('Match démarré !');
    } catch (e) {
      toast.error('Erreur démarrage');
    }
  };

  const finishMatch = async () => {
    if (!confirm('Terminer le match ?')) return;
    try {
      const res = await matchAPI.finish(activeMatch.id);
      setActiveMatch(res.data);
      toast.success('Match terminé !');
    } catch {
      toast.error('Erreur');
    }
  };

  const handleEventClick = (eventDef) => {
    if (!selectedTeam) {
      toast.error('Sélectionne une équipe d\'abord');
      return;
    }
    setConfirmEvent({ ...eventDef, team: selectedTeam });
  };

  const confirmAddEvent = async () => {
    if (!confirmEvent || !activeMatch) return;
    setLoading(true);

    const eventData = {
      eventType: confirmEvent.type,
      minute,
      description: `${confirmEvent.label} - ${confirmEvent.team === 'home'
        ? activeMatch.homeTeam?.name : activeMatch.awayTeam?.name}`,
      homeTeam: confirmEvent.team === 'home',
      points: confirmEvent.points || 1,
    };

    if (online) {
      try {
        await matchAPI.addEvent(activeMatch.id, eventData);
        // Update local score
        if (confirmEvent.points > 0) {
          setActiveMatch(prev => ({
            ...prev,
            homeScore: confirmEvent.team === 'home'
              ? prev.homeScore + confirmEvent.points
              : prev.homeScore,
            awayScore: confirmEvent.team === 'away'
              ? prev.awayScore + confirmEvent.points
              : prev.awayScore,
          }));
        }
        toast.success(`${confirmEvent.icon} ${confirmEvent.label} enregistré !`);
      } catch {
        toast.error('Erreur enregistrement');
      }
    } else {
      // Store offline
      setPendingEvents(prev => [...prev, { matchId: activeMatch.id, ...eventData }]);
      toast.success(`${confirmEvent.icon} Enregistré hors ligne`);
    }

    setConfirmEvent(null);
    setLoading(false);
  };

  const sportEvents = SPORT_EVENTS[activeMatch?.tournament?.sport?.name] || SPORT_EVENTS.Football;

  return (
    <div style={{
      maxWidth: '480px', margin: '0 auto',
      padding: '16px', minHeight: '100vh',
    }}>

      {/* Connection status */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: online ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${online ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
        borderRadius: '10px',
        marginBottom: '16px',
        fontSize: '13px',
      }}>
        {online ? (
          <>
            <span style={{ color: 'var(--c-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiWifi size={14} /> En ligne
            </span>
          </>
        ) : (
          <>
            <span style={{ color: 'var(--c-live)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiWifiOff size={14} /> Hors ligne
            </span>
            {pendingEvents.length > 0 && (
              <span style={{ color: 'var(--c-warning)' }}>
                {pendingEvents.length} événements en attente
              </span>
            )}
          </>
        )}
      </div>

      {!activeMatch ? (
        /* Match Selection */
        <div>
          <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>Mes matchs assignés</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_ASSIGNED_MATCHES.map(m => (
              <button key={m.id} onClick={() => setActiveMatch(m)} style={{
                background: 'var(--c-surface)',
                border: '1px solid var(--c-border)',
                borderRadius: '14px', padding: '16px',
                textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: '12px', color: 'var(--c-text-3)', marginBottom: '8px' }}>
                  {m.tournament?.name} • {m.scheduledAt}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '16px', color: 'var(--c-text)',
                }}>
                  {m.homeTeam?.name} vs {m.awayTeam?.name}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span className={`badge badge-${m.status === 'LIVE' ? 'live' : 'info'}`}>
                    {m.status === 'LIVE' && <span className="live-dot" style={{ width: 6, height: 6 }} />}
                    {m.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Active Match Interface */
        <div>
          {/* Back */}
          <button onClick={() => setActiveMatch(null)} style={{
            color: 'var(--c-text-3)', fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '6px',
            marginBottom: '16px', background: 'none', cursor: 'pointer',
          }}>
            ← Retour aux matchs
          </button>

          {/* Score Card */}
          <div style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '12px', color: 'var(--c-text-3)', marginBottom: '12px' }}>
              {activeMatch.tournament?.name}
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr auto 1fr',
              gap: '12px', alignItems: 'center', marginBottom: '16px',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>
                {activeMatch.homeTeam?.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '40px',
                fontWeight: 900, letterSpacing: '-1px',
              }}>
                {activeMatch.homeScore ?? 0}
                <span style={{ color: 'var(--c-text-3)', margin: '0 6px' }}>—</span>
                {activeMatch.awayScore ?? 0}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>
                {activeMatch.awayTeam?.name}
              </div>
            </div>

            {activeMatch.status === 'LIVE' && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: 'var(--c-live)', fontSize: '14px', fontWeight: 600,
              }}>
                <FiClock size={14} />
                {minute}'
              </div>
            )}

            {/* Match control buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'center' }}>
              {activeMatch.status === 'SCHEDULED' && (
                <button onClick={startMatch} className="btn btn-primary" style={{ gap: '6px' }}>
                  <FiPlay size={16} /> Démarrer le match
                </button>
              )}
              {activeMatch.status === 'LIVE' && (
                <button onClick={finishMatch} className="btn btn-danger" style={{ gap: '6px' }}>
                  <FiSquare size={14} /> Terminer
                </button>
              )}
            </div>
          </div>

          {activeMatch.status === 'LIVE' && (
            <>
              {/* Team Selection */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--c-text-3)', marginBottom: '10px', textAlign: 'center' }}>
                  SÉLECTIONNE L'ÉQUIPE CONCERNÉE
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['home', 'away'].map(team => (
                    <button
                      key={team}
                      onClick={() => setSelectedTeam(team === selectedTeam ? null : team)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: `2px solid ${selectedTeam === team ? 'var(--c-primary)' : 'var(--c-border)'}`,
                        background: selectedTeam === team ? 'rgba(0,212,170,0.1)' : 'var(--c-surface)',
                        color: selectedTeam === team ? 'var(--c-primary)' : 'var(--c-text)',
                        fontFamily: 'var(--font-display)', fontWeight: 600,
                        fontSize: '14px', cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {team === 'home' ? activeMatch.homeTeam?.name : activeMatch.awayTeam?.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Buttons */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: 'var(--c-text-3)', marginBottom: '10px', textAlign: 'center' }}>
                  ÉVÉNEMENT
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {sportEvents.map(event => (
                    <button
                      key={event.type}
                      onClick={() => handleEventClick(event)}
                      style={{
                        padding: '18px 12px',
                        borderRadius: '14px',
                        border: `1px solid ${event.color}40`,
                        background: `${event.color}15`,
                        color: event.color,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: '8px',
                        cursor: 'pointer', transition: 'all 0.15s',
                        fontSize: '28px',
                      }}
                    >
                      {event.icon}
                      <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                        {event.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmEvent && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '360px', width: '100%',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{confirmEvent.icon}</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '20px',
              fontWeight: 700, marginBottom: '8px',
            }}>
              {confirmEvent.label}
            </div>
            <div style={{ color: 'var(--c-text-2)', fontSize: '14px', marginBottom: '24px' }}>
              {confirmEvent.team === 'home' ? activeMatch?.homeTeam?.name : activeMatch?.awayTeam?.name}
              {confirmEvent.points > 0 && ` (+${confirmEvent.points} point${confirmEvent.points > 1 ? 's' : ''})`}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => setConfirmEvent(null)}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Annuler
              </button>
              <button
                onClick={confirmAddEvent}
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? '...' : 'Confirmer ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MOCK_ASSIGNED_MATCHES = [
  {
    id: 1, status: 'SCHEDULED',
    homeScore: 0, awayScore: 0,
    scheduledAt: '14h00 - Aujourd\'hui',
    homeTeam: { name: 'FC Cotonou' },
    awayTeam: { name: 'AS Parakou' },
    tournament: { name: 'Coupe du Bénin 2026', sport: { name: 'Football' } },
  },
  {
    id: 2, status: 'LIVE',
    homeScore: 1, awayScore: 0,
    scheduledAt: '16h30 - Aujourd\'hui',
    homeTeam: { name: 'Etoile Sportive' },
    awayTeam: { name: 'Dragons FC' },
    tournament: { name: 'Ligue Béninoise', sport: { name: 'Football' } },
  },
];
