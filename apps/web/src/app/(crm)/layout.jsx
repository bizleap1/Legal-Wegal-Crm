'use client';

import React from 'react';
import Sidebar from '../../components/Sidebar';
export default function CrmLayout({
  children
}) {
  return <div style={{
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0a0e17'
  }}>
      <Sidebar />
      <main style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      overflowX: 'hidden'
    }}>
        {children}
      </main>
    </div>;
}