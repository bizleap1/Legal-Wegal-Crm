'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, ChevronRight, ChevronLeft } from 'lucide-react';
import Topbar from '../../../components/Topbar';
import { api } from '../../../lib/api-client';

const STAGES = [
  { id: 'new', label: 'New', color: '#0284c7' },
  { id: 'contacted', label: 'Contacted', color: '#4338ca' },
  { id: 'qualified', label: 'Qualified', color: '#7e22ce' },
  { id: 'proposal', label: 'Proposal / Meeting', color: '#d97706' },
  { id: 'won', label: 'Won', color: '#059669' },
  { id: 'lost', label: 'Lost', color: '#e11d48' }
];

export default function PipelinePage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipelineLeads();
  }, []);

  const loadPipelineLeads = async () => {
    try {
      const res = await api.getLeads({ limit: 100 });
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to load pipeline leads', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStage = async (leadId, currentStage, direction) => {
    const stageIdx = STAGES.findIndex((s) => s.id === currentStage);
    if (stageIdx === -1) return;
    const newIdx = direction === 'next' ? stageIdx + 1 : stageIdx - 1;
    if (newIdx < 0 || newIdx >= STAGES.length) return;

    const targetStage = STAGES[newIdx].id;
    let lostReason = undefined;
    if (targetStage === 'lost') {
      lostReason = prompt('Enter lost reason:') || 'Budget / timing constraints';
    }

    try {
      await api.updateLead(leadId, {
        status: targetStage,
        lostReason
      });
      loadPipelineLeads();
    } catch (err) {
      alert(err.message || 'Failed to update pipeline stage');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Topbar
        title="Sales Pipeline Kanban"
        subtitle="Manage deal stages from inbound intake to Won engagement"
      />

      <div style={{ padding: '24px 32px', flex: 1, overflowX: 'auto' }}>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            minWidth: '1200px',
            height: 'calc(100vh - 140px)'
          }}
        >
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.status === stage.id);
            return (
              <div
                key={stage.id}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                {/* Stage Header */}
                <div
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: stage.color
                      }}
                    />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#09090b' }}>
                      {stage.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}
                  >
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div
                  style={{
                    padding: '12px',
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="card-clean"
                      style={{
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Link
                          href={`/leads/${lead.id}`}
                          style={{
                            fontWeight: 600,
                            color: '#09090b',
                            fontSize: '13.5px'
                          }}
                        >
                          {lead.firstName} {lead.lastName}
                        </Link>
                        <span
                          className={`priority-${lead.priority}`}
                          style={{ fontSize: '11px', textTransform: 'capitalize' }}
                        >
                          ● {lead.priority}
                        </span>
                      </div>

                      {lead.company && (
                        <div
                          style={{
                            fontSize: '11.5px',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Building2 size={12} color="#94a3b8" />
                          <span>{lead.company}</span>
                        </div>
                      )}

                      <p
                        style={{
                          fontSize: '12px',
                          color: '#475569',
                          margin: '2px 0',
                          lineHeight: 1.35,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {lead.requirement || 'No notes available'}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '4px',
                          paddingTop: '8px',
                          borderTop: '1px solid #f1f5f9'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#e0e7ff',
                            color: '#4338ca',
                            textTransform: 'uppercase'
                          }}
                        >
                          {lead.sourceType}
                        </span>

                        {/* Stage Shift Controls */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleMoveStage(lead.id, stage.id, 'prev')}
                            disabled={stage.id === STAGES[0].id}
                            title="Move back"
                            style={{
                              padding: '3px',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0',
                              backgroundColor: '#ffffff',
                              color: '#64748b',
                              cursor: stage.id === STAGES[0].id ? 'not-allowed' : 'pointer',
                              opacity: stage.id === STAGES[0].id ? 0.3 : 1
                            }}
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveStage(lead.id, stage.id, 'next')}
                            disabled={stage.id === STAGES[STAGES.length - 1].id}
                            title="Advance stage"
                            style={{
                              padding: '3px',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0',
                              backgroundColor: '#ffffff',
                              color: '#64748b',
                              cursor:
                                stage.id === STAGES[STAGES.length - 1].id
                                  ? 'not-allowed'
                                  : 'pointer',
                              opacity:
                                stage.id === STAGES[STAGES.length - 1].id ? 0.3 : 1
                            }}
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div
                      style={{
                        padding: '28px 12px',
                        textAlign: 'center',
                        color: '#94a3b8',
                        fontSize: '12px'
                      }}
                    >
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}