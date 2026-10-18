'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Check, X, Shield, Sparkles, Scale, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api-client';

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirement: 'Enterprise Lead Management & Inbound Automation Inquiry'
  });

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitPublicForm('consultation', {
        ...formData,
        utm_source: 'landing_page',
        utm_medium: 'discovery_modal',
        consent: true
      });
      setFormSubmitted(true);
    } catch (err) {
      alert(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#09090b', fontFamily: 'var(--font-body)' }}>
      {/* ── Top Navigation Bar (Matches Aiveeno layout) ── */}
      <header
        style={{
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '0 40px',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Left Nav Menus */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 500, color: '#334155', cursor: 'pointer' }}>
            <span>AI Transformation</span>
            <ChevronDown size={14} color="#64748b" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 500, color: '#334155', cursor: 'pointer' }}>
            <span>Cloud & Technology</span>
            <ChevronDown size={14} color="#64748b" />
          </div>
        </div>

        {/* Center Brand */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#09090b',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              aiveeno
            </span>
          </Link>
        </div>

        {/* Right Nav Links & Dark Pill CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flex: 1, justifyContent: 'flex-end' }}>
          <Link href="/dashboard" style={{ fontSize: '13.5px', fontWeight: 500, color: '#334155' }}>
            Platform
          </Link>
          <Link href="/login" style={{ fontSize: '13.5px', fontWeight: 500, color: '#334155' }}>
            Sign In
          </Link>
          <button
            onClick={() => {
              setFormSubmitted(false);
              setModalOpen(true);
            }}
            className="btn-pill-dark"
          >
            Book a Discovery Call
          </button>
        </div>
      </header>

      {/* ── Main Hero Section: The 3 Principles ── */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '52px 32px 80px' }}>
        
        {/* Grid of 3 Principle Cards (Exact match to screenshot) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '72px'
          }}
        >
          {/* ── CARD 01: Business First ── */}
          <div
            className="card-clean"
            style={{
              padding: '36px 32px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '480px',
              backgroundColor: '#ffffff'
            }}
          >
            <div>
              {/* Category Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  — 01 — PRINCIPLE
                </span>
              </div>

              {/* Title & Description */}
              <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#09090b', letterSpacing: '-0.02em', marginBottom: '10px' }}>
                Business First
              </h2>
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, margin: 0, minHeight: '42px' }}>
                Start with business priorities, workflows and operational reality.
              </p>

              {/* Radial System Diagram */}
              <div
                style={{
                  height: '240px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '16px',
                  position: 'relative'
                }}
              >
                <svg width="280" height="230" viewBox="0 0 280 230" fill="none" style={{ overflow: 'visible' }}>
                  {/* Subtle radiating connection lines */}
                  <line x1="140" y1="115" x2="140" y2="40" stroke="#d1d5db" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="140" y1="115" x2="60" y2="80" stroke="#d1d5db" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="140" y1="115" x2="60" y2="160" stroke="#d1d5db" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="140" y1="115" x2="220" y2="160" stroke="#d1d5db" strokeWidth="1" strokeDasharray="3 3" />
                  
                  {/* Highlighted golden line to Customer Experience */}
                  <line x1="140" y1="115" x2="218" y2="68" stroke="#d97706" strokeWidth="1.5" />

                  {/* Central Node */}
                  <circle cx="140" cy="115" r="32" fill="#ffffff" stroke="#111827" strokeWidth="1.2" />
                  <text x="140" y="112" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#111827" letterSpacing="0.06em">
                    BUSINESS
                  </text>
                  <text x="140" y="123" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#111827" letterSpacing="0.06em">
                    PRIORITY
                  </text>

                  {/* Operations Node */}
                  <circle cx="140" cy="38" r="4" fill="#6b7280" />
                  <circle cx="140" cy="38" r="8" fill="none" stroke="#d1d5db" strokeWidth="1" />
                  <text x="140" y="24" textAnchor="middle" fontSize="9.5" fill="#374151" fontWeight="500">
                    Operations
                  </text>

                  {/* Systems Node */}
                  <circle cx="60" cy="80" r="4" fill="#6b7280" />
                  <circle cx="60" cy="80" r="8" fill="none" stroke="#d1d5db" strokeWidth="1" />
                  <text x="60" y="66" textAnchor="middle" fontSize="9.5" fill="#374151" fontWeight="500">
                    Systems
                  </text>

                  {/* Finance Node */}
                  <circle cx="60" cy="160" r="4" fill="#6b7280" />
                  <circle cx="60" cy="160" r="8" fill="none" stroke="#d1d5db" strokeWidth="1" />
                  <text x="60" y="180" textAnchor="middle" fontSize="9.5" fill="#374151" fontWeight="500">
                    Finance
                  </text>

                  {/* Revenue Node */}
                  <circle cx="220" cy="160" r="4" fill="#6b7280" />
                  <circle cx="220" cy="160" r="8" fill="none" stroke="#d1d5db" strokeWidth="1" />
                  <text x="220" y="180" textAnchor="middle" fontSize="9.5" fill="#374151" fontWeight="500">
                    Revenue
                  </text>

                  {/* Highlighted Gold Concentric Node: Customer Experience */}
                  <circle cx="218" cy="68" r="11" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.4" />
                  <circle cx="218" cy="68" r="8" fill="#fff" stroke="#d97706" strokeWidth="1.5" />
                  <circle cx="218" cy="68" r="3.5" fill="#d97706" />
                  <text x="218" y="48" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#111827">
                    Customer Experience
                  </text>
                  <text x="218" y="58" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#d97706" letterSpacing="0.08em">
                    OPPORTUNITY
                  </text>
                </svg>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div
              style={{
                borderTop: '1px solid #f3f4f6',
                paddingTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-dot-amber" />
                <span style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', color: '#374151', textTransform: 'uppercase' }}>
                  OPERATING REALITY
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>01</span>
            </div>
          </div>

          {/* ── CARD 02: Value Before Technology ── */}
          <div
            className="card-clean"
            style={{
              padding: '36px 32px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '480px',
              backgroundColor: '#ffffff'
            }}
          >
            <div>
              {/* Category Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  — 02 — PRINCIPLE
                </span>
              </div>

              {/* Title & Description */}
              <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#09090b', letterSpacing: '-0.02em', marginBottom: '10px' }}>
                Value Before Technology
              </h2>
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, margin: 0, minHeight: '42px' }}>
                Prioritise opportunities by business impact and practical feasibility.
              </p>

              {/* 2D Matrix Diagram (Impact x Feasibility) */}
              <div
                style={{
                  height: '240px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '16px'
                }}
              >
                <svg width="270" height="210" viewBox="0 0 270 210" fill="none">
                  {/* Grid Lines */}
                  <line x1="45" y1="30" x2="45" y2="170" stroke="#111827" strokeWidth="1.2" />
                  <line x1="45" y1="170" x2="250" y2="170" stroke="#111827" strokeWidth="1.2" />
                  
                  {/* Axis Arrows */}
                  <path d="M43 32 L45 26 L47 32" stroke="#111827" strokeWidth="1.2" fill="none" />
                  <path d="M246 168 L252 170 L246 172" stroke="#111827" strokeWidth="1.2" fill="none" />

                  {/* Axis Labels */}
                  <text x="45" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="#111827" letterSpacing="0.06em">
                    IMPACT ↑
                  </text>
                  <text x="235" y="184" textAnchor="end" fontSize="9" fontWeight="700" fill="#111827" letterSpacing="0.06em">
                    FEASIBILITY →
                  </text>

                  {/* Midline quadrant dividers */}
                  <line x1="45" y1="100" x2="245" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="145" y1="30" x2="145" y2="170" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Shaded High-Value Quadrant (Top Right) */}
                  <rect x="145" y="40" width="100" height="60" fill="#fef3c7" fillOpacity="0.35" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Scatter Data Points */}
                  <circle cx="85" cy="140" r="3" fill="#9ca3af" />
                  <circle cx="110" cy="115" r="3" fill="#9ca3af" />
                  <circle cx="95" cy="75" r="3" fill="#9ca3af" />
                  <circle cx="180" cy="145" r="3" fill="#9ca3af" />
                  <circle cx="160" cy="65" r="3" fill="#9ca3af" />

                  {/* High Value Opportunity Concentric Gold Node */}
                  <circle cx="205" cy="65" r="10" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.4" />
                  <circle cx="205" cy="65" r="7" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
                  <circle cx="205" cy="65" r="3.5" fill="#d97706" />

                  <text x="205" y="90" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#111827">
                    High-value opportunity
                  </text>
                </svg>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div
              style={{
                borderTop: '1px solid #f3f4f6',
                paddingTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-dot-amber" />
                <span style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', color: '#374151', textTransform: 'uppercase' }}>
                  IMPACT × FEASIBILITY
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>02</span>
            </div>
          </div>

          {/* ── CARD 03: Build for Adoption ── */}
          <div
            className="card-clean"
            style={{
              padding: '36px 32px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '480px',
              backgroundColor: '#ffffff'
            }}
          >
            <div>
              {/* Category Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  — 03 — PRINCIPLE
                </span>
              </div>

              {/* Title & Description */}
              <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#09090b', letterSpacing: '-0.02em', marginBottom: '10px' }}>
                Build for Adoption
              </h2>
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, margin: 0, minHeight: '42px' }}>
                Design solutions around the way people, workflows and systems actually operate.
              </p>

              {/* Operating Model Schematic Diagram */}
              <div
                style={{
                  height: '240px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '16px'
                }}
              >
                <svg width="280" height="210" viewBox="0 0 280 210" fill="none">
                  {/* Subtle Corner Framing Brackets */}
                  <path d="M45 40 L35 40 L35 50" stroke="#d1d5db" strokeWidth="1" fill="none" />
                  <path d="M235 40 L245 40 L245 50" stroke="#d1d5db" strokeWidth="1" fill="none" />
                  <path d="M35 160 L35 170 L45 170" stroke="#d1d5db" strokeWidth="1" fill="none" />
                  <path d="M245 160 L245 170 L235 170" stroke="#d1d5db" strokeWidth="1" fill="none" />

                  {/* Corner Nodes Connectors to Center */}
                  <line x1="65" y1="70" x2="105" y2="95" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="215" y1="70" x2="175" y2="95" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="65" y1="140" x2="105" y2="120" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="215" y1="140" x2="175" y2="120" stroke="#d1d5db" strokeWidth="1" />

                  {/* Golden dashed connecting lines from Operating Model */}
                  <line x1="140" y1="65" x2="140" y2="85" stroke="#d97706" strokeWidth="1.2" strokeDasharray="3 3" />
                  <line x1="140" y1="130" x2="140" y2="150" stroke="#d97706" strokeWidth="1.2" strokeDasharray="3 3" />

                  {/* Corner 1: People */}
                  <rect x="52" y="48" width="26" height="26" rx="4" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
                  <circle cx="65" cy="57" r="3" fill="#6b7280" />
                  <path d="M60 67 C60 63 70 63 70 67" stroke="#6b7280" strokeWidth="1" fill="none" />
                  <text x="65" y="42" textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151">
                    People
                  </text>

                  {/* Corner 2: Workflows */}
                  <rect x="202" y="48" width="26" height="26" rx="4" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="208" y1="58" x2="222" y2="58" stroke="#6b7280" strokeWidth="1.2" />
                  <line x1="208" y1="64" x2="222" y2="64" stroke="#6b7280" strokeWidth="1.2" />
                  <text x="215" y="42" textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151">
                    Workflows
                  </text>

                  {/* Corner 3: Technology */}
                  <rect x="52" y="132" width="26" height="26" rx="4" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="58" y="138" width="14" height="10" rx="1" fill="none" stroke="#6b7280" strokeWidth="1" />
                  <line x1="62" y1="151" x2="68" y2="151" stroke="#6b7280" strokeWidth="1" />
                  <text x="65" y="172" textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151">
                    Technology
                  </text>

                  {/* Corner 4: Data */}
                  <rect x="202" y="132" width="26" height="26" rx="4" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="208" y="138" width="6" height="6" fill="#6b7280" />
                  <rect x="216" y="138" width="6" height="6" fill="#6b7280" />
                  <rect x="208" y="146" width="6" height="6" fill="#6b7280" />
                  <rect x="216" y="146" width="6" height="6" fill="#6b7280" />
                  <text x="215" y="172" textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151">
                    Data
                  </text>

                  {/* Central Operating Model Box */}
                  <rect x="105" y="86" width="70" height="38" rx="2" fill="#fffbeb" stroke="#d97706" strokeWidth="1.2" />
                  <text x="140" y="102" textAnchor="middle" fontSize="8" fontWeight="700" fill="#b45309" letterSpacing="0.08em">
                    OPERATING
                  </text>
                  <text x="140" y="114" textAnchor="middle" fontSize="8" fontWeight="700" fill="#b45309" letterSpacing="0.08em">
                    MODEL
                  </text>
                </svg>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div
              style={{
                borderTop: '1px solid #f3f4f6',
                paddingTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-dot-amber" />
                <span style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', color: '#374151', textTransform: 'uppercase' }}>
                  OPERATING INTEGRATION
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>03</span>
            </div>
          </div>
        </div>

        {/* ── Section Below: WHERE AI CREATES VALUE (From screenshot) ── */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
              — WHERE AI CREATES VALUE
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '640px' }}>
              <h1
                style={{
                  fontSize: '44px',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  color: '#09090b',
                  marginBottom: '16px'
                }}
              >
                Transformation can start anywhere in your workflows.
              </h1>
              <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                Whether it is 0-second lead ingestion from Meta Ads & Google Ads, automatic SLA priority routing,
                or multi-touch WhatsApp scheduling — our enterprise engine accelerates client conversion.
              </p>
            </div>

            {/* Quick Actions to CRM */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <Link href="/dashboard" className="btn-pill-dark" style={{ padding: '12px 24px', fontSize: '14px' }}>
                <span>Launch CRM</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/pipeline" className="btn-pill-outline" style={{ padding: '12px 24px', fontSize: '14px' }}>
                <span>View Sales Pipeline</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* 3 Value Pillars Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              marginTop: '48px'
            }}
          >
            <div
              style={{
                borderLeft: '2px solid #09090b',
                paddingLeft: '20px',
                paddingTop: '4px',
                paddingBottom: '4px'
              }}
            >
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#09090b', marginBottom: '6px' }}>
                Omnichannel Lead Intake
              </h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Sync Meta Lead Ads, WhatsApp Cloud messages, and website inquiries with duplicate protection.
              </p>
            </div>

            <div
              style={{
                borderLeft: '2px solid #d97706',
                paddingLeft: '20px',
                paddingTop: '4px',
                paddingBottom: '4px'
              }}
            >
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#09090b', marginBottom: '6px' }}>
                Guaranteed Response SLA
              </h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Automated round-robin distribution with timer-based escalations to prevent lost opportunities.
              </p>
            </div>

            <div
              style={{
                borderLeft: '2px solid #059669',
                paddingLeft: '20px',
                paddingTop: '4px',
                paddingBottom: '4px'
              }}
            >
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#09090b', marginBottom: '6px' }}>
                End-to-End Attribution
              </h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Track full funnel ROI from UTM parameters and ad campaigns directly to settled client retainers.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Discovery Call Modal ── */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '36px', maxWidth: '520px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  — CONSULTATION INTAKE
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#09090b', marginTop: '4px' }}>
                  Book a Discovery Call
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
              >
                <X size={20} />
              </button>
            </div>

            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: '#d1fae5',
                    color: '#059669',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <Check size={28} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#09090b', marginBottom: '8px' }}>
                  Consultation Request Received
                </h4>
                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, marginBottom: '24px' }}>
                  Your request has been routed to our strategy team. An advisor will contact you within 60 minutes.
                </p>
                <button onClick={() => setModalOpen(false)} className="btn-pill-dark" style={{ width: '100%' }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="label">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Aditya Sharma"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="label">Work Email</label>
                    <input
                      required
                      type="email"
                      placeholder="aditya@company.com"
                      className="input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Phone (WhatsApp)</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Company / Law Firm</label>
                  <input
                    type="text"
                    placeholder="Sharma Legal Associates"
                    className="input"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Primary Requirement</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your lead volume and practice priorities..."
                    className="textarea"
                    value={formData.requirement}
                    onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-pill-dark"
                  style={{ width: '100%', marginTop: '8px', padding: '12px' }}
                >
                  {loading ? 'Submitting...' : 'Confirm Discovery Call'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}