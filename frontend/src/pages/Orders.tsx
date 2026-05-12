import { Link } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { mockOrders, mockJobs } from '../data/mockData'
import { orderStatusBadge, formatCurrency, formatDate } from '../utils/formatters'

export function Orders() {
  const ordersWithJobs = mockOrders.map(o => ({
    ...o,
    job: mockJobs.find(j => j.id === o.job_id),
  }))

  return (
    <AppLayout title="Orders">
      <PageHeader
        title="Orders"
        subtitle={`${mockOrders.length} orders`}
        actions={<button className="btn btn-primary">+ New Order</button>}
      />
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Job</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Total</th>
              <th>Expected</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            {ordersWithJobs.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>{o.order_number}</td>
                <td>
                  {o.job && (
                    <Link to={`/jobs/${o.job_id}`} style={{ color: 'var(--color-brand)' }}>
                      {o.job.job_number}
                    </Link>
                  )}
                </td>
                <td className="text-muted">{o.supplier_name ?? '—'}</td>
                <td><span className={`badge badge-${orderStatusBadge(o.status)}`}>{o.status.replace('_', ' ')}</span></td>
                <td style={{ fontWeight: 600 }}>{o.total ? formatCurrency(o.total) : '—'}</td>
                <td className="text-muted text-sm">{o.expected_at ? formatDate(o.expected_at) : '—'}</td>
                <td className="text-muted text-sm">{o.received_at ? formatDate(o.received_at) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}
