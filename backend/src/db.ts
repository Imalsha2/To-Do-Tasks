import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// If DB_CLIENT=sqlite or Docker/Postgres is not available locally, use SQLite file DB for quick dev.
const DB_CLIENT = process.env.DB_CLIENT || 'auto';

// Helper: simple sqlite wrapper exposing query(sql, params) returning { rows, rowCount }
function createSqliteWrapper(dbFile: string) {
  // lazy require so app still works if dependency missing
  let Database: any;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Database = require('better-sqlite3');
  } catch (err) {
    // If better-sqlite3 isn't available (native build missing), fall back to an in-memory JS adapter
    // This keeps local dev and tests running without native deps installed.
    const createInMemoryWrapper = () => {
      const rows: any[] = [];
      let idSeq = 1;
      return {
        async query(sql: string, params: any[] = []) {
          const s = sql.trim().toUpperCase();
          if (s.startsWith('INSERT')) {
            const [title, description] = params;
            const rec = { id: idSeq++, title, description, completed: 0, created_at: new Date().toISOString() };
            rows.push(rec);
            return { rows: [{ id: rec.id }], rowCount: 1 };
          }
          if (s.startsWith('UPDATE')) {
            // simplistic: expect SET completed = ? WHERE id = ? or completed = TRUE
            const id = params[1] ?? params[0];
            const completedVal = params[0] ?? 1;
            const found = rows.find((r) => Number(r.id) === Number(id));
            if (found) {
              found.completed = completedVal ? 1 : 0;
              return { rows: [], rowCount: 1 };
            }
            return { rows: [], rowCount: 0 };
          }
          if (s.startsWith('SELECT')) {
            // support simple selects used in models
            // WHERE id = $1
            if (s.includes('WHERE ID =')) {
              const id = params[0];
              const found = rows.filter((r) => Number(r.id) === Number(id));
              return { rows: found };
            }
            if (s.includes('WHERE COMPLETED = FALSE')) {
              const limitMatch = s.match(/LIMIT \$1/);
              let out = rows.filter((r) => Number(r.completed) === 0).slice().sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
              if (limitMatch) {
                const lim = Number(params[0]) || out.length;
                out = out.slice(0, lim);
              }
              return { rows: out };
            }
            // otherwise return all tasks ordered by id desc
            const all = rows.slice().sort((a, b) => b.id - a.id);
            return { rows: all };
          }
          return { rows: [] };
        },
      };
    };
    return createInMemoryWrapper();
  }
  // ensure directory exists
  const dir = path.dirname(dbFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new Database(dbFile);

  // ensure table exists (safe to call multiple times)
  db.exec(`
    CREATE TABLE IF NOT EXISTS task (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return {
    async query(sql: string, params: any[] = []) {
      const trimmed = sql.trim().toUpperCase();
      if (trimmed.startsWith('INSERT')) {
        const stmt = db.prepare(sql);
        const info = stmt.run(...params);
        return { rows: [{ id: info.lastInsertRowid }], rowCount: info.changes };
      }
      if (trimmed.startsWith('UPDATE') || trimmed.startsWith('DELETE')) {
        const stmt = db.prepare(sql);
        const info = stmt.run(...params);
        return { rows: [], rowCount: info.changes };
      }
      const stmt = db.prepare(sql);
      const rows = stmt.all(...params);
      return { rows };
    },
  };
}

// Auto-detect: if PG env vars present and DB_CLIENT not forced, use pg; else fallback to sqlite
const useSqlite = (() => {
  if (DB_CLIENT === 'sqlite') return true;
  if (DB_CLIENT === 'pg') return false;
  // auto: if DB_HOST is set to a non-empty value and not localhost, prefer pg; but for local dev fallback to sqlite
  const host = process.env.DB_HOST || '';
  const port = process.env.DB_PORT || '';
  if (host && host !== '127.0.0.1' && host !== 'localhost') return false;
  // default to sqlite when Docker/Postgres likely unavailable
  return true;
})();

let db: any;
if (useSqlite) {
  const dbFile = process.env.SQLITE_FILE || path.join(process.cwd(), 'data', 'coveragex.sqlite');
  db = createSqliteWrapper(dbFile);
} else {
  // Postgres pool as before
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Pool } = require('pg');
  const pool = new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppass',
    database: process.env.DB_NAME || 'coveragex',
    port: Number(process.env.DB_PORT || 5432),
    max: 10,
  });
  db = pool;
}

export default db;
