'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scale, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../../lib/api-client';
import { setCurrentUser } from '../../../lib/auth';
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@legalwegal.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({
        email,
        password
      });
      setCurrentUser(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };
  const handleQuickLogin = roleEmail => {
    setEmail(roleEmail);
    setPassword('Password123!');
  };
  return <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#070b12',
    backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
    padding: '24px'
  }}>
      <div style={{
      maxWidth: '440px',
      width: '100%'
    }}>
        {/* Brand */}
        <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
          <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
          marginBottom: '16px'
        }}>
            <Scale size={30} color="#ffffff" />
          </div>
          <h1 style={{
          fontSize: '24px',
          fontWeight: 800,
          color: '#ffffff'
        }}>Legal Wegal CRM</h1>
          <p style={{
          color: '#94a3b8',
          fontSize: '13.5px',
          marginTop: '4px'
        }}>
            Single-Tenant Inbound Lead Management & Outreach
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel" style={{
        padding: '32px',
        border: '1px solid #1e293b'
      }}>
          <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
            {error && <div style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fda4af',
            fontSize: '13px'
          }}>
                {error}
              </div>}

            <div>
              <label className="label">Work Email</label>
              <div style={{
              position: 'relative'
            }}>
                <Mail size={16} color="#64748b" style={{
                position: 'absolute',
                left: '12px',
                top: '12px'
              }} />
                <input type="email" className="input" style={{
                paddingLeft: '38px'
              }} value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{
              position: 'relative'
            }}>
                <Lock size={16} color="#64748b" style={{
                position: 'absolute',
                left: '12px',
                top: '12px'
              }} />
                <input type="password" className="input" style={{
                paddingLeft: '38px'
              }} value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{
            padding: '11px',
            marginTop: '4px'
          }} disabled={loading}>
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Role Switcher */}
          <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #1e293b'
        }}>
            <span style={{
            fontSize: '11.5px',
            color: '#64748b',
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '0.05em'
          }}>
              Quick Demo Sign-in
            </span>
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '10px'
          }}>
              <button type="button" onClick={() => handleQuickLogin('admin@legalwegal.com')} className="btn btn-secondary" style={{
              justifyContent: 'space-between',
              padding: '8px 12px',
              fontSize: '12.5px'
            }}>
                <span>Admin (Full Control & Integrations)</span>
                <span className="badge" style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#fca5a5'
              }}>Admin</span>
              </button>
              <button type="button" onClick={() => handleQuickLogin('manager@legalwegal.com')} className="btn btn-secondary" style={{
              justifyContent: 'space-between',
              padding: '8px 12px',
              fontSize: '12.5px'
            }}>
                <span>Manager (Pipeline & Assignment)</span>
                <span className="badge" style={{
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                color: '#fde68a'
              }}>Manager</span>
              </button>
              <button type="button" onClick={() => handleQuickLogin('rahul@legalwegal.com')} className="btn btn-secondary" style={{
              justifyContent: 'space-between',
              padding: '8px 12px',
              fontSize: '12.5px'
            }}>
                <span>Salesperson (Calls & Tasks)</span>
                <span className="badge" style={{
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                color: '#93c5fd'
              }}>Sales</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '20px',
        color: '#64748b',
        fontSize: '12px'
      }}>
          <ShieldCheck size={15} color="#10b981" />
          <span>Role-Based Access Control (RBAC) & Audit Logs Enforced</span>
        </div>
      </div>
    </div>;
}