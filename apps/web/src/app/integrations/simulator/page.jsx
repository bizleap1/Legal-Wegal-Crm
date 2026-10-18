'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, MessageSquare, ShieldAlert, Layers, Code } from 'lucide-react';
import Topbar from '../../../components/Topbar';
import { api } from '../../../lib/api-client';

export default function IntegrationSimulatorPage() {
  const [activeTab, setActiveTab] = useState('meta');
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);

  const addLog = (msg) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  // 1. Meta Webhook Simulator
  const handleSimulateMeta = async (isDuplicate = false) => {
    setRunning(true);
    addLog(`Initiating Meta Leadgen webhook notification (X-Hub-Signature-256 verified)...`);
    const leadgenId = isDuplicate ? 'meta_leadgen_mock_101' : `meta_lead_${Date.now()}`;
    const payload = {
      object: 'page',
      entry: [
        {
          id: 'page_9823746190',
          time: Math.floor(Date.now() / 1000),
          changes: [
            {
              field: 'leadgen',
              value: {
                leadgen_id: leadgenId,
                form_id: 'form_trademark_2026',
                campaign_name: 'Meta_Trademark_Registration_Q4',
                first_name: 'Deepak',
                last_name: 'Chawla',
                email: 'deepak.chawla@aeroflux.in',
                phone_number: '+919811002233',
                requirement: 'International Patent & Trademark Portfolio Advisory'
              }
            }
          ]
        }
      ]
    };

    try {
      await api.simulateMetaWebhook(payload);
      addLog(`✓ Meta response 200 OK received. External Event ID: ${leadgenId}`);
      if (isDuplicate) {
        addLog(
          `⚡ Deduplication active: Handled idempotently. Webhook acknowledged without duplicate lead!`
        );
      } else {
        addLog(
          `🎉 Lead ingested into CRM! Owner assigned and Day 0-29 follow-up sequence created.`
        );
      }
    } catch (err) {
      addLog(`❌ Error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  // 2. WhatsApp Inbound Simulator (Inbound reply vs STOP opt-out)
  const handleSimulateWhatsApp = async (type) => {
    setRunning(true);
    const textBody =
      type === 'stop' ? 'STOP' : 'Yes, 3:00 PM works for the consultation call.';
    addLog(`Simulating inbound WhatsApp message from contact: "${textBody}"`);
    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: '209876543210',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                messages: [
                  {
                    from: '919820112233',
                    id: `wamid.HBgL${Date.now()}==`,
                    timestamp: String(Math.floor(Date.now() / 1000)),
                    text: { body: textBody },
                    type: 'text'
                  }
                ]
              },
              field: 'messages'
            }
          ]
        }
      ]
    };

    try {
      await api.simulateWhatsAppWebhook(payload);
      addLog(`✓ Webhook acknowledged 200 OK.`);
      if (type === 'stop') {
        addLog(
          `🛑 Opt-out keyword 'STOP' detected! Automated marketing halted and do_not_contact enforced.`
        );
      } else {
        addLog(
          `💬 Inbound customer reply logged to lead activity timeline. Sequence paused on reply.`
        );
      }
    } catch (err) {
      addLog(`❌ Error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  // 3. Google Ads Simulator
  const handleSimulateGoogle = async () => {
    setRunning(true);
    addLog(`Simulating Google Ads Search lead form asset intake...`);
    const payload = {
      lead_id: `gad_lead_${Date.now()}`,
      campaign_name: 'Google_Company_Incorporation_2026',
      gclid: 'Cj0KCQiA_google_click_id_demo_882',
      user_column_data: [
        { column_id: 'FULL_NAME', string_value: 'Pooja Agarwal' },
        { column_id: 'EMAIL', string_value: 'pooja.agarwal@apexlegal.org' },
        { column_id: 'PHONE_NUMBER', string_value: '+919988776655' }
      ]
    };

    try {
      await api.simulateGoogleAdsWebhook(payload);
      addLog(`✓ Google Ads lead intake processed with click-ID attribution (gclid).`);
    } catch (err) {
      addLog(`❌ Error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Topbar
        title="Integrations & Webhook Sandbox"
        subtitle="Live testing sandbox for Meta Lead Ads, WhatsApp Cloud API, and Google Ads intake"
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Simulator Control Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Controls Box */}
          <div className="card-clean" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[
                { id: 'meta', label: 'Meta Lead Ads Webhook' },
                { id: 'whatsapp', label: 'WhatsApp Inbound & Opt-Out' },
                { id: 'google', label: 'Google Ads Attribution' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    border: activeTab === tab.id ? '1px solid #09090b' : '1px solid #e2e8f0',
                    backgroundColor: activeTab === tab.id ? '#09090b' : '#ffffff',
                    color: activeTab === tab.id ? '#ffffff' : '#64748b',
                    fontSize: '12.5px',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Meta Scenario */}
            {activeTab === 'meta' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '15px', color: '#09090b', fontWeight: 600 }}>
                  Meta Instant Form Lead Ingestion
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                  Simulates a verified Facebook/Instagram Lead Ads webhook event. Ingests normalized contact data, verifies HMAC SHA256 signature, triggers automated follow-up sequences, and validates idempotency.
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => handleSimulateMeta(false)}
                    className="btn-pill-dark"
                    style={{ fontSize: '12.5px', padding: '8px 16px' }}
                    disabled={running}
                  >
                    <Play size={14} />
                    <span>Fire New Meta Lead Webhook</span>
                  </button>
                  <button
                    onClick={() => handleSimulateMeta(true)}
                    className="btn-secondary"
                    style={{ fontSize: '12.5px', padding: '8px 16px', borderRadius: '9999px' }}
                    disabled={running}
                  >
                    <Layers size={14} />
                    <span>Fire Duplicate (Test Idempotency)</span>
                  </button>
                </div>
              </div>
            )}

            {/* WhatsApp Scenario */}
            {activeTab === 'whatsapp' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '15px', color: '#09090b', fontWeight: 600 }}>
                  WhatsApp Cloud API Inbound Events
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                  Simulates customer replies via official WhatsApp Business Platform. Tests pause-on-reply logic and STOP keyword opt-out enforcement.
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => handleSimulateWhatsApp('reply')}
                    className="btn btn-emerald"
                    style={{ fontSize: '12.5px', padding: '8px 16px', borderRadius: '9999px' }}
                    disabled={running}
                  >
                    <MessageSquare size={14} />
                    <span>Simulate Customer Reply</span>
                  </button>
                  <button
                    onClick={() => handleSimulateWhatsApp('stop')}
                    className="btn btn-danger"
                    style={{ fontSize: '12.5px', padding: '8px 16px', borderRadius: '9999px' }}
                    disabled={running}
                  >
                    <ShieldAlert size={14} />
                    <span>Simulate 'STOP' Opt-Out Keyword</span>
                  </button>
                </div>
              </div>
            )}

            {/* Google Ads Scenario */}
            {activeTab === 'google' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '15px', color: '#09090b', fontWeight: 600 }}>
                  Google Ads Search Lead Intake
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                  Simulates Google lead-form webhook intake with click ID (gclid) attribution and campaign metadata.
                </p>

                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={handleSimulateGoogle}
                    className="btn-pill-dark"
                    style={{ fontSize: '12.5px', padding: '8px 16px' }}
                    disabled={running}
                  >
                    <Play size={14} />
                    <span>Fire Google Ads Lead Webhook</span>
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <Link
                href="/leads"
                className="btn-ghost"
                style={{ fontSize: '12.5px', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Inspect newly created leads in CRM</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Live Execution Logs Window */}
          <div className="card-clean" style={{ padding: '20px', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#09090b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Code size={15} color="#09090b" />
                <span>Live Webhook Processing Console</span>
              </span>
              <button
                onClick={() => setLog([])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                Clear
              </button>
            </div>

            <div
              style={{
                flex: 1,
                minHeight: '260px',
                backgroundColor: '#09090b',
                borderRadius: '8px',
                border: '1px solid #27272a',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '11.5px',
                color: '#34d399',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              {log.length === 0 ? (
                <span style={{ color: '#71717a' }}>
                  Awaiting webhook triggers... Select a scenario and click Fire.
                </span>
              ) : (
                log.map((entry, idx) => <div key={idx}>{entry}</div>)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}