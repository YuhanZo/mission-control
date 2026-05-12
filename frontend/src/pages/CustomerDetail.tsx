import { useParams, Link } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { mockCustomers, mockJobs } from '../data/mockData'
import { jobStatusLabel, jobStatusBadge, formatDate } from '../utils/formatters'

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const customer = mockCustomers.find(c => c.id === id)
  const jobs = mockJobs.filter(j => j.customer_id === id)

  if (!customer) {
    return (
      <AppLayout title="Customer">
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p className="text-muted">Customer not found.</p>
          <Link to="/customers" className="btn btn-outline" style={{ marginTop: 16 }}>
            ← Back to Customers
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title={`${customer.first_name} ${customer.last_name}`}>
      <PageHeader
        title={`${customer.first_name} ${customer.last_name}`}
        subtitle={customer.company_name}
        actions={
          <>
            <Link to="/customers" className="btn btn-outline">← Back</Link>
            <button className="btn btn-primary">+ New Job</button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 14 }}>Contact Details</div>
            <Field label="Email" value={customer.email} />
            <Field label="Phone" value={customer.phone} />
            <Field label="Alt Phone" value={customer.phone_alt} />
            <Field label="Source" value={customer.source?.replace('_', ' ')} />
            <Field label="Customer Since" value={formatDate(customer.created_at)} />
          </div>

          {customer.notes && (
            <div className="card">
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Notes</div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap' }}>
                {customer.notes}
              </p>
            </div>
          )}
        </div>

        {/* Jobs */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 600 }}>Jobs ({jobs.length})</span>
            <button className="btn btn-outline" style={{ fontSize: 12 }}>+ Add Job</button>
          </div>
          {jobs.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No jobs yet.
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Job #</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <Link to={`/jobs/${job.id}`} style={{ color: 'var(--color-brand)', fontWeight: 500 }}>
                        {job.job_number}
                      </Link>
                    </td>
                    <td>{job.title}</td>
                    <td>
                      <span className={`badge badge-${jobStatusBadge(job.status)}`}>
                        {jobStatusLabel(job.status)}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{job.priority}</span>
                    </td>
                    <td className="text-muted text-sm">{formatDate(job.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: 13, marginTop: 2 }}>{value}</div>
    </div>
  )
}
