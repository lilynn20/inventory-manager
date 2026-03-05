import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, Mail, Lock } from 'lucide-react'

export default function Login() {
  const { login, loading } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
      padding: 20,
    }}>
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        animation: 'fadeIn 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, background: '#4f46e5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Package size={30} color="white" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1e1b4b' }}>Inventory Manager</h1>
          <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: 38 }}
                placeholder="admin@inventory.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: 38 }}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#64748b', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
            Create Company Account
          </Link>
        </p>
      </div>
    </div>
  )
}
