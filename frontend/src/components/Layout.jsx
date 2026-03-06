import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useKeyboard } from '../context/KeyboardContext'
import {
  LayoutDashboard, Package, Tag, ArrowLeftRight,
  LogOut, Users, Truck, TrendingUp, Activity, Bell, Upload, Settings, Moon, Sun, Keyboard, Menu, X, Search
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/products',    icon: Package,         label: 'Products' },
  { to: '/dashboard/categories',  icon: Tag,             label: 'Categories' },
  { to: '/dashboard/suppliers',   icon: Truck,           label: 'Suppliers' },
  { to: '/dashboard/movements',   icon: ArrowLeftRight,  label: 'Stock Movements' },
  { to: '/dashboard/predictions', icon: TrendingUp,      label: 'Predictions' },
  { to: '/dashboard/employees',   icon: Users,           label: 'Team', adminOnly: true },
  { to: '/dashboard/activity-logs', icon: Activity,      label: 'Activity Logs', adminOnly: true },
  { to: '/dashboard/notifications', icon: Bell,          label: 'Notifications', adminOnly: true },
  { to: '/dashboard/import',      icon: Upload,          label: 'Import Data', adminOnly: true },
]

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { setShowHelp } = useKeyboard()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [location.pathname, isMobile])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 90,
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: '#1e1b4b',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Package size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Inventory</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>Management System</div>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navItems
            .filter(item => !item.adminOnly || isAdmin)
            .map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 10,
                marginBottom: 4,
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.2s',
                background: isActive ? 'rgba(79,70,229,0.8)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <NavLink
            to="/dashboard/profile"
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
              padding: '8px', borderRadius: 8, textDecoration: 'none',
              background: isActive ? 'rgba(79,70,229,0.8)' : 'transparent',
              transition: 'background 0.2s'
            })}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, color: 'white'
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{user?.name}</div>
              <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'capitalize', color: 'white' }}>{user?.role}</div>
            </div>
            <Settings size={16} style={{ opacity: 0.6, color: 'white' }} />
          </NavLink>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 14px', borderRadius: 8, border: 'none',
              background: 'rgba(239,68,68,0.15)', color: '#fca5a5',
              fontWeight: 600, fontSize: 13, cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 260,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        transition: 'margin-left 0.3s ease',
      }}>
        {/* Topbar */}
        <header style={{
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          padding: isMobile ? '12px 16px' : '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 12 : 16,
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                cursor: 'pointer',
              }}
            >
              <Menu size={20} />
            </button>
          )}

          <div style={{ flex: 1 }} />
          
          {/* Search Button - Ctrl+K */}
          <button
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '7px 14px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: 13,
              transition: 'all 0.2s',
              minWidth: isMobile ? 'auto' : 200,
            }}
            title="Search (Ctrl+K)"
          >
            <Search size={15} />
            {!isMobile && <span style={{ flex: 1, textAlign: 'left' }}>Search...</span>}
            {!isMobile && (
              <kbd style={{
                padding: '2px 6px',
                fontSize: 11,
                fontFamily: 'monospace',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 4,
              }}>⌘K</kbd>
            )}
          </button>

          {/* Keyboard Shortcuts - hide on mobile */}
          {!isMobile && (
            <button
              onClick={() => setShowHelp(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: 13,
                transition: 'all 0.2s',
              }}
              title="Keyboard shortcuts (?)"
            >
              <Keyboard size={16} />
              <kbd style={{
                padding: '2px 6px',
                fontSize: 11,
                fontFamily: 'monospace',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 4,
              }}>?</kbd>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 8,
              border: 'none',
              background: isDark ? 'rgba(251, 191, 36, 0.15)' : 'rgba(99, 102, 241, 0.1)',
              color: isDark ? '#fbbf24' : '#6366f1',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* User info - hide details on mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            {!isMobile && <span style={{ color: 'var(--text-muted)' }}>Signed in as</span>}
            <strong style={{ color: 'var(--text)' }}>{isMobile ? user?.name?.split(' ')[0] : user?.name}</strong>
            {!isMobile && (
              <span
                className={`badge ${isAdmin ? 'badge-info' : 'badge-success'}`}
                style={{ marginLeft: 4 }}
              >
                {user?.role}
              </span>
            )}
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: isMobile ? '16px' : '28px 28px', background: 'var(--bg)' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
