import { supabase } from '../lib/supabaseClient'
import type { Task, TaskStatus, ServiceResult, PaginationMeta } from '../types'

export interface TaskListResult {
  data: Task[]
  meta: PaginationMeta
  error: string | null
}

export async function listTasks(
  page = 1,
  pageSize = 50,
  filters?: { status?: TaskStatus; assigned_to?: string; job_id?: string }
): Promise<TaskListResult> {
  let query = supabase
    .from('tasks')
    .select('*, job:jobs(id,title,job_number), customer:customers(id,first_name,last_name)', { count: 'exact' })
    .order('due_date', { ascending: true, nullsFirst: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to)
  if (filters?.job_id) query = query.eq('job_id', filters.job_id)

  const { data, error, count } = await query

  return {
    data: (data as Task[]) ?? [],
    meta: { page, pageSize, total: count ?? 0 },
    error: error?.message ?? null,
  }
}

export async function createTask(
  payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>
): Promise<ServiceResult<Task>> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(payload)
    .select()
    .single()

  return { data: data as Task, error: error?.message ?? null }
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus
): Promise<ServiceResult<Task>> {
  const payload: Partial<Task> = { status }
  if (status === 'done') payload.completed_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  return { data: data as Task, error: error?.message ?? null }
}
