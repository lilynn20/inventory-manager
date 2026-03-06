import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, Mail, Lock, ArrowLeft } from 'lucide-react'

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
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background shapes */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          top: '-200px',
          right: '-200px',
          animation: 'pulse 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
          bottom: '-150px',
          left: '-150px',
          animation: 'pulse 10s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, transparent 70%)',
          top: '40%',
          left: '20%',
          animation: 'pulse 6s ease-in-out infinite',
        }} />
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.3)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Back to Home button */}
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'rgba(255, 255, 255, 0.8)',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 14,
          padding: '10px 16px',
          borderRadius: 10,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s',
          zIndex: 10,
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)'
          e.target.style.color = 'white'
        }}
        onMouseLeave={e => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)'
          e.target.style.color = 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        animation: 'fadeIn 0.3s ease',
        position: 'relative',
        zIndex: 1,
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Password</label>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#4f46e5', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
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
