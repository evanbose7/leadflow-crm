import React from 'react'

export default function Sidebar({ view, setView, apiConnected }) {
  const navItems = [
    { id: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
    { id: 'leads', icon: 'ti-users', label: 'Leads' },
  ]

  return (
    <aside style={{
      width: '220px', background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '32px', height: '32px', background: 'var(--accent)',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className="ti ti-chart-dots" style={{ fontSize: '16px', color: '#fff' }} />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.3px', lineHeight: 1.2 }}>LeadFlow</div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 400 }}>CRM</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 0', flex: 1 }}>
        {navItems.map((item) => {
          const active = view === item.id
          return (
            <div
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 20px', cursor: 'pointer',
                color: active ? 'var(--accent2)' : 'var(--text2)',
                background: active ? 'var(--accent-bg)' : 'transparent',
                borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                fontSize: '13.5px', fontWeight: 400, transition: 'all .15s',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg3)' } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'transparent' } }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: '17px', width: '20px' }} />
              {item.label}
            </div>
          )
        })}
      </nav>

      {/* Status indicator */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', marginBottom: '2px' }}>
          {apiConnected
            ? <span style={{ color: 'var(--green)' }}>● Connected</span>
            : <span style={{ color: 'var(--amber)' }}>⚡ Demo mode</span>}
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--text3)' }}>
          {apiConnected ? 'localhost:5000' : 'Using local data'}
        </div>
      </div>
    </aside>
  )
}
