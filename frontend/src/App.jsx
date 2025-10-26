import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API = process.env.REACT_APP_API || 'http://localhost:5000';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to load tasks', err);
      // Try IPv4 fallback if localhost might resolve weirdly
      const msg = err?.response?.data?.error || err.message || 'Failed to load tasks';
      setError(`Failed to load tasks: ${msg}`);
      if (!err?.response) {
        try {
          const fallback = API.replace('localhost', '127.0.0.1');
          const res2 = await axios.get(`${fallback}/tasks`);
          setTasks(res2.data);
          setError('');
          return;
        } catch (e2) {
          console.error('Fallback load also failed', e2);
        }
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post(`${API}/tasks`, { title: title.trim(), description: description.trim() });
      const newTask = res.data;
      
      setTasks(prev => [newTask, ...prev].slice(0, 5));
      setTitle(''); setDescription('');
    } catch (err) { console.error(err); setError('Failed to add task — backend may be unavailable.'); alert('Failed to add task — backend may be unavailable.'); }
    finally { setLoading(false); }
  };



  const done = async (id) => {
    try {
      await axios.post(`${API}/tasks/${id}/done`);
      await load();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="app-shell">
      <div className="left">
        <div className="header">
          <div>
            <h3>Create a Task</h3>
            <p>Add a short title and optional description</p>
          </div>
          <div>
            <div className="brand">Coveragex</div>
          </div>
        </div>

        <div className="form-field">
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-field">
          <textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <button className="btn" onClick={add} disabled={loading || !title.trim()}>Add Task</button>
          <button className="btn secondary" onClick={() => { setTitle(''); setDescription(''); }} disabled={loading}>Clear</button>
        </div>
      </div>

      <div className="right">
        <div className="tasks-title">
          <h3>Recent Tasks</h3>
          <div className="tasks-count">{loading ? 'Loading...' : `${tasks.length} shown`}</div>
        </div>

        <div className="tasks-grid">
          {tasks.length === 0 && !loading && (
            <div className="empty">No tasks yet — add your first task on the left.</div>
          )}

          {tasks.map(t => (
            <div key={t.id} className={`task-card ${t.completed ? 'completed' : ''}`}>
              <div className="task-meta">
                <div className="task-title"><span className="title-text">{t.title}</span>
                  <span className={`task-badge ${t.completed ? 'done' : 'new'}`}>{t.completed ? 'Done' : 'New'}</span>
                </div>
                <div className="task-desc">{t.description || <span style={{color:'#cbd5e1'}}>No description</span>}</div>
                <div className="task-time">{t.created_at ? new Date(t.created_at).toLocaleString() : ''}</div>
              </div>
              <div className="task-actions">
                <button className="btn small" onClick={() => done(t.id)} disabled={t.completed} title={t.completed ? 'Already done' : 'Mark done'}>
                  {t.completed ? '✓ Done' : 'Mark done'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
