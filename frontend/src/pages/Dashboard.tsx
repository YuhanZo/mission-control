import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { mockDashboardStats, mockJobs, mockTasks, mockInstallations } from '../data/mockData'
import { jobStatusLabel, jobStatusBadge, formatCurrency, formatDate, taskStatusBadge, formatDateShort } from '../utils/formatters'
import type { Job, Task, Installation } from '../types'

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${accent ?? 'var(--color-brand)'}` }}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  )
}

function JobRow({ job }: { job: Job }) {
  const badge = jobStatusBadge(job.status)
  return (
    <tr>
      <td>
        <a href={`/jobs/${job.id}`} style={{ color: 'var(--color-brand)', fontWeight: 500 }}>
          {job.job_number}
        </a>
      </td>
      <td>{job.title}</td>
      <td>{job.customer ? `${job.customer.first_name} ${job.customer.last_name}` : '—'}</td>
      <td>
        <span className={`badge badge-${badge}`}>{jobStatusLabel(job.status)}</span>
      </td>
      <td className="text-muted text-sm">{formatDate(job.updated_at)}</td>
    </tr>
  )
}

function TaskRow({ task }: { task: Task }) {
  const badge = taskStatusBadge(task.status)
  return (
    <tr>
      <td style={{ fontWeight: 500 }}>{task.title}</td>
      <td>{task.job?.job_number ?? '—'}</td>
      <td>
        <span className={`badge badge-${badge}`}>{task.status.replace('_', ' ')}</span>
      </td>
      <td className="text-muted text-sm">
        {task.due_date ? formatDateShort(task.due_date) : '—'}
      </td>
    </tr>
  )
}

function UpcomingInstallation({ inst }: { inst: Installation }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{
        background: 'var(--color-info-bg)', color: 'var(--color-info)',
        borderRadius: 6, padding: '6px 10px', textAlign: 'center', minWidth: 48,
      }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>
          {new Date(inst.scheduled_date).getDate()}
        </div>
        <div style={{ fontSize: 10, fontWeight: 600 }}>
          {new Date(inst.scheduled_date).toLocaleString('en-AU', { month: 'short' })}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 500, fontSize: 13 }}>{inst.job?.title}</div>
        <div className="text-muted text-sm">
          {inst.scheduled_time ?? 'Time TBC'}
          {inst.duration_hours ? ` · ${inst.duration_hours}h` : ''}
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const stats = mockDashboardStats
  const recentJobs = mockJobs.slice(0, 5)
  const openTasks = mockTasks.filter(t => t.status !== 'done' && t.status !== 'cancelled')
  const upcomingInstalls = mockInstallations.filter(i => i.status === 'scheduled')

  return (
    <AppLayout title="Dashboard">
      <PageHeader
        title="Good morning, James"
        subtitle={`${new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Active Jobs" value={stats.activeJobs} accent="var(--color-brand)" />
        <StatCard label="Open Quotes" value={stats.openQuotes} sub="awaiting response" accent="var(--color-warning)" />
        <StatCard label="Installs This Week" value={stats.installationsThisWeek} accent="var(--color-info)" />
        <StatCard label="Pending Tasks" value={stats.pendingTasks} accent="var(--color-accent)" />
        <StatCard
          label="Approved Revenue"
          value={formatCurrency(stats.revenueThisMonth)}
          sub="from approved quotes"
          accent="var(--color-success)"
        />
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Recent jobs */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>
            Recent Jobs
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Job #</th>
                <th>Title</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map(job => <JobRow key={job.id} job={job} />)}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Upcoming installs */}
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Upcoming Installations</div>
            {upcomingInstalls.length === 0
              ? <p className="text-muted text-sm">No installations scheduled.</p>
              : upcomingInstalls.map(i => <UpcomingInstallation key={i.id} inst={i} />)
            }
          </div>

          {/* Open tasks */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>
              Open Tasks
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Job</th>
                  <th>Status</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {openTasks.map(t => <TaskRow key={t.id} task={t} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
