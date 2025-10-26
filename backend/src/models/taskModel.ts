import pool from '../db';

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  created_at?: string;
}

function normalizeRow(r: any): Task {
  return {
    id: Number(r.id),
    title: r.title,
    description: r.description ?? null,
    completed: r.completed === true || r.completed === 1 || r.completed === '1' ? true : Boolean(r.completed),
    created_at: r.created_at,
  };
}

export async function listRecentIncomplete(limit = 5): Promise<Task[]> {
  const res = await pool.query(
    'SELECT id, title, description, completed, created_at FROM task WHERE completed = FALSE ORDER BY created_at DESC LIMIT $1',
    [limit]
  );
  return (res.rows || []).map((r: any) => normalizeRow(r));
}

export async function createTask(title: string, description?: string | null): Promise<number> {
  const res = await pool.query('INSERT INTO task (title, description) VALUES ($1, $2) RETURNING id', [title, description || null]);
  return Number(res.rows[0].id);
}

export async function findById(id: number): Promise<Task | null> {
  const res = await pool.query('SELECT id, title, description, completed, created_at FROM task WHERE id = $1', [id]);
  return res.rows[0] ? normalizeRow(res.rows[0]) : null;
}

export async function markDone(id: number): Promise<number> {
  const res = await pool.query('UPDATE task SET completed = TRUE WHERE id = $1', [id]);
  return res.rowCount ?? 0;
}
