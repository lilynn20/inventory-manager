import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Package, Tag, ArrowLeftRight,
  LogOut, Menu, X, ChevronRight, User, Users
} from 'lucide-react'

const navItems = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products',   icon: Package,         label: 'Products' },
  { to: '/categories', icon: Tag,             label: 'Categories' },
  { to: '/movements',  icon: ArrowLeftRight,  label: 'Stock Movements' },
  { to: '/employees',  icon: Users,           label: 'Team', adminOnly: true },
]

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        background: '#1e1b4b',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transition: 'transform 0.3s',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
      }}
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems
            .filter(item => !item.adminOnly || isAdmin)
            .map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setSidebarOpen(false)}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{user?.name}</div>
              <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 99, display: 'block'
          }}
        />
      )}

      {/* Main */}
      <main style={{
        flex: 1,
        marginLeft: 'var(--sidebar-width)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Topbar */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid var(--border)',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none', border: 'none', color: 'var(--text)',
              cursor: 'pointer', padding: 4, borderRadius: 6,
              display: 'flex', alignItems: 'center'
            }}
          >
            <Menu size={22} />
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <span style={{ color: 'var(--text-muted)' }}>Signed in as</span>
            <strong>{user?.name}</strong>
            <span
              className={`badge ${isAdmin ? 'badge-info' : 'badge-success'}`}
              style={{ marginLeft: 4 }}
            >
              {user?.role}
            </span>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: '28px 28px' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (min-width: 769px) {
          .sidebar { transform: translateX(0) !important; }
        }
      `}</style>
    </div>
  )
}
