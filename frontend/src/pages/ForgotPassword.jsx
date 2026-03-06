import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/api'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, Send } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await forgotPassword({ email })
      setSent(true)
      toast.success(data.message)
      
      // In development, show the debug URL if available
      if (data.debug_url) {
        console.log('Password reset URL:', data.debug_url)
        toast.success('Check console for reset link (development only)', { duration: 5000 })
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14, marginBottom: 20 }}>
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Mail size={28} color="#4f46e5" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Forgot Password?</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: 20, background: '#f0fdf4', borderRadius: 12, border: '1px solid #86efac' }}>
            <div style={{ color: '#16a34a', fontWeight: 600, marginBottom: 8 }}>Email Sent!</div>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              If an account exists with that email, you'll receive a password reset link shortly.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: 16 }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12 }} disabled={loading}>
              {loading ? 'Sending...' : (
                <>
                  <Send size={16} /> Send Reset Link
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
