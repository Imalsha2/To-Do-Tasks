# To-Do-Tasks

A small fullstack example app (React frontend + TypeScript/Express backend) for managing simple tasks. This repository contains a Docker setup and clear instructions for running the project locally for development or production-like testing.

## What this repo contains
- `frontend/` — React single-page app (Create React App). Port 3000 in development.
- `backend/` — TypeScript + Express API. Port 4000 in development.
- `db/` — SQL files for database initialization / seed (used by Docker Postgres service).

## Quick start (Docker Compose)
The easiest way to run the whole stack is with Docker Compose.

1. Make sure Docker Desktop is running.
2. From the repo root:

```powershell
cd "E:\MY PROJECTS\Coveragex"
docker-compose up --build
```

This brings up:
- Postgres database
- Backend API (connects to Postgres)
- Frontend (serves production build)

Open the frontend in your browser at http://localhost:3000 (or check the compose output for the bound ports).

To stop and remove containers:

```powershell
docker-compose down
```

## Local development (without Docker)
If you prefer to run frontend and backend locally (recommended for iterative development):

Prerequisites
- Node.js (18 or newer recommended)
- npm (comes with Node)

Run the backend

```powershell
cd backend
npm install
# start in dev mode (ts-node-dev)
npm run dev
```

The backend listens on port 4000 by default (see `backend/src/index.ts`). The backend includes a fallback DB layer so you can run it without a Postgres server (it prefers Postgres but will use a local SQLite or in-memory adapter when Postgres is unavailable).

Run the frontend (development server)

```powershell
cd frontend
npm install
npm start
```

The frontend dev server runs on port 3000 by default and proxies API calls to the backend in development (see `frontend/package.json` proxy setting).

## Environment variables
You can configure the backend with environment variables. Add a `.env` file in `backend/` or set variables in your shell.

- `DATABASE_URL` — Postgres connection string, e.g. `postgres://user:pass@localhost:5432/tasks_db` (used in Docker Compose).
- `PORT` — Backend port (default 4000).

When running with Docker Compose the `DATABASE_URL` is provided by the compose file.

## Database
- SQL initialization and seed scripts are in `db/init/` and are used by the Docker Postgres container.
- If you run the backend locally without Postgres, the app will fall back to a local SQLite store or an in-memory adapter. This is convenient for development and testing.

## Tests
Backend unit tests use Jest. From the repo root run:

```powershell
cd backend
npm test
```

There may be additional frontend test or e2e scripts in `frontend/` depending on the branches you work on.

## Troubleshooting
- If the frontend dev server fails with a ModuleScopePlugin error, try stopping any running dev servers, delete `node_modules` and reinstall:

```powershell
cd frontend
rm -r node_modules; npm install
```

- If ports 3000 or 4000 are in use, either stop the process using them or set different ports in the environment.
- If Docker Compose fails to start the DB, check that Docker Desktop has enough resources and that no existing Postgres service is using the same data directory.

## Contributing
- Make edits on feature branches and open a PR to `main`.
- Keep changes small and focused; include tests for backend logic when appropriate.

## Where to look next
- Frontend entry: `frontend/src/App.jsx` and styling in `frontend/src/App.css`.
- Backend entry: `backend/src/index.ts` and DB logic in `backend/src/db.ts`.

---
If you'd like, I can make the README bilingual or add screenshots and a short demo GIF — tell me how you'd like it styled and I'll update it.

