'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Kanban,
  CalendarCheck,
  BarChart3,
  Sliders,
  Share2,
  Globe,
  LogOut,
  Scale
} from 'lucide-react';
import { getCurrentUser, clearUserSession } from '../lib/auth';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser() || {
    name: 'Aditya Sharma',
    role: 'admin',
    email: 'admin@legalwegal.com'
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Leads', href: '/leads', icon: Users },
    { label: 'Sales Pipeline', href: '/pipeline', icon: Kanban },
    { label: 'Tasks & Follow-ups', href: '/tasks', icon: CalendarCheck },
    { label: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
    { label: 'Settings & Rules', href: '/settings', icon: Sliders },
    { label: 'Integrations Hub', href: '/integrations/simulator', icon: Share2 },
    { label: 'Public Intake Form', href: '/public/form', icon: Globe }
  ];

  const handleLogout = () => {
    clearUserSession();
    router.push('/login');
  };

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        zIndex: 40
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '22px 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            backgroundColor: '#09090b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}
        >
          <Scale size={18} />
        </div>
        <div>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1
              style={{
                fontSize: '16px',
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.2,
                color: '#09090b',
                letterSpacing: '-0.02em'
              }}
            >
              Legal Wegal
            </h1>
          </Link>
          <span
            style={{
              fontSize: '10.5px',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600
            }}
          >
            CRM Platform
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          padding: '16px 12px',
          flex: 1,
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#09090b' : '#64748b',
                  backgroundColor: isActive ? '#f1f5f9' : 'transparent',
                  border: isActive ? '1px solid #e2e8f0' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={17} color={isActive ? '#09090b' : '#94a3b8'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Footer */}
      <div
        style={{
          padding: '16px 18px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '12.5px'
            }}
          >
            {user.name.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#09090b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {user.name}
            </div>
            <span
              style={{
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '4px',
                backgroundColor:
                  user.role === 'admin'
                    ? '#fee2e2'
                    : user.role === 'manager'
                    ? '#fef3c7'
                    : '#e0f2fe',
                color:
                  user.role === 'admin'
                    ? '#b91c1c'
                    : user.role === 'manager'
                    ? '#b45309'
                    : '#0369a1',
                textTransform: 'uppercase',
                fontWeight: 700
              }}
            >
              {user.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease'
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}