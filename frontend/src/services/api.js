import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ----- Auth -----
export const login    = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)
export const logout   = ()     => api.post('/auth/logout')
export const getMe    = ()     => api.get('/auth/me')
export const updateProfile = (data) => api.put('/auth/profile', data)

// ----- Password Reset -----
export const forgotPassword = (data) => api.post('/forgot-password', data)
export const resetPassword  = (data) => api.post('/reset-password', data)

// ----- Employees (Admin only) -----
export const getEmployees   = ()         => api.get('/employees')
export const addEmployee    = (data)     => api.post('/employees', data)
export const deleteEmployee = (id)       => api.delete(`/employees/${id}`)

// ----- Dashboard -----
export const getDashboard = (params) => api.get('/dashboard', { params })

// ----- Categories -----
export const getCategories    = ()           => api.get('/categories')
export const createCategory   = (data)       => api.post('/categories', data)
export const updateCategory   = (id, data)   => api.put(`/categories/${id}`, data)
export const deleteCategory   = (id)         => api.delete(`/categories/${id}`)

// ----- Products -----
export const getProducts    = (params)     => api.get('/products', { params })
export const createProduct  = (data)       => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateProduct  = (id, data)   => api.post(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteProduct  = (id)         => api.delete(`/products/${id}`)

// ----- Suppliers -----
export const getSuppliers    = (params)    => api.get('/suppliers', { params })
export const createSupplier  = (data)      => api.post('/suppliers', data)
export const updateSupplier  = (id, data)  => api.put(`/suppliers/${id}`, data)
export const deleteSupplier  = (id)        => api.delete(`/suppliers/${id}`)

// ----- Stock Movements -----
export const getMovements   = (params)   => api.get('/stock-movements', { params })
export const createMovement = (data)     => api.post('/stock-movements', data)

// ----- Predictions & Analytics -----
export const getPredictions     = ()           => api.get('/predictions')
export const getTopSelling      = (params)     => api.get('/predictions/top-selling', { params })
export const getStockEvolution  = (params)     => api.get('/predictions/stock-evolution', { params })

// ----- Activity Logs (Admin) -----
export const getActivityLogs      = (params) => api.get('/activity-logs', { params })
export const getActivityLogTypes  = ()       => api.get('/activity-logs/types')

// ----- Exports -----
export const exportProducts       = ()       => api.get('/export/products', { responseType: 'blob' })
export const exportMovements      = (params) => api.get('/export/stock-movements', { params, responseType: 'blob' })
export const exportLowStock       = ()       => api.get('/export/low-stock', { responseType: 'blob' })

// ----- Notifications (Admin) -----
export const getLowStockPreview   = ()       => api.get('/notifications/low-stock/preview')
export const sendLowStockAlert    = ()       => api.post('/notifications/low-stock/send')

// ----- Import (Admin) -----
export const importProducts       = (file)   => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/import/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export const importSuppliers      = (file)   => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/import/suppliers', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export const downloadTemplate     = (type)   => api.get(`/import/template/${type}`, { responseType: 'blob' })
