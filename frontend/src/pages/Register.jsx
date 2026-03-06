import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'
import { Package, Mail, Lock, User, Building2, ArrowLeft } from 'lucide-react'
import Confetti from '../components/Confetti'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    company_name: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.password_confirmation) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { data } = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        company_name: form.company_name,
      })

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Company registered successfully!')
      setShowConfetti(true)
      // Delay redirect to show confetti
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
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
        padding: '40px 40px',
        width: '100%',
        maxWidth: 460,
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeIn 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, background: '#4f46e5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Package size={30} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1e1b4b' }}>Create Your Account</h1>
          <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
            Start managing your inventory today
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <div style={{ position: 'relative' }}>
              <Building2 size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                name="company_name"
                className="form-control"
                style={{ paddingLeft: 38 }}
                placeholder="Your Company Name"
                value={form.company_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Your Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                name="name"
                className="form-control"
                style={{ paddingLeft: 38 }}
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                name="email"
                className="form-control"
                style={{ paddingLeft: 38 }}
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  style={{ paddingLeft: 38 }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password"
                  name="password_confirmation"
                  className="form-control"
                  style={{ paddingLeft: 38 }}
                  placeholder="••••••••"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#64748b', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>

      {/* Confetti on successful registration */}
      {showConfetti && <Confetti particleCount={150} duration={2500} />}
    </div>
  )
}
