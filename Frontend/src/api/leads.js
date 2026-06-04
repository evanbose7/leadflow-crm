import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export const leadsApi = {
  // GET /api/leads
  getAll: (params) => api.get('/leads', { params }),

  // GET /api/leads/stats
  getStats: () => api.get('/leads/stats'),

  // GET /api/leads/:id
  getOne: (id) => api.get(`/leads/${id}`),

  // POST /api/leads
  create: (data) => api.post('/leads', data),

  // PUT /api/leads/:id
  update: (id, data) => api.put(`/leads/${id}`, data),

  // PATCH /api/leads/:id/status
  updateStatus: (id, status) => api.patch(`/leads/${id}/status`, { status }),

  // DELETE /api/leads/:id
  remove: (id) => api.delete(`/leads/${id}`),

  // DELETE /api/leads (bulk)
  bulkDelete: (ids) => api.delete('/leads', { data: { ids } }),
}
