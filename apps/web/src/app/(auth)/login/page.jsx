'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scale, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../../lib/api-client';
import { setCurrentUser } from '../../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@legalwegal.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email, password });
      setCurrentUser(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('Password123!');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: '32px 24px'
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#09090b',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                marginBottom: '16px'
              }}
            >
              <Scale size={24} />
            </div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#09090b',
                letterSpacing: '-0.02em'
              }}
            >
              Legal Wegal CRM
            </h1>
          </Link>
          <p style={{ color: '#64748b', fontSize: '13.5px', marginTop: '4px' }}>
            Single-Tenant Inbound Lead Management & Outreach
          </p>
        </div>

        {/* Card */}
        <div
          className="card-clean"
          style={{
            padding: '36px',
            backgroundColor: '#ffffff'
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {error && (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#ffe4e6',
                  border: '1px solid #fecdd3',
                  color: '#be123c',
                  fontSize: '13px'
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label className="label">Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '13px' }}
                />
                <input
                  type="email"
                  className="input"
                  style={{ paddingLeft: '38px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '13px' }}
                />
                <input
                  type="password"
                  className="input"
                  style={{ paddingLeft: '38px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-pill-dark"
              style={{
                padding: '12px',
                marginTop: '6px',
                width: '100%',
                borderRadius: '8px'
              }}
              disabled={loading}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '10px'
              }}
            >
              <ShieldCheck size={14} color="#059669" />
              <span>Fast Seed Access</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@legalwegal.com')}
                className="btn-secondary"
                style={{ fontSize: '11.5px', padding: '7px 4px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('manager@legalwegal.com')}
                className="btn-secondary"
                style={{ fontSize: '11.5px', padding: '7px 4px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('rahul@legalwegal.com')}
                className="btn-secondary"
                style={{ fontSize: '11.5px', padding: '7px 4px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Sales Rep
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}