import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as loginApi, logout as logoutApi, getMe } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

// Session timeout: 30 min for regular, 30 days for remember me
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
const REMEMBER_TIMEOUT = 30 * 24 * 60 * 60 * 1000 // 30 days
const WARNING_BEFORE = 2 * 60 * 1000 // 2 minutes before timeout

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)

  // Check session expiry on startup
  useEffect(() => {
    const expiry = localStorage.getItem('session_expiry')
    if (expiry && Date.now() > parseInt(expiry)) {
      // Session expired
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('session_expiry')
      localStorage.removeItem('remember_me')
      setUser(null)
    }
  }, [])

  // Session timeout tracking
  useEffect(() => {
    if (!user) return

    const rememberMe = localStorage.getItem('remember_me') === 'true'
    const timeout = rememberMe ? REMEMBER_TIMEOUT : SESSION_TIMEOUT
    
    let warningTimer
    let logoutTimer

    const resetTimers = () => {
      clearTimeout(warningTimer)
      clearTimeout(logoutTimer)
      setShowTimeoutWarning(false)
      
      const newExpiry = Date.now() + timeout
      localStorage.setItem('session_expiry', newExpiry.toString())
      
      if (!rememberMe) {
        // Show warning 2 minutes before timeout
        warningTimer = setTimeout(() => {
          setShowTimeoutWarning(true)
        }, timeout - WARNING_BEFORE)
        
        // Auto logout after timeout
        logoutTimer = setTimeout(() => {
          toast.error('Session expired. Please login again.')
          logout()
        }, timeout)
      }
    }

    // Reset on activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(event => window.addEventListener(event, resetTimers))
    
    resetTimers() // Initial setup

    return () => {
      clearTimeout(warningTimer)
      clearTimeout(logoutTimer)
      events.forEach(event => window.removeEventListener(event, resetTimers))
    }
  }, [user])

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

  const login = async (email, password, rememberMe = false) => {
    setLoading(true)
    try {
      const { data } = await loginApi({ email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('remember_me', rememberMe.toString())
      
      const timeout = rememberMe ? REMEMBER_TIMEOUT : SESSION_TIMEOUT
      localStorage.setItem('session_expiry', (Date.now() + timeout).toString())
      
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

  const logout = useCallback(async () => {
    try { await logoutApi() } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('session_expiry')
    localStorage.removeItem('remember_me')
    setUser(null)
    setShowTimeoutWarning(false)
  }, [])

  const extendSession = useCallback(() => {
    const rememberMe = localStorage.getItem('remember_me') === 'true'
    const timeout = rememberMe ? REMEMBER_TIMEOUT : SESSION_TIMEOUT
    localStorage.setItem('session_expiry', (Date.now() + timeout).toString())
    setShowTimeoutWarning(false)
    toast.success('Session extended')
  }, [])

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
    <AuthContext.Provider value={{ 
      user, setUser, login, logout, loading, isAdmin, initializing,
      showTimeoutWarning, extendSession 
    }}>
      {children}
      
      {/* Session Timeout Warning Modal */}
      {showTimeoutWarning && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: 16,
            padding: 32,
            maxWidth: 400,
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <span style={{ fontSize: 32 }}>⏱️</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Session Expiring Soon
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
              Your session will expire in less than 2 minutes due to inactivity.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={logout}>
                Sign Out
              </button>
              <button className="btn btn-primary" onClick={extendSession}>
                Stay Signed In
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
