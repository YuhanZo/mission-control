import { AppLayout } from '../components/layout/AppLayout'
import { PageHeader } from '../components/layout/PageHeader'

const MOCK_INVENTORY = [
  { id: '1', name: 'Roller Blind Chain Drive', sku: 'HW-001', category: 'track_hardware', location: 'Shelf A1', qty_on_hand: 48, qty_reserved: 12, qty_reorder: 10, unit_cost: 4.50 },
  { id: '2', name: 'Venetian Slat 50mm White', sku: 'VN-050-W', category: 'venetian', location: 'Shelf B2', qty_on_hand: 200, qty_reserved: 80, qty_reorder: 50, unit_cost: 1.20 },
  { id: '3', name: 'Blockout Fabric Roll (Arctic)', sku: 'FB-BLKOUT-ARC', category: 'fabric', location: 'Roll rack R3', qty_on_hand: 3, qty_reserved: 1, qty_reorder: 2, unit_cost: 28.00 },
  { id: '4', name: 'Roman Blind Track 1.8m', sku: 'HW-ROM-180', category: 'track_hardware', location: 'Shelf A3', qty_on_hand: 15, qty_reserved: 5, qty_reorder: 5, unit_cost: 18.50 },
  { id: '5', name: 'Mounting Bracket Set (4pk)', sku: 'HW-BRKT-4', category: 'accessory', location: 'Bin D5', qty_on_hand: 6, qty_reserved: 2, qty_reorder: 10, unit_cost: 6.00 },
]

export function Inventory() {
  return (
    <AppLayout title="Inventory">
      <PageHeader
        title="Inventory"
        subtitle="Warehouse stock levels"
        actions={<button className="btn btn-primary">+ Add Item</button>}
      />
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>On Hand</th>
              <th>Reserved</th>
              <th>Available</th>
              <th>Reorder At</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INVENTORY.map(item => {
              const available = item.qty_on_hand - item.qty_reserved
              const lowStock = available <= item.qty_reorder
              return (
                <tr key={item.id}>
                  <td className="text-muted text-sm">{item.sku}</td>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td className="text-muted text-sm">{item.category.replace('_', ' ')}</td>
                  <td className="text-muted text-sm">{item.location}</td>
                  <td>{item.qty_on_hand}</td>
                  <td className="text-muted">{item.qty_reserved}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: lowStock ? 'var(--color-danger)' : 'var(--color-success)' }}>
                      {available}
                    </span>
                    {lowStock && <span className="badge badge-danger" style={{ marginLeft: 6 }}>Low</span>}
                  </td>
                  <td className="text-muted">{item.qty_reorder}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}
