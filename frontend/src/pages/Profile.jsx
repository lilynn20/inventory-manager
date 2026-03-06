import { useState } from 'react'
import { User, Mail, Lock, Save, Shield, Building2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.new_password && form.new_password !== form.new_password_confirmation) {
      toast.error('New passwords do not match')
      return
    }

    if (form.new_password && !form.current_password) {
      toast.error('Current password is required to set a new password')
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: form.name,
        email: form.email,
      }

      if (form.current_password && form.new_password) {
        payload.current_password = form.current_password
        payload.new_password = form.new_password
        payload.new_password_confirmation = form.new_password_confirmation
      }

      const { data } = await updateProfile(payload)
      
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      setForm({
        ...form,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      })

      toast.success('Profile updated successfully')
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to update profile'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <User size={28} />
            Profile Settings
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
            Manage your account information and security
          </p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="card" style={{ padding: 0 }}>
        {/* Profile Header */}
        <div style={{
          padding: 24,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 28,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              {user?.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 6,
                background: user?.role === 'admin' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                color: user?.role === 'admin' ? '#4f46e5' : '#6b7280',
              }}>
                <Shield size={12} />
                {user?.role === 'admin' ? 'Administrator' : 'Employee'}
              </span>
              {user?.company && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 13,
                  color: 'var(--text-muted)',
                }}>
                  <Building2 size={14} />
                  {user.company.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
              Account Information
            </h3>
            
            <div style={{ display: 'grid', gap: 16 }}>
              {/* Name */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    style={{ paddingLeft: 38 }}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    style={{ paddingLeft: 38 }}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                Change Password
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                Leave blank to keep your current password
              </p>

              <div style={{ display: 'grid', gap: 16 }}>
                {/* Current Password */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      name="current_password"
                      className="form-control"
                      style={{ paddingLeft: 38 }}
                      value={form.current_password}
                      onChange={handleChange}
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        name="new_password"
                        className="form-control"
                        style={{ paddingLeft: 38 }}
                        value={form.new_password}
                        onChange={handleChange}
                        minLength={6}
                        placeholder="New password"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        name="new_password_confirmation"
                        className="form-control"
                        style={{ paddingLeft: 38 }}
                        value={form.new_password_confirmation}
                        onChange={handleChange}
                        minLength={6}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: 140 }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
