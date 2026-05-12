import type { Customer, Job, Task, Installation, Order, Quote } from '../types'

export const mockCustomers: Customer[] = [
  {
    id: 'c1', first_name: 'Sarah', last_name: 'Mitchell', email: 'sarah.mitchell@email.com',
    phone: '0412 345 678', source: 'referral', is_active: true,
    created_at: '2024-10-15T09:00:00Z', updated_at: '2024-10-15T09:00:00Z',
  },
  {
    id: 'c2', first_name: 'Daniel', last_name: 'Nguyen', company_name: 'Nguyen Property Group',
    email: 'daniel@nguyenproperty.com.au', phone: '0423 456 789', source: 'website',
    is_active: true, is_commercial: true,
    created_at: '2024-11-02T10:30:00Z', updated_at: '2024-11-02T10:30:00Z',
  },
  {
    id: 'c3', first_name: 'Linda', last_name: 'Torres', email: 'linda.torres@gmail.com',
    phone: '0434 567 890', source: 'google', is_active: true,
    created_at: '2024-11-20T14:00:00Z', updated_at: '2024-11-20T14:00:00Z',
  },
  {
    id: 'c4', first_name: 'Mark', last_name: 'Evans', email: 'mark.evans@hotmail.com',
    phone: '0445 678 901', source: 'referral', is_active: true,
    created_at: '2025-01-08T11:00:00Z', updated_at: '2025-01-08T11:00:00Z',
  },
  {
    id: 'c5', first_name: 'Priya', last_name: 'Sharma', company_name: 'Sharma Interiors',
    email: 'priya@sharmainteriors.com.au', phone: '0456 789 012', source: 'referral',
    is_active: true, is_commercial: true,
    created_at: '2025-02-14T09:30:00Z', updated_at: '2025-02-14T09:30:00Z',
  },
]

export const mockJobs: Job[] = [
  {
    id: 'j1', customer_id: 'c1', title: 'Living room roller blinds', job_number: 'JB-2025-0001',
    status: 'quote_sent', priority: 'normal', is_commercial: false,
    created_at: '2025-03-01T09:00:00Z', updated_at: '2025-03-10T15:00:00Z',
    customer: mockCustomers[0],
  },
  {
    id: 'j2', customer_id: 'c2', title: 'Office venetian blinds — 12 windows', job_number: 'JB-2025-0002',
    status: 'ordered', priority: 'high', is_commercial: true,
    created_at: '2025-03-05T10:00:00Z', updated_at: '2025-04-01T09:00:00Z',
    customer: mockCustomers[1],
  },
  {
    id: 'j3', customer_id: 'c3', title: 'Master bedroom blockout curtains', job_number: 'JB-2025-0003',
    status: 'installation_booked', priority: 'normal', is_commercial: false,
    created_at: '2025-03-15T11:00:00Z', updated_at: '2025-04-10T14:00:00Z',
    customer: mockCustomers[2],
  },
  {
    id: 'j4', customer_id: 'c4', title: 'Plantation shutters — whole house', job_number: 'JB-2025-0004',
    status: 'measured', priority: 'normal', is_commercial: false,
    created_at: '2025-04-01T09:00:00Z', updated_at: '2025-04-05T16:00:00Z',
    customer: mockCustomers[3],
  },
  {
    id: 'j5', customer_id: 'c5', title: 'Showroom Roman blinds — 20 units', job_number: 'JB-2025-0005',
    status: 'ready_to_install', priority: 'urgent', is_commercial: true,
    created_at: '2025-04-10T10:00:00Z', updated_at: '2025-05-01T09:00:00Z',
    customer: mockCustomers[4],
  },
  {
    id: 'j6', customer_id: 'c1', title: 'Study vertical blinds', job_number: 'JB-2025-0006',
    status: 'enquiry', priority: 'low', is_commercial: false,
    created_at: '2025-05-05T14:00:00Z', updated_at: '2025-05-05T14:00:00Z',
    customer: mockCustomers[0],
  },
]

export const mockTasks: Task[] = [
  {
    id: 't1', job_id: 'j1', title: 'Follow up on quote — Sarah Mitchell',
    status: 'todo', priority: 'high', due_date: '2025-05-14',
    created_at: '2025-05-08T09:00:00Z', updated_at: '2025-05-08T09:00:00Z',
    job: mockJobs[0], customer: mockCustomers[0],
  },
  {
    id: 't2', job_id: 'j2', title: 'Confirm delivery date with supplier (Nguyen office)',
    status: 'in_progress', priority: 'high', due_date: '2025-05-12',
    created_at: '2025-05-06T10:00:00Z', updated_at: '2025-05-10T11:00:00Z',
    job: mockJobs[1],
  },
  {
    id: 't3', job_id: 'j5', title: 'Pre-install site check — Sharma Interiors',
    status: 'todo', priority: 'urgent', due_date: '2025-05-13',
    created_at: '2025-05-09T09:00:00Z', updated_at: '2025-05-09T09:00:00Z',
    job: mockJobs[4],
  },
  {
    id: 't4', title: 'Update product price list from supplier catalogue',
    status: 'todo', priority: 'normal', due_date: '2025-05-20',
    created_at: '2025-05-07T14:00:00Z', updated_at: '2025-05-07T14:00:00Z',
  },
  {
    id: 't5', job_id: 'j4', title: 'Send shutter sample to Mark Evans',
    status: 'done', priority: 'normal',
    completed_at: '2025-05-09T16:00:00Z',
    created_at: '2025-05-05T09:00:00Z', updated_at: '2025-05-09T16:00:00Z',
    job: mockJobs[3],
  },
]

export const mockInstallations: Installation[] = [
  {
    id: 'i1', job_id: 'j3', status: 'scheduled',
    scheduled_date: '2025-05-14', scheduled_time: '09:00', duration_hours: 3,
    customer_signed: false,
    created_at: '2025-04-10T14:00:00Z', updated_at: '2025-04-10T14:00:00Z',
    job: mockJobs[2],
  },
  {
    id: 'i2', job_id: 'j5', status: 'scheduled',
    scheduled_date: '2025-05-15', scheduled_time: '08:00', duration_hours: 6,
    customer_signed: false,
    created_at: '2025-05-01T09:00:00Z', updated_at: '2025-05-01T09:00:00Z',
    job: mockJobs[4],
  },
]

export const mockQuotes: Quote[] = [
  {
    id: 'q1', job_id: 'j1', version: 1, status: 'sent',
    subtotal: 1850, discount_pct: 0, tax_pct: 10, total: 2035,
    valid_until: '2025-05-31', sent_at: '2025-03-10T15:00:00Z',
    created_at: '2025-03-08T10:00:00Z', updated_at: '2025-03-10T15:00:00Z',
  },
  {
    id: 'q2', job_id: 'j2', version: 2, status: 'approved',
    subtotal: 8400, discount_pct: 5, tax_pct: 10, total: 8778,
    approved_at: '2025-03-20T11:00:00Z',
    created_at: '2025-03-12T09:00:00Z', updated_at: '2025-03-20T11:00:00Z',
  },
  {
    id: 'q3', job_id: 'j5', version: 1, status: 'approved',
    subtotal: 12600, discount_pct: 0, tax_pct: 10, total: 13860,
    approved_at: '2025-04-20T14:00:00Z',
    created_at: '2025-04-15T09:00:00Z', updated_at: '2025-04-20T14:00:00Z',
  },
]

export const mockOrders: Order[] = [
  {
    id: 'o1', job_id: 'j2', quote_id: 'q2', order_number: 'PO-2025-0001',
    status: 'in_production', supplier_name: 'Luxaflex', supplier_ref: 'LX-98234',
    ordered_at: '2025-03-22T09:00:00Z', expected_at: '2025-05-20',
    subtotal: 4200, tax: 420, total: 4620,
    created_at: '2025-03-22T09:00:00Z', updated_at: '2025-04-01T09:00:00Z',
  },
  {
    id: 'o2', job_id: 'j5', quote_id: 'q3', order_number: 'PO-2025-0002',
    status: 'ready', supplier_name: 'Norman Shutters', supplier_ref: 'NS-45678',
    ordered_at: '2025-04-22T09:00:00Z', expected_at: '2025-05-10',
    received_at: '2025-05-08T14:00:00Z',
    subtotal: 7800, tax: 780, total: 8580,
    created_at: '2025-04-22T09:00:00Z', updated_at: '2025-05-08T14:00:00Z',
  },
]

// Dashboard summary stats
export const mockDashboardStats = {
  activeJobs: mockJobs.filter(j => !['completed', 'cancelled'].includes(j.status)).length,
  openQuotes: mockQuotes.filter(q => q.status === 'sent').length,
  installationsThisWeek: mockInstallations.filter(i => i.status === 'scheduled').length,
  pendingTasks: mockTasks.filter(t => t.status === 'todo').length,
  revenueThisMonth: mockQuotes
    .filter(q => q.status === 'approved')
    .reduce((sum, q) => sum + q.total, 0),
}
