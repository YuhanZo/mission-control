import { useParams, Link } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { mockJobs, mockQuotes } from '../data/mockData'
import { jobStatusLabel, jobStatusBadge, quoteStatusBadge, formatDate, formatCurrency } from '../utils/formatters'

export function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const job = mockJobs.find(j => j.id === id)
  const quotes = mockQuotes.filter(q => q.job_id === id)

  if (!job) {
    return (
      <AppLayout title="Job">
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p className="text-muted">Job not found.</p>
          <Link to="/jobs" className="btn btn-outline" style={{ marginTop: 16 }}>← Back to Jobs</Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title={job.job_number ?? 'Job'}>
      <PageHeader
        title={job.title}
        subtitle={`${job.job_number} · ${job.is_commercial ? 'Commercial' : 'Residential'}`}
        actions={
          <>
            <Link to="/jobs" className="btn btn-outline">← Back</Link>
            <button className="btn btn-primary">+ Add Quote</button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Job info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 14 }}>Status</div>
            <span className={`badge badge-${jobStatusBadge(job.status)}`} style={{ fontSize: 13, padding: '4px 12px' }}>
              {jobStatusLabel(job.status)}
            </span>
          </div>

          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 14 }}>Details</div>
            <Field label="Customer">
              {job.customer && (
                <Link to={`/customers/${job.customer_id}`} style={{ color: 'var(--color-brand)' }}>
                  {job.customer.first_name} {job.customer.last_name}
                </Link>
              )}
            </Field>
            <Field label="Priority">
              <span className="badge badge-neutral">{job.priority}</span>
            </Field>
            <Field label="Created">{formatDate(job.created_at)}</Field>
            <Field label="Last Updated">{formatDate(job.updated_at)}</Field>
            {job.description && <Field label="Description">{job.description}</Field>}
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quotes */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontWeight: 600 }}>Quotes</span>
              <button className="btn btn-outline" style={{ fontSize: 12 }}>+ New Quote</button>
            </div>
            {quotes.length === 0 ? (
              <div style={{ padding: 24, color: 'var(--color-text-muted)', fontSize: 13 }}>No quotes yet.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr><th>Version</th><th>Status</th><th>Total</th><th>Valid Until</th><th>Sent</th></tr>
                </thead>
                <tbody>
                  {quotes.map(q => (
                    <tr key={q.id}>
                      <td style={{ fontWeight: 500 }}>v{q.version}</td>
                      <td><span className={`badge badge-${quoteStatusBadge(q.status)}`}>{q.status}</span></td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(q.total)}</td>
                      <td className="text-muted text-sm">{q.valid_until ? formatDate(q.valid_until) : '—'}</td>
                      <td className="text-muted text-sm">{q.sent_at ? formatDate(q.sent_at) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Placeholder sections */}
          <PlaceholderSection title="Measurements" hint="No measurements recorded yet." />
          <PlaceholderSection title="Orders" hint="No orders placed yet." />
          <PlaceholderSection title="Installations" hint="No installations scheduled yet." />
        </div>
      </div>
    </AppLayout>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: 13, marginTop: 2 }}>{children}</div>
    </div>
  )
}

function PlaceholderSection({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>{title}</div>
      <div style={{ padding: 24, color: 'var(--color-text-muted)', fontSize: 13 }}>{hint}</div>
    </div>
  )
}
