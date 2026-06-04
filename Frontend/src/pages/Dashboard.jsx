import React from 'react'
import { Card, Empty } from '../components/UI'
import { STATUSES, SOURCES, STATUS_COLORS, fmtDate, initials } from '../utils/constants'

function StatCard({ icon, iconColor, label, value, sub }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius2)', padding: '18px 20px',
    }}>
      <div style={{ fontSize: '22px', color: iconColor, marginBottom: '10px' }}>
        <i className={`ti ${icon}`} />
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '6px' }}>{sub}</div>
    </div>
  )
}

function BarChart({ items, getColor }) {
  const max = Math.max(...items.map((i) => i.count), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {items.map((item) => (
        <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px' }}>
          <span style={{ color: 'var(--text2)', minWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item._id}</span>
          <div style={{ flex: 1, background: 'var(--bg3)', borderRadius: '20px', height: '7px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '20px',
              width: `${(item.count / max) * 100}%`,
              background: getColor(item._id),
              transition: 'width .5s ease',
            }} />
          </div>
          <span style={{ color: 'var(--text3)', minWidth: '20px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '12px' }}>{item.count}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ stats, onAddLead, onViewLeads }) {
  const s = stats

  const statusItems = STATUSES.map((st) => ({
    _id: st,
    count: s?.byStatus.find((x) => x._id === st)?.count || 0,
  }))

  const sourceItems = SOURCES.map((src) => ({
    _id: src,
    count: s?.bySource.find((x) => x._id === src)?.count || 0,
  })).filter((i) => i.count > 0)

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <StatCard icon="ti-users" iconColor="var(--blue)" label="Total Leads" value={s?.total ?? '—'} sub="All time" />
        <StatCard icon="ti-trending-up" iconColor="var(--green)" label="Conversion Rate" value={s ? `${s.conversionRate}%` : '—'} sub="Leads converted" />
        <StatCard
          icon="ti-coin-rupee"
          iconColor="var(--amber)"
          label="Pipeline Value"
          value={s ? '₹' + Number(s.totalValue).toLocaleString('en-IN') : '—'}
          sub="Total value"
        />
        <StatCard
          icon="ti-star"
          iconColor="var(--purple)"
          label="Qualified"
          value={s ? (s.byStatus.find((x) => x._id === 'Qualified')?.count || 0) : '—'}
          sub="High-potential leads"
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Card style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text2)', marginBottom: '16px' }}>Status breakdown</div>
          {s ? <BarChart items={statusItems} getColor={(id) => STATUS_COLORS[id] || 'var(--accent)'} />
            : <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: '13px' }}>Loading...</div>}
        </Card>
        <Card style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text2)', marginBottom: '16px' }}>By source</div>
          {s ? (sourceItems.length > 0
            ? <BarChart items={sourceItems} getColor={() => 'var(--accent)'} />
            : <Empty icon="ti-chart-bar" message="No data yet" />)
            : <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: '13px' }}>Loading...</div>}
        </Card>
      </div>

      {/* Recent leads */}
      <Card style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text2)' }}>Recent leads</div>
          <button
            onClick={onViewLeads}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '5px 11px', borderRadius: '8px', fontSize: '12px', fontWeight: 500,
              background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border2)',
              cursor: 'pointer', fontFamily: 'var(--font)',
            }}
          >
            <i className="ti ti-arrow-right" style={{ fontSize: '13px' }} /> View all
          </button>
        </div>
        {!s ? (
          <div style={{ color: 'var(--text3)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>Loading...</div>
        ) : s.recentLeads?.length === 0 ? (
          <Empty icon="ti-inbox" message="No leads yet — add your first one!" />
        ) : (
          s.recentLeads?.map((lead) => (
            <div key={lead._id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 600, color: 'var(--accent2)', flexShrink: 0,
              }}>
                {initials(lead.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{lead.company}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <span style={{ fontSize: '12px', color: 'var(--text3)' }}>{fmtDate(lead.createdAt)}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '2px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 500,
                  color: STATUS_COLORS[lead.status],
                  background: lead.status === 'New' ? '#0a1628' : lead.status === 'Contacted' ? '#1f1500' : lead.status === 'Qualified' ? '#170d26' : lead.status === 'Converted' ? '#0d2018' : '#1f0808',
                }}>
                  {lead.status}
                </span>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}
