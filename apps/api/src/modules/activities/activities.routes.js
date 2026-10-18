import { Router } from 'express';
import { addActivity, getLeadActivities } from './activities.controller.js';
import { authenticate } from '../../middleware/auth.js';
const router = Router({
  mergeParams: true
});
router.use(authenticate);
router.post('/', addActivity);
router.get('/', getLeadActivities);
export default router;