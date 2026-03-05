import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'
import { Package, Mail, Lock, User, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
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
      window.location.href = '/'
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
    }}>
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '40px 40px',
        width: '100%',
        maxWidth: 460,
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
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
    </div>
  )
}
