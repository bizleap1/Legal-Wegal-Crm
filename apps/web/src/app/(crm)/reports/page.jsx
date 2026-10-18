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
      const [srcRes, ovRes] = await Promise.all([
        api.getSourcesReport(),
        api.getOverviewReport()
      ]);
      setSourcesReport(srcRes.data);
      setOverview(ovRes.data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Topbar
        title="Reports & Analytics"
        subtitle="Attribution conversion rates, response-time SLAs, and campaign ROI metrics"
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* KPI Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}
        >
          <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Lead-to-Won Conversion
            </span>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#059669',
                margin: '6px 0 2px',
                letterSpacing: '-0.02em'
              }}
            >
              {overview?.conversionRate ?? 16.7}%
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Industry benchmark: 12-15%
            </span>
          </div>

          <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Avg Response Time SLA
            </span>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#0284c7',
                margin: '6px 0 2px',
                letterSpacing: '-0.02em'
              }}
            >
              {overview?.avgResponseTimeMinutes ?? 14.5}m
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Within 60m SLA target
            </span>
          </div>

          <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Inbound Leads
            </span>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#4338ca',
                margin: '6px 0 2px',
                letterSpacing: '-0.02em'
              }}
            >
              {overview?.totalLeads ?? 6}
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Across Meta, Web, & Search
            </span>
          </div>

          <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Engagements Won
            </span>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#d97706',
                margin: '6px 0 2px',
                letterSpacing: '-0.02em'
              }}
            >
              {overview?.wonCount ?? 1}
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Retainer & corporate clients
            </span>
          </div>
        </div>

        {/* Source & Campaign Performance Table */}
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
                Attribution Source Performance
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
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
              {sourcesReport?.sources?.map((s) => (
                <tr key={s.source}>
                  <td>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor:
                          s.source === 'meta'
                            ? '#dbeafe'
                            : s.source === 'website'
                            ? '#d1fae5'
                            : s.source === 'google_ads'
                            ? '#fef3c7'
                            : '#f1f5f9',
                        color:
                          s.source === 'meta'
                            ? '#1d4ed8'
                            : s.source === 'website'
                            ? '#047857'
                            : s.source === 'google_ads'
                            ? '#b45309'
                            : '#475569',
                        textTransform: 'uppercase'
                      }}
                    >
                      {s.source}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#09090b' }}>{s.total}</td>
                  <td style={{ color: '#059669', fontWeight: 600 }}>{s.won}</td>
                  <td style={{ color: '#e11d48' }}>{s.lost}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#09090b',
                          minWidth: '40px'
                        }}
                      >
                        {s.conversionRate}%
                      </span>
                      <div
                        style={{
                          width: '100px',
                          height: '6px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            width: `${s.conversionRate}%`,
                            height: '100%',
                            backgroundColor: '#059669'
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {Object.keys(s.campaigns || {}).map((c) => (
                        <span
                          key={c}
                          style={{
                            fontSize: '11px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            color: '#475569'
                          }}
                        >
                          {c} ({s.campaigns[c]})
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lost Reasons Breakdown */}
        <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: 0 }}>
            Lost Deal Reasons Breakdown
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 16px 0' }}>
            Root-cause analytics for deals that did not convert
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sourcesReport?.lostReasonsBreakdown &&
            Object.keys(sourcesReport.lostReasonsBreakdown).length > 0 ? (
              Object.entries(sourcesReport.lostReasonsBreakdown).map(([reason, count]) => (
                <div
                  key={reason}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '13.5px', color: '#09090b' }}>{reason}</span>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: '#ffe4e6',
                      color: '#be123c',
                      border: '1px solid #fecdd3'
                    }}
                  >
                    {count} deals
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                No lost deals recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}