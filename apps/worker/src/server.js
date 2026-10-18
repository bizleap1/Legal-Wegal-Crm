import { startReconcilerSchedule } from './schedulers/reconciler.js';
import { redisConnection, isRedisAvailable } from './queue.js';
console.log('==================================================');
console.log('🤖 Legal Wegal Lead Management CRM Worker Starting');
console.log('==================================================');

// Start the periodic database reconciler
const intervalId = startReconcilerSchedule(15000); // Check every 15s

console.log('✅ Worker engine is active and monitoring follow-up tasks.');

// Graceful shutdown
function shutdown() {
  console.log('[WORKER] Shutting down gracefully...');
  clearInterval(intervalId);
  if (redisConnection && isRedisAvailable) {
    redisConnection.quit();
  }
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);