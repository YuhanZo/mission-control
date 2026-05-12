import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { mockJobs } from '../data/mockData'
import { jobStatusLabel, jobStatusBadge, priorityBadge, formatDate, JOB_STATUS_ORDER } from '../utils/formatters'
import type { JobStatus } from '../types'

const ALL = 'all'

export function Jobs() {
  const [statusFilter, setStatusFilter] = useState<JobStatus | typeof ALL>(ALL)

  const filtered = mockJobs.filter(j =>
    statusFilter === ALL ? true : j.status === statusFilter
  )

  return (
    <AppLayout title="Jobs">
      <PageHeader
        title="Jobs"
        subtitle={`${mockJobs.length} total jobs`}
        actions={<button className="btn btn-primary">+ New Job</button>}
      />

      {/* Status filter pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <FilterPill label="All" value={ALL} current={statusFilter} onClick={setStatusFilter} count={mockJobs.length} />
        {JOB_STATUS_ORDER.map(s => {
          const count = mockJobs.filter(j => j.status === s).length
          if (count === 0) return null
          return (
            <FilterPill key={s} label={jobStatusLabel(s)} value={s} current={statusFilter} onClick={setStatusFilter} count={count} />
          )
        })}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Job #</th>
              <th>Title</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Type</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(job => (
              <tr key={job.id}>
                <td>
                  <Link to={`/jobs/${job.id}`} style={{ color: 'var(--color-brand)', fontWeight: 600 }}>
                    {job.job_number}
                  </Link>
                </td>
                <td style={{ fontWeight: 500 }}>{job.title}</td>
                <td>
                  {job.customer && (
                    <Link to={`/customers/${job.customer_id}`} className="text-muted">
                      {job.customer.first_name} {job.customer.last_name}
                    </Link>
                  )}
                </td>
                <td>
                  <span className={`badge badge-${jobStatusBadge(job.status)}`}>
                    {jobStatusLabel(job.status)}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${priorityBadge(job.priority)}`}>
                    {job.priority}
                  </span>
                </td>
                <td className="text-muted text-sm">{job.is_commercial ? 'Commercial' : 'Residential'}</td>
                <td className="text-muted text-sm">{formatDate(job.updated_at)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-muted)' }}>
                  No jobs match the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}

function FilterPill<T extends string>({
  label, value, current, onClick, count
}: {
  label: string; value: T; current: T; onClick: (v: T) => void; count: number
}) {
  const active = value === current
  return (
    <button
      onClick={() => onClick(value)}
      style={{
        padding: '4px 12px',
        borderRadius: 99,
        border: '1px solid',
        borderColor: active ? 'var(--color-brand)' : 'var(--color-border)',
        background: active ? 'var(--color-brand)' : 'var(--color-surface)',
        color: active ? '#fff' : 'var(--color-text-muted)',
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
      }}
    >
      {label} <span style={{ opacity: 0.7 }}>({count})</span>
    </button>
  )
}
