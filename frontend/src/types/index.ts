// =============================================================================
// Entity types — mirror the database schema
// =============================================================================

export type StaffRole = 'admin' | 'manager' | 'staff' | 'installer' | 'readonly'

export interface StaffUser {
  id: string
  auth_id?: string
  full_name: string
  email: string
  role: StaffRole
  phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------

export type CustomerSource = 'referral' | 'walk_in' | 'website' | 'google' | 'facebook' | 'other'

export interface Customer {
  id: string
  first_name: string
  last_name: string
  company_name?: string
  email?: string
  phone?: string
  phone_alt?: string
  source?: CustomerSource
  notes?: string
  is_active: boolean
  is_commercial?: boolean
  created_by?: string
  created_at: string
  updated_at: string
  // joined
  addresses?: Address[]
  contacts?: Contact[]
}

export type AddressLabel = 'primary' | 'billing' | 'site' | 'other'

export interface Address {
  id: string
  customer_id?: string
  label: AddressLabel
  line1: string
  line2?: string
  city: string
  state: string
  postcode: string
  country: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  customer_id: string
  full_name: string
  role?: string
  email?: string
  phone?: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------

export type JobStatus =
  | 'enquiry'
  | 'measurement_booked'
  | 'measured'
  | 'quote_sent'
  | 'quote_approved'
  | 'ordered'
  | 'in_production'
  | 'ready_to_install'
  | 'installation_booked'
  | 'installed'
  | 'completed'
  | 'cancelled'
  | 'on_hold'

export type Priority = 'low' | 'normal' | 'high' | 'urgent'

export interface Job {
  id: string
  customer_id: string
  address_id?: string
  assigned_to?: string
  title: string
  description?: string
  status: JobStatus
  priority: Priority
  job_number?: string
  source_notes?: string
  is_commercial: boolean
  created_by?: string
  created_at: string
  updated_at: string
  // joined
  customer?: Customer
  address?: Address
  assigned_user?: StaffUser
}

export interface JobStatusHistory {
  id: string
  job_id: string
  from_status?: string
  to_status: string
  changed_by?: string
  notes?: string
  changed_at: string
}

// -----------------------------------------------------------------------------

export type MountType = 'inside' | 'outside' | 'ceiling'

export interface Measurement {
  id: string
  job_id: string
  measured_by?: string
  measured_at?: string
  location_name: string
  width_mm?: number
  height_mm?: number
  depth_mm?: number
  mount_type?: MountType
  notes?: string
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------

export type ProductCategory =
  | 'roller_blind'
  | 'roman_blind'
  | 'venetian'
  | 'vertical'
  | 'sheer_curtain'
  | 'blockout_curtain'
  | 'shutter'
  | 'track_hardware'
  | 'fabric'
  | 'accessory'
  | 'other'

export interface Product {
  id: string
  sku?: string
  name: string
  category: ProductCategory
  description?: string
  unit_cost?: number
  unit_price?: number
  unit: string
  is_active: boolean
  supplier_name?: string
  supplier_sku?: string
  lead_days: number
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'

export interface Quote {
  id: string
  job_id: string
  version: number
  status: QuoteStatus
  subtotal: number
  discount_pct: number
  tax_pct: number
  total: number
  valid_until?: string
  notes?: string
  sent_at?: string
  approved_at?: string
  created_by?: string
  created_at: string
  updated_at: string
  items?: QuoteItem[]
}

export interface QuoteItem {
  id: string
  quote_id: string
  measurement_id?: string
  product_id?: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
  sort_order: number
  notes?: string
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------

export type OrderStatus = 'pending' | 'confirmed' | 'in_production' | 'ready' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  job_id: string
  quote_id?: string
  order_number?: string
  status: OrderStatus
  supplier_name?: string
  supplier_ref?: string
  ordered_at?: string
  expected_at?: string
  received_at?: string
  subtotal?: number
  tax?: number
  total?: number
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  description: string
  quantity: number
  unit_cost?: number
  total_cost?: number
  notes?: string
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------

export type InstallationStatus = 'scheduled' | 'in_progress' | 'completed' | 'rescheduled' | 'cancelled'

export interface Installation {
  id: string
  job_id: string
  assigned_to?: string
  status: InstallationStatus
  scheduled_date: string
  scheduled_time?: string
  duration_hours?: number
  completed_at?: string
  notes?: string
  customer_signed: boolean
  created_by?: string
  created_at: string
  updated_at: string
  job?: Job
  assigned_user?: StaffUser
}

// -----------------------------------------------------------------------------

export interface InventoryItem {
  id: string
  product_id?: string
  sku?: string
  name: string
  category?: string
  location?: string
  qty_on_hand: number
  qty_reserved: number
  qty_reorder: number
  unit_cost?: number
  notes?: string
  last_counted_at?: string
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled'

export interface Task {
  id: string
  job_id?: string
  customer_id?: string
  assigned_to?: string
  created_by?: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  due_date?: string
  completed_at?: string
  created_at: string
  updated_at: string
  job?: Job
  customer?: Customer
  assigned_user?: StaffUser
}

// -----------------------------------------------------------------------------

export interface ActivityLog {
  id: string
  entity_type: string
  entity_id: string
  action: string
  description?: string
  metadata?: Record<string, unknown>
  performed_by?: string
  created_at: string
}

// -----------------------------------------------------------------------------
// UI utility types

export interface SelectOption {
  value: string
  label: string
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
}

export interface ServiceResult<T> {
  data: T | null
  error: string | null
}
