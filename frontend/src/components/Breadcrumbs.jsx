import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const routeLabels = {
  dashboard: 'Dashboard',
  products: 'Products',
  categories: 'Categories',
  companies: 'Companies',
  movements: 'Stock Movements',
  users: 'Users',
  profile: 'Profile',
  new: 'New',
  edit: 'Edit',
}

export default function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  // Don't show breadcrumbs on auth pages or home
  if (pathnames.length === 0 || ['login', 'register'].includes(pathnames[0])) {
    return null
  }

  const breadcrumbs = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`
    const isLast = index === pathnames.length - 1
    
    // Get label - use mapping or capitalize the value
    let label = routeLabels[value.toLowerCase()] || value
    
    // If it looks like an ID (MongoDB ObjectId), show "Details"
    if (/^[a-f0-9]{24}$/i.test(value)) {
      label = 'Details'
    }

    return { to, label, isLast }
  })

  return (
    <nav 
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        color: 'var(--text-muted)',
        padding: '8px 0',
      }}
    >
      <Link
        to="/dashboard"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <Home size={16} />
      </Link>

      {breadcrumbs.map(({ to, label, isLast }, index) => (
        <span key={to} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          {isLast ? (
            <span style={{ color: 'var(--text)', fontWeight: 500 }}>
              {label}
            </span>
          ) : (
            <Link
              to={to}
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
