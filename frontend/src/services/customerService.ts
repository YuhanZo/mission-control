import { supabase } from '../lib/supabaseClient'
import type { Customer, Address, Contact, ServiceResult, PaginationMeta } from '../types'

export interface CustomerListResult {
  data: Customer[]
  meta: PaginationMeta
  error: string | null
}

export async function listCustomers(
  page = 1,
  pageSize = 20,
  search?: string
): Promise<CustomerListResult> {
  let query = supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('last_name', { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (search) {
    query = query.or(
      `last_name.ilike.%${search}%,first_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`
    )
  }

  const { data, error, count } = await query

  return {
    data: (data as Customer[]) ?? [],
    meta: { page, pageSize, total: count ?? 0 },
    error: error?.message ?? null,
  }
}

export async function getCustomer(id: string): Promise<ServiceResult<Customer>> {
  const { data, error } = await supabase
    .from('customers')
    .select('*, addresses(*), contacts(*)')
    .eq('id', id)
    .single()

  return { data: data as Customer, error: error?.message ?? null }
}

export async function createCustomer(
  payload: Omit<Customer, 'id' | 'created_at' | 'updated_at'>
): Promise<ServiceResult<Customer>> {
  const { data, error } = await supabase
    .from('customers')
    .insert(payload)
    .select()
    .single()

  return { data: data as Customer, error: error?.message ?? null }
}

export async function updateCustomer(
  id: string,
  payload: Partial<Customer>
): Promise<ServiceResult<Customer>> {
  const { data, error } = await supabase
    .from('customers')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  return { data: data as Customer, error: error?.message ?? null }
}

export async function addAddress(
  payload: Omit<Address, 'id' | 'created_at' | 'updated_at'>
): Promise<ServiceResult<Address>> {
  const { data, error } = await supabase
    .from('addresses')
    .insert(payload)
    .select()
    .single()

  return { data: data as Address, error: error?.message ?? null }
}

export async function addContact(
  payload: Omit<Contact, 'id' | 'created_at' | 'updated_at'>
): Promise<ServiceResult<Contact>> {
  const { data, error } = await supabase
    .from('contacts')
    .insert(payload)
    .select()
    .single()

  return { data: data as Contact, error: error?.message ?? null }
}
