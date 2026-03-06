import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useKeyboard } from '../context/KeyboardContext'
import Breadcrumbs from './Breadcrumbs'
import OnboardingTour, { useOnboarding } from './OnboardingTour'
import {
  LayoutDashboard, Package, Tag, ArrowLeftRight,
  LogOut, Users, Truck, TrendingUp, Activity, Bell, Upload, Settings, Moon, Sun, Keyboard, Menu, X, Search, HelpCircle, ChevronLeft, ChevronRight
} from 'lucide-react'

const getNavSections = (t) => [
  {
    label: t('nav.overview'),
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    ]
  },
  {
    label: t('nav.inventory'),
    items: [
      { to: '/dashboard/products', icon: Package, label: t('nav.products') },
      { to: '/dashboard/categories', icon: Tag, label: t('nav.categories') },
      { to: '/dashboard/suppliers', icon: Truck, label: t('nav.suppliers') },
      { to: '/dashboard/movements', icon: ArrowLeftRight, label: t('nav.stockMovements') },
    ]
  },
  {
    label: t('nav.analytics'),
    items: [
      { to: '/dashboard/predictions', icon: TrendingUp, label: t('nav.predictions') },
    ]
  },
  {
    label: t('nav.administration'),
    adminOnly: true,
    items: [
      { to: '/dashboard/employees', icon: Users, label: t('nav.team') },
      { to: '/dashboard/activity-logs', icon: Activity, label: t('nav.activityLogs') },
      { to: '/dashboard/notifications', icon: Bell, label: t('nav.notifications') },
      { to: '/dashboard/import', icon: Upload, label: t('nav.importData') },
    ]
  },
]

// Keep flat array for backward compatibility
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
  const { language, toggleLanguage, t } = useLanguage()
  const { setShowHelp } = useKeyboard()
  const { showTour, completeTour, startTour } = useOnboarding()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true'
  })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [hoveredItem, setHoveredItem] = useState(null)

  const sidebarWidth = sidebarCollapsed && !isMobile ? 72 : 260

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

  // Persist collapsed state
  const toggleSidebarCollapse = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
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
        width: sidebarWidth,
        background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s ease, width 0.3s ease',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      }}>
        {/* Logo */}
        <div style={{ 
          padding: sidebarCollapsed && !isMobile ? '20px 12px' : '20px', 
          borderBottom: '1px solid rgba(255,255,255,0.08)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'space-between',
          minHeight: 72,
        }}>
          <NavLink 
            to="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              textDecoration: 'none',
              color: 'inherit',
              transition: 'opacity 0.2s',
            }}
            title="Go to homepage"
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
              flexShrink: 0,
            }}>
              <Package size={22} />
            </div>
            {(!sidebarCollapsed || isMobile) && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>Inventory</div>
                <div style={{ fontSize: 11, opacity: 0.5, fontWeight: 500 }}>Management System</div>
              </div>
            )}
          </NavLink>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: 6, borderRadius: 6 }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: sidebarCollapsed && !isMobile ? '16px 8px' : '16px 12px', overflowY: 'auto', overflowX: 'hidden' }}>
          {getNavSections(t)
            .filter(section => !section.adminOnly || isAdmin)
            .map((section, sectionIndex) => (
              <div key={section.label} style={{ marginBottom: 20 }}>
                {/* Section Label */}
                {(!sidebarCollapsed || isMobile) && (
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.35)',
                    padding: '0 14px',
                    marginBottom: 8,
                  }}>
                    {section.label}
                  </div>
                )}
                {sidebarCollapsed && !isMobile && sectionIndex > 0 && (
                  <div style={{ 
                    height: 1, 
                    background: 'rgba(255,255,255,0.08)', 
                    margin: '0 8px 12px',
                  }} />
                )}
                
                {/* Section Items */}
                {section.items.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/dashboard'}
                    onMouseEnter={() => setHoveredItem(to)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
                      gap: 12,
                      padding: sidebarCollapsed && !isMobile ? '12px' : '11px 14px',
                      borderRadius: 10,
                      marginBottom: 4,
                      fontSize: 14,
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      background: isActive 
                        ? 'linear-gradient(90deg, rgba(99,102,241,0.9) 0%, rgba(79,70,229,0.9) 100%)' 
                        : hoveredItem === to 
                          ? 'rgba(255,255,255,0.08)' 
                          : 'transparent',
                      color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                      position: 'relative',
                      textDecoration: 'none',
                      boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
                    })}
                    title={sidebarCollapsed && !isMobile ? label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div style={{
                            position: 'absolute',
                            left: sidebarCollapsed && !isMobile ? '50%' : 0,
                            transform: sidebarCollapsed && !isMobile ? 'translateX(-50%)' : 'none',
                            bottom: sidebarCollapsed && !isMobile ? -2 : 'auto',
                            top: sidebarCollapsed && !isMobile ? 'auto' : '50%',
                            marginTop: sidebarCollapsed && !isMobile ? 0 : -10,
                            width: sidebarCollapsed && !isMobile ? 20 : 3,
                            height: sidebarCollapsed && !isMobile ? 3 : 20,
                            background: 'white',
                            borderRadius: 2,
                            boxShadow: '0 0 8px rgba(255,255,255,0.5)',
                          }} />
                        )}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 22,
                          height: 22,
                          flexShrink: 0,
                        }}>
                          <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        {(!sidebarCollapsed || isMobile) && (
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
        </nav>

        {/* Collapse Toggle (Desktop only) */}
        {!isMobile && (
          <button
            onClick={toggleSidebarCollapse}
            className="sidebar-collapse-btn"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        <style>{`
          .sidebar-collapse-btn {
            position: absolute;
            right: -12px;
            top: 50%;
            transform: translateY(-50%);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            border: 2px solid var(--bg);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: transform 0.2s, box-shadow 0.2s;
            z-index: 10;
          }
          .sidebar-collapse-btn:hover {
            transform: translateY(-50%) scale(1.15);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          }
          .sidebar-collapse-btn:active {
            transform: translateY(-50%) scale(1.05);
          }
          .sidebar-collapse-btn svg {
            pointer-events: none;
          }
        `}</style>

        {/* User */}
        <div style={{ 
          padding: sidebarCollapsed && !isMobile ? '12px 8px' : '16px', 
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.15)',
        }}>
          <NavLink
            to="/dashboard/profile"
            style={({ isActive }) => ({
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              marginBottom: sidebarCollapsed && !isMobile ? 8 : 12,
              padding: sidebarCollapsed && !isMobile ? '8px' : '10px 12px', 
              borderRadius: 10, 
              textDecoration: 'none',
              justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
              background: isActive ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)',
              border: '1px solid',
              borderColor: isActive ? 'rgba(99,102,241,0.5)' : 'transparent',
              transition: 'all 0.2s'
            })}
            title={sidebarCollapsed && !isMobile ? `${user?.name} - ${user?.role}` : undefined}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, color: 'white',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)',
              flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            {(!sidebarCollapsed || isMobile) && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.5, textTransform: 'capitalize', color: 'white' }}>{user?.role}</div>
                </div>
                <Settings size={16} style={{ opacity: 0.5, color: 'white', flexShrink: 0 }} />
              </>
            )}
          </NavLink>
          <button
            onClick={handleLogout}
            title={sidebarCollapsed && !isMobile ? t('auth.signOut') : undefined}
            style={{
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
              gap: 8,
              padding: sidebarCollapsed && !isMobile ? '10px' : '10px 14px', 
              borderRadius: 8, 
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.1)', 
              color: '#fca5a5',
              fontWeight: 600, 
              fontSize: 13, 
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239,68,68,0.2)'
              e.target.style.borderColor = 'rgba(239,68,68,0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(239,68,68,0.1)'
              e.target.style.borderColor = 'rgba(239,68,68,0.3)'
            }}
          >
            <LogOut size={16} />
            {(!sidebarCollapsed || isMobile) && t('auth.signOut')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{
        flex: 1,
        marginLeft: isMobile ? 0 : sidebarWidth,
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

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 36,
              height: 36,
              padding: '0 10px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: 13,
              fontWeight: 700,
              gap: 6,
            }}
            title={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
          >
            <span style={{ fontSize: 16 }}>{language === 'en' ? '🇬🇧' : '🇫🇷'}</span>
            {!isMobile && <span>{language.toUpperCase()}</span>}
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

          {/* Help/Tour button */}
          <button
            onClick={startTour}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title="Start tour"
          >
            <HelpCircle size={18} />
          </button>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: isMobile ? '16px' : '28px 28px', background: 'var(--bg)' }}>
          <Breadcrumbs />
          <Outlet />
        </div>
      </main>

      {/* Onboarding Tour */}
      {showTour && <OnboardingTour onComplete={completeTour} />}
    </div>
  )
}
