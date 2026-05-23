// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_URL });

// Inject token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
};

// ── Public ────────────────────────────────────────────────────
export const publicAPI = {
  getHomepage: () => api.get('/public/home'),
  getTeams: (params) => api.get('/public/teams', { params }),
  searchPlayers: (params) => api.get('/public/players/search', { params }),
};

// ── Matches ───────────────────────────────────────────────────
export const matchAPI = {
  getLive: () => api.get('/matches/live'),
  getById: (id) => api.get(`/matches/${id}`),
  getEvents: (id) => api.get(`/matches/${id}/events`),
  start: (id) => api.post(`/matches/${id}/start`),
  finish: (id) => api.post(`/matches/${id}/finish`),
  addEvent: (id, data) => api.post(`/matches/${id}/event`, data),
};

// ── Tournaments ───────────────────────────────────────────────
export const tournamentAPI = {
  getAll: (params) => api.get('/tournaments', { params }),
  getById: (id) => api.get(`/tournaments/${id}`),
  getMatches: (id) => api.get(`/tournaments/${id}/matches`),
  create: (data) => api.post('/tournaments', data),
  update: (id, data) => api.put(`/tournaments/${id}`, data),
};

// ── Sports ────────────────────────────────────────────────────
export const sportAPI = {
  getAll: () => api.get('/sports'),
  getById: (id) => api.get(`/sports/${id}`),
  create: (data) => api.post('/sports', data),
};

export default api;
