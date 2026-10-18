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
      const [rulesRes, tplRes, usersRes, intRes] = await Promise.all([
        api.getRules(),
        api.getTemplates(),
        api.getUsers(),
        api.getIntegrations()
      ]);
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
      await api.updateRule(ruleId, { enabled: !currentEnabled });
      loadSettingsData();
    } catch (err) {
      alert(err.message || 'Failed to update rule');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Topbar
        title="Settings & Governance"
        subtitle="Configure follow-up sequence automation rules, approved templates, roles, and provider health"
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '12px'
          }}
        >
          {[
            { id: 'rules', label: 'Automation Rules (Day 0-29)', icon: Sliders },
            { id: 'templates', label: 'Message Templates', icon: MessageSquare },
            { id: 'users', label: 'Team & RBAC Roles', icon: Users },
            { id: 'integrations', label: 'Provider Health', icon: Zap }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid #09090b' : '1px solid transparent',
                  backgroundColor: isSelected ? '#09090b' : 'transparent',
                  color: isSelected ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: isSelected ? 600 : 500,
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} color={isSelected ? '#ffffff' : '#94a3b8'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Automation Rules */}
        {activeTab === 'rules' && (
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
                  Follow-up Sequence Automation Rules
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
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
                  <th style={{ textAlign: 'right' }}>Toggle</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#09090b' }}>{rule.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Trigger: {rule.triggerType}
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: '#e0e7ff',
                          color: '#4338ca',
                          border: '1px solid #c7d2fe'
                        }}
                      >
                        Day {rule.offsetDays} ({rule.offsetDays === 0 ? 'Instant' : `+${rule.offsetDays * 24} hrs`})
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          textTransform: 'uppercase',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: '#334155'
                        }}
                      >
                        {rule.channel}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: rule.stopOnReply ? '#059669' : '#94a3b8', fontSize: '12.5px', fontWeight: 500 }}>
                        {rule.stopOnReply ? '✓ Enabled' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: rule.businessHoursOnly ? '#059669' : '#94a3b8', fontSize: '12.5px', fontWeight: 500 }}>
                        {rule.businessHoursOnly ? '✓ 9am - 7pm' : 'Anytime'}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: rule.enabled ? '#d1fae5' : '#f1f5f9',
                          color: rule.enabled ? '#047857' : '#64748b',
                          border: rule.enabled ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
                        }}
                      >
                        {rule.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleRule(rule.id, rule.enabled)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: rule.enabled ? '#059669' : '#94a3b8'
                        }}
                      >
                        {rule.enabled ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Message Templates */}
        {activeTab === 'templates' && (
          <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: '0 0 16px 0' }}>
              Approved Message Templates
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '16px'
              }}
            >
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#09090b' }}>
                      {tpl.name}
                    </span>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: '#d1fae5',
                        color: '#047857',
                        border: '1px solid #a7f3d0'
                      }}
                    >
                      {tpl.approvalStatus}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        border: '1px solid #c7d2fe'
                      }}
                    >
                      Channel: {tpl.channel}
                    </span>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      Lang: {tpl.language}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12.5px',
                      color: '#334155',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.45
                    }}
                  >
                    {tpl.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Users & Roles */}
        {activeTab === 'users' && (
          <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: '0 0 16px 0' }}>
              Sales Team & Role Permissions (1-5 Users)
            </h3>
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
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: '#09090b' }}>{u.name}</span>
                    </td>
                    <td>
                      <span style={{ color: '#475569' }}>{u.email}</span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            u.role === 'admin'
                              ? '#fee2e2'
                              : u.role === 'manager'
                              ? '#fef3c7'
                              : '#e0f2fe',
                          color:
                            u.role === 'admin'
                              ? '#b91c1c'
                              : u.role === 'manager'
                              ? '#b45309'
                              : '#0369a1',
                          border:
                            u.role === 'admin'
                              ? '1px solid #fecaca'
                              : u.role === 'manager'
                              ? '1px solid #fde68a'
                              : '1px solid #bae6fd'
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {u.role === 'admin'
                          ? 'Full Control, Integrations, Audit Logs, Settings'
                          : u.role === 'manager'
                          ? 'All Leads, Reassignment, Team Pipeline, Reports'
                          : 'Assigned Leads Only, Log Calls/Notes, Complete Tasks'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: u.isActive ? '#059669' : '#e11d48', fontSize: '12px', fontWeight: 600 }}>
                        {u.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Provider Health */}
        {activeTab === 'integrations' && (
          <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#09090b', margin: '0 0 16px 0' }}>
              Connected External Inbound Services
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px'
              }}
            >
              {integrations.map((acc) => (
                <div
                  key={acc.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#09090b',
                        textTransform: 'capitalize'
                      }}
                    >
                      {acc.provider}
                    </span>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: '#d1fae5',
                        color: '#047857',
                        border: '1px solid #a7f3d0'
                      }}
                    >
                      {acc.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#334155' }}>{acc.accountLabel}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                    Last Verified Sync: {acc.lastSuccessAt ? new Date(acc.lastSuccessAt).toLocaleString() : 'Active'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}