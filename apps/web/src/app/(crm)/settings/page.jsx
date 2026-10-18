'use client';

import React, { useEffect, useState } from 'react';
import { Sliders, Users, MessageSquare, ToggleLeft, ToggleRight, Zap } from 'lucide-react';
import Topbar from '../../../components/Topbar';
import { api } from '../../../lib/api-client';
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('rules');
  const [rules, setRules] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadSettingsData();
  }, []);
  const loadSettingsData = async () => {
    setLoading(true);
    try {
      const [rulesRes, tplRes, usersRes, intRes] = await Promise.all([api.getRules(), api.getTemplates(), api.getUsers(), api.getIntegrations()]);
      setRules(rulesRes.data);
      setTemplates(tplRes.data);
      setUsers(usersRes.data);
      setIntegrations(intRes.data);
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };
  const handleToggleRule = async (ruleId, currentEnabled) => {
    try {
      await api.updateRule(ruleId, {
        enabled: !currentEnabled
      });
      loadSettingsData();
    } catch (err) {
      alert(err.message || 'Failed to update rule');
    }
  };
  return <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }}>
      <Topbar title="Settings & Governance" subtitle="Configure follow-up sequence automation rules, approved templates, roles, and provider health" />

      <div style={{
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
        {/* Navigation Tabs */}
        <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '12px'
      }}>
          {[{
          id: 'rules',
          label: 'Automation Rules (Day 0-29)',
          icon: Sliders
        }, {
          id: 'templates',
          label: 'Message Templates',
          icon: MessageSquare
        }, {
          id: 'users',
          label: 'Team & RBAC Roles',
          icon: Users
        }, {
          id: 'integrations',
          label: 'Provider Health',
          icon: Zap
        }].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid transparent',
            backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: isSelected ? '#ffffff' : '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13.5px',
            fontWeight: isSelected ? 600 : 500
          }}>
                <Icon size={16} color={isSelected ? '#818cf8' : '#64748b'} />
                <span>{tab.label}</span>
              </button>;
        })}
        </div>

        {/* Tab 1: Automation Rules */}
        {activeTab === 'rules' && <div className="glass-card" style={{
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
            }}>Follow-up Sequence Automation Rules</h3>
                <p style={{
              fontSize: '12.5px',
              color: '#94a3b8',
              margin: '2px 0 0 0'
            }}>
                  Default offsets: Day 0, 1, 2, 5, 12, 21, and 29. Automatically halts on reply, won/lost, or opt-out.
                </p>
              </div>
            </div>

            <table className="crm-table">
              <thead>
                <tr>
                  <th>Rule Name & Action</th>
                  <th>Timeline Offset</th>
                  <th>Outreach Channel</th>
                  <th>Stop On Customer Reply</th>
                  <th>Business Hours Only</th>
                  <th>Status</th>
                  <th style={{
                textAlign: 'right'
              }}>Toggle</th>
                </tr>
              </thead>
              <tbody>
                {rules.map(rule => <tr key={rule.id}>
                    <td>
                      <div style={{
                  fontWeight: 600,
                  color: '#f8fafc'
                }}>{rule.name}</div>
                      <div style={{
                  fontSize: '11px',
                  color: '#64748b'
                }}>Trigger: {rule.triggerType}</div>
                    </td>
                    <td>
                      <span className="badge" style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  color: '#a5b4fc'
                }}>
                        Day {rule.offsetDays} ({rule.offsetDays === 0 ? 'Instant' : `+${rule.offsetDays * 24} hrs`})
                      </span>
                    </td>
                    <td>
                      <span style={{
                  textTransform: 'uppercase',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#cbd5e1'
                }}>
                        {rule.channel}
                      </span>
                    </td>
                    <td>
                      <span style={{
                  color: rule.stopOnReply ? '#34d399' : '#94a3b8',
                  fontSize: '12.5px'
                }}>
                        {rule.stopOnReply ? '✓ Enabled' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                  color: rule.businessHoursOnly ? '#34d399' : '#94a3b8',
                  fontSize: '12.5px'
                }}>
                        {rule.businessHoursOnly ? '✓ 9am - 7pm' : 'Anytime'}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{
                  backgroundColor: rule.enabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                  color: rule.enabled ? '#34d399' : '#cbd5e1'
                }}>
                        {rule.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{
                textAlign: 'right'
              }}>
                      <button onClick={() => handleToggleRule(rule.id, rule.enabled)} style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: rule.enabled ? '#10b981' : '#64748b'
                }}>
                        {rule.enabled ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>}

        {/* Tab 2: Message Templates */}
        {activeTab === 'templates' && <div className="glass-card" style={{
        padding: '24px'
      }}>
            <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          margin: '0 0 16px 0'
        }}>Approved Message Templates</h3>
            <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}>
              {templates.map(tpl => <div key={tpl.id} style={{
            backgroundColor: '#0c121e',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
                  <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
                    <span style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#f8fafc'
              }}>{tpl.name}</span>
                    <span className="badge" style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399'
              }}>
                      {tpl.approvalStatus}
                    </span>
                  </div>

                  <div style={{
              display: 'flex',
              gap: '6px'
            }}>
                    <span className="badge" style={{
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc'
              }}>
                      Channel: {tpl.channel}
                    </span>
                    <span className="badge" style={{
                backgroundColor: 'rgba(100, 116, 139, 0.2)',
                color: '#cbd5e1'
              }}>
                      Lang: {tpl.language}
                    </span>
                  </div>

                  <div style={{
              padding: '10px 12px',
              backgroundColor: '#111827',
              borderRadius: '8px',
              border: '1px solid #1f293d',
              fontSize: '12.5px',
              color: '#cbd5e1',
              whiteSpace: 'pre-line',
              lineHeight: 1.4
            }}>
                    {tpl.body}
                  </div>
                </div>)}
            </div>
          </div>}

        {/* Tab 3: Users & Roles */}
        {activeTab === 'users' && <div className="glass-card" style={{
        padding: '24px'
      }}>
            <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          margin: '0 0 16px 0'
        }}>Sales Team & Role Permissions (1-5 Users)</h3>
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Email</th>
                  <th>Assigned Role</th>
                  <th>Access Permissions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => <tr key={u.id}>
                    <td>
                      <span style={{
                  fontWeight: 600,
                  color: '#f8fafc'
                }}>{u.name}</span>
                    </td>
                    <td>
                      <span style={{
                  color: '#cbd5e1'
                }}>{u.email}</span>
                    </td>
                    <td>
                      <span className="badge" style={{
                  backgroundColor: u.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : u.role === 'manager' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                  color: u.role === 'admin' ? '#fca5a5' : u.role === 'manager' ? '#fde68a' : '#93c5fd'
                }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span style={{
                  fontSize: '12px',
                  color: '#94a3b8'
                }}>
                        {u.role === 'admin' ? 'Full Control, Integrations, Audit Logs, Settings' : u.role === 'manager' ? 'All Leads, Reassignment, Team Pipeline, Reports' : 'Assigned Leads Only, Log Calls/Notes, Complete Tasks'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                  color: u.isActive ? '#34d399' : '#f87171',
                  fontSize: '12px'
                }}>
                        {u.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>}

        {/* Tab 4: Provider Health */}
        {activeTab === 'integrations' && <div className="glass-card" style={{
        padding: '24px'
      }}>
            <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          margin: '0 0 16px 0'
        }}>Connected External Inbound Services</h3>
            <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
              {integrations.map(acc => <div key={acc.id} style={{
            backgroundColor: '#0c121e',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
                  <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
                    <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#f8fafc',
                textTransform: 'capitalize'
              }}>
                      {acc.provider}
                    </span>
                    <span className="badge" style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399'
              }}>
                      {acc.status}
                    </span>
                  </div>

                  <div style={{
              fontSize: '13px',
              color: '#cbd5e1'
            }}>{acc.accountLabel}</div>
                  <div style={{
              fontSize: '11.5px',
              color: '#64748b'
            }}>
                    Last Verified Sync: {acc.lastSuccessAt ? new Date(acc.lastSuccessAt).toLocaleString() : 'Active'}
                  </div>
                </div>)}
            </div>
          </div>}
      </div>
    </div>;
}