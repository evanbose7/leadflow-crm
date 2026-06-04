export const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost']

export const SOURCES = ['Website', 'Referral', 'Cold Call', 'Email Campaign', 'Social Media', 'Other']

export const STATUS_COLORS = {
  New: '#60a5fa',
  Contacted: '#fbbf24',
  Qualified: '#c084fc',
  Converted: '#4ade80',
  Lost: '#f87171',
}

export const STATUS_BG = {
  New: '#0a1628',
  Contacted: '#1f1500',
  Qualified: '#170d26',
  Converted: '#0d2018',
  Lost: '#1f0808',
}

export const STATUS_BORDER = {
  New: '#1a3558',
  Contacted: '#3d2c00',
  Qualified: '#2d1648',
  Converted: '#0d3320',
  Lost: '#3d1212',
}

export const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'New',
  notes: '',
  source: 'Other',
  value: '',
}

export const validateLead = (data) => {
  const errors = {}
  if (!data.name?.trim()) errors.name = 'Name is required'
  if (!data.email?.trim() || !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Valid email is required'
  if (!data.phone?.trim()) errors.phone = 'Phone is required'
  if (!data.company?.trim()) errors.company = 'Company is required'
  return errors
}

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

export const fmtValue = (v) =>
  v ? '₹' + Number(v).toLocaleString('en-IN') : '—'

export const initials = (name) =>
  name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '??'
