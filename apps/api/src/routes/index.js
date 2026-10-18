import { Router } from 'express';
import { prisma } from '@crm/database';
import authRoutes from '../modules/auth/auth.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import leadsRoutes from '../modules/leads/leads.routes.js';
import activitiesRoutes from '../modules/activities/activities.routes.js';
import tasksRoutes from '../modules/tasks/tasks.routes.js';
import automationRoutes from '../modules/automation/automation.routes.js';
import reportsRoutes from '../modules/reports/reports.routes.js';
import integrationsRoutes from '../modules/integrations/integrations.routes.js';
import webhooksRoutes from '../modules/webhooks/webhooks.routes.js';
import publicFormsRoutes from '../modules/public-forms/public-forms.routes.js';
const router = Router();

// Health checks per specification
router.get('/health/live', (_req, res) => {
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});
router.get('/health/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(503).json({
      status: 'unready',
      database: 'disconnected',
      error: err.message
    });
  }
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/leads', leadsRoutes);
router.use('/leads/:id/activities', activitiesRoutes);
router.use('/tasks', tasksRoutes);
router.use('/automation', automationRoutes);
router.use('/reports', reportsRoutes);
router.use('/integrations', integrationsRoutes);
router.use('/webhooks', webhooksRoutes);
router.use('/public/forms', publicFormsRoutes);
export default router;