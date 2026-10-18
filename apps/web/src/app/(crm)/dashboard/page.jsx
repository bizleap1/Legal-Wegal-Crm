'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  PhoneCall,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import Topbar from '../../../components/Topbar';
import { api } from '../../../lib/api-client';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const res = await api.getOverviewReport();
      setMetrics(res.data);
    } catch (err) {
      console.error('Failed to load metrics', err);
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    {
      label: 'Total Leads Ingested',
      value: metrics?.totalLeads ?? '...',
      change: '+14% this week',
      icon: Users,
      color: '#4338ca',
      bg: '#eef2ff'
    },
    {
      label: 'New Leads Today',
      value: metrics?.newLeadsToday ?? '...',
      change: 'Meta & Website intake',
      icon: TrendingUp,
      color: '#0284c7',
      bg: '#f0f9ff'
    },
    {
      label: 'Avg Response Time SLA',
      value: `${metrics?.avgResponseTimeMinutes ?? 14}m`,
      change: 'Target < 60 mins',
      icon: Clock,
      color: '#059669',
      bg: '#f0fdf4'
    },
    {
      label: 'Follow-up Tasks Due',
      value: metrics?.pendingTasksCount ?? '...',
      change: `${metrics?.overdueTasksCount ?? 0} overdue`,
      icon: AlertCircle,
      color: metrics?.overdueTasksCount > 0 ? '#e11d48' : '#d97706',
      bg: metrics?.overdueTasksCount > 0 ? '#fff1f2' : '#fefce8'
    }
  ];

  const pipelineStages = [
    { key: 'new', label: 'New', count: metrics?.leadsByStatus?.new ?? 0, color: '#0284c7' },
    { key: 'contacted', label: 'Contacted', count: metrics?.leadsByStatus?.contacted ?? 0, color: '#4338ca' },
    { key: 'qualified', label: 'Qualified', count: metrics?.leadsByStatus?.qualified ?? 0, color: '#7e22ce' },
    { key: 'proposal', label: 'Proposal', count: metrics?.leadsByStatus?.proposal ?? 0, color: '#d97706' },
    { key: 'won', label: 'Won', count: metrics?.leadsByStatus?.won ?? 0, color: '#059669' }
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Topbar
        title="Executive Dashboard"
        subtitle="Real-time inbound lead volume, response SLAs, and team conversion pipeline"
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '20px'
          }}
        >
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="card-clean"
                style={{
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff'
                }}
              >
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {kpi.label}
                  </span>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: '#09090b',
                      margin: '6px 0 2px 0',
                      letterSpacing: '-0.03em'
                    }}
                  >
                    {kpi.value}
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {kpi.change}
                  </span>
                </div>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: kpi.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={20} color={kpi.color} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pipeline Progression Bar */}
        <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: 0 }}>
                Sales Pipeline Progression
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
                Active leads across sequential pipeline stages
              </p>
            </div>
            <Link
              href="/pipeline"
              className="btn-pill-outline"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              <span>View Kanban Board</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px'
            }}
          >
            {pipelineStages.map((st) => (
              <div
                key={st.key}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                    {st.label}
                  </span>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: st.color
                    }}
                  />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#09090b' }}>
                  {st.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Split Section: Sources & Activity Timeline */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '24px'
          }}
        >
          {/* Inbound Sources Breakdown */}
          <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: 0 }}>
              Lead Capture Channels
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 16px 0' }}>
              Multi-source attribution distribution
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                {
                  name: 'Meta Lead Ads (FB & IG)',
                  key: 'meta',
                  color: '#1877f2',
                  count: metrics?.leadsBySource?.meta || 2
                },
                {
                  name: 'Website Consultation Form',
                  key: 'website',
                  color: '#059669',
                  count: metrics?.leadsBySource?.website || 2
                },
                {
                  name: 'Google Ads Search',
                  key: 'google_ads',
                  color: '#d97706',
                  count: metrics?.leadsBySource?.google_ads || 1
                },
                {
                  name: 'Direct Inbound / Manual',
                  key: 'manual',
                  color: '#7c3aed',
                  count: metrics?.leadsBySource?.manual || 1
                }
              ].map((src) => {
                const total = metrics?.totalLeads || 6;
                const pct = Math.round(((src.count / (total || 1)) * 100));
                return (
                  <div key={src.key}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '13px',
                        marginBottom: '6px'
                      }}
                    >
                      <span style={{ color: '#334155', fontWeight: 500 }}>{src.name}</span>
                      <span style={{ color: '#64748b', fontWeight: 600 }}>
                        {src.count} leads ({pct}%)
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '7px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: src.color,
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '10px'
              }}
            >
              <Link
                href="/public/form"
                className="btn-secondary"
                style={{ flex: 1, fontSize: '12px' }}
              >
                Test Intake Form
              </Link>
              <Link
                href="/integrations/simulator"
                className="btn-pill-dark"
                style={{ flex: 1, fontSize: '12px', padding: '8px' }}
              >
                Meta & WhatsApp Sandbox
              </Link>
            </div>
          </div>

          {/* Chronological Activity Feed */}
          <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: 0 }}>
              Recent Activity Timeline
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 16px 0' }}>
              Live audit events, calls, messages, and state transitions
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '330px',
                overflowY: 'auto'
              }}
            >
              {metrics?.recentActivities && metrics.recentActivities.length > 0 ? (
                metrics.recentActivities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    style={{
                      padding: '12px 14px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        backgroundColor:
                          act.activityType === 'call'
                            ? '#dbeafe'
                            : act.activityType === 'whatsapp'
                            ? '#d1fae5'
                            : '#ede9fe',
                        marginTop: '2px'
                      }}
                    >
                      {act.activityType === 'call' ? (
                        <PhoneCall size={14} color="#2563eb" />
                      ) : act.activityType === 'whatsapp' ? (
                        <MessageSquare size={14} color="#059669" />
                      ) : (
                        <Clock size={14} color="#6d28d9" />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#09090b' }}>
                          {act.subject}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {new Date(act.occurredAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#4b5563', margin: '3px 0 0 0', lineHeight: 1.4 }}>
                        {act.body}
                      </p>
                      {act.lead && (
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#4338ca',
                            fontWeight: 600,
                            marginTop: '4px',
                            display: 'inline-block'
                          }}
                        >
                          Lead: {act.lead.firstName} {act.lead.lastName}{' '}
                          {act.lead.company ? `(${act.lead.company})` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  No recent activities
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}