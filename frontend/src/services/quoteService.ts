import { supabase } from '../lib/supabaseClient'
import type { Quote, ServiceResult } from '../types'

export async function listQuotesByJob(jobId: string): Promise<ServiceResult<Quote[]>> {
  const { data, error } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*)')
    .eq('job_id', jobId)
    .order('version', { ascending: false })

  return { data: data as Quote[], error: error?.message ?? null }
}

export async function createQuote(
  payload: Omit<Quote, 'id' | 'created_at' | 'updated_at'>
): Promise<ServiceResult<Quote>> {
  const { data, error } = await supabase
    .from('quotes')
    .insert(payload)
    .select()
    .single()

  return { data: data as Quote, error: error?.message ?? null }
}

export async function updateQuote(
  id: string,
  payload: Partial<Quote>
): Promise<ServiceResult<Quote>> {
  const { data, error } = await supabase
    .from('quotes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  return { data: data as Quote, error: error?.message ?? null }
}
