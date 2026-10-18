import { Router } from 'express';
import { verifyMetaChallenge, handleMetaWebhook, handleWhatsAppWebhook, handleEmailWebhook, handleGoogleAdsWebhook } from './webhooks.controller.js';
const router = Router();
router.get('/meta', verifyMetaChallenge);
router.post('/meta', handleMetaWebhook);
router.post('/whatsapp', handleWhatsAppWebhook);
router.post('/email/events', handleEmailWebhook);
router.post('/google-ads', handleGoogleAdsWebhook);
export default router;