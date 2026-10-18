'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, CheckCircle2, Building2, Mail, Phone, ArrowRight, X } from 'lucide-react';
import Topbar from '../../../components/Topbar';
import { api } from '../../../lib/api-client';
export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Lead Form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    requirement: '',
    priority: 'medium',
    status: 'new',
    sourceType: 'manual',
    campaignName: '',
    consentStatus: 'consented'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    loadLeads();
  }, [statusFilter, sourceFilter]);
  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await api.getLeads({
        search,
        status: statusFilter,
        source: sourceFilter
      });
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to load leads', err);
    } finally {
      setLoading(false);
    }
  };
  const handleSearchSubmit = e => {
    e.preventDefault();
    loadLeads();
  };
  const handleCreateLead = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.createLead(form);
      setIsModalOpen(false);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        requirement: '',
        priority: 'medium',
        status: 'new',
        sourceType: 'manual',
        campaignName: '',
        consentStatus: 'consented'
      });
      loadLeads();
    } catch (err) {
      setError(err.message || 'Failed to create lead');
    } finally {
      setSubmitting(false);
    }
  };
  return <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }}>
      <Topbar title="Unified Leads Management" subtitle="Inbound leads from Meta Ads, website forms, Google Ads, and manual inquiries" onNewLeadClick={() => setIsModalOpen(true)} />

      <div style={{
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
        {/* Filter Controls Bar */}
        <div className="glass-card" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
          minWidth: '260px'
        }}>
            <div style={{
            position: 'relative',
            width: '100%'
          }}>
              <Search size={16} color="#64748b" style={{
              position: 'absolute',
              left: '12px',
              top: '11px'
            }} />
              <input type="text" className="input" placeholder="Search leads by name, email, phone, company..." value={search} onChange={e => setSearch(e.target.value)} style={{
              paddingLeft: '38px',
              height: '38px'
            }} />
            </div>
            <button type="submit" className="btn btn-secondary" style={{
            height: '38px'
          }}>
              Search
            </button>
          </form>

          {/* Filter Dropdowns */}
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
            <select className="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
            width: '140px',
            height: '38px'
          }}>
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="nurture">Nurture</option>
            </select>

            <select className="select" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} style={{
            width: '140px',
            height: '38px'
          }}>
              <option value="">All Sources</option>
              <option value="meta">Meta Ads</option>
              <option value="website">Website Form</option>
              <option value="google_ads">Google Ads</option>
              <option value="manual">Direct / Manual</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="glass-card" style={{
        overflow: 'hidden'
      }}>
          <table className="crm-table">
            <thead>
              <tr>
                <th>Lead & Company</th>
                <th>Contact Details</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Source Attribution</th>
                <th>Assigned Owner</th>
                <th>Next Action</th>
                <th style={{
                textAlign: 'right'
              }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr>
                  <td colSpan={8} style={{
                textAlign: 'center',
                padding: '40px',
                color: '#94a3b8'
              }}>
                    Loading leads database...
                  </td>
                </tr> : leads.length === 0 ? <tr>
                  <td colSpan={8} style={{
                textAlign: 'center',
                padding: '40px',
                color: '#94a3b8'
              }}>
                    No leads found matching your criteria.
                  </td>
                </tr> : leads.map(lead => <tr key={lead.id}>
                    <td>
                      <Link href={`/leads/${lead.id}`} style={{
                  fontWeight: 600,
                  color: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                        <span>{lead.firstName} {lead.lastName}</span>
                      </Link>
                      {lead.company && <div style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '2px'
                }}>
                          <Building2 size={12} color="#64748b" />
                          <span>{lead.company}</span>
                        </div>}
                    </td>
                    <td>
                      <div style={{
                  fontSize: '12.5px',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                        <Phone size={12} color="#64748b" />
                        <span>{lead.phoneE164}</span>
                      </div>
                      <div style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginTop: '2px'
                }}>
                        <Mail size={12} color="#64748b" />
                        <span>{lead.emailNormalized}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${lead.status}`}>{lead.status}</span>
                    </td>
                    <td>
                      <span className={`priority-${lead.priority}`} style={{
                  textTransform: 'capitalize',
                  fontSize: '12.5px'
                }}>
                        ● {lead.priority}
                      </span>
                    </td>
                    <td>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                        <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    backgroundColor: lead.sourceType === 'meta' ? 'rgba(24, 119, 242, 0.2)' : lead.sourceType === 'website' ? 'rgba(16, 185, 129, 0.2)' : lead.sourceType === 'google_ads' ? 'rgba(234, 67, 53, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                    color: lead.sourceType === 'meta' ? '#60a5fa' : lead.sourceType === 'website' ? '#34d399' : lead.sourceType === 'google_ads' ? '#f87171' : '#cbd5e1',
                    textTransform: 'uppercase'
                  }}>
                          {lead.sourceType}
                        </span>
                        {lead.consentStatus === 'consented' && <span title="Consent verified" style={{
                    color: '#10b981',
                    display: 'flex'
                  }}>
                            <CheckCircle2 size={13} />
                          </span>}
                      </div>
                    </td>
                    <td>
                      <div style={{
                  fontSize: '13px',
                  color: '#e2e8f0'
                }}>{lead.owner?.name || 'Unassigned'}</div>
                      <span style={{
                  fontSize: '11px',
                  color: '#64748b',
                  textTransform: 'capitalize'
                }}>
                        {lead.owner?.role || 'Round-robin pending'}
                      </span>
                    </td>
                    <td>
                      <div style={{
                  fontSize: '12px',
                  color: '#cbd5e1'
                }}>
                        {lead.nextFollowupAt ? new Date(lead.nextFollowupAt).toLocaleDateString() : 'None scheduled'}
                      </div>
                    </td>
                    <td style={{
                textAlign: 'right'
              }}>
                      <Link href={`/leads/${lead.id}`} className="btn btn-secondary" style={{
                  padding: '5px 10px',
                  fontSize: '12px'
                }}>
                        <span>Details</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Lead Modal */}
      {isModalOpen && <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
              <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            margin: 0
          }}>Add Inbound Lead</h3>
              <button onClick={() => setIsModalOpen(false)} style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
              {error && <div style={{
            padding: '10px',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            color: '#fda4af',
            borderRadius: '8px',
            fontSize: '13px'
          }}>
                  {error}
                </div>}

              <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px'
          }}>
                <div>
                  <label className="label">First Name *</label>
                  <input type="text" className="input" value={form.firstName} onChange={e => setForm({
                ...form,
                firstName: e.target.value
              })} required />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input type="text" className="input" value={form.lastName} onChange={e => setForm({
                ...form,
                lastName: e.target.value
              })} />
                </div>
              </div>

              <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px'
          }}>
                <div>
                  <label className="label">Email Address *</label>
                  <input type="email" className="input" value={form.email} onChange={e => setForm({
                ...form,
                email: e.target.value
              })} required />
                </div>
                <div>
                  <label className="label">Phone (E.164) *</label>
                  <input type="text" className="input" placeholder="+919876543210" value={form.phone} onChange={e => setForm({
                ...form,
                phone: e.target.value
              })} required />
                </div>
              </div>

              <div>
                <label className="label">Company / Firm Name</label>
                <input type="text" className="input" value={form.company} onChange={e => setForm({
              ...form,
              company: e.target.value
            })} />
              </div>

              <div>
                <label className="label">Legal Advisory Requirement</label>
                <textarea className="textarea" rows={2} placeholder="e.g. Trademark Class 35 registration, Founder Agreement..." value={form.requirement} onChange={e => setForm({
              ...form,
              requirement: e.target.value
            })} />
              </div>

              <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px'
          }}>
                <div>
                  <label className="label">Source Channel</label>
                  <select className="select" value={form.sourceType} onChange={e => setForm({
                ...form,
                sourceType: e.target.value
              })}>
                    <option value="manual">Manual Entry / Call</option>
                    <option value="meta">Meta Ads Form</option>
                    <option value="website">Website Intake</option>
                    <option value="google_ads">Google Ads</option>
                  </select>
                </div>
                <div>
                  <label className="label">Priority</label>
                  <select className="select" value={form.priority} onChange={e => setForm({
                ...form,
                priority: e.target.value
              })}>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '4px'
          }}>
                <input type="checkbox" id="consent" checked={form.consentStatus === 'consented'} onChange={e => setForm({
              ...form,
              consentStatus: e.target.checked ? 'consented' : 'pending'
            })} />
                <label htmlFor="consent" style={{
              fontSize: '12.5px',
              color: '#94a3b8'
            }}>
                  Consent verified: Contact agreed to receiving advisory updates via WhatsApp and Email
                </label>
              </div>

              <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '12px'
          }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Ingest Lead & Start Sequence'}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
}