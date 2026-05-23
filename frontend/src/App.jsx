// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Navbar';
import HomePage from './pages/public/HomePage';
import LiveMatchPage from './pages/public/LiveMatchPage';
import { LoginPage, RegisterPage } from './pages/auth/AuthPages';
import PromoterDashboard from './pages/promoter/PromoterDashboard';
import TerrainDashboard from './pages/terrain/TerrainDashboard';
import './index.css';

// Protected route wrapper
function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// Tournaments list page (simplified)
function TournamentsPage() {
  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ marginBottom: '24px' }}>Tous les tournois</h1>
        <p style={{ color: 'var(--c-text-2)' }}>Filtrez par pays, ville et sport</p>
      </div>
    </div>
  );
}

// Live page
function LivePage() {
  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            width: 10, height: 10,
            background: 'var(--c-live)',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'pulse-live 1.5s ease-in-out infinite',
          }} />
          Matchs en direct
        </h1>
        <p style={{ color: 'var(--c-text-2)', marginBottom: '32px' }}>
          Tous les matchs en cours à travers l'Afrique
        </p>
        <div style={{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          color: 'var(--c-text-3)',
        }}>
          Aucun match en direct pour le moment
        </div>
      </div>
    </div>
  );
}

// Teams page
function TeamsPage() {
  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ marginBottom: '24px' }}>Équipes</h1>
        <p style={{ color: 'var(--c-text-2)' }}>Découvrez les équipes africaines</p>
      </div>
    </div>
  );
}

// Admin Platform Dashboard
function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ marginBottom: '8px' }}>Dashboard Admin Plateforme</h1>
        <p style={{ color: 'var(--c-text-2)', marginBottom: '32px' }}>
          Gestion globale de SportAfrica
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Promoteurs actifs', val: '48', icon: '🏢' },
            { label: 'Tournois total', val: '234', icon: '🏆' },
            { label: 'Utilisateurs', val: '12,450', icon: '👥' },
            { label: 'Matchs joués', val: '1,890', icon: '⚽' },
            { label: 'Sports configurés', val: '5', icon: '🎯' },
            { label: 'Pays couverts', val: '12', icon: '🌍' },
          ].map(({ label, val, icon }) => (
            <div key={label} className="card">
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--c-primary)' }}>
                {val}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--c-text-3)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/tournaments" element={<Layout><TournamentsPage /></Layout>} />
      <Route path="/live" element={<Layout><LivePage /></Layout>} />
      <Route path="/teams" element={<Layout><TeamsPage /></Layout>} />
      <Route path="/match/:id" element={<Layout><LiveMatchPage /></Layout>} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['PLATFORM_ADMIN']}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/promoter" element={
        <ProtectedRoute roles={['SUPER_ADMIN_PROMOTER', 'PLATFORM_ADMIN']}>
          <Layout><PromoterDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/terrain" element={
        <ProtectedRoute roles={['ADMIN_TERRAIN', 'SUPER_ADMIN_PROMOTER', 'PLATFORM_ADMIN']}>
          <TerrainDashboard />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--c-surface)',
              color: 'var(--c-text)',
              border: '1px solid var(--c-border)',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
