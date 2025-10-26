-- Seed data for Postgres (database is created via POSTGRES_DB)
INSERT INTO task (title, description, completed)
VALUES
  ('Buy books', 'Buy books for the next school year', FALSE),
  ('Clean home', 'Need to clean the bedroom', FALSE),
  ('Take home assignment', 'Finish the take home assignment', FALSE);
