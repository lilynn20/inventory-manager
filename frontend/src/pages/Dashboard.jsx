import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement
} from 'chart.js'
import { Package, Tag, TrendingDown, Activity, AlertTriangle, ArrowUp, ArrowDown, Calendar, Plus, ArrowLeftRight, Upload, Users, Sparkles } from 'lucide-react'
import { SkeletonStats, SkeletonTable, Skeleton } from '../components/Skeleton'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('6months')
  const [customRange, setCustomRange] = useState({ start: '', end: '' })
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    return sessionStorage.getItem('welcomeBannerDismissed') === 'true'
  })

  const dismissBanner = () => {
    setBannerDismissed(true)
    sessionStorage.setItem('welcomeBannerDismissed', 'true')
  }

  const quickActions = [
    { icon: Plus, label: 'Add Product', to: '/dashboard/products', color: '#4f46e5' },
    { icon: ArrowLeftRight, label: 'Stock Movement', to: '/dashboard/movements', color: '#10b981' },
    { icon: Tag, label: 'New Category', to: '/dashboard/categories', color: '#f59e0b' },
    ...(isAdmin ? [{ icon: Users, label: 'Manage Team', to: '/dashboard/employees', color: '#3b82f6' }] : []),
  ]

  const loadData = () => {
    setLoading(true)
    const params = { period }
    if (period === 'custom' && customRange.start && customRange.end) {
      params.start_date = customRange.start
      params.end_date = customRange.end
    }
    getDashboard(params)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [period])

  const handleCustomRangeApply = () => {
    if (customRange.start && customRange.end) {
      loadData()
    }
  }

  // Only show full skeleton on initial load
  if (loading && !data) return (
    <div className="fade-in" style={{ background: 'var(--bg)' }}>
      <SkeletonStats count={4} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginTop: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <Skeleton height="1rem" width="40%" style={{ marginBottom: 16 }} />
          <Skeleton height="200px" />
        </div>
        <div className="card" style={{ padding: 24 }}>
          <Skeleton height="1rem" width="40%" style={{ marginBottom: 16 }} />
          <Skeleton height="200px" />
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <SkeletonTable rows={5} cols={4} />
      </div>
    </div>
  )
  
  if (!data) return null

  const { stats, low_stock_products, recent_movements, chart_data, top_products } = data

  const barData = {
    labels: chart_data.map(d => d.month),
    datasets: [
      {
        label: 'Stock In',
        data: chart_data.map(d => d.in),
        backgroundColor: 'rgba(79,70,229,0.8)',
        borderRadius: 6,
      },
      {
        label: 'Stock Out',
        data: chart_data.map(d => d.out),
        backgroundColor: 'rgba(239,68,68,0.7)',
        borderRadius: 6,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  }

  const topValues = top_products.slice(0,5)
  const doughnutData = {
    labels: topValues.map(p => p.name),
    datasets: [{
      data: topValues.map(p => p.stock_value),
      backgroundColor: ['#4f46e5','#10b981','#f59e0b','#3b82f6','#ef4444'],
      borderWidth: 0,
    }],
  }

  return (
    <div className="fade-in">
      {/* Welcome Banner */}
      {!bannerDismissed && (
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: -30,
            right: 100,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
          
          <button
            onClick={dismissBanner}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: 6,
              padding: '4px 8px',
              color: 'white',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Sparkles size={20} color="#fbbf24" />
              <span style={{ color: '#fbbf24', fontSize: 13, fontWeight: 600 }}>
                {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
              </span>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 8 }}>
              Welcome back, {user?.name?.split(' ')[0]}!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 20 }}>
              Here's what's happening with your inventory today. You have{' '}
              <strong style={{ color: '#fbbf24' }}>{data?.stats?.low_stock_count || 0} items</strong> that need restocking.
            </p>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 10,
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                >
                  <action.icon size={16} />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="page-header" style={{ marginBottom: 16 }}>
        <h1 className="page-title">Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </span>
        </div>
      </div>

      {/* Date Range Filter */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 24, 
        padding: '12px 16px', 
        background: 'var(--card)', 
        borderRadius: 10, 
        border: '1px solid var(--border)' 
      }}>
        <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Period:</span>
        {['7days', '30days', '3months', '6months', '12months'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              background: period === p ? '#4f46e5' : 'transparent',
              color: period === p ? 'white' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            {p === '7days' ? '7 Days' :
             p === '30days' ? '30 Days' :
             p === '3months' ? '3 Months' :
             p === '6months' ? '6 Months' : '12 Months'}
          </button>
        ))}
        <div style={{ borderLeft: '1px solid var(--border)', height: 24, margin: '0 8px' }} />
        <button
          onClick={() => setPeriod('custom')}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: 'none',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            background: period === 'custom' ? '#4f46e5' : 'transparent',
            color: period === 'custom' ? 'white' : 'var(--text-muted)',
          }}
        >
          Custom
        </button>
        {period === 'custom' && (
          <>
            <input
              type="date"
              value={customRange.start}
              onChange={(e) => setCustomRange(r => ({ ...r, start: e.target.value }))}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                fontSize: 13,
                background: 'var(--input-bg)',
                color: 'var(--text)'
              }}
            />
            <span style={{ color: 'var(--text-muted)' }}>to</span>
            <input
              type="date"
              value={customRange.end}
              onChange={(e) => setCustomRange(r => ({ ...r, end: e.target.value }))}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                fontSize: 13,
                background: 'var(--input-bg)',
                color: 'var(--text)'
              }}
            />
            <button
              onClick={handleCustomRangeApply}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                background: '#10b981',
                color: 'white',
              }}
            >
              Apply
            </button>
          </>
        )}
        {loading && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
            <div style={{
              width: 14,
              height: 14,
              border: '2px solid var(--border)',
              borderTopColor: '#4f46e5',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            Updating...
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', 
        gap: 16, 
        marginBottom: 28,
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.2s',
        pointerEvents: loading ? 'none' : 'auto'
      }}>
        <StatCard icon={Package} label="Total Products"   value={stats.total_products}   color="#4f46e5" />
        <StatCard icon={Tag}     label="Categories"       value={stats.total_categories} color="#10b981" />
        <StatCard icon={Activity} label="Total Stock"     value={stats.total_stock}       color="#3b82f6" sub="units in warehouse" />
        <StatCard icon={AlertTriangle} label="Low Stock"  value={stats.low_stock_count}   color="#f59e0b" sub="need restocking" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Stock Movements</span>
          </div>
          <Bar data={barData} options={barOptions} />
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Top Products by Value</span>
          </div>
          {top_products.length > 0
            ? <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            : <div className="empty-state"><p>No product data yet</p></div>
          }
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Low Stock */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">⚠️ Low Stock Products</span>
          </div>
          {low_stock_products.length === 0
            ? <div className="empty-state"><p>All products are sufficiently stocked</p></div>
            : (
              <div>
                {low_stock_products.map(p => (
                  <div key={p._id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', borderBottom: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.category?.name}</div>
                    </div>
                    <span className="badge badge-warning">{p.quantity} left</span>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Recent Movements */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Movements</span>
          </div>
          {recent_movements.length === 0
            ? <div className="empty-state"><p>No movements recorded yet</p></div>
            : (
              <div>
                {recent_movements.map(m => (
                  <div key={m._id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 0', borderBottom: '1px solid #f1f5f9'
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: m.type === 'in' ? '#d1fae5' : '#fee2e2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {m.type === 'in'
                        ? <ArrowUp size={14} color="#065f46" />
                        : <ArrowDown size={14} color="#991b1b" />
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.product?.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        by {m.user?.name} · {new Date(m.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`badge ${m.type === 'in' ? 'badge-success' : 'badge-danger'}`}>
                      {m.type === 'in' ? '+' : '-'}{m.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
