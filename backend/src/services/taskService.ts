import * as taskModel from '../models/taskModel';
import { Task } from '../models/taskModel';

/**
 * Service layer for task operations.
 * Keeps controllers thin and provides a seam for testing/business logic.
 */
export class TaskService {
  async listRecent(limit = 5): Promise<Task[]> {
    return taskModel.listRecentIncomplete(limit);
  }

  async create(title: string, description?: string | null): Promise<Task> {
    const insertId = await taskModel.createTask(title, description);
    const task = await taskModel.findById(insertId);
    if (!task) {
      // Domain-level failure — caller can map to HTTP 500
      throw new Error('TaskCreationError');
    }
    return task;
  }

  async markDone(id: number): Promise<boolean> {
    const affected = await taskModel.markDone(id);
    return affected > 0;
  }
}

export default new TaskService();
