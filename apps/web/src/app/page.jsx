'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../lib/auth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        fontFamily: 'var(--font-body)'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#09090b',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '16px'
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 700 }}>LW</span>
        </div>
        <div style={{ color: '#09090b', fontSize: '15px', fontWeight: 600 }}>
          Legal Wegal CRM
        </div>
        <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
          Loading Lead Management Workspace...
        </div>
      </div>
    </div>
  );
}