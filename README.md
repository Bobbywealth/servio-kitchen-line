# Servio Kitchen Line

Tablet-optimized recipe execution UI for the Servio Restaurant Platform. Launched from the Servio dashboard's **Recipes** section, it receives the session JWT via `?token=` and reads/writes recipes from the main Servio backend.

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Servio Dashboard (https://servio-app.onrender.com)          │
│  Recipes page → "Open Kitchen Line" button                  │
│  Launches: https://servio-kitchen-line.onrender.com/?token=<JWT>
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTPS + Authorization: Bearer <JWT>
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  servio-kitchen-line (Render) — static file server only     │
│  This repo: static HTML/JS/CSS, no DB connection             │
└────────────────────────┬─────────────────────────────────────┘
                         │ Proxies / forwards all API calls
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  servio-backend-zexb.onrender.com — main Servio backend      │
│  /api/kitchen-assistant/recipes  ← source of truth           │
│  /api/kitchen-assistant/recipe-categories                     │
└──────────────────────────────────────────────────────────────┘
```

## What Changed (Jul 2026)

Kitchen Line no longer has its own database or Express CRUD routes. It is now a **pure static frontend** that:
- Reads `?token=` on page load → saves to `localStorage.servio_access_token`
- Sends `Authorization: Bearer <token>` on every API call to the main Servio backend
- All recipe data (recipes, categories, steps) comes from `/api/kitchen-assistant/*` routes

## Features

- **Recipe Library** — grid/list view, category filters, search
- **Recipe Detail** — ingredients (checkable), prep steps, cooking steps with built-in timers
- **Batch Scaling** — scale all ingredient quantities by 0.5×–20×
- **Timer System** — multiple simultaneous timers, audio alerts, quick-add
- **Bilingual** — English/Spanish toggle
- **Dark/Light theme**
- **Offline fallback** — 3 demo recipes work without auth/DB

## Auth

Launched from the Servio dashboard with `?token=<jwt>`. The dashboard passes the current session JWT so Kitchen Line inherits the restaurant's scope automatically.

- Token key: `servio_access_token` (standardized across all Servio properties)
- Fallback: `servio_token` (legacy, for backwards compat during transition)
- API key: `servio_api_key` in localStorage → sent as `X-API-Key`

## Local Dev

```bash
npm install
npm start
# Open http://localhost:5001
# Note: without a real token, you'll see demo recipes only.
# To test against staging: open http://localhost:5001/?token=<your-jwt>
```

## Deploy

Pushed to GitHub → auto-deploys on Render. No database or environment variables required.

## Linking from Servio

```js
const token = localStorage.getItem('servio_access_token')
const url = `https://servio-kitchen-line.onrender.com/?token=${encodeURIComponent(token)}`
window.open(url, '_blank', 'noopener,noreferrer')
```
