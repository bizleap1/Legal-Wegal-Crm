import { Router } from 'express';
import { getOverviewReport, getSourcesReport } from './reports.controller.js';
import { authenticate } from '../../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/overview', getOverviewReport);
router.get('/sources', getSourcesReport);
export default router;