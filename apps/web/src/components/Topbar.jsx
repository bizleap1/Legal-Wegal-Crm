'use client';

import React from 'react';
import { Plus } from 'lucide-react';

export default function Topbar({
  title,
  subtitle,
  onNewLeadClick
}) {
  return (
    <header
      style={{
        height: '70px',
        padding: '0 32px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      <div>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 700,
            margin: 0,
            letterSpacing: '-0.02em',
            color: '#09090b'
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: '12.5px',
              color: '#64748b',
              margin: '2px 0 0 0'
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        {/* Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '9999px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            fontSize: '11.5px',
            color: '#15803d',
            fontWeight: 600
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#16a34a'
            }}
          />
          Meta & WhatsApp Active
        </div>

        {/* Global Action */}
        {onNewLeadClick && (
          <button
            onClick={onNewLeadClick}
            className="btn-pill-dark"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <Plus size={15} />
            <span>Create Lead</span>
          </button>
        )}
      </div>
    </header>
  );
}