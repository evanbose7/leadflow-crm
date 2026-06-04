import React, { useState, useEffect } from 'react'
import { Btn } from './UI'
import { STATUSES, SOURCES, STATUS_COLORS, STATUS_BG, STATUS_BORDER, EMPTY_FORM, validateLead } from '../utils/constants'

function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </label>
      {children}
      {error && <span style={{ color: 'var(--red)', fontSize: '11.5px' }}>{error}</span>}
    </div>
  )
}

const inputStyle = {
  background: 'var(--bg3)', border: '1px solid var(--border)',
  borderRadius: '8px', color: 'var(--text)', fontSize: '13.5px',
  padding: '9px 12px', width: '100%', transition: 'border .15s',
}

export default function LeadModal({ open, onClose, onSave, editLead }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editLead) {
      setForm({
        name: editLead.name || '',
        email: editLead.email || '',
        phone: editLead.phone || '',
        company: editLead.company || '',
        status: editLead.status || 'New',
        notes: editLead.notes || '',
        source: editLead.source || 'Other',
        value: editLead.value || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [editLead, open])

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => { const n = { ...e }; delete n[key]; return n })
  }

  const handleSave = async () => {
    const errs = validateLead(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      await onSave({ ...form, value: Number(form.value) || 0 })
    } finally {
      setSaving(false)
    }
  }

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
        borderRadius: 'var(--radius2)', width: '100%', maxWidth: '540px',
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.2px' }}>
            {editLead ? 'Edit Lead' : 'Add New Lead'}
          </span>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text3)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <i className="ti ti-x" style={{ fontSize: '15px' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Name *" error={errors.name}>
              <input
                style={inputStyle}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Full name"
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </Field>
            <Field label="Email *" error={errors.email}>
              <input
                style={inputStyle}
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="email@company.com"
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </Field>
            <Field label="Phone *" error={errors.phone}>
              <input
                style={inputStyle}
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+91 98765 43210"
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </Field>
            <Field label="Company *" error={errors.company}>
              <input
                style={inputStyle}
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                placeholder="Company name"
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </Field>
            <Field label="Source">
              <select
                style={inputStyle}
                value={form.source}
                onChange={(e) => set('source', e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              >
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Value (₹)">
              <input
                style={inputStyle}
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => set('value', e.target.value)}
                placeholder="0"
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </Field>
          </div>

          {/* Status */}
          <div style={{ marginTop: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px' }}>Status</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {STATUSES.map((s) => {
                const active = form.status === s
                return (
                  <div
                    key={s}
                    onClick={() => set('status', s)}
                    style={{
                      padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                      cursor: 'pointer', transition: 'all .15s',
                      border: `1px solid ${active ? STATUS_BORDER[s] : 'var(--border)'}`,
                      color: active ? STATUS_COLORS[s] : 'var(--text3)',
                      background: active ? STATUS_BG[s] : 'transparent',
                    }}
                  >
                    {s}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginTop: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '5px' }}>Notes</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Add any notes..."
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'flex-end', gap: '10px',
        }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving}>
            <i className={`ti ${saving ? 'ti-loader-2' : 'ti-check'}`} />
            {editLead ? 'Update Lead' : 'Create Lead'}
          </Btn>
        </div>
      </div>
    </div>
  )
}
