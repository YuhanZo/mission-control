import { supabase } from '../lib/supabaseClient'
import type { Job, JobStatus, JobStatusHistory, ServiceResult, PaginationMeta } from '../types'

export interface JobListResult {
  data: Job[]
  meta: PaginationMeta
  error: string | null
}

export async function listJobs(
  page = 1,
  pageSize = 20,
  filters?: { status?: JobStatus; assigned_to?: string; customer_id?: string }
): Promise<JobListResult> {
  let query = supabase
    .from('jobs')
    .select('*, customer:customers(id,first_name,last_name,company_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to)
  if (filters?.customer_id) query = query.eq('customer_id', filters.customer_id)

  const { data, error, count } = await query

  return {
    data: (data as Job[]) ?? [],
    meta: { page, pageSize, total: count ?? 0 },
    error: error?.message ?? null,
  }
}

export async function getJob(id: string): Promise<ServiceResult<Job>> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, customer:customers(*), address:addresses(*), assigned_user:staff_users(*)')
    .eq('id', id)
    .single()

  return { data: data as Job, error: error?.message ?? null }
}

export async function createJob(
  payload: Omit<Job, 'id' | 'job_number' | 'created_at' | 'updated_at'>
): Promise<ServiceResult<Job>> {
  const { data, error } = await supabase
    .from('jobs')
    .insert(payload)
    .select()
    .single()

  return { data: data as Job, error: error?.message ?? null }
}

export async function updateJobStatus(
  jobId: string,
  newStatus: JobStatus,
  changedBy: string,
  notes?: string
): Promise<ServiceResult<Job>> {
  const { data: currentJob, error: fetchErr } = await supabase
    .from('jobs')
    .select('status')
    .eq('id', jobId)
    .single()

  if (fetchErr) return { data: null, error: fetchErr.message }

  const [jobUpdate, historyInsert] = await Promise.all([
    supabase.from('jobs').update({ status: newStatus }).eq('id', jobId).select().single(),
    supabase.from('job_status_history').insert({
      job_id: jobId,
      from_status: currentJob.status,
      to_status: newStatus,
      changed_by: changedBy,
      notes,
    }),
  ])

  if (jobUpdate.error) return { data: null, error: jobUpdate.error.message }
  if (historyInsert.error) return { data: null, error: historyInsert.error.message }

  return { data: jobUpdate.data as Job, error: null }
}

export async function getJobStatusHistory(jobId: string): Promise<ServiceResult<JobStatusHistory[]>> {
  const { data, error } = await supabase
    .from('job_status_history')
    .select('*')
    .eq('job_id', jobId)
    .order('changed_at', { ascending: true })

  return { data: data as JobStatusHistory[], error: error?.message ?? null }
}
