import request from 'supertest';
import app from '../../src/index';

jest.mock('../../src/services/taskService');
import taskService from '../../src/services/taskService';
const mocked = taskService as jest.Mocked<typeof taskService>;

describe('tasksController', () => {
  beforeEach(() => jest.resetAllMocks());

  test('GET /tasks returns list', async () => {
    mocked.listRecent = jest.fn().mockResolvedValue([{ id: 1, title: 't', description: null, completed: false, created_at: 'now' } as any]);
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('POST /tasks creates task', async () => {
    const created = { id: 2, title: 'x', description: 'd', completed: false, created_at: 'now' } as any;
    mocked.create = jest.fn().mockResolvedValue(created);
    const res = await request(app).post('/tasks').send({ title: 'x', description: 'd' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(2);
  });

  test('POST /tasks without title returns 400', async () => {
    const res = await request(app).post('/tasks').send({ description: 'd' });
    expect(res.status).toBe(400);
  });

  test('POST /tasks/:id/done returns 200 when ok', async () => {
    mocked.markDone = jest.fn().mockResolvedValue(true);
    const res = await request(app).post('/tasks/1/done');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /tasks/:id/done returns 404 when not found', async () => {
    mocked.markDone = jest.fn().mockResolvedValue(false);
    const res = await request(app).post('/tasks/999/done');
    expect(res.status).toBe(404);
  });
});
