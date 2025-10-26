import taskService, { TaskService } from '../services/taskService';
import * as taskModel from '../models/taskModel';

jest.mock('../models/taskModel');

const mockedModel = taskModel as jest.Mocked<typeof taskModel>;

describe('TaskService', () => {
  beforeEach(() => jest.resetAllMocks());

  test('listRecent returns tasks from model', async () => {
    const fake = [{ id: 1, title: 't', description: null, completed: false, created_at: 'now' }];
    mockedModel.listRecentIncomplete.mockResolvedValueOnce(fake as any);
    const res = await taskService.listRecent(5);
    expect(res).toEqual(fake);
    expect(mockedModel.listRecentIncomplete).toHaveBeenCalledWith(5);
  });

  test('create returns created task', async () => {
    mockedModel.createTask.mockResolvedValueOnce(10 as any);
    const task = { id: 10, title: 't', description: 'd', completed: false, created_at: 'now' };
    mockedModel.findById.mockResolvedValueOnce(task as any);
    const res = await taskService.create('t', 'd');
    expect(res).toEqual(task);
    expect(mockedModel.createTask).toHaveBeenCalledWith('t', 'd');
    expect(mockedModel.findById).toHaveBeenCalledWith(10);
  });

  test('create throws when findById returns null', async () => {
    mockedModel.createTask.mockResolvedValueOnce(11 as any);
    mockedModel.findById.mockResolvedValueOnce(null as any);
    await expect(taskService.create('x')).rejects.toThrow('TaskCreationError');
  });

  test('markDone returns true when affectedRows > 0', async () => {
    mockedModel.markDone.mockResolvedValueOnce(1 as any);
    const ok = await taskService.markDone(5);
    expect(ok).toBe(true);
  });

  test('markDone returns false when affectedRows === 0', async () => {
    mockedModel.markDone.mockResolvedValueOnce(0 as any);
    const ok = await taskService.markDone(5);
    expect(ok).toBe(false);
  });
});
