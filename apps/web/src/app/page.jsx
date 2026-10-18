'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ArrowRight,
  Check,
  X,
  Scale,
  Shield,
  FileText,
  Briefcase,
  Users2,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../lib/api-client';

export default function LegalWegalLandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    practiceArea: 'Corporate & Commercial Law',
    requirement: ''
  });

  const practiceAreasList = [
    'Corporate & Commercial Law',
    'Intellectual Property & Trademarks',
    'Commercial Litigation & Arbitration',
    'Regulatory Compliance & Taxation',
    'Real Estate & Land Advisory',
    'Employment & Labor Law'
  ];

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitPublicForm('consultation', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        requirement: `[Practice: ${formData.practiceArea}] ${formData.requirement}`,
        utm_source: 'website_direct',
        utm_medium: 'consultation_modal',
        consent: true
      });
      setFormSubmitted(true);
    } catch (err) {
      alert(err.message || 'Consultation request failed to submit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        color: '#09090b',
        fontFamily: 'var(--font-body)'
      }}
    >
      {/* ── Top Navigation Bar: Legal Wegal ── */}
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
        {/* Left Nav Menus: Legal Practice Areas & Solutions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <span>Practice Areas</span>
            <ChevronDown size={14} color="#64748b" />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <span>Corporate Solutions</span>
            <ChevronDown size={14} color="#64748b" />
          </div>
          <Link
            href="/public/form"
            style={{ fontSize: '13.5px', fontWeight: 500, color: '#334155' }}
          >
            Case Evaluation
          </Link>
        </div>

        {/* Center Brand: Legal Wegal */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#09090b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Scale size={18} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#09090b'
              }}
            >
              legal wegal
            </span>
          </Link>
        </div>

        {/* Right Nav Links & Dark Pill CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, justifyContent: 'flex-end' }}>
          <Link
            href="/dashboard"
            style={{ fontSize: '13.5px', fontWeight: 500, color: '#334155' }}
          >
            Launch CRM
          </Link>
          <Link
            href="/login"
            style={{ fontSize: '13.5px', fontWeight: 500, color: '#334155' }}
          >
            Advocate Sign In
          </Link>
          <button
            onClick={() => {
              setFormSubmitted(false);
              setModalOpen(true);
            }}
            className="btn-pill-dark"
          >
            Schedule Consultation
          </button>
        </div>
      </header>

      {/* ── Main Hero Section: The 3 Legal Practice Principles ── */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '52px 32px 80px' }}>
        
        {/* Grid of 3 Principle Cards (Refined for Legal Wegal services) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '72px'
          }}
        >
          {/* ── CARD 01: Advisory First ── */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  — 01 — PRINCIPLE
                </span>
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#09090b', letterSpacing: '-0.02em', marginBottom: '10px' }}>
                Advisory First
              </h2>
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, margin: 0, minHeight: '42px' }}>
                Start with legal stakes, corporate governance and regulatory compliance reality.
              </p>

              {/* Radial System Diagram: Legal Priority Matrix */}
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
                <svg width="280" height="230" viewBox="0 0 280 230" fill="none">
                  {/* Subtle connection lines */}
                  <line x1="140" y1="115" x2="140" y2="40" stroke="#d1d5db" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="140" y1="115" x2="60" y2="80" stroke="#d1d5db" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="140" y1="115" x2="60" y2="160" stroke="#d1d5db" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="140" y1="115" x2="220" y2="160" stroke="#d1d5db" strokeWidth="1" strokeDasharray="3 3" />
                  
                  {/* Golden line to Retainer Opportunity */}
                  <line x1="140" y1="115" x2="218" y2="68" stroke="#d97706" strokeWidth="1.5" />

                  {/* Central Node */}
                  <circle cx="140" cy="115" r="32" fill="#ffffff" stroke="#111827" strokeWidth="1.2" />
                  <text x="140" y="112" textAnchor="middle" fontSize="8" fontWeight="700" fill="#111827" letterSpacing="0.06em">
                    LEGAL
                  </text>
                  <text x="140" y="123" textAnchor="middle" fontSize="8" fontWeight="700" fill="#111827" letterSpacing="0.06em">
                    PRIORITY
                  </text>

                  {/* Compliance Node */}
                  <circle cx="140" cy="38" r="4" fill="#6b7280" />
                  <circle cx="140" cy="38" r="8" fill="none" stroke="#d1d5db" strokeWidth="1" />
                  <text x="140" y="24" textAnchor="middle" fontSize="9.5" fill="#374151" fontWeight="500">
                    Compliance
                  </text>

                  {/* Contracts Node */}
                  <circle cx="60" cy="80" r="4" fill="#6b7280" />
                  <circle cx="60" cy="80" r="8" fill="none" stroke="#d1d5db" strokeWidth="1" />
                  <text x="60" y="66" textAnchor="middle" fontSize="9.5" fill="#374151" fontWeight="500">
                    Contracts
                  </text>

                  {/* Corporate Node */}
                  <circle cx="60" cy="160" r="4" fill="#6b7280" />
                  <circle cx="60" cy="160" r="8" fill="none" stroke="#d1d5db" strokeWidth="1" />
                  <text x="60" y="180" textAnchor="middle" fontSize="9.5" fill="#374151" fontWeight="500">
                    Corporate
                  </text>

                  {/* Litigation Node */}
                  <circle cx="220" cy="160" r="4" fill="#6b7280" />
                  <circle cx="220" cy="160" r="8" fill="none" stroke="#d1d5db" strokeWidth="1" />
                  <text x="220" y="180" textAnchor="middle" fontSize="9.5" fill="#374151" fontWeight="500">
                    Litigation
                  </text>

                  {/* Highlighted Gold Concentric Node: Retainer Opportunity */}
                  <circle cx="218" cy="68" r="11" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.4" />
                  <circle cx="218" cy="68" r="8" fill="#fff" stroke="#d97706" strokeWidth="1.5" />
                  <circle cx="218" cy="68" r="3.5" fill="#d97706" />
                  <text x="218" y="48" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#111827">
                    Corporate Retainer
                  </text>
                  <text x="218" y="58" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#d97706" letterSpacing="0.08em">
                    HIGH PRIORITY
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
                  REGULATORY REALITY
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>01</span>
            </div>
          </div>

          {/* ── CARD 02: Value Before Litigation ── */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  — 02 — PRINCIPLE
                </span>
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#09090b', letterSpacing: '-0.02em', marginBottom: '10px' }}>
                Value Before Litigation
              </h2>
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, margin: 0, minHeight: '42px' }}>
                Prioritise legal claims by financial impact, jurisdictional merits and resolution feasibility.
              </p>

              {/* 2D Matrix Diagram: Claim Quantum vs Feasibility */}
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
                    CLAIM VALUE ↑
                  </text>
                  <text x="235" y="184" textAnchor="end" fontSize="9" fontWeight="700" fill="#111827" letterSpacing="0.06em">
                    FEASIBILITY →
                  </text>

                  {/* Midline quadrant dividers */}
                  <line x1="45" y1="100" x2="245" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="145" y1="30" x2="145" y2="170" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Shaded High-Value Quadrant */}
                  <rect x="145" y="40" width="100" height="60" fill="#fef3c7" fillOpacity="0.35" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Scatter Data Points */}
                  <circle cx="85" cy="140" r="3" fill="#9ca3af" />
                  <circle cx="110" cy="115" r="3" fill="#9ca3af" />
                  <circle cx="95" cy="75" r="3" fill="#9ca3af" />
                  <circle cx="180" cy="145" r="3" fill="#9ca3af" />
                  <circle cx="160" cy="65" r="3" fill="#9ca3af" />

                  {/* High Value Concentric Gold Node */}
                  <circle cx="205" cy="65" r="10" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.4" />
                  <circle cx="205" cy="65" r="7" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
                  <circle cx="205" cy="65" r="3.5" fill="#d97706" />

                  <text x="205" y="90" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#111827">
                    High-value dispute
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
                  EXPOSURE × FEASIBILITY
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>02</span>
            </div>
          </div>

          {/* ── CARD 03: Build for Resolution ── */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  — 03 — PRINCIPLE
                </span>
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#09090b', letterSpacing: '-0.02em', marginBottom: '10px' }}>
                Build for Resolution
              </h2>
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, margin: 0, minHeight: '42px' }}>
                Coordinate partners, litigation counsel, tribunals and clients through structured operating workflows.
              </p>

              {/* Operating Model Schematic: Practice Integration */}
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
                  {/* Framing Brackets */}
                  <path d="M45 40 L35 40 L35 50" stroke="#d1d5db" strokeWidth="1" fill="none" />
                  <path d="M235 40 L245 40 L245 50" stroke="#d1d5db" strokeWidth="1" fill="none" />
                  <path d="M35 160 L35 170 L45 170" stroke="#d1d5db" strokeWidth="1" fill="none" />
                  <path d="M245 160 L245 170 L235 170" stroke="#d1d5db" strokeWidth="1" fill="none" />

                  {/* Connectors */}
                  <line x1="65" y1="70" x2="105" y2="95" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="215" y1="70" x2="175" y2="95" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="65" y1="140" x2="105" y2="120" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="215" y1="140" x2="175" y2="120" stroke="#d1d5db" strokeWidth="1" />

                  <line x1="140" y1="65" x2="140" y2="85" stroke="#d97706" strokeWidth="1.2" strokeDasharray="3 3" />
                  <line x1="140" y1="130" x2="140" y2="150" stroke="#d97706" strokeWidth="1.2" strokeDasharray="3 3" />

                  {/* Corner 1: Advocates */}
                  <rect x="52" y="48" width="26" height="26" rx="4" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
                  <circle cx="65" cy="57" r="3" fill="#6b7280" />
                  <path d="M60 67 C60 63 70 63 70 67" stroke="#6b7280" strokeWidth="1" fill="none" />
                  <text x="65" y="42" textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151">
                    Advocates
                  </text>

                  {/* Corner 2: Contracts */}
                  <rect x="202" y="48" width="26" height="26" rx="4" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="208" y1="58" x2="222" y2="58" stroke="#6b7280" strokeWidth="1.2" />
                  <line x1="208" y1="64" x2="222" y2="64" stroke="#6b7280" strokeWidth="1.2" />
                  <text x="215" y="42" textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151">
                    Contracts
                  </text>

                  {/* Corner 3: Courts */}
                  <rect x="52" y="132" width="26" height="26" rx="4" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="58" y="138" width="14" height="10" rx="1" fill="none" stroke="#6b7280" strokeWidth="1" />
                  <line x1="62" y1="151" x2="68" y2="151" stroke="#6b7280" strokeWidth="1" />
                  <text x="65" y="172" textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151">
                    Tribunals
                  </text>

                  {/* Corner 4: Clients */}
                  <rect x="202" y="132" width="26" height="26" rx="4" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
                  <rect x="208" y="138" width="6" height="6" fill="#6b7280" />
                  <rect x="216" y="138" width="6" height="6" fill="#6b7280" />
                  <rect x="208" y="146" width="6" height="6" fill="#6b7280" />
                  <rect x="216" y="146" width="6" height="6" fill="#6b7280" />
                  <text x="215" y="172" textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151">
                    Enterprises
                  </text>

                  {/* Central Legal Operating Model Box */}
                  <rect x="105" y="86" width="70" height="38" rx="2" fill="#fffbeb" stroke="#d97706" strokeWidth="1.2" />
                  <text x="140" y="102" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#b45309" letterSpacing="0.08em">
                    PRACTICE
                  </text>
                  <text x="140" y="114" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#b45309" letterSpacing="0.08em">
                    OPERATING MODEL
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
                  PRACTICE INTEGRATION
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>03</span>
            </div>
          </div>
        </div>

        {/* ── Section Below: WHERE LEGAL WEGAL CREATES VALUE ── */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
              — WHERE LEGAL WEGAL CREATES VALUE
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '680px' }}>
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
                Comprehensive legal counsel tailored to protect and scale your enterprise.
              </h1>
              <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                From cross-border corporate transactions and trademark registrations to commercial litigation and regulatory compliance,
                Legal Wegal delivers senior advocate representation with guaranteed response turnaround.
              </p>
            </div>

            {/* Actions to CRM & Intake */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setModalOpen(true);
                }}
                className="btn-pill-dark"
                style={{ padding: '12px 24px', fontSize: '14px' }}
              >
                <span>Book a Consultation</span>
                <ArrowRight size={16} />
              </button>
              <Link href="/dashboard" className="btn-pill-outline" style={{ padding: '12px 24px', fontSize: '14px' }}>
                <span>Advocate Workspace</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* 3 Core Legal Pillars Bar */}
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
                Corporate & Contract Advisory
              </h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Master service agreements, vendor drafting, cross-border M&A transactions, and regulatory structuring for fast-growth entities.
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
                IP, Trademarks & Brand Defense
              </h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Comprehensive trademark searches, multi-class registrations, software licensing, and immediate cease-and-desist enforcement.
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
                Commercial Litigation & Disputes
              </h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Dedicated tribunal representation, arbitration strategy, debt recovery, and high-stakes dispute resolution across High Courts.
              </p>
            </div>
          </div>

          {/* Practice Areas Grid Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginTop: '48px'
            }}
          >
            {[
              {
                title: 'Corporate Governance & Formation',
                desc: 'End-to-end entity structuring, board advisory, shareholder agreements, and FDI compliance.',
                icon: Briefcase
              },
              {
                title: 'Intellectual Property Portfolio',
                desc: 'Protecting brand equity through trademarks, patent drafting, copyright licensing, and trade secrets.',
                icon: Shield
              },
              {
                title: 'Dispute Resolution & Arbitration',
                desc: 'Commercial court representation, institutional arbitrations, mediation, and contract enforcement.',
                icon: Scale
              },
              {
                title: 'Employment & Labor Compliance',
                desc: 'Executive agreements, POSH policy compliance, severance negotiations, and workplace audits.',
                icon: Users2
              },
              {
                title: 'Regulatory & Taxation Defense',
                desc: 'Direct and indirect tax representation, GST litigation, and compliance before statutory authorities.',
                icon: FileText
              },
              {
                title: 'Real Estate & Infrastructure Law',
                desc: 'Title due diligence, commercial lease agreements, RERA compliance, and conveyance documentation.',
                icon: Award
              }
            ].map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div
                  key={idx}
                  className="card-clean"
                  style={{
                    padding: '24px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}
                  >
                    <Icon size={18} color="#09090b" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#09090b', marginBottom: '8px' }}>
                    {svc.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {svc.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── Consultation Intake Modal ── */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '36px', maxWidth: '540px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  — CONFIDENTIAL LEGAL INTAKE
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#09090b', marginTop: '4px' }}>
                  Schedule Legal Consultation
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
                  Consultation Request Captured
                </h4>
                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, marginBottom: '24px' }}>
                  Your inquiry has been assigned to our practice partners. An advocate will review your matter and contact you within 60 minutes.
                </p>
                <button onClick={() => setModalOpen(false)} className="btn-pill-dark" style={{ width: '100%' }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="label">Full Name *</label>
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
                    <label className="label">Corporate Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="aditya@enterprise.com"
                      className="input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Phone / WhatsApp *</label>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="label">Company / Entity</label>
                    <input
                      type="text"
                      placeholder="Nova Enterprises Pvt Ltd"
                      className="input"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Practice Area</label>
                    <select
                      className="select"
                      value={formData.practiceArea}
                      onChange={(e) => setFormData({ ...formData, practiceArea: e.target.value })}
                    >
                      {practiceAreasList.map((pa) => (
                        <option key={pa} value={pa}>
                          {pa}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Matter Summary / Requirement *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly describe your legal requirement or dispute situation..."
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
                  {loading ? 'Submitting to Counsel...' : 'Confirm Consultation Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}