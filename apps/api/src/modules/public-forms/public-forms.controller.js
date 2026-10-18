import { PublicFormSubmitSchema } from '@crm/shared';
import { ingestOrUpdateLead } from '../leads/leads.service.js';
import { logger } from '../../utils/logger.js';
export async function submitPublicForm(req, res) {
  try {
    const formKey = req.params.formKey;

    // Validate form submission payload with bot honeypot protection
    const parsed = PublicFormSubmitSchema.safeParse(req.body);
    if (!parsed.success) {
      logger.warn('Public form validation failure or spam honeypot tripped', parsed.error);
      // Return 200 with generic success to prevent bot reconnaissance per spec
      return res.status(200).json({
        status: 'success',
        message: 'Thank you for reaching out. A legal representative will contact you shortly.'
      });
    }
    const {
      name,
      email,
      phone,
      company,
      requirement,
      utm_source,
      utm_medium,
      utm_campaign,
      gclid,
      landing_page,
      consent
    } = parsed.data;

    // Split name into first and last
    const parts = name.trim().split(' ');
    const firstName = parts[0] || name;
    const lastName = parts.slice(1).join(' ') || '';

    // Asynchronously ingest lead
    ingestOrUpdateLead({
      firstName,
      lastName,
      email,
      phone,
      company: company || null,
      requirement: requirement || 'Website consultation inquiry',
      sourceType: 'website',
      sourceExternalId: `web_${formKey}_${Date.now()}`,
      utmSource: utm_source,
      utmMedium: utm_medium,
      utmCampaign: utm_campaign,
      gclid,
      consentStatus: consent ? 'consented' : 'declined',
      consentSource: `web_form_${formKey}:${landing_page || 'website'}`
    }).catch(err => {
      logger.error('Error in background website lead ingestion', err);
    });

    // Return generic success response immediately per spec
    return res.status(200).json({
      status: 'success',
      message: 'Thank you for reaching out. A legal representative will contact you shortly.'
    });
  } catch (err) {
    logger.error('Unexpected public form error', err);
    return res.status(200).json({
      status: 'success',
      message: 'Thank you for contacting Legal Wegal.'
    });
  }
}