import React, { useState, useRef } from 'react'
import { StatusBadge, SourceBadge, IconBtn, Spinner, Empty } from '../components/UI'
import { STATUSES, SOURCES, STATUS_COLORS, fmtDate, fmtValue } from '../utils/constants'

function SortIcon({ col, sortBy, sortOrder }) {
  if (sortBy !== col) return <i className="ti ti-selector" style={{ fontSize: '13px', marginLeft: '3px', verticalAlign: 'middle', opacity: 0.4 }} />
  return sortOrder === 'asc'
    ? <i className="ti ti-chevron-up" style={{ fontSize: '13px', marginLeft: '3px', verticalAlign: 'middle', color: 'var(--accent2)' }} />
    : <i className="ti ti-chevron-down" style={{ fontSize: '13px', marginLeft: '3px', verticalAlign: 'middle', color: 'var(--accent2)' }} />
}

function StatusDropdown({ lead, onUpdate, open, onToggle }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <StatusBadge status={lead.status} onClick={onToggle} />
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 5px)', left: 0,
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: '10px', overflow: 'hidden', zIndex: 50,
          minWidth: '140px', boxShadow: '0 8px 24px rgba(0,0,0,.4)',
        }}>
          {STATUSES.map((s) => (
            <div
              key={s}
              onClick={(e) => { e.stopPropagation(); onUpdate(lead._id, s) }}
              style={{
                padding: '8px 14px', fontSize: '13px', cursor: 'pointer',
                color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '8px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_COLORS[s], display: 'inline-block', flexShrink: 0 }} />
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const filterStyle = {
  padding: '8px 12px', background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: '8px', color: 'var(--text)', fontSize: '13px', cursor: 'pointer',
}

const thStyle = {
  padding: '11px 16px', textAlign: 'left', fontSize: '11.5px', fontWeight: 500,
  color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px',
  borderBottom: '1px solid var(--border)', background: 'var(--bg3)',
  whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none',
}
const tdStyle = { padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '13.5px', verticalAlign: 'middle' }

export default function Leads({
  leads, loading, total, page, totalPages, limit,
  search, status, source, sortBy, sortOrder,
  onSearch, onStatus, onSource, onSort, onPage, onLimit,
  onEdit, onDelete, onStatusUpdate,
}) {
  const [openDD, setOpenDD] = useState(null)
  const searchRef = useRef()
  let searchTimer = useRef()

  const handleSearch = (v) => {
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => onSearch(v), 350)
  }

  const handleSort = (col) => {
    onSort(col, sortBy === col ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'desc')
  }

  const pageNums = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i)
      else if (Math.abs(i - page) === 2 && !pages.includes('…')) pages.push('…')
    }
    return [...new Set(pages)]
  }

  return (
    <div onClick={() => setOpenDD(null)}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontSize: '16px', pointerEvents: 'none' }} />
          <input
            ref={searchRef}
            defaultValue={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search name, email, company..."
            style={{
              width: '100%', padding: '8px 12px 8px 36px',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--text)', fontSize: '13.5px',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>
        <select style={filterStyle} value={status} onChange={(e) => onStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select style={filterStyle} value={source} onChange={(e) => onSource(e.target.value)}>
          <option value="">All sources</option>
          {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select style={{ ...filterStyle, minWidth: '95px' }} value={limit} onChange={(e) => onLimit(Number(e.target.value))}>
          {[10, 25, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius2)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {[
                  { col: 'name', label: 'Name' },
                  { col: null, label: 'Phone' },
                  { col: 'company', label: 'Company' },
                  { col: 'status', label: 'Status' },
                  { col: null, label: 'Source' },
                  { col: 'value', label: 'Value' },
                  { col: 'createdAt', label: 'Created' },
                  { col: null, label: 'Actions' },
                ].map(({ col, label }) => (
                  <th
                    key={label}
                    style={{ ...thStyle, cursor: col ? 'pointer' : 'default' }}
                    onClick={() => col && handleSort(col)}
                    onMouseEnter={(e) => { if (col) e.currentTarget.style.color = 'var(--text2)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)' }}
                  >
                    {label}
                    {col && <SortIcon col={col} sortBy={sortBy} sortOrder={sortOrder} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}><Spinner /></td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={8}><Empty icon="ti-database-off" message={search || status || source ? 'No leads match your filters — try clearing them.' : 'No leads yet. Add your first lead!'} /></td></tr>
              ) : leads.map((lead) => (
                <tr
                  key={lead._id}
                  onMouseEnter={(e) => { e.currentTarget.querySelectorAll('td').forEach(td => td.style.background = 'rgba(255,255,255,.018)') }}
                  onMouseLeave={(e) => { e.currentTarget.querySelectorAll('td').forEach(td => td.style.background = 'transparent') }}
                >
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500, color: 'var(--text)' }}>{lead.name}</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{lead.email}</div>
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--text2)' }}>{lead.phone}</td>
                  <td style={tdStyle}>{lead.company}</td>
                  <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown
                      lead={lead}
                      open={openDD === lead._id}
                      onToggle={(e) => { e?.stopPropagation?.(); setOpenDD(openDD === lead._id ? null : lead._id) }}
                      onUpdate={(id, s) => { onStatusUpdate(id, s); setOpenDD(null) }}
                    />
                  </td>
                  <td style={tdStyle}><SourceBadge source={lead.source} /></td>
                  <td style={{ ...tdStyle, color: 'var(--green)', fontFamily: 'var(--mono)', fontWeight: 500 }}>{fmtValue(lead.value)}</td>
                  <td style={{ ...tdStyle, color: 'var(--text3)', fontSize: '12.5px' }}>{fmtDate(lead.createdAt)}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <IconBtn icon="ti-pencil" title="Edit" onClick={() => onEdit(lead)} />
                      <IconBtn icon="ti-trash" title="Delete" danger onClick={() => onDelete(lead)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text3)' }}>
            Showing {leads.length} of {total} leads
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PageBtn onClick={() => onPage(page - 1)} disabled={page <= 1}><i className="ti ti-chevron-left" style={{ fontSize: '13px' }} /></PageBtn>
            {pageNums().map((p, i) =>
              p === '…'
                ? <span key={`dots-${i}`} style={{ color: 'var(--text3)', padding: '0 4px', fontSize: '12px' }}>…</span>
                : <PageBtn key={p} active={p === page} onClick={() => onPage(p)}>{p}</PageBtn>
            )}
            <PageBtn onClick={() => onPage(page + 1)} disabled={page >= totalPages}><i className="ti ti-chevron-right" style={{ fontSize: '13px' }} /></PageBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

function PageBtn({ children, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '30px', height: '30px', borderRadius: '7px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'var(--accent)' : 'var(--bg3)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        color: active ? '#fff' : 'var(--text2)',
        cursor: disabled ? 'default' : 'pointer', fontSize: '12px',
        opacity: disabled ? 0.3 : 1, fontFamily: 'var(--font)',
      }}
    >
      {children}
    </button>
  )
}
