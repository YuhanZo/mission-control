import { supabase } from '../lib/supabaseClient'
import type { Installation, ServiceResult, PaginationMeta } from '../types'

export interface InstallationListResult {
  data: Installation[]
  meta: PaginationMeta
  error: string | null
}

export async function listInstallations(
  page = 1,
  pageSize = 20,
  filters?: { from_date?: string; to_date?: string; assigned_to?: string }
): Promise<InstallationListResult> {
  let query = supabase
    .from('installations')
    .select('*, job:jobs(id,title,job_number,customer:customers(id,first_name,last_name))', { count: 'exact' })
    .order('scheduled_date', { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (filters?.from_date) query = query.gte('scheduled_date', filters.from_date)
  if (filters?.to_date) query = query.lte('scheduled_date', filters.to_date)
  if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to)

  const { data, error, count } = await query

  return {
    data: (data as Installation[]) ?? [],
    meta: { page, pageSize, total: count ?? 0 },
    error: error?.message ?? null,
  }
}

export async function createInstallation(
  payload: Omit<Installation, 'id' | 'created_at' | 'updated_at'>
): Promise<ServiceResult<Installation>> {
  const { data, error } = await supabase
    .from('installations')
    .insert(payload)
    .select()
    .single()

  return { data: data as Installation, error: error?.message ?? null }
}

export async function updateInstallation(
  id: string,
  payload: Partial<Installation>
): Promise<ServiceResult<Installation>> {
  const { data, error } = await supabase
    .from('installations')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  return { data: data as Installation, error: error?.message ?? null }
}
