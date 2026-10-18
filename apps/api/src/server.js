import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';
const app = createApp();
const server = app.listen(ENV.PORT, () => {
  logger.info(`🚀 Legal Wegal CRM API Server running on port ${ENV.PORT} (${ENV.NODE_ENV})`);
  logger.info(`🔗 Base URL: http://localhost:${ENV.PORT}/api/v1`);
  logger.info(`🩺 Health check: http://localhost:${ENV.PORT}/api/v1/health/live`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});
process.on('SIGINT', () => {
  logger.info('SIGINT signal received. Closing HTTP server...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});