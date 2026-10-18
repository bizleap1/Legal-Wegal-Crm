'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../lib/auth';
export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);
  return <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0e17'
  }}>
      <div style={{
      color: '#94a3b8',
      fontSize: '14px'
    }}>Loading Legal Wegal CRM...</div>
    </div>;
}