import { Router } from 'express';
import { listUsers, createUser, updateUser } from './users.controller.js';
import { authenticate } from '../../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/', listUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
export default router;