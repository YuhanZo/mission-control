import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/',              label: 'Dashboard',     icon: '⊞' },
  { to: '/customers',     label: 'Customers',     icon: '👥' },
  { to: '/jobs',          label: 'Jobs',          icon: '🔧' },
  { to: '/quotes',        label: 'Quotes',        icon: '📋' },
  { to: '/orders',        label: 'Orders',        icon: '📦' },
  { to: '/installations', label: 'Installations', icon: '🗓' },
  { to: '/inventory',     label: 'Inventory',     icon: '🏭' },
  { to: '/tasks',         label: 'Tasks',         icon: '✓' },
  { to: '/settings',      label: 'Settings',      icon: '⚙' },
]

export function Sidebar() {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--color-brand)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
          James Blinds
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 }}>
          Mission Control
        </div>
      </div>

      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 16px',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              transition: 'all 0.12s',
              textDecoration: 'none',
            })}
          >
            <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
      }}>
        v0.1.0
      </div>
    </aside>
  )
}
