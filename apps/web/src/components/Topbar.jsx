'use client';

import React from 'react';
import { Plus } from 'lucide-react';
export default function Topbar({
  title,
  subtitle,
  onNewLeadClick
}) {
  return <header style={{
    height: '68px',
    padding: '0 32px',
    borderBottom: '1px solid #1e293b',
    backgroundColor: '#0c121e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 30
  }}>
      <div>
        <h2 style={{
        fontSize: '19px',
        fontWeight: 700,
        margin: 0,
        color: '#ffffff'
      }}>{title}</h2>
        {subtitle && <p style={{
        fontSize: '12.5px',
        color: '#94a3b8',
        margin: 0
      }}>{subtitle}</p>}
      </div>

      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
        {/* Status Pill */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '20px',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        fontSize: '11.5px',
        color: '#34d399',
        fontWeight: 600
      }}>
          <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#10b981'
        }} />
          Meta & WhatsApp Active
        </div>

        {/* Global Action */}
        {onNewLeadClick && <button onClick={onNewLeadClick} className="btn btn-primary" style={{
        padding: '8px 14px'
      }}>
            <Plus size={16} />
            <span>Create Lead</span>
          </button>}
      </div>
    </header>;
}