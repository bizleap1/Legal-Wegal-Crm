import { Router } from 'express';
import { listTasks, createTask, updateTask } from './tasks.controller.js';
import { authenticate } from '../../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/', listTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
export default router;