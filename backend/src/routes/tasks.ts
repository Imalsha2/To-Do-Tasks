import { Router } from 'express';
import * as tasksController from '../controllers/tasksController';

const router = Router();

router.get('/', tasksController.list);
router.post('/', tasksController.create);
router.post('/:id/done', tasksController.markDone);

export default router;
