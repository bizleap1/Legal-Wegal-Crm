'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, ChevronRight, ChevronLeft } from 'lucide-react';
import Topbar from '../../../components/Topbar';
import { api } from '../../../lib/api-client';
const STAGES = [{
  id: 'new',
  label: 'New',
  color: '#38bdf8'
}, {
  id: 'contacted',
  label: 'Contacted',
  color: '#818cf8'
}, {
  id: 'qualified',
  label: 'Qualified',
  color: '#c084fc'
}, {
  id: 'proposal',
  label: 'Proposal / Meeting',
  color: '#fbbf24'
}, {
  id: 'won',
  label: 'Won',
  color: '#34d399'
}, {
  id: 'lost',
  label: 'Lost',
  color: '#f87171'
}];
export default function PipelinePage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadPipelineLeads();
  }, []);
  const loadPipelineLeads = async () => {
    try {
      const res = await api.getLeads({
        limit: 100
      });
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to load pipeline leads', err);
    } finally {
      setLoading(false);
    }
  };
  const handleMoveStage = async (leadId, currentStage, direction) => {
    const stageIdx = STAGES.findIndex(s => s.id === currentStage);
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
  return <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }}>
      <Topbar title="Sales Pipeline Kanban" subtitle="Manage deal stages from inbound intake to Won engagement" />

      <div style={{
      padding: '24px 32px',
      flex: 1,
      overflowX: 'auto'
    }}>
        <div style={{
        display: 'flex',
        gap: '16px',
        minWidth: '1200px',
        height: 'calc(100vh - 140px)'
      }}>
          {STAGES.map(stage => {
          const stageLeads = leads.filter(l => l.status === stage.id);
          return <div key={stage.id} style={{
            flex: 1,
            minWidth: '220px',
            backgroundColor: '#0c121e',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
                {/* Stage Header */}
                <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#111726'
            }}>
                  <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                    <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: stage.color
                }} />
                    <span style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#f8fafc'
                }}>{stage.label}</span>
                  </div>
                  <span style={{
                fontSize: '11.5px',
                fontWeight: 700,
                backgroundColor: '#1e293b',
                color: '#cbd5e1',
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div style={{
              padding: '12px',
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
                  {stageLeads.map(lead => <div key={lead.id} className="glass-card" style={{
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                      <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between'
                }}>
                        <Link href={`/leads/${lead.id}`} style={{
                    fontWeight: 600,
                    color: '#ffffff',
                    fontSize: '13.5px'
                  }}>
                          {lead.firstName} {lead.lastName}
                        </Link>
                        <span className={`priority-${lead.priority}`} style={{
                    fontSize: '11px',
                    textTransform: 'capitalize'
                  }}>
                          ● {lead.priority}
                        </span>
                      </div>

                      {lead.company && <div style={{
                  fontSize: '11.5px',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                          <Building2 size={12} color="#64748b" />
                          <span>{lead.company}</span>
                        </div>}

                      <p style={{
                  fontSize: '12px',
                  color: '#cbd5e1',
                  margin: '2px 0',
                  lineHeight: 1.35,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                        {lead.requirement || 'No notes available'}
                      </p>

                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '4px',
                  paddingTop: '8px',
                  borderTop: '1px solid #1e293b'
                }}>
                        <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    color: '#a5b4fc',
                    textTransform: 'uppercase'
                  }}>
                          {lead.sourceType}
                        </span>

                        {/* Stage Shift Controls */}
                        <div style={{
                    display: 'flex',
                    gap: '4px'
                  }}>
                          {stage.id !== 'new' && <button onClick={() => handleMoveStage(lead.id, stage.id, 'prev')} title="Move back" style={{
                      background: '#1e293b',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      padding: '3px 6px'
                    }}>
                              <ChevronLeft size={13} />
                            </button>}
                          {stage.id !== 'lost' && stage.id !== 'won' && <button onClick={() => handleMoveStage(lead.id, stage.id, 'next')} title="Advance to next stage" style={{
                      background: 'rgba(99, 102, 241, 0.3)',
                      border: 'none',
                      color: '#c7d2fe',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      padding: '3px 6px'
                    }}>
                              <ChevronRight size={13} />
                            </button>}
                        </div>
                      </div>
                    </div>)}

                  {stageLeads.length === 0 && <div style={{
                padding: '24px 12px',
                textAlign: 'center',
                color: '#475569',
                fontSize: '12px'
              }}>
                      No deals in {stage.label}
                    </div>}
                </div>
              </div>;
        })}
        </div>
      </div>
    </div>;
}