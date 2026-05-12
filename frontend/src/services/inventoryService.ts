import { supabase } from '../lib/supabaseClient'
import type { InventoryItem, ServiceResult, PaginationMeta } from '../types'

export interface InventoryListResult {
  data: InventoryItem[]
  meta: PaginationMeta
  error: string | null
}

export async function listInventory(
  page = 1,
  pageSize = 50,
  search?: string
): Promise<InventoryListResult> {
  let query = supabase
    .from('inventory_items')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,location.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  return {
    data: (data as InventoryItem[]) ?? [],
    meta: { page, pageSize, total: count ?? 0 },
    error: error?.message ?? null,
  }
}

export async function updateInventoryQty(
  id: string,
  qty_on_hand: number
): Promise<ServiceResult<InventoryItem>> {
  const { data, error } = await supabase
    .from('inventory_items')
    .update({ qty_on_hand, last_counted_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { data: data as InventoryItem, error: error?.message ?? null }
}
