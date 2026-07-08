# Servio Kitchen Line

Standalone tablet-optimized recipe app for Servio. Runs as its own Render service but shares Servio's PostgreSQL database.

## Architecture

```
┌─────────────────────────────────┐
│   servio-kitchen-line (Render)   │
│   Express + static HTML          │
│   Port 5001                      │
└──────────┬──────────────────────┘
           │
           │ READ / WRITE
           ▼
┌─────────────────────────────────┐
│   Servio PostgreSQL (Render)      │
│   recipes                         │
│   recipe_ingredients              │
│   recipe_steps                    │
│   recipe_categories               │
└─────────────────────────────────┘
           ▲
           │ SHARED DB
┌──────────┴──────────────────────┘
│   servio-worker (Render)          │
│   Main Servio backend             │
└─────────────────────────────────┘
```

## Features

- **Recipe Library** — grid/list view, category filters, search
- **Recipe Detail** — ingredients (checkable), prep steps, cooking steps with built-in timers
- **Batch Scaling** — scale all ingredient quantities by 0.5×–20×
- **Timer System** — multiple simultaneous timers, audio alerts, quick-add
- **Bilingual** — English/Spanish toggle
- **Dark/Light theme**
- **Admin mode** — full CRUD recipe editor
- **Offline fallback** — 3 demo recipes work without auth/DB

## Auth

The app accepts auth via:
1. URL param: `?token=<jwt>` (from Servio dashboard link)
2. localStorage: `servio_token` (persisted login)
3. API key: `servio_api_key` in localStorage, sent as `X-API-Key`

Without auth, the app shows demo recipes (read-only).

## Local Dev

```bash
npm install
npm start
# Open http://localhost:5001
```

Set `DATABASE_URL` to connect to real Servio data.

## Deploy

1. Push to GitHub
2. Create new Web Service on Render from this repo
3. Set `DATABASE_URL` to Servio's Postgres internal connection string
4. Auto-deploys on push

## Linking from Servio

Add a button in the Servio dashboard:
```
https://servio-kitchen-line.onrender.com/?token=<jwt>
```
