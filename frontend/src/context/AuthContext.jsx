import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, logout as logoutApi } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

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

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
