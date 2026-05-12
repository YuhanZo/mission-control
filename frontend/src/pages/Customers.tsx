import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { mockCustomers } from '../data/mockData'
import { formatDate } from '../utils/formatters'

export function Customers() {
  const [search, setSearch] = useState('')

  const filtered = mockCustomers.filter(c => {
    const q = search.toLowerCase()
    return (
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.company_name?.toLowerCase().includes(q)
    )
  })

  return (
    <AppLayout title="Customers">
      <PageHeader
        title="Customers"
        subtitle={`${mockCustomers.length} total customers`}
        actions={
          <button className="btn btn-primary">+ New Customer</button>
        }
      />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', maxWidth: 360,
              padding: '7px 12px', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)', fontSize: 13,
              outline: 'none',
            }}
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Since</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <Link
                    to={`/customers/${c.id}`}
                    style={{ color: 'var(--color-brand)', fontWeight: 500 }}
                  >
                    {c.first_name} {c.last_name}
                  </Link>
                </td>
                <td className="text-muted">{c.company_name ?? '—'}</td>
                <td className="text-muted text-sm">{c.email ?? '—'}</td>
                <td className="text-muted text-sm">{c.phone ?? '—'}</td>
                <td>
                  {c.source && (
                    <span className="badge badge-neutral">
                      {c.source.replace('_', ' ')}
                    </span>
                  )}
                </td>
                <td className="text-muted text-sm">{formatDate(c.created_at)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-muted)' }}>
                  No customers match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}
