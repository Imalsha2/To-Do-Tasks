# Coveragex — Run & Dev Instructions

This repository contains a small full-stack example: a Node/Express TypeScript backend and a React frontend. The project is configured to run either with Docker (recommended for production-like setups) or locally without Docker (convenient on Windows).

---

## Requirements

- Node.js (18+ recommended) and npm
- Optional: Docker & Docker Compose (for full containerized run)

Notes for Windows users: Docker Desktop may require additional configuration. The backend includes a SQLite and in-memory fallback so you can run without Docker if needed.

---

## Quick start — with Docker (recommended)

From the repository root:

PowerShell:

```powershell
# Build and start all services (Postgres, backend, frontend)
docker compose up --build
# or, if using older docker-compose CLI
# docker-compose up --build
```

- Frontend will be available at http://localhost:3000 (the compose maps port 3000 to the container).
- Backend API will be available at http://localhost:5000.

Stop the stack with `docker compose down`.

---

## Run locally without Docker (development)

The backend includes an automatic fallback to SQLite or an in-memory adapter when Postgres is not available. This lets you run everything locally on Windows without Docker.

1) Backend

```powershell
cd backend
npm install
# Development (hot-reload)
npm run dev
# Production-style (build then run):
# npm run build
# npm start
```

Environment variables (optional):
- `PORT` — backend port (default 5000)
- `DB_CLIENT` — `pg` or `sqlite` or `auto` (default `auto`)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` — Postgres connection settings
- `SQLITE_FILE` — path to SQLite file (default: `./data/coveragex.sqlite`)

Behavior notes:
- If `DB_CLIENT=pg` or a non-local `DB_HOST` is provided, the backend will try to use Postgres.
- If `DB_CLIENT=sqlite` (or `auto` detects local dev), the app uses `better-sqlite3` if available. If that native dependency is not present, an in-memory JS adapter is used — this keeps development and tests working but data will not persist between runs.

2) Frontend

```powershell
cd frontend
npm install
npm start
```

Open http://localhost:3000. The frontend expects the backend at `http://localhost:5000` by default. You can override this with an environment variable before starting:

PowerShell example:

```powershell
$env:REACT_APP_API = 'http://localhost:5000'; npm start
```

---

## Run both locally (concurrently)

You can open two terminals and run the backend and frontend commands above in parallel. The frontend will call the API at `http://localhost:5000` by default.

---

## Tests

Backend tests (Jest):

```powershell
cd backend
npm install
npm test
```

There are a small number of unit/smoke tests. The tests are configured to run without requiring Docker or a Postgres server because of the SQLite / in-memory fallback.

---

## Build for production

- Backend: `cd backend && npm run build && npm start` (or run inside Docker)
- Frontend: `cd frontend && npm run build` (then serve `frontend/build` with any static server)

When using the Docker Compose setup, each service is built from its Dockerfile and served by the appropriate container.

---

## Troubleshooting

- If the backend cannot connect to Postgres and you want to force SQLite, set `DB_CLIENT=sqlite` in your environment before starting.
- If you see errors related to `better-sqlite3` on Windows (native build issues), the backend will automatically fall back to an in-memory adapter. To persist data, either install `better-sqlite3` with a matching toolchain or run the Postgres Docker service.
- If the frontend cannot reach the backend, ensure the backend is running on `:5000` and that `REACT_APP_API` is set correctly.

---

## Project layout

- `backend/` — TypeScript Express backend (API, DB access)
- `frontend/` — React app (CRA)
- `db/init/` — SQL used by the Docker Postgres init scripts
- `docker-compose.yml` — compose file to run DB + backend + frontend together

---

If you'd like, I can also add a small npm script at the repository root to start both servers concurrently (e.g., using `concurrently`) or implement a Makefile. Tell me which option you prefer and I can add it.
