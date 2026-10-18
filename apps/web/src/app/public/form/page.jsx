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
  const handleSubmit = async e => {
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
  return <div style={{
    minHeight: '100vh',
    backgroundColor: '#070b12',
    backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
    padding: '32px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }}>
      {/* Top Navigation Back to CRM */}
      <div style={{
      maxWidth: '640px',
      width: '100%',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
        <Link href="/leads" className="btn btn-ghost" style={{
        padding: '6px 12px',
        fontSize: '13px'
      }}>
          <ArrowLeft size={16} />
          <span>Return to CRM Workspace</span>
        </Link>
        <span style={{
        fontSize: '12px',
        color: '#64748b'
      }}>
          Simulating Website Consultation Intake (Section 8.2)
        </span>
      </div>

      <div style={{
      maxWidth: '640px',
      width: '100%'
    }}>
        {/* Header */}
        <div style={{
        textAlign: 'center',
        marginBottom: '28px'
      }}>
          <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
          marginBottom: '14px'
        }}>
            <Scale size={28} color="#ffffff" />
          </div>
          <h1 style={{
          fontSize: '24px',
          fontWeight: 800,
          color: '#ffffff'
        }}>Legal Wegal Advisory Services</h1>
          <p style={{
          color: '#94a3b8',
          fontSize: '14px',
          marginTop: '4px'
        }}>
            Schedule an Executive Consultation with our Senior Corporate Advocates
          </p>
        </div>

        {submitted ? <div className="glass-panel" style={{
        padding: '40px',
        textAlign: 'center',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
            <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
              <CheckCircle2 size={36} color="#34d399" />
            </div>
            <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '8px'
        }}>
              Inquiry Received Successfully!
            </h2>
            <p style={{
          color: '#cbd5e1',
          fontSize: '14px',
          lineHeight: 1.5,
          marginBottom: '24px'
        }}>
              {responseMsg}
            </p>
            <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px'
        }}>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary">
                Submit Another Consultation
              </button>
              <Link href="/leads" className="btn btn-emerald">
                <span>View in CRM Leads</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div> : <div className="glass-panel" style={{
        padding: '32px',
        border: '1px solid #1e293b'
      }}>
            <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
              <div>
                <label className="label">Full Name *</label>
                <input type="text" className="input" value={form.name} onChange={e => setForm({
              ...form,
              name: e.target.value
            })} required />
              </div>

              <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px'
          }}>
                <div>
                  <label className="label">Corporate Email *</label>
                  <input type="email" className="input" value={form.email} onChange={e => setForm({
                ...form,
                email: e.target.value
              })} required />
                </div>
                <div>
                  <label className="label">Mobile Number *</label>
                  <input type="text" className="input" value={form.phone} onChange={e => setForm({
                ...form,
                phone: e.target.value
              })} required />
                </div>
              </div>

              <div>
                <label className="label">Company / Organization</label>
                <input type="text" className="input" value={form.company} onChange={e => setForm({
              ...form,
              company: e.target.value
            })} />
              </div>

              <div>
                <label className="label">Legal Advisory Details</label>
                <textarea className="textarea" rows={3} value={form.requirement} onChange={e => setForm({
              ...form,
              requirement: e.target.value
            })} required />
              </div>

              {/* Bot Honeypot field (hidden from real users) */}
              <input type="text" name="honeypot" style={{
            display: 'none'
          }} tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={e => setForm({
            ...form,
            honeypot: e.target.value
          })} />

              {/* UTM & Attribution Preview */}
              <div style={{
            padding: '12px 14px',
            backgroundColor: '#0c121e',
            borderRadius: '8px',
            border: '1px solid #1e293b',
            fontSize: '12px',
            color: '#94a3b8'
          }}>
                <strong style={{
              color: '#cbd5e1'
            }}>Simulated Attribution Headers:</strong>
                <div style={{
              marginTop: '4px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
                  <span>utm_source: <code style={{
                  color: '#38bdf8'
                }}>{form.utm_source}</code></span>
                  <span>utm_medium: <code style={{
                  color: '#38bdf8'
                }}>{form.utm_medium}</code></span>
                  <span>gclid: <code style={{
                  color: '#38bdf8'
                }}>{form.gclid.slice(0, 15)}...</code></span>
                </div>
              </div>

              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
                <input type="checkbox" id="consentCheckbox" checked={form.consent} onChange={e => setForm({
              ...form,
              consent: e.target.checked
            })} required />
                <label htmlFor="consentCheckbox" style={{
              fontSize: '12.5px',
              color: '#94a3b8'
            }}>
                  I consent to Legal Wegal contacting me regarding this legal inquiry via Phone, Email, and WhatsApp.
                </label>
              </div>

              <button type="submit" className="btn btn-emerald" style={{
            padding: '12px',
            marginTop: '6px'
          }} disabled={submitting}>
                <Send size={16} />
                <span>{submitting ? 'Submitting Inquiry...' : 'Submit Legal Advisory Request'}</span>
              </button>
            </form>
          </div>}
      </div>
    </div>;
}