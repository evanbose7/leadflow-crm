import React, { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import LeadModal from './components/LeadModal'
import ConfirmModal from './components/ConfirmModal'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import { leadsApi } from './api/leads'
import { Btn } from './components/UI'

export default function App() {
  const [view, setView] = useState('dashboard')
  const [apiConnected, setApiConnected] = useState(true)
  const [stats, setStats] = useState(null)
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editLead, setEditLead] = useState(null)
  const [confirmData, setConfirmData] = useState(null)

  const fetchLeads = useCallback(async (overrides = {}) => {
    setLoading(true)
    try {
      const res = await leadsApi.getAll({
        search: overrides.search ?? search,
        status: overrides.status ?? status,
        source: overrides.source ?? source,
        sortBy: overrides.sortBy ?? sortBy,
        sortOrder: overrides.sortOrder ?? sortOrder,
        page: overrides.page ?? page,
        limit: overrides.limit ?? limit,
      })
      setLeads(res.data)
      setTotal(res.pagination.total)
      setTotalPages(res.pagination.totalPages)
      setApiConnected(true)
    } catch (e) {
      setApiConnected(false)
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, status, source, sortBy, sortOrder, page, limit])

  const fetchStats = useCallback(async () => {
    try {
      const res = await leadsApi.getStats()
      setStats(res.data)
    } catch (_) {}
  }, [])

  useEffect(() => { fetchLeads() }, [search, status, source, sortBy, sortOrder, page, limit])
  useEffect(() => { fetchStats() }, [])

  const handleViewChange = (v) => {
    setView(v)
    if (v === 'dashboard') fetchStats()
  }

  const handleSort = (col, order) => { setSortBy(col); setSortOrder(order) }
  const handleSearch = (val) => { setSearch(val); setPage(1) }
  const handleStatus = (val) => { setStatus(val); setPage(1) }
  const handleSource = (val) => { setSource(val); setPage(1) }
  const handlePage = (p) => { if (p >= 1 && p <= totalPages) setPage(p) }
  const handleLimit = (l) => { setLimit(l); setPage(1) }

  const openAdd = () => { setEditLead(null); setShowForm(true) }
  const openEdit = (lead) => { setEditLead(lead); setShowForm(true) }

  const handleSave = async (data) => {
    try {
      if (editLead) {
        await leadsApi.update(editLead._id, data)
        toast.success('Lead updated successfully')
      } else {
        await leadsApi.create(data)
        toast.success('Lead created successfully')
      }
      setShowForm(false)
      setEditLead(null)
      await Promise.all([fetchLeads(), fetchStats()])
    } catch (e) {
      toast.error(e.message)
      throw e
    }
  }

  const handleDelete = async () => {
    if (!confirmData) return
    try {
      await leadsApi.remove(confirmData._id)
      toast.success('Lead deleted')
      setConfirmData(null)
      await Promise.all([fetchLeads(), fetchStats()])
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await leadsApi.updateStatus(id, newStatus)
      toast.success(`Status updated to ${newStatus}`)
      await Promise.all([fetchLeads(), fetchStats()])
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar view={view} setView={handleViewChange} apiConnected={apiConnected} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          padding: '0 28px', height: '58px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <span style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.3px' }}>
            {view === 'dashboard' ? 'Dashboard' : 'Leads'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {view === 'leads' && (
              <Btn variant="ghost" size="sm" onClick={() => fetchLeads()}>
                <i className="ti ti-refresh" style={{ fontSize: '14px' }} />
              </Btn>
            )}
            <Btn variant="primary" onClick={openAdd}>
              <i className="ti ti-plus" style={{ fontSize: '14px' }} /> Add Lead
            </Btn>
          </div>
        </div>

        <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
          {view === 'dashboard' ? (
            <Dashboard stats={stats} onAddLead={openAdd} onViewLeads={() => handleViewChange('leads')} />
          ) : (
            <Leads
              leads={leads} loading={loading} total={total}
              page={page} totalPages={totalPages} limit={limit}
              search={search} status={status} source={source}
              sortBy={sortBy} sortOrder={sortOrder}
              onSearch={handleSearch} onStatus={handleStatus} onSource={handleSource}
              onSort={handleSort} onPage={handlePage} onLimit={handleLimit}
              onEdit={openEdit} onDelete={(lead) => setConfirmData(lead)}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </div>
      </div>

      <LeadModal open={showForm} onClose={() => { setShowForm(false); setEditLead(null) }} onSave={handleSave} editLead={editLead} />
      <ConfirmModal open={!!confirmData} name={confirmData?.name} onClose={() => setConfirmData(null)} onConfirm={handleDelete} />
    </div>
  )
}
