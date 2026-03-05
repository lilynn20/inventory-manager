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

// ----- Employees (Admin only) -----
export const getEmployees   = ()         => api.get('/employees')
export const addEmployee    = (data)     => api.post('/employees', data)
export const deleteEmployee = (id)       => api.delete(`/employees/${id}`)

// ----- Dashboard -----
export const getDashboard = () => api.get('/dashboard')

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

// ----- Stock Movements -----
export const getMovements   = (params)   => api.get('/stock-movements', { params })
export const createMovement = (data)     => api.post('/stock-movements', data)
