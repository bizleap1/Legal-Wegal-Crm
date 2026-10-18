'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Kanban, CalendarCheck, BarChart3, Sliders, Share2, Globe, LogOut, Scale } from 'lucide-react';
import { getCurrentUser, clearUserSession } from '../lib/auth';
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser() || {
    name: 'Aditya Sharma',
    role: 'admin',
    email: 'admin@legalwegal.com'
  };
  const navItems = [{
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  }, {
    label: 'Leads',
    href: '/leads',
    icon: Users
  }, {
    label: 'Sales Pipeline',
    href: '/pipeline',
    icon: Kanban
  }, {
    label: 'Tasks & Follow-ups',
    href: '/tasks',
    icon: CalendarCheck
  }, {
    label: 'Reports & Analytics',
    href: '/reports',
    icon: BarChart3
  }, {
    label: 'Settings & Rules',
    href: '/settings',
    icon: Sliders
  }, {
    label: 'Integrations Hub',
    href: '/integrations/simulator',
    icon: Share2
  }, {
    label: 'Public Form Intake',
    href: '/public/form',
    icon: Globe
  }];
  const handleLogout = () => {
    clearUserSession();
    router.push('/login');
  };
  return <aside style={{
    width: '260px',
    backgroundColor: '#0c121e',
    borderRight: '1px solid #1e293b',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
    zIndex: 40
  }}>
      {/* Brand Header */}
      <div style={{
      padding: '24px 20px',
      borderBottom: '1px solid #1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
        <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
      }}>
          <Scale size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{
          fontSize: '17px',
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.2
        }}>Legal Wegal</h1>
          <span style={{
          fontSize: '11px',
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 600
        }}>
            Lead Management CRM
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{
      padding: '16px 12px',
      flex: 1,
      overflowY: 'auto'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
          {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || item.href !== '/dashboard' && pathname?.startsWith(item.href);
          return <Link key={item.href} href={item.href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '9px',
            fontSize: '13.5px',
            fontWeight: isActive ? 600 : 500,
            color: isActive ? '#ffffff' : '#94a3b8',
            backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
            transition: 'all 0.15s ease'
          }}>
                <Icon size={18} color={isActive ? '#818cf8' : '#64748b'} />
                <span>{item.label}</span>
              </Link>;
        })}
        </div>
      </nav>

      {/* User Footer */}
      <div style={{
      padding: '16px 20px',
      borderTop: '1px solid #1e293b',
      backgroundColor: '#090d16',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        overflow: 'hidden'
      }}>
          <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          backgroundColor: '#312e81',
          color: '#c7d2fe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '13px'
        }}>
            {user.name.charAt(0)}
          </div>
          <div style={{
          overflow: 'hidden'
        }}>
            <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#f8fafc',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
              {user.name}
            </div>
            <span style={{
            fontSize: '10.5px',
            padding: '1px 6px',
            borderRadius: '4px',
            backgroundColor: user.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : user.role === 'manager' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            color: user.role === 'admin' ? '#fca5a5' : user.role === 'manager' ? '#fde68a' : '#93c5fd',
            textTransform: 'uppercase',
            fontWeight: 700
          }}>
              {user.role}
            </span>
          </div>
        </div>

        <button onClick={handleLogout} title="Sign out" style={{
        background: 'none',
        border: 'none',
        color: '#64748b',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.15s ease'
      }}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>;
}