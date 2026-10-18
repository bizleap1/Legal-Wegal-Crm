import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.resolve(process.cwd(), '../../.env')
});
dotenv.config();
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  SESSION_SECRET: process.env.SESSION_SECRET || 'legal-wegal-super-secret-jwt-key-2026-production',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '01234567890123456789012345678901',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  META_APP_SECRET: process.env.META_APP_SECRET || 'meta_app_test_secret',
  META_WEBHOOK_VERIFY_TOKEN: process.env.META_WEBHOOK_VERIFY_TOKEN || 'legal_wegal_meta_verify_2026',
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '109876543210',
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || 'EAAC...',
  EMAIL_PROVIDER_API_KEY: process.env.EMAIL_PROVIDER_API_KEY || 're_test_key',
  CORS_ORIGIN: process.env.WEB_URL || 'http://localhost:3000'
};