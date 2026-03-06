import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, logout as logoutApi, getMe } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  // Validate token on app startup
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getMe()
        .then(r => {
          setUser(r.data)
          localStorage.setItem('user', JSON.stringify(r.data))
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        })
        .finally(() => setInitializing(false))
    } else {
      setInitializing(false)
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await loginApi({ email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      return true
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed'
      toast.error(msg)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try { await logoutApi() } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  // Show loading while validating token
  if (initializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, isAdmin, initializing }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
