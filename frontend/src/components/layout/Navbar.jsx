// src/components/layout/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiActivity, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const SPORTS = [
  { name: 'Football', icon: '⚽', color: '#00d4aa' },
  { name: 'Basketball', icon: '🏀', color: '#ff6b35' },
  { name: 'Handball', icon: '🤾', color: '#8b5cf6' },
  { name: 'Volleyball', icon: '🏐', color: '#f59e0b' },
  { name: 'Tennis', icon: '🎾', color: '#22c55e' },
];

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (hasRole('PLATFORM_ADMIN')) return '/admin';
    if (hasRole('SUPER_ADMIN_PROMOTER')) return '/promoter';
    if (hasRole('ADMIN_TERRAIN')) return '/terrain';
    if (hasRole('TEAM_ACCOUNT')) return '/team';
    if (hasRole('SCOUT')) return '/scout';
    return '/dashboard';
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(6,10,15,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--c-border)',
      height: '64px',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '100%',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--c-primary), var(--c-accent))',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>🌍</div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: '16px', color: 'var(--c-text)',
              letterSpacing: '-0.02em',
            }}>SportAfrica</div>
            <div style={{ fontSize: '10px', color: 'var(--c-primary)', letterSpacing: '0.1em' }}>
              PANAFRICAIN
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[
            { to: '/', label: 'Accueil' },
            { to: '/tournaments', label: 'Tournois' },
            { to: '/live', label: 'Live', live: true },
            { to: '/teams', label: 'Équipes' },
          ].map(({ to, label, live }) => (
            <Link key={to} to={to} style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: location.pathname === to ? '600' : '400',
              color: location.pathname === to ? 'var(--c-primary)' : 'var(--c-text-2)',
              background: location.pathname === to ? 'rgba(0,212,170,0.1)' : 'transparent',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}>
              {live && <span className="live-dot" />}
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '13px' }}>
                Dashboard
              </Link>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px',
                background: 'var(--c-surface)',
                borderRadius: '10px',
                border: '1px solid var(--c-border)',
              }}>
                <div style={{
                  width: 28, height: 28,
                  background: 'var(--c-primary)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, color: '#000',
                }}>
                  {user.firstName?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--c-text-2)' }}>
                  {user.firstName}
                </span>
                <button onClick={logout} style={{
                  color: 'var(--c-text-3)', padding: '2px',
                  display: 'flex', alignItems: 'center',
                }}>
                  <FiLogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ fontSize: '14px' }}>
                Connexion
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '14px' }}>
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// src/components/layout/Layout.jsx
export function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--c-border)',
      padding: '40px 0',
      marginTop: '80px',
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🌍</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--c-text)' }}>
                SportAfrica
              </div>
              <div style={{ fontSize: '12px', color: 'var(--c-text-3)' }}>
                La plateforme sportive panafricaine
              </div>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--c-text-3)' }}>
            © 2026 SportAfrica. Révéler les talents du continent.
          </div>
        </div>
      </div>
    </footer>
  );
}
