// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const ROLE_REDIRECT = {
    PLATFORM_ADMIN: '/admin',
    SUPER_ADMIN_PROMOTER: '/promoter',
    ADMIN_TERRAIN: '/terrain',
    TEAM_ACCOUNT: '/team',
    SCOUT: '/scout',
    PUBLIC_USER: '/',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(ROLE_REDIRECT[result.role] || '/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,170,0.05) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, var(--c-primary), var(--c-accent))',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
            }}>🌍</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800 }}>
              SportAfrica
            </span>
          </Link>
          <h1 style={{ fontSize: '26px', marginBottom: '8px' }}>Connexion</h1>
          <p style={{ color: 'var(--c-text-2)', fontSize: '14px' }}>
            Accédez à votre espace
          </p>
        </div>

        <div className="card" style={{ borderRadius: '20px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email" required
                placeholder="votre@email.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input
                className="form-input"
                type="password" required
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '8px' }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--c-text-3)' }}>
            Pas de compte ?{' '}
            <Link to="/register" style={{ color: 'var(--c-primary)', fontWeight: 600 }}>
              S'inscrire
            </Link>
          </div>

          {/* Demo accounts */}
          <div style={{
            marginTop: '20px', padding: '14px',
            background: 'var(--c-surface-2)',
            borderRadius: '12px', fontSize: '12px',
          }}>
            <div style={{ color: 'var(--c-text-3)', marginBottom: '8px', fontWeight: 600 }}>
              COMPTES DE DÉMO
            </div>
            {[
              { label: 'Admin plateforme', email: 'admin@sportafrica.com', pass: 'Admin2026@' },
              { label: 'Promoteur', email: 'promoter@demo.com', pass: 'demo123' },
              { label: 'Admin terrain', email: 'terrain@demo.com', pass: 'demo123' },
            ].map(({ label, email, pass }) => (
              <button
                key={email}
                onClick={() => setForm({ email, password: pass })}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '6px 0', color: 'var(--c-primary)',
                  background: 'none', cursor: 'pointer', fontSize: '12px',
                }}
              >
                {label} →
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// src/pages/auth/RegisterPage.jsx
export function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) navigate('/');
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', marginBottom: '8px' }}>Créer un compte</h1>
          <p style={{ color: 'var(--c-text-2)', fontSize: '14px' }}>
            Rejoignez la communauté sportive africaine
          </p>
        </div>

        <div className="card" style={{ borderRadius: '20px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input className="form-input" required placeholder="Hortice"
                  value={form.firstName} onChange={set('firstName')} />
              </div>
              <div className="form-group">
                <label className="form-label">Nom</label>
                <input className="form-input" required placeholder="ADOGNIBO"
                  value={form.lastName} onChange={set('lastName')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" required
                placeholder="votre@email.com"
                value={form.email} onChange={set('email')} />
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input className="form-input" type="password" required minLength="6"
                placeholder="••••••••"
                value={form.password} onChange={set('password')} />
            </div>
            <button
              type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '8px' }}
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--c-text-3)' }}>
            Déjà inscrit ?{' '}
            <Link to="/login" style={{ color: 'var(--c-primary)', fontWeight: 600 }}>
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
