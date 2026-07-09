// Servio Kitchen Line — Backend
// Pure static file server + CORS proxy for main Servio API.
// Recipe data now lives entirely in the main Servio backend.
// This server handles only static asset delivery and optional proxying.

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allow the main Servio frontend (and any dashboard) to launch kitchen-line
// as a separate browser tab/tablet app with JWT auth.
const CORS_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    // and any origin that matches our allowlist
    if (!origin) return callback(null, true);
    if (
      CORS_ORIGINS.includes(origin) ||
      CORS_ORIGINS.includes('*') ||
      origin.endsWith('.onrender.com') // all Render-hosted frontends
    ) {
      return callback(null, true);
    }
    // During development, allow localhost
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
};

app.use(cors(corsOptions));

// ─── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'servio-kitchen-line',
    role: 'static-server',
    note: 'Recipe data is served by the main Servio backend',
    time: new Date().toISOString()
  });
});

// ─── Static files (the Kitchen Line tablet UI) ───────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found — kitchen-line is a read-only tablet UI' });
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🍳 Servio Kitchen Line running on port ${PORT} (static server mode)`);
  console.log(`   Role: Tablet execution UI for main Servio backend`);
  console.log(`   CORS origins: ${CORS_ORIGINS.length > 0 ? CORS_ORIGINS.join(', ') : '(all onrender.com + localhost)'}`);
});

module.exports = app;
