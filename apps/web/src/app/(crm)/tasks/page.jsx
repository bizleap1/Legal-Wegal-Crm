'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, PhoneCall, MessageSquare, Check, RotateCcw } from 'lucide-react';
import Topbar from '../../../components/Topbar';
import { api } from '../../../lib/api-client';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await api.getTasks({
        status: filter === 'completed' ? 'completed' : filter === 'all' ? undefined : 'pending',
        dueFilter: filter === 'today' ? 'today' : filter === 'overdue' ? 'overdue' : undefined
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    const outcome =
      prompt('Enter task completion outcome or call notes:') ||
      'Follow-up call completed with client';
    try {
      await api.updateTask(taskId, {
        status: 'completed',
        outcome
      });
      loadTasks();
    } catch (err) {
      alert(err.message || 'Failed to complete task');
    }
  };

  const handleSnoozeTask = async (taskId) => {
    const days = prompt('Snooze task by how many days?', '2');
    if (!days) return;
    const newDue = new Date(Date.now() + parseInt(days, 10) * 86400000);
    try {
      await api.updateTask(taskId, {
        dueAt: newDue.toISOString(),
        outcome: `Rescheduled by ${days} days`
      });
      loadTasks();
    } catch (err) {
      alert(err.message || 'Failed to reschedule task');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Topbar
        title="Tasks & Follow-up Sequences"
        subtitle="Durable follow-up execution queue: Day 0, 1, 2, 5, 12, 21, and 29 sequence actions"
      />

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'today', label: 'Due Today' },
            { id: 'overdue', label: 'Overdue' },
            { id: 'completed', label: 'Completed' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={filter === item.id ? 'btn-pill-dark' : 'btn-secondary'}
              style={{
                padding: '6px 14px',
                fontSize: '12.5px',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Tasks List Table */}
        <div className="card-clean" style={{ overflow: 'hidden', backgroundColor: '#ffffff' }}>
          <table className="crm-table">
            <thead>
              <tr>
                <th>Action & Type</th>
                <th>Target Lead</th>
                <th>Due Date & Offset</th>
                <th>Assigned Sales Rep</th>
                <th>Sequence Outcome</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    Loading tasks...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    No follow-up tasks in this view.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const isOverdue = new Date(task.dueAt) < new Date() && task.status === 'pending';
                  return (
                    <tr key={task.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor:
                                task.taskType === 'call'
                                  ? '#dbeafe'
                                  : task.taskType === 'whatsapp'
                                  ? '#d1fae5'
                                  : '#ede9fe',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {task.taskType === 'call' ? (
                              <PhoneCall size={15} color="#2563eb" />
                            ) : task.taskType === 'whatsapp' ? (
                              <MessageSquare size={15} color="#059669" />
                            ) : (
                              <Clock size={15} color="#6d28d9" />
                            )}
                          </div>
                          <div>
                            <span
                              style={{
                                fontWeight: 600,
                                color: '#09090b',
                                fontSize: '13.5px',
                                textTransform: 'capitalize'
                              }}
                            >
                              {task.taskType} Follow-up
                            </span>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              Attempt #{task.attemptNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {task.lead ? (
                          <Link
                            href={`/leads/${task.lead.id}`}
                            style={{ color: '#4338ca', fontWeight: 600 }}
                          >
                            {task.lead.firstName} {task.lead.lastName}
                          </Link>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>Unlinked Lead</span>
                        )}
                        {task.lead?.company && (
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                            {task.lead.company}
                          </div>
                        )}
                      </td>

                      <td>
                        <div
                          style={{
                            color: isOverdue ? '#e11d48' : '#09090b',
                            fontWeight: isOverdue ? 600 : 500,
                            fontSize: '13px'
                          }}
                        >
                          {new Date(task.dueAt).toLocaleDateString()}
                        </div>
                        {isOverdue && (
                          <span style={{ fontSize: '11px', color: '#e11d48', fontWeight: 600 }}>
                            ● Overdue
                          </span>
                        )}
                      </td>

                      <td>
                        <div style={{ fontSize: '13px', color: '#334155' }}>
                          {task.assignedUser?.name || 'Unassigned'}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '12.5px', color: '#475569' }}>
                          {task.outcome || 'Pending execution'}
                        </span>
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              task.status === 'completed'
                                ? '#d1fae5'
                                : task.status === 'pending'
                                ? '#fef3c7'
                                : '#f1f5f9',
                            color:
                              task.status === 'completed'
                                ? '#047857'
                                : task.status === 'pending'
                                ? '#b45309'
                                : '#475569',
                            border:
                              task.status === 'completed'
                                ? '1px solid #a7f3d0'
                                : task.status === 'pending'
                                ? '1px solid #fde68a'
                                : '1px solid #e2e8f0'
                          }}
                        >
                          {task.status}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        {task.status === 'pending' ? (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                            <button
                              onClick={() => handleCompleteTask(task.id)}
                              className="btn btn-emerald"
                              style={{ padding: '5px 10px', fontSize: '12px' }}
                              title="Mark Completed"
                            >
                              <Check size={13} />
                              <span>Done</span>
                            </button>
                            <button
                              onClick={() => handleSnoozeTask(task.id)}
                              className="btn-secondary"
                              style={{ padding: '5px 8px', fontSize: '12px', borderRadius: '6px' }}
                              title="Reschedule / Snooze"
                            >
                              <RotateCcw size={13} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}