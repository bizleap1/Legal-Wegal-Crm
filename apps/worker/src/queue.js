import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.resolve(process.cwd(), '../../.env')
});
dotenv.config();
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export let redisConnection = null;
export let isRedisAvailable = false;
try {
  redisConnection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: times => {
      if (times > 3) {
        // Stop spamming if local redis is not running
        return null;
      }
      return 2000;
    }
  });
  redisConnection.on('connect', () => {
    isRedisAvailable = true;
    console.log('[WORKER] Connected to Redis queue engine at', REDIS_URL);
  });
  redisConnection.on('error', _err => {
    isRedisAvailable = false;
    // Silent fallback
  });
} catch (e) {
  isRedisAvailable = false;
}
export const FOLLOWUP_QUEUE_NAME = 'crm-followup-queue';
export const OUTBOX_QUEUE_NAME = 'crm-outbox-queue';
export function getFollowupQueue() {
  if (redisConnection && isRedisAvailable) {
    return new Queue(FOLLOWUP_QUEUE_NAME, {
      connection: redisConnection
    });
  }
  return null;
}