import type { JobStatus, OrderStatus, QuoteStatus, TaskStatus, Priority } from '../types'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
}

export function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short' }).format(new Date(iso))
}

export function customerFullName(c: { first_name: string; last_name: string; company_name?: string }): string {
  const name = `${c.first_name} ${c.last_name}`
  return c.company_name ? `${name} (${c.company_name})` : name
}

const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  enquiry: 'Enquiry',
  measurement_booked: 'Measurement Booked',
  measured: 'Measured',
  quote_sent: 'Quote Sent',
  quote_approved: 'Quote Approved',
  ordered: 'Ordered',
  in_production: 'In Production',
  ready_to_install: 'Ready to Install',
  installation_booked: 'Installation Booked',
  installed: 'Installed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  on_hold: 'On Hold',
}

const JOB_STATUS_BADGE: Record<JobStatus, string> = {
  enquiry: 'neutral',
  measurement_booked: 'info',
  measured: 'info',
  quote_sent: 'warning',
  quote_approved: 'success',
  ordered: 'info',
  in_production: 'info',
  ready_to_install: 'warning',
  installation_booked: 'warning',
  installed: 'success',
  completed: 'success',
  cancelled: 'danger',
  on_hold: 'neutral',
}

export const JOB_STATUS_ORDER: JobStatus[] = [
  'enquiry', 'measurement_booked', 'measured', 'quote_sent', 'quote_approved',
  'ordered', 'in_production', 'ready_to_install', 'installation_booked',
  'installed', 'completed', 'cancelled', 'on_hold',
]

export function jobStatusLabel(s: JobStatus): string { return JOB_STATUS_LABELS[s] ?? s }
export function jobStatusBadge(s: JobStatus): string { return JOB_STATUS_BADGE[s] ?? 'neutral' }

const PRIORITY_BADGE: Record<Priority, string> = {
  low: 'neutral', normal: 'neutral', high: 'warning', urgent: 'danger',
}
export function priorityBadge(p: Priority): string { return PRIORITY_BADGE[p] }

const QUOTE_STATUS_BADGE: Record<QuoteStatus, string> = {
  draft: 'neutral', sent: 'warning', approved: 'success', rejected: 'danger', expired: 'neutral',
}
export function quoteStatusBadge(s: QuoteStatus): string { return QUOTE_STATUS_BADGE[s] ?? 'neutral' }

const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  pending: 'neutral', confirmed: 'info', in_production: 'info',
  ready: 'success', delivered: 'success', cancelled: 'danger',
}
export function orderStatusBadge(s: OrderStatus): string { return ORDER_STATUS_BADGE[s] ?? 'neutral' }

const TASK_STATUS_BADGE: Record<TaskStatus, string> = {
  todo: 'neutral', in_progress: 'warning', done: 'success', cancelled: 'danger',
}
export function taskStatusBadge(s: TaskStatus): string { return TASK_STATUS_BADGE[s] ?? 'neutral' }
