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
  const handleCompleteTask = async taskId => {
    const outcome = prompt('Enter task completion outcome or call notes:') || 'Follow-up call completed with client';
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
  const handleSnoozeTask = async taskId => {
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
  return <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }}>
      <Topbar title="Tasks & Follow-up Sequences" subtitle="Durable follow-up execution queue: Day 0, 1, 2, 5, 12, 21, and 29 sequence actions" />

      <div style={{
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
        {/* Filter Pills */}
        <div style={{
        display: 'flex',
        gap: '10px'
      }}>
          {[{
          id: 'all',
          label: 'All Tasks'
        }, {
          id: 'today',
          label: 'Due Today'
        }, {
          id: 'overdue',
          label: 'Overdue'
        }, {
          id: 'completed',
          label: 'Completed'
        }].map(item => <button key={item.id} onClick={() => setFilter(item.id)} className={filter === item.id ? 'btn btn-primary' : 'btn btn-secondary'} style={{
          padding: '7px 14px',
          fontSize: '13px'
        }}>
              <span>{item.label}</span>
            </button>)}
        </div>

        {/* Tasks List Table */}
        <div className="glass-card" style={{
        overflow: 'hidden'
      }}>
          <table className="crm-table">
            <thead>
              <tr>
                <th>Action & Type</th>
                <th>Target Lead</th>
                <th>Due Date & Offset</th>
                <th>Assigned Sales Rep</th>
                <th>Sequence Outcome</th>
                <th>Status</th>
                <th style={{
                textAlign: 'right'
              }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr>
                  <td colSpan={7} style={{
                textAlign: 'center',
                padding: '40px',
                color: '#94a3b8'
              }}>
                    Loading tasks...
                  </td>
                </tr> : tasks.length === 0 ? <tr>
                  <td colSpan={7} style={{
                textAlign: 'center',
                padding: '40px',
                color: '#94a3b8'
              }}>
                    No follow-up tasks in this view.
                  </td>
                </tr> : tasks.map(task => {
              const isOverdue = new Date(task.dueAt) < new Date() && task.status === 'pending';
              return <tr key={task.id}>
                      <td>
                        <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                          <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: task.taskType === 'call' ? 'rgba(59, 130, 246, 0.2)' : task.taskType === 'whatsapp' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                            {task.taskType === 'call' ? <PhoneCall size={15} color="#60a5fa" /> : task.taskType === 'whatsapp' ? <MessageSquare size={15} color="#34d399" /> : <Clock size={15} color="#a5b4fc" />}
                          </div>
                          <div>
                            <span style={{
                        fontWeight: 600,
                        color: '#f8fafc',
                        fontSize: '13.5px',
                        textTransform: 'capitalize'
                      }}>
                              {task.taskType} Follow-up
                            </span>
                            <div style={{
                        fontSize: '11px',
                        color: '#94a3b8'
                      }}>
                              Attempt #{task.attemptNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {task.lead ? <Link href={`/leads/${task.lead.id}`} style={{
                    color: '#818cf8',
                    fontWeight: 600
                  }}>
                            {task.lead.firstName} {task.lead.lastName}
                          </Link> : <span style={{
                    color: '#94a3b8'
                  }}>Unlinked Lead</span>}
                        {task.lead?.company && <div style={{
                    fontSize: '11.5px',
                    color: '#94a3b8'
                  }}>{task.lead.company}</div>}
                      </td>

                      <td>
                        <div style={{
                    color: isOverdue ? '#f43f5e' : '#e2e8f0',
                    fontWeight: isOverdue ? 600 : 400,
                    fontSize: '13px'
                  }}>
                          {new Date(task.dueAt).toLocaleDateString()}
                        </div>
                        {isOverdue && <span style={{
                    fontSize: '11px',
                    color: '#f43f5e'
                  }}>● Overdue</span>}
                      </td>

                      <td>
                        <div style={{
                    fontSize: '13px',
                    color: '#e2e8f0'
                  }}>{task.assignedUser?.name || 'Unassigned'}</div>
                      </td>

                      <td>
                        <span style={{
                    fontSize: '12px',
                    color: '#cbd5e1'
                  }}>
                          {task.outcome || 'Pending execution'}
                        </span>
                      </td>

                      <td>
                        <span className="badge" style={{
                    backgroundColor: task.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : task.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                    color: task.status === 'completed' ? '#34d399' : task.status === 'pending' ? '#fde68a' : '#cbd5e1'
                  }}>
                          {task.status}
                        </span>
                      </td>

                      <td style={{
                  textAlign: 'right'
                }}>
                        {task.status === 'pending' ? <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '6px'
                  }}>
                            <button onClick={() => handleCompleteTask(task.id)} className="btn btn-emerald" style={{
                      padding: '5px 10px',
                      fontSize: '12px'
                    }} title="Mark Completed">
                              <Check size={13} />
                              <span>Done</span>
                            </button>
                            <button onClick={() => handleSnoozeTask(task.id)} className="btn btn-secondary" style={{
                      padding: '5px 8px',
                      fontSize: '12px'
                    }} title="Reschedule / Snooze">
                              <RotateCcw size={13} />
                            </button>
                          </div> : <span style={{
                    fontSize: '12px',
                    color: '#10b981'
                  }}>Completed</span>}
                      </td>
                    </tr>;
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}