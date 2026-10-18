'use client';

import React, { useEffect, useState } from 'react';
import Topbar from '../../../components/Topbar';
import { api } from '../../../lib/api-client';
export default function ReportsPage() {
  const [sourcesReport, setSourcesReport] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadReports();
  }, []);
  const loadReports = async () => {
    try {
      const [srcRes, ovRes] = await Promise.all([api.getSourcesReport(), api.getOverviewReport()]);
      setSourcesReport(srcRes.data);
      setOverview(ovRes.data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };
  return <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }}>
      <Topbar title="Reports & Analytics" subtitle="Attribution conversion rates, response-time SLAs, and campaign ROI metrics" />

      <div style={{
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    }}>
        {/* KPI Summary Cards */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
          <div className="glass-card" style={{
          padding: '22px'
        }}>
            <span style={{
            fontSize: '12.5px',
            color: '#94a3b8',
            fontWeight: 500
          }}>Lead-to-Won Conversion</span>
            <div style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#34d399',
            margin: '4px 0'
          }}>
              {overview?.conversionRate ?? 16.7}%
            </div>
            <span style={{
            fontSize: '11.5px',
            color: '#64748b'
          }}>Industry benchmark: 12-15%</span>
          </div>

          <div className="glass-card" style={{
          padding: '22px'
        }}>
            <span style={{
            fontSize: '12.5px',
            color: '#94a3b8',
            fontWeight: 500
          }}>Avg Response Time SLA</span>
            <div style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#38bdf8',
            margin: '4px 0'
          }}>
              {overview?.avgResponseTimeMinutes ?? 14.5}m
            </div>
            <span style={{
            fontSize: '11.5px',
            color: '#64748b'
          }}>Within 60m SLA target</span>
          </div>

          <div className="glass-card" style={{
          padding: '22px'
        }}>
            <span style={{
            fontSize: '12.5px',
            color: '#94a3b8',
            fontWeight: 500
          }}>Total Inbound Leads</span>
            <div style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#818cf8',
            margin: '4px 0'
          }}>
              {overview?.totalLeads ?? 6}
            </div>
            <span style={{
            fontSize: '11.5px',
            color: '#64748b'
          }}>Across Meta, Web, & Search</span>
          </div>

          <div className="glass-card" style={{
          padding: '22px'
        }}>
            <span style={{
            fontSize: '12.5px',
            color: '#94a3b8',
            fontWeight: 500
          }}>Engagements Won</span>
            <div style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#fcd34d',
            margin: '4px 0'
          }}>
              {overview?.wonCount ?? 1}
            </div>
            <span style={{
            fontSize: '11.5px',
            color: '#64748b'
          }}>Retainer & corporate clients</span>
          </div>
        </div>

        {/* Source & Campaign Performance Table */}
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
            }}>Attribution Source Performance</h3>
              <p style={{
              fontSize: '12.5px',
              color: '#94a3b8',
              margin: '2px 0 0 0'
            }}>
                Compare conversion rates and lead volumes across inbound channels
              </p>
            </div>
          </div>

          <table className="crm-table">
            <thead>
              <tr>
                <th>Source Channel</th>
                <th>Total Leads</th>
                <th>Won Deals</th>
                <th>Lost Deals</th>
                <th>Conversion Rate</th>
                <th>Active Campaigns</th>
              </tr>
            </thead>
            <tbody>
              {sourcesReport?.sources?.map(s => <tr key={s.source}>
                  <td>
                    <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: s.source === 'meta' ? 'rgba(24, 119, 242, 0.2)' : s.source === 'website' ? 'rgba(16, 185, 129, 0.2)' : s.source === 'google_ads' ? 'rgba(234, 67, 53, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                  color: s.source === 'meta' ? '#60a5fa' : s.source === 'website' ? '#34d399' : s.source === 'google_ads' ? '#f87171' : '#cbd5e1',
                  textTransform: 'uppercase'
                }}>
                      {s.source}
                    </span>
                  </td>
                  <td style={{
                fontWeight: 600,
                color: '#f8fafc'
              }}>{s.total}</td>
                  <td style={{
                color: '#34d399',
                fontWeight: 600
              }}>{s.won}</td>
                  <td style={{
                color: '#fda4af'
              }}>{s.lost}</td>
                  <td>
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                      <span style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#ffffff',
                    minWidth: '40px'
                  }}>
                        {s.conversionRate}%
                      </span>
                      <div style={{
                    width: '100px',
                    height: '6px',
                    backgroundColor: '#1e293b',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                        <div style={{
                      width: `${s.conversionRate}%`,
                      height: '100%',
                      backgroundColor: '#10b981'
                    }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px'
                }}>
                      {Object.keys(s.campaigns || {}).map(c => <span key={c} style={{
                    fontSize: '11px',
                    backgroundColor: '#0c121e',
                    border: '1px solid #1e293b',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: '#cbd5e1'
                  }}>
                          {c} ({s.campaigns[c]})
                        </span>)}
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {/* Lost Reasons Breakdown */}
        <div className="glass-card" style={{
        padding: '24px'
      }}>
          <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          margin: 0
        }}>Lost Deal Reasons Breakdown</h3>
          <p style={{
          fontSize: '12.5px',
          color: '#94a3b8',
          margin: '2px 0 16px 0'
        }}>
            Root-cause analytics for deals that did not convert
          </p>

          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
            {sourcesReport?.lostReasonsBreakdown && Object.keys(sourcesReport.lostReasonsBreakdown).length > 0 ? Object.entries(sourcesReport.lostReasonsBreakdown).map(([reason, count]) => <div key={reason} style={{
            padding: '12px 16px',
            backgroundColor: '#0c121e',
            borderRadius: '8px',
            border: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
                  <span style={{
              fontSize: '13.5px',
              color: '#f1f5f9'
            }}>{reason}</span>
                  <span className="badge" style={{
              backgroundColor: 'rgba(244, 63, 94, 0.2)',
              color: '#fda4af'
            }}>
                    {count} deals
                  </span>
                </div>) : <div style={{
            color: '#64748b',
            fontSize: '13px'
          }}>No lost deals recorded yet.</div>}
          </div>
        </div>
      </div>
    </div>;
}