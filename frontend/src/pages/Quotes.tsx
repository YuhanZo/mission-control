import { Link } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { mockQuotes, mockJobs } from '../data/mockData'
import { quoteStatusBadge, formatCurrency, formatDate } from '../utils/formatters'

export function Quotes() {
  const quotesWithJobs = mockQuotes.map(q => ({
    ...q,
    job: mockJobs.find(j => j.id === q.job_id),
  }))

  return (
    <AppLayout title="Quotes">
      <PageHeader
        title="Quotes"
        subtitle={`${mockQuotes.length} quotes`}
        actions={<button className="btn btn-primary">+ New Quote</button>}
      />
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Job #</th>
              <th>Job Title</th>
              <th>Customer</th>
              <th>Version</th>
              <th>Status</th>
              <th>Total</th>
              <th>Valid Until</th>
            </tr>
          </thead>
          <tbody>
            {quotesWithJobs.map(q => (
              <tr key={q.id}>
                <td>
                  {q.job && (
                    <Link to={`/jobs/${q.job_id}`} style={{ color: 'var(--color-brand)', fontWeight: 600 }}>
                      {q.job.job_number}
                    </Link>
                  )}
                </td>
                <td style={{ fontWeight: 500 }}>{q.job?.title}</td>
                <td className="text-muted text-sm">
                  {q.job?.customer
                    ? `${q.job.customer.first_name} ${q.job.customer.last_name}`
                    : '—'}
                </td>
                <td className="text-muted">v{q.version}</td>
                <td><span className={`badge badge-${quoteStatusBadge(q.status)}`}>{q.status}</span></td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(q.total)}</td>
                <td className="text-muted text-sm">{q.valid_until ? formatDate(q.valid_until) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}
