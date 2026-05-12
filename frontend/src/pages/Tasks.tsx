import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { mockTasks } from '../data/mockData'
import { taskStatusBadge, priorityBadge, formatDateShort } from '../utils/formatters'
import type { TaskStatus } from '../types'

const STATUS_TABS: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
]

export function Tasks() {
  const [tab, setTab] = useState<TaskStatus | 'all'>('all')

  const filtered = mockTasks.filter(t =>
    tab === 'all' ? t.status !== 'cancelled' : t.status === tab
  )

  return (
    <AppLayout title="Tasks">
      <PageHeader
        title="Tasks"
        subtitle={`${mockTasks.filter(t => t.status === 'todo').length} open tasks`}
        actions={<button className="btn btn-primary">+ New Task</button>}
      />

      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {STATUS_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid',
              borderColor: tab === t.value ? 'var(--color-brand)' : 'var(--color-border)',
              background: tab === t.value ? 'var(--color-brand)' : 'var(--color-surface)',
              color: tab === t.value ? '#fff' : 'var(--color-text-muted)',
              fontSize: 13,
              fontWeight: tab === t.value ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Job</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(task => (
              <tr key={task.id}>
                <td style={{ fontWeight: 500 }}>
                  {task.status === 'done'
                    ? <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>{task.title}</span>
                    : task.title}
                </td>
                <td className="text-muted text-sm">
                  {task.job
                    ? <Link to={`/jobs/${task.job_id}`} style={{ color: 'var(--color-brand)' }}>{task.job.job_number}</Link>
                    : '—'}
                </td>
                <td>
                  <span className={`badge badge-${taskStatusBadge(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${priorityBadge(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="text-muted text-sm">
                  {task.due_date ? formatDateShort(task.due_date) : '—'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-muted)' }}>
                  No tasks here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}
