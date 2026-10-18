'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Mail, Phone, Calendar, User, Clock, PhoneCall, MessageSquare, FileText, Send, Shield } from 'lucide-react';
import Topbar from '../../../../components/Topbar';
import { api } from '../../../../lib/api-client';
export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Activity logger tab & form
  const [activityType, setActivityType] = useState('note');
  const [activitySubject, setActivitySubject] = useState('');
  const [activityBody, setActivityBody] = useState('');
  const [submittingAct, setSubmittingAct] = useState(false);
  useEffect(() => {
    loadLeadData();
  }, [id]);
  const loadLeadData = async () => {
    try {
      const [leadRes, actRes, usersRes] = await Promise.all([api.getLead(id), api.getLeadActivities(id), api.getUsers()]);
      setLead(leadRes.data);
      setActivities(actRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load lead details', err);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async newStatus => {
    try {
      let lostReason = undefined;
      if (newStatus === 'lost') {
        lostReason = prompt('Enter reason for losing this lead:') || 'Client chose competitor';
      }
      const res = await api.updateLead(id, {
        status: newStatus,
        lostReason
      });
      setLead(res.data);
      // Reload activities to reflect status change event
      const actRes = await api.getLeadActivities(id);
      setActivities(actRes.data);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };
  const handleOwnerChange = async newOwnerId => {
    try {
      const res = await api.assignLead(id, newOwnerId);
      setLead(res.data);
      const actRes = await api.getLeadActivities(id);
      setActivities(actRes.data);
    } catch (err) {
      alert(err.message || 'Failed to assign owner');
    }
  };
  const handleToggleOptOut = async () => {
    const isOptedOut = Boolean(lead?.doNotContactAt);
    const confirm = window.confirm(isOptedOut ? 'Re-enable outreach for this lead?' : 'Are you sure you want to opt-out this lead? All pending automated WhatsApp and email messages will be halted.');
    if (!confirm) return;
    try {
      const res = await api.updateLead(id, {
        consentStatus: isOptedOut ? 'consented' : 'revoked',
        doNotContactAt: isOptedOut ? null : new Date().toISOString()
      });
      setLead(res.data);
    } catch (err) {
      alert(err.message || 'Failed to update opt-out status');
    }
  };
  const handleAddActivity = async e => {
    e.preventDefault();
    if (!activityBody.trim()) return;
    setSubmittingAct(true);
    try {
      await api.addLeadActivity(id, {
        activityType,
        direction: 'outbound',
        subject: activitySubject || `${activityType.toUpperCase()} Logged`,
        body: activityBody
      });
      setActivitySubject('');
      setActivityBody('');
      const actRes = await api.getLeadActivities(id);
      setActivities(actRes.data);
    } catch (err) {
      alert(err.message || 'Failed to log activity');
    } finally {
      setSubmittingAct(false);
    }
  };
  if (loading) {
    return <div style={{
      flex: 1,
      padding: '40px',
      textAlign: 'center',
      color: '#94a3b8'
    }}>
        Loading lead details...
      </div>;
  }
  if (!lead) {
    return <div style={{
      flex: 1,
      padding: '40px',
      textAlign: 'center',
      color: '#fda4af'
    }}>
        Lead not found. <Link href="/leads" style={{
        textDecoration: 'underline'
      }}>Back to Leads</Link>
      </div>;
  }
  return <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }}>
      <Topbar title={`${lead.firstName} ${lead.lastName}`} subtitle={lead.company ? `${lead.company} • Ingested via ${lead.sourceType.toUpperCase()}` : `Ingested via ${lead.sourceType.toUpperCase()}`} />

      <div style={{
      padding: '24px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
        {/* Back Link & Quick Actions Bar */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
          <Link href="/leads" className="btn btn-ghost" style={{
          padding: '6px 10px',
          fontSize: '13px'
        }}>
            <ArrowLeft size={16} />
            <span>Back to Leads</span>
          </Link>

          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
            {/* Status Selector */}
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
              <span style={{
              fontSize: '12.5px',
              color: '#94a3b8',
              fontWeight: 500
            }}>Stage:</span>
              <select className="select" value={lead.status} onChange={e => handleStatusChange(e.target.value)} style={{
              width: '130px',
              height: '36px',
              fontSize: '13px'
            }}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="nurture">Nurture</option>
              </select>
            </div>

            {/* Owner Reassignment */}
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
              <span style={{
              fontSize: '12.5px',
              color: '#94a3b8',
              fontWeight: 500
            }}>Owner:</span>
              <select className="select" value={lead.ownerUserId || ''} onChange={e => handleOwnerChange(e.target.value)} style={{
              width: '160px',
              height: '36px',
              fontSize: '13px'
            }}>
                {users.map(u => <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>)}
              </select>
            </div>

            {/* Opt-out Toggle Button */}
            <button onClick={handleToggleOptOut} className={`btn ${lead.doNotContactAt ? 'btn-secondary' : 'btn-danger'}`} style={{
            fontSize: '12px',
            padding: '6px 12px'
          }}>
              <Shield size={14} />
              <span>{lead.doNotContactAt ? 'Opted Out (Resume)' : 'Enforce Opt-Out'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Profile & Sequence vs Timeline */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: '24px'
      }}>
          {/* Left Column: Profile Card & Sequence */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
            {/* Profile Info */}
            <div className="glass-card" style={{
            padding: '22px'
          }}>
              <h3 style={{
              fontSize: '15px',
              fontWeight: 700,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
                <User size={16} color="#6366f1" />
                <span>Contact Details & Scope</span>
              </h3>

              <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
                <div>
                  <span className="label">Full Name</span>
                  <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffff'
                }}>
                    {lead.firstName} {lead.lastName}
                  </div>
                </div>

                <div>
                  <span className="label">Phone (E.164)</span>
                  <div style={{
                  fontSize: '13.5px',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                    <Phone size={14} />
                    <span>{lead.phoneE164}</span>
                  </div>
                </div>

                <div>
                  <span className="label">Normalized Email</span>
                  <div style={{
                  fontSize: '13.5px',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                    <Mail size={14} />
                    <span>{lead.emailNormalized}</span>
                  </div>
                </div>

                {lead.company && <div>
                    <span className="label">Organization / Entity</span>
                    <div style={{
                  fontSize: '13.5px',
                  color: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                      <Building2 size={14} color="#64748b" />
                      <span>{lead.company}</span>
                    </div>
                  </div>}

                <div>
                  <span className="label">Legal Requirement</span>
                  <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#0c121e',
                  borderRadius: '8px',
                  border: '1px solid #1e293b',
                  fontSize: '13px',
                  color: '#e2e8f0',
                  lineHeight: 1.4
                }}>
                    {lead.requirement || 'No specific requirement stated.'}
                  </div>
                </div>

                <div>
                  <span className="label">Attribution & Consent</span>
                  <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginTop: '4px'
                }}>
                    <span className="badge" style={{
                    backgroundColor: 'rgba(24, 119, 242, 0.2)',
                    color: '#60a5fa'
                  }}>
                      Source: {lead.sourceType}
                    </span>
                    <span className="badge" style={{
                    backgroundColor: lead.consentStatus === 'consented' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                    color: lead.consentStatus === 'consented' ? '#34d399' : '#fda4af'
                  }}>
                      Consent: {lead.consentStatus}
                    </span>
                    {lead.campaign && <span className="badge" style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    color: '#a5b4fc'
                  }}>
                        {lead.campaign.campaignName}
                      </span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Follow-up Sequence Card (Day 0, 1, 2, 5, 12, 21, 29) */}
            <div className="glass-card" style={{
            padding: '22px'
          }}>
              <h3 style={{
              fontSize: '15px',
              fontWeight: 700,
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
                <Calendar size={16} color="#10b981" />
                <span>Follow-up Sequence Schedule</span>
              </h3>

              <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
                {lead.followupTasks && lead.followupTasks.length > 0 ? lead.followupTasks.map((t, idx) => <div key={t.id} style={{
                padding: '10px 12px',
                backgroundColor: '#0c121e',
                borderRadius: '8px',
                border: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                        <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: t.status === 'completed' ? '#10b981' : t.status === 'cancelled' ? '#64748b' : '#334155',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                          {idx + 1}
                        </span>
                        <div>
                          <div style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#f1f5f9'
                    }}>
                            {t.outcome || `${t.taskType.toUpperCase()} Task`}
                          </div>
                          <div style={{
                      fontSize: '11px',
                      color: '#94a3b8'
                    }}>
                            Due: {new Date(t.dueAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className="badge" style={{
                  backgroundColor: t.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : t.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                  color: t.status === 'completed' ? '#34d399' : t.status === 'pending' ? '#fde68a' : '#cbd5e1'
                }}>
                        {t.status}
                      </span>
                    </div>) : <div style={{
                fontSize: '12.5px',
                color: '#64748b'
              }}>No follow-up sequence created.</div>}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Log Activity & Chronological Timeline */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
            {/* Log Activity Card */}
            <div className="glass-card" style={{
            padding: '20px'
          }}>
              <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '16px'
            }}>
                {[{
                key: 'note',
                label: 'Internal Note',
                icon: FileText
              }, {
                key: 'call',
                label: 'Call Log',
                icon: PhoneCall
              }, {
                key: 'meeting',
                label: 'Meeting Note',
                icon: Clock
              }, {
                key: 'whatsapp',
                label: 'WhatsApp Outreach',
                icon: MessageSquare
              }].map(tab => {
                const Icon = tab.icon;
                const isSelected = activityType === tab.key;
                return <button key={tab.key} type="button" onClick={() => setActivityType(tab.key)} style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid #1e293b',
                  backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.15)' : '#0c121e',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  fontWeight: isSelected ? 600 : 500
                }}>
                      <Icon size={14} color={isSelected ? '#818cf8' : '#64748b'} />
                      <span>{tab.label}</span>
                    </button>;
              })}
              </div>

              <form onSubmit={handleAddActivity} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
                <input type="text" className="input" placeholder="Subject / Summary (e.g. Discovery call regarding trademark filing)..." value={activitySubject} onChange={e => setActivitySubject(e.target.value)} />
                <textarea className="textarea" rows={3} placeholder="Enter detailed notes, conversation summary, client requirements, or next steps..." value={activityBody} onChange={e => setActivityBody(e.target.value)} required />
                <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                  <button type="submit" className="btn btn-primary" style={{
                  padding: '8px 16px'
                }} disabled={submittingAct}>
                    <Send size={14} />
                    <span>{submittingAct ? 'Logging...' : 'Post to Lead Timeline'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Chronological Timeline */}
            <div className="glass-card" style={{
            padding: '24px'
          }}>
              <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '20px'
            }}>
                Activity & Audit History
              </h3>

              <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
                {activities.map(act => <div key={act.id} style={{
                display: 'flex',
                gap: '14px',
                paddingBottom: '16px',
                borderBottom: '1px solid #1e293b'
              }}>
                    <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: act.activityType === 'call' ? 'rgba(59, 130, 246, 0.2)' : act.activityType === 'whatsapp' ? 'rgba(16, 185, 129, 0.2)' : act.activityType === 'status_change' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                      {act.activityType === 'call' ? <PhoneCall size={14} color="#60a5fa" /> : act.activityType === 'whatsapp' ? <MessageSquare size={14} color="#34d399" /> : <FileText size={14} color="#a5b4fc" />}
                    </div>

                    <div style={{
                  flex: 1
                }}>
                      <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                        <span style={{
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#ffffff'
                    }}>{act.subject}</span>
                        <span style={{
                      fontSize: '11.5px',
                      color: '#64748b'
                    }}>
                          {new Date(act.occurredAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{
                    fontSize: '13px',
                    color: '#cbd5e1',
                    margin: '4px 0 6px 0',
                    lineHeight: 1.45
                  }}>
                        {act.body}
                      </p>
                      {act.actor && <span style={{
                    fontSize: '11px',
                    color: '#94a3b8'
                  }}>
                          Recorded by: <strong style={{
                      color: '#e2e8f0'
                    }}>{act.actor.name}</strong> ({act.actor.role})
                        </span>}
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}