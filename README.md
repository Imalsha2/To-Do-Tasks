# 📝✨ Task Manager App

A **small full-stack example app** (React frontend + TypeScript/Express backend) for managing simple tasks. This repository includes a **Docker setup** and clear instructions for running the project locally for development or production-like testing. 🚀💻

---

## 📂 Project Structure
- **`frontend/`** — 🌐 React single-page app (Create React App). Port **3000** in development.  
- **`backend/`** — ⚡ TypeScript + Express API. Port **4000** in development.  
- **`db/`** — 🐘 SQL files for database initialization / seed (used by Docker Postgres service).  

---

## ⚡ Quick Start (Docker Compose)
The easiest way to run the whole stack is with **Docker Compose**. 🐳

1. Make sure **Docker Desktop** is running.  
2. From the repo root:

```
cd "E:\MY PROJECTS\Coveragex"
docker-compose up --build

```
This brings up:

**🐘 Postgres database**

**🔧 Backend API (connects to Postgres)**

**🌐 Frontend (serves production build)**

Open the frontend in your browser at http://localhost:3000
.

To stop and remove containers:

```
docker-compose down

```
---

## 🛠️ Local Development (without Docker)

For iterative development, run frontend and backend locally. 🔄

**Prerequisites**

- *Node.js 🟢* (18 or newer recommended)

- *npm 📦* (comes with Node)

Run the backend

```
cd backend
npm install
# start in dev mode (ts-node-dev)
npm run dev

```
- Backend listens on port 4000 by default.

- Includes fallback DB layer: will use SQLite or in-memory adapter if Postgres unavailable.

**Run the frontend**

```
cd frontend
npm install
npm start

```
- Frontend dev server runs on port 3000 and proxies API calls to the backend. 🔗

---

## ⚙️ Environment Variables

Create a **`.env/`** file in **`backend/`** or set variables in your shell:

- **`DATABASE_URL/`** — Postgres connection string, e.g. **`postgres://user:pass@localhost:5432/tasks_db/`**🐘

- **`PORT/`** — Backend port (default 4000)

Docker Compose automatically provides **`DATABASE_URL/`** .

---

## 🗄️ Database 

- SQL initialization and seed scripts: **`db/init/`**

- Running backend locally without Postgres will fallback to SQLite or in-memory store 🧪

---

## 🧪 Tests

Backend unit tests use Jest:

```
cd backend
npm test

```
Frontend may have additional test or e2e scripts in **`frontend/`**.🖥️

---

## ⚠️ Troubleshooting

- ModuleScopePlugin error (frontend dev server):

```
cd frontend
rm -r node_modules
npm install

```
- Ports 3000 or 4000 in use: Stop the process using them or change ports in environment. 🔌

- Docker DB fails to start: Ensure Docker Desktop has enough resources, and no other Postgres is using the same data directory. 💾

---

## 🤝 Contributing

- Make edits on feature branches 🌿 and open a PR to **`main`**.

- Keep changes small and focused; include tests for backend logic when appropriate. ✅

---

## 🔎 Where to Look Next

- Frontend entry: **`frontend/src/App.jsx`** 🌐

- Styling: **`frontend/src/App.css`** 🎨

- Backend entry: **`backend/src/index.ts`** ⚡

- DB logic: **`backend/src/db.ts`** 🐘

---

✨ Happy coding and managing tasks efficiently! 💻🎉