import { Request, Response } from 'express';
import taskService from '../services/taskService';

export async function list(req: Request, res: Response) {
  try {
    const rows = await taskService.listRecent(5);
    res.json(rows);
  } catch (err) {
    console.error('Failed to list tasks', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function create(req: Request, res: Response) {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  try {
    const task = await taskService.create(title, description);
    res.status(201).json(task);
  } catch (err) {
    console.error('Failed to create task', err);
    // If known domain error we could map more specifically; default to 500
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function markDone(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const ok = await taskService.markDone(id);
    if (!ok) return res.status(404).json({ error: 'task not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to mark task done', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
