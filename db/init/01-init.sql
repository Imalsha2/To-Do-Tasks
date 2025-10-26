-- Postgres init script: create table if missing in the pre-created 'coveragex' database
CREATE TABLE IF NOT EXISTS task (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index to help query recent incomplete tasks
CREATE INDEX IF NOT EXISTS idx_task_created_at ON task (created_at);
