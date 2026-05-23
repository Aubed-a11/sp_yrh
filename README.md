# 🌍 SportAfrica — Plateforme Sportive Panafricaine

Application complète **React + Spring Boot** pour la gestion et le suivi de tournois sportifs en Afrique.

---

## 🏗️ Architecture

```
sport-platform/
├── backend/          # Spring Boot (Java 17)
│   └── src/main/java/com/africa/sport/
│       ├── model/        # Entités JPA (User, Tournament, Match, Player...)
│       ├── repository/   # Repositories Spring Data JPA
│       ├── controller/   # REST Controllers (Auth, Match, Tournament, Sport...)
│       ├── security/     # JWT + Spring Security
│       ├── websocket/    # WebSocket STOMP (temps réel)
│       └── config/       # DataInitializer (sports + admin par défaut)
│
└── frontend/         # React + Vite
    └── src/
        ├── pages/
        │   ├── public/    # HomePage, LiveMatchPage
        │   ├── auth/      # Login, Register
        │   ├── promoter/  # PromoterDashboard
        │   └── terrain/   # TerrainDashboard (mobile-first)
        ├── components/    # Navbar, Layout
        ├── services/      # API (axios)
        ├── context/       # AuthContext (JWT)
        └── hooks/         # useWebSocket (STOMP)
```

---

## 🚀 Démarrage

### 1. Base de données PostgreSQL

```sql
CREATE DATABASE sport_platform;
CREATE USER sport_user WITH PASSWORD 'sport_pass';
GRANT ALL PRIVILEGES ON DATABASE sport_platform TO sport_user;
```

### 2. Backend Spring Boot

```bash
cd backend
mvn spring-boot:run
```

Le serveur démarre sur **http://localhost:8080**

Au premier démarrage, les données suivantes sont créées automatiquement :
- **5 sports** : Football, Basketball, Handball, Volleyball, Tennis
- **Admin** : `admin@sportafrica.com` / `Admin2026@`

### 3. Frontend React

```bash
cd frontend
npm install
npm run dev
```

L'app démarre sur **http://localhost:3000**

---

## 🔑 Comptes et rôles

| Rôle | Description | Accès |
|------|-------------|-------|
| `PLATFORM_ADMIN` | Admin de la plateforme SaaS | `/admin` |
| `SUPER_ADMIN_PROMOTER` | Promoteur de tournois | `/promoter` |
| `ADMIN_TERRAIN` | Saisie des événements live | `/terrain` |
| `COMMENTATEUR` | Commentaire en direct | — |
| `TEAM_ACCOUNT` | Gestion d'équipe | `/team` |
| `SCOUT` | Détection de talents | `/scout` |
| `PUBLIC_USER` | Visiteur inscrit | `/` |

---

## 📡 API REST

### Auth
```
POST /api/auth/login     { email, password } → { token, role }
POST /api/auth/register  { email, password, firstName, lastName }
```

### Matchs (public)
```
GET  /api/matches/live         → Liste des matchs en cours
GET  /api/matches/{id}         → Détail d'un match
GET  /api/matches/{id}/events  → Événements du match
```

### Matchs (admin terrain)
```
POST /api/matches/{id}/start   → Démarrer un match
POST /api/matches/{id}/event   → Ajouter un événement { eventType, minute, homeTeam, points }
POST /api/matches/{id}/finish  → Terminer un match
```

### Tournois
```
GET  /api/tournaments              → Liste (params: country, status)
GET  /api/tournaments/{id}         → Détail
GET  /api/tournaments/{id}/matches → Matchs du tournoi
POST /api/tournaments              → Créer (PROMOTER+)
PUT  /api/tournaments/{id}         → Modifier
```

### Sports
```
GET  /api/sports      → Tous les sports actifs
POST /api/sports      → Créer un template (ADMIN)
```

---

## 🔌 WebSocket (temps réel)

Endpoint STOMP : `ws://localhost:8080/ws`

```javascript
// S'abonner aux événements d'un match
client.subscribe('/topic/match/{matchId}', (msg) => {
  // { type, homeScore, awayScore, status }
});

client.subscribe('/topic/match/{matchId}/events', (msg) => {
  // { eventType, minute, description, homeScore, awayScore }
});

// Envoyer un événement (admin terrain)
client.publish('/app/match.event', eventData);
```

---

## 🎯 Fonctionnalités implémentées

### Frontend
- ✅ Page d'accueil avec matchs live + tournois
- ✅ Filtre par sport (Football, Basketball, etc.)
- ✅ Page match live avec mise à jour WebSocket temps réel
- ✅ Dashboard Promoteur (créer/gérer tournois)
- ✅ Interface Admin Terrain mobile-first
  - Boutons gros format pour terrain
  - Mode hors-ligne avec synchronisation
  - Confirmation avant enregistrement
  - Auto-incrément du chrono
- ✅ Connexion / Inscription JWT
- ✅ Routes protégées par rôle
- ✅ Toast notifications
- ✅ Design responsive dark theme

### Backend
- ✅ JWT Authentication (Spring Security)
- ✅ 8 rôles différenciés
- ✅ Modèle complet (User, Tournament, Match, Team, Player, MatchEvent, SportTemplate)
- ✅ WebSocket STOMP pour le temps réel
- ✅ Repositories JPA avec requêtes custom
- ✅ CORS configuré
- ✅ DataInitializer (5 sports + admin)
- ✅ Validation des entrées

---

## 🔧 Variables d'environnement

### Backend (`application.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/sport_platform
spring.datasource.username=sport_user
spring.datasource.password=sport_pass
jwt.secret=VotreClefSecrete
jwt.expiration=86400000
```

---

## 📱 Sports couverts (MVP)

| Sport | Événements | Config |
|-------|-----------|--------|
| ⚽ Football | But, Carton, Corner, Faute, Remplacement, Penalty | 11v11, 7v7, 5v5 |
| 🏀 Basketball | Panier 2/3pts, Lancer franc, Faute, Temps mort | 5v5, 3v3 |
| 🤾 Handball | But, Arrêt, Exclusion, 7m | 7v7 |
| 🏐 Volleyball | Point, Ace, Bloc, Set gagné | 6v6 |
| 🎾 Tennis | Point, Ace, Double faute, Jeu/Set | 1v1, 2v2 |
