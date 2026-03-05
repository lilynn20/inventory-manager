import { useEffect, useState } from 'react'
import { getDashboard } from '../services/api'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement
} from 'chart.js'
import { Package, Tag, TrendingDown, Activity, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react'

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
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />

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
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          {new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </span>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon={Package} label="Total Products"   value={stats.total_products}   color="#4f46e5" />
        <StatCard icon={Tag}     label="Categories"       value={stats.total_categories} color="#10b981" />
        <StatCard icon={Activity} label="Total Stock"     value={stats.total_stock}       color="#3b82f6" sub="units in warehouse" />
        <StatCard icon={AlertTriangle} label="Low Stock"  value={stats.low_stock_count}   color="#f59e0b" sub="need restocking" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Stock Movements (Last 6 Months)</span>
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
