import { STATUS_COLORS, STATUS_BG, STATUS_BORDER } from '../utils/constants'

export function Btn({ children, variant = 'ghost', size = 'md', onClick, disabled, type = 'button', style }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    borderRadius: '8px', fontFamily: 'var(--font)', fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .15s',
    border: '1px solid transparent', opacity: disabled ? 0.5 : 1,
  }
  const sizes = {
    sm: { padding: '5px 11px', fontSize: '12px' },
    md: { padding: '8px 16px', fontSize: '13px' },
  }
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' },
    ghost: { background: 'transparent', color: 'var(--text2)', borderColor: 'var(--border2)' },
    danger: { background: 'var(--red-bg)', color: 'var(--red)', borderColor: '#3d1212' },
    icon: { background: 'transparent', color: 'var(--text3)', borderColor: 'transparent', padding: '6px', borderRadius: '7px', width: '30px', height: '30px', justifyContent: 'center' },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </button>
  )
}

export function StatusBadge({ status, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 500,
        color: STATUS_COLORS[status], background: STATUS_BG[status],
        border: `1px solid ${STATUS_BORDER[status]}`,
        cursor: onClick ? 'pointer' : 'default', whiteSpace: 'nowrap',
      }}
    >
      {status}
      {onClick && <i className="ti ti-chevron-down" style={{ fontSize: '11px' }} />}
    </span>
  )
}

export function SourceBadge({ source }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
      borderRadius: '5px', fontSize: '11px', color: 'var(--text3)',
      background: 'var(--bg3)', border: '1px solid var(--border)',
      fontFamily: 'var(--mono)', whiteSpace: 'nowrap',
    }}>
      {source || 'Other'}
    </span>
  )
}

export function IconBtn({ icon, onClick, danger, title }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '30px', height: '30px', borderRadius: '7px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all .15s', border: '1px solid transparent',
        background: hovered ? (danger ? 'var(--red-bg)' : 'var(--bg3)') : 'transparent',
        borderColor: hovered ? (danger ? '#3d1212' : 'var(--border)') : 'transparent',
        color: hovered ? (danger ? 'var(--red)' : 'var(--text)') : 'var(--text3)',
      }}
    >
      <i className={`ti ${icon}`} style={{ fontSize: '15px' }} />
    </button>
  )
}

export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius2)', ...style,
    }}>
      {children}
    </div>
  )
}

export function Empty({ icon = 'ti-database-off', message }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text3)' }}>
      <i className={`ti ${icon}`} style={{ fontSize: '40px', display: 'block', marginBottom: '12px', opacity: 0.4 }} />
      <p style={{ fontSize: '13.5px' }}>{message}</p>
    </div>
  )
}

export function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
      <i className="ti ti-loader-2" style={{ fontSize: '22px', display: 'block', marginBottom: '8px', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <p style={{ fontSize: '13px' }}>Loading...</p>
    </div>
  )
}

import React from 'react'
