import React from 'react'
import { Btn } from './UI'

export default function ConfirmModal({ open, name, onConfirm, onClose }) {
  if (!open) return null
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 'var(--radius2)', width: '100%', maxWidth: '380px', padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--red-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="ti ti-trash" style={{ color: 'var(--red)', fontSize: '17px' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Delete Lead</h3>
        </div>
        <p style={{ fontSize: '13.5px', color: 'var(--text2)', marginBottom: '20px', lineHeight: 1.7 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text)' }}>{name}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="danger" onClick={onConfirm}>
            <i className="ti ti-trash" />Delete
          </Btn>
        </div>
      </div>
    </div>
  )
}
