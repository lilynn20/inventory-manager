import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, BarChart3, Users, Shield, ArrowRight, Check, TrendingUp, Bell, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react'

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    setProfileOpen(false)
  }

  const features = [
    {
      icon: Package,
      title: 'Inventory Tracking',
      description: 'Track all your products, stock levels, and movements in real-time.',
      color: '#4f46e5'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into your inventory with powerful analytics and reports.',
      color: '#10b981'
    },
    {
      icon: TrendingUp,
      title: 'Smart Predictions',
      description: 'AI-powered consumption forecasting and reorder suggestions.',
      color: '#f59e0b'
    },
    {
      icon: Bell,
      title: 'Low Stock Alerts',
      description: 'Get notified when products are running low on stock.',
      color: '#ef4444'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Invite team members and manage roles with admin controls.',
      color: '#3b82f6'
    },
    {
      icon: Shield,
      title: 'Secure & Isolated',
      description: 'Your data is completely isolated and secure from other companies.',
      color: '#8b5cf6'
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)' }}>
      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={22} color="white" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>StockFlow</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {user ? (
              /* Logged in - show profile dropdown */
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 12,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    color: 'white',
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</span>
                  <ChevronDown size={16} style={{ opacity: 0.7, transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>
                
                {profileOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'white',
                    borderRadius: 12,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    minWidth: 200,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.15s ease',
                    zIndex: 100,
                  }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{user.name}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</div>
                      <div style={{ marginTop: 6 }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          background: user.role === 'admin' ? '#4f46e5' : '#6b7280',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '8px' }}>
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 8,
                          color: '#374151',
                          textDecoration: 'none',
                          fontWeight: 500,
                          fontSize: 14,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.target.style.background = '#f3f4f6'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}
                      >
                        <LayoutDashboard size={16} />
                        Go to Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 8,
                          color: '#374151',
                          textDecoration: 'none',
                          fontWeight: 500,
                          fontSize: 14,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.target.style.background = '#f3f4f6'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}
                      >
                        <User size={16} />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 8,
                          color: '#ef4444',
                          fontWeight: 500,
                          fontSize: 14,
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => e.target.style.background = '#fef2f2'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in - show sign in / register */
              <>
                <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 15 }}>
                  Sign In
                </Link>
                <Link to="/register" style={{ background: 'white', color: '#4f46e5', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 52, fontWeight: 900, color: 'white', marginBottom: 20, lineHeight: 1.15 }}>
            Intelligent Inventory<br />
            <span style={{ color: '#a5b4fc' }}>Management System</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', marginBottom: 40, lineHeight: 1.6 }}>
            Track stock, predict demand, manage suppliers, and never run out of inventory again.
            Built for small businesses that want to grow smarter.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'white', color: '#4f46e5', padding: '16px 32px',
              borderRadius: 12, fontWeight: 700, fontSize: 17,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 32px',
              borderRadius: 12, fontWeight: 600, fontSize: 17, border: '1px solid rgba(255,255,255,0.2)'
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 24px 100px', background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 50 }}>
            Everything You Need to Manage Inventory
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 28,
                border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 12,
                  background: feature.color + '25', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <feature.icon size={24} color={feature.color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', background: '#4f46e5', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 16 }}>
            Ready to Take Control of Your Inventory?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>
            Join thousands of businesses managing their stock with StockFlow. Free forever for small teams.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'white', color: '#4f46e5', padding: '16px 40px',
            borderRadius: 12, fontWeight: 700, fontSize: 17
          }}>
            Create Your Free Account <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '30px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          © 2026 StockFlow. Built for smart inventory management.
        </p>
      </footer>
    </div>
  )
}
