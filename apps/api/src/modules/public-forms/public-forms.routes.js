import { Router } from 'express';
import { submitPublicForm } from './public-forms.controller.js';
import { publicFormLimiter } from '../../middleware/rate-limit.js';
const router = Router();
router.post('/:formKey/submit', publicFormLimiter, submitPublicForm);
export default router;