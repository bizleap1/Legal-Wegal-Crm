'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scale, CheckCircle2, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import { api } from '../../../lib/api-client';

export default function PublicFormSimulationPage() {
  const [form, setForm] = useState({
    name: 'Rohan Varma',
    email: 'rohan.varma@novatech.co.in',
    phone: '+919876543210',
    company: 'NovaTech Solutions LLP',
    requirement: 'Need legal advisory on trademark class 42 registration & software licensing contract drafting.',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'trademark_search_2026',
    gclid: 'Cj0KCQiA_test_click_id_9921',
    landing_page: 'https://legalwegal.com/consultation',
    consent: true,
    honeypot: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitPublicForm('consultation', form);
      setResponseMsg(res.message);
      setSubmitted(true);
    } catch (err) {
      alert(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '36px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Top Navigation Back to CRM */}
      <div
        style={{
          maxWidth: '640px',
          width: '100%',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Link
          href="/leads"
          className="btn-pill-outline"
          style={{ padding: '6px 14px', fontSize: '12.5px' }}
        >
          <ArrowLeft size={14} />
          <span>Return to CRM Workspace</span>
        </Link>
        <span style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
          Public Consultation Intake
        </span>
      </div>

      <div style={{ maxWidth: '640px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#09090b',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: '14px'
            }}
          >
            <Scale size={24} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.02em' }}>
            Legal Wegal Advisory Services
          </h1>
          <p style={{ color: '#64748b', fontSize: '13.5px', marginTop: '4px' }}>
            Schedule an Executive Consultation with our Senior Advocates
          </p>
        </div>

        {submitted ? (
          <div
            className="card-clean"
            style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#ffffff'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#d1fae5',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: '#059669'
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#09090b', marginBottom: '8px' }}>
              Inquiry Received Successfully!
            </h2>
            <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.5, marginBottom: '24px' }}>
              {responseMsg ||
                'Your consultation request has been captured in our CRM. A senior partner will contact you shortly.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary"
                style={{ padding: '8px 16px' }}
              >
                Submit Another Inquiry
              </button>
              <Link href="/leads" className="btn-pill-dark" style={{ padding: '8px 18px' }}>
                <span>View in CRM Leads</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="card-clean"
            style={{
              padding: '36px',
              backgroundColor: '#ffffff'
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Honeypot anti-spam */}
              <input
                type="text"
                name="website_url_hp"
                value={form.honeypot}
                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Work Email *</label>
                  <input
                    type="email"
                    required
                    className="input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label">Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    className="input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Company / Organization</label>
                  <input
                    type="text"
                    className="input"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Consultation Requirement *</label>
                <textarea
                  required
                  rows={3}
                  className="textarea"
                  value={form.requirement}
                  onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                />
              </div>

              {/* Attribution Meta Fields Simulation */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 14px'
                }}
              >
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Automatic Marketing Attribution Captured
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
                  <div style={{ fontSize: '11.5px', color: '#475569' }}>
                    <strong>Source:</strong> {form.utm_source}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#475569' }}>
                    <strong>Medium:</strong> {form.utm_medium}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#475569' }}>
                    <strong>Campaign:</strong> {form.utm_campaign}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  required
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  style={{ accentColor: '#09090b', width: '15px', height: '15px' }}
                />
                <label htmlFor="consentCheckbox" style={{ fontSize: '12px', color: '#64748b' }}>
                  I consent to Legal Wegal contacting me via Phone/WhatsApp regarding legal advisory services.
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-pill-dark"
                style={{
                  padding: '12px',
                  marginTop: '4px',
                  width: '100%',
                  borderRadius: '8px'
                }}
              >
                <span>{submitting ? 'Submitting Inquiry...' : 'Submit Consultation Request'}</span>
                <Send size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}