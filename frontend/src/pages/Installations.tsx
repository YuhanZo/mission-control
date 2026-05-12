import { Link } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { mockInstallations } from '../data/mockData'
import { formatDate } from '../utils/formatters'

const STATUS_BADGE: Record<string, string> = {
  scheduled: 'warning', in_progress: 'info', completed: 'success',
  rescheduled: 'neutral', cancelled: 'danger',
}

export function Installations() {
  return (
    <AppLayout title="Installations">
      <PageHeader
        title="Installations"
        subtitle={`${mockInstallations.length} scheduled`}
        actions={<button className="btn btn-primary">+ Schedule Installation</button>}
      />
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Job</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Signed</th>
            </tr>
          </thead>
          <tbody>
            {mockInstallations.map(inst => (
              <tr key={inst.id}>
                <td style={{ fontWeight: 500 }}>{formatDate(inst.scheduled_date)}</td>
                <td className="text-muted text-sm">{inst.scheduled_time ?? '—'}</td>
                <td>
                  {inst.job && (
                    <Link to={`/jobs/${inst.job_id}`} style={{ color: 'var(--color-brand)' }}>
                      {inst.job.title}
                    </Link>
                  )}
                </td>
                <td>
                  <span className={`badge badge-${STATUS_BADGE[inst.status] ?? 'neutral'}`}>
                    {inst.status}
                  </span>
                </td>
                <td className="text-muted text-sm">{inst.duration_hours ? `${inst.duration_hours}h` : '—'}</td>
                <td className="text-muted text-sm">{inst.customer_signed ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}
