'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, TrendingUp, Clock, AlertCircle, PhoneCall, MessageSquare, ArrowUpRight } from 'lucide-react';
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
  const kpis = [{
    label: 'Total Leads Ingested',
    value: metrics?.totalLeads ?? '...',
    change: '+14% this week',
    icon: Users,
    color: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.2)'
  }, {
    label: 'New Leads Today',
    value: metrics?.newLeadsToday ?? '...',
    change: 'Meta & Website intake',
    icon: TrendingUp,
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.2)'
  }, {
    label: 'Avg Response Time SLA',
    value: `${metrics?.avgResponseTimeMinutes ?? 14}m`,
    change: 'Target < 60 mins',
    icon: Clock,
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.2)'
  }, {
    label: 'Follow-up Tasks Due',
    value: metrics?.pendingTasksCount ?? '...',
    change: `${metrics?.overdueTasksCount ?? 0} overdue`,
    icon: AlertCircle,
    color: metrics?.overdueTasksCount > 0 ? '#f43f5e' : '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.2)'
  }];
  const pipelineStages = [{
    key: 'new',
    label: 'New',
    count: metrics?.leadsByStatus?.new ?? 0,
    color: '#38bdf8'
  }, {
    key: 'contacted',
    label: 'Contacted',
    count: metrics?.leadsByStatus?.contacted ?? 0,
    color: '#818cf8'
  }, {
    key: 'qualified',
    label: 'Qualified',
    count: metrics?.leadsByStatus?.qualified ?? 0,
    color: '#c084fc'
  }, {
    key: 'proposal',
    label: 'Proposal',
    count: metrics?.leadsByStatus?.proposal ?? 0,
    color: '#fbbf24'
  }, {
    key: 'won',
    label: 'Won',
    count: metrics?.leadsByStatus?.won ?? 0,
    color: '#34d399'
  }];
  return <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }}>
      <Topbar title="Executive Dashboard" subtitle="Real-time inbound lead volume, response SLAs, and team conversion pipeline" />

      <div style={{
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    }}>
        {/* KPI Cards */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '20px'
      }}>
          {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return <div key={idx} className="glass-card" style={{
            padding: '22px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
                <div>
                  <span style={{
                fontSize: '12.5px',
                color: '#94a3b8',
                fontWeight: 500
              }}>{kpi.label}</span>
                  <div style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#ffffff',
                margin: '6px 0 2px 0'
              }}>
                    {kpi.value}
                  </div>
                  <span style={{
                fontSize: '11.5px',
                color: '#64748b'
              }}>{kpi.change}</span>
                </div>
                <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: kpi.glow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${kpi.color}40`
            }}>
                  <Icon size={22} color={kpi.color} />
                </div>
              </div>;
        })}
        </div>

        {/* Pipeline Progression Bar */}
        <div className="glass-card" style={{
        padding: '24px'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
            <div>
              <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              margin: 0
            }}>Sales Pipeline Progression</h3>
              <p style={{
              fontSize: '12.5px',
              color: '#94a3b8',
              margin: '2px 0 0 0'
            }}>
                Active leads across sequential pipeline stages
              </p>
            </div>
            <Link href="/pipeline" className="btn btn-secondary" style={{
            fontSize: '12px',
            padding: '6px 12px'
          }}>
              <span>View Kanban Board</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '12px'
        }}>
            {pipelineStages.map(st => <div key={st.key} style={{
            backgroundColor: '#0c121e',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
                  <span style={{
                fontSize: '12px',
                color: '#94a3b8',
                fontWeight: 600
              }}>{st.label}</span>
                  <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: st.color
              }} />
                </div>
                <div style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#ffffff'
            }}>{st.count}</div>
              </div>)}
          </div>
        </div>

        {/* Split Section: Sources & Activity Timeline */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '24px'
      }}>
          {/* Inbound Sources Breakdown */}
          <div className="glass-card" style={{
          padding: '24px'
        }}>
            <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            margin: 0
          }}>Lead Capture Channels</h3>
            <p style={{
            fontSize: '12.5px',
            color: '#94a3b8',
            margin: '2px 0 16px 0'
          }}>
              Multi-source attribution distribution
            </p>

            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
              {[{
              name: 'Meta Lead Ads (FB & IG)',
              key: 'meta',
              color: '#1877f2',
              count: metrics?.leadsBySource?.meta || 2
            }, {
              name: 'Website Consultation Form',
              key: 'website',
              color: '#10b981',
              count: metrics?.leadsBySource?.website || 2
            }, {
              name: 'Google Ads Search',
              key: 'google_ads',
              color: '#ea4335',
              count: metrics?.leadsBySource?.google_ads || 1
            }, {
              name: 'Direct Inbound / Manual',
              key: 'manual',
              color: '#8b5cf6',
              count: metrics?.leadsBySource?.manual || 1
            }].map(src => {
              const total = metrics?.totalLeads || 6;
              const pct = Math.round(src.count / (total || 1) * 100);
              return <div key={src.key}>
                    <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  marginBottom: '6px'
                }}>
                      <span style={{
                    color: '#e2e8f0',
                    fontWeight: 500
                  }}>{src.name}</span>
                      <span style={{
                    color: '#94a3b8',
                    fontWeight: 600
                  }}>{src.count} leads ({pct}%)</span>
                    </div>
                    <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#1e293b',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                      <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor: src.color,
                    borderRadius: '4px'
                  }} />
                    </div>
                  </div>;
            })}
            </div>

            <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            gap: '10px'
          }}>
              <Link href="/public/form" className="btn btn-secondary" style={{
              flex: 1,
              fontSize: '12px'
            }}>
                Test Website Form
              </Link>
              <Link href="/integrations/simulator" className="btn btn-primary" style={{
              flex: 1,
              fontSize: '12px'
            }}>
                Meta & WhatsApp Sandbox
              </Link>
            </div>
          </div>

          {/* Chronological Activity Feed */}
          <div className="glass-card" style={{
          padding: '24px'
        }}>
            <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            margin: 0
          }}>Recent Activity Timeline</h3>
            <p style={{
            fontSize: '12.5px',
            color: '#94a3b8',
            margin: '2px 0 16px 0'
          }}>
              Live audit events, calls, messages, and state transitions
            </p>

            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '330px',
            overflowY: 'auto'
          }}>
              {metrics?.recentActivities && metrics.recentActivities.length > 0 ? metrics.recentActivities.slice(0, 5).map(act => <div key={act.id} style={{
              padding: '12px 14px',
              backgroundColor: '#0c121e',
              borderRadius: '10px',
              border: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
                    <div style={{
                padding: '6px',
                borderRadius: '8px',
                backgroundColor: act.activityType === 'call' ? 'rgba(59, 130, 246, 0.15)' : act.activityType === 'whatsapp' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                marginTop: '2px'
              }}>
                      {act.activityType === 'call' ? <PhoneCall size={14} color="#60a5fa" /> : act.activityType === 'whatsapp' ? <MessageSquare size={14} color="#34d399" /> : <Clock size={14} color="#a5b4fc" />}
                    </div>
                    <div style={{
                flex: 1,
                minWidth: 0
              }}>
                      <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                        <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#f1f5f9'
                  }}>{act.subject}</span>
                        <span style={{
                    fontSize: '11px',
                    color: '#64748b'
                  }}>
                          {new Date(act.occurredAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                        </span>
                      </div>
                      <p style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  margin: '3px 0 0 0',
                  lineHeight: 1.4
                }}>
                        {act.body}
                      </p>
                      {act.lead && <span style={{
                  fontSize: '11px',
                  color: '#818cf8',
                  fontWeight: 500,
                  marginTop: '4px',
                  display: 'inline-block'
                }}>
                          Lead: {act.lead.firstName} {act.lead.lastName} {act.lead.company ? `(${act.lead.company})` : ''}
                        </span>}
                    </div>
                  </div>) : <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#64748b'
            }}>No recent activities</div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
}