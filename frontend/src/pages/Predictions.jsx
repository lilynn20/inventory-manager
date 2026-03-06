import { useEffect, useState } from 'react'
import { getPredictions, getTopSelling, getStockEvolution } from '../services/api'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js'
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle, ShoppingCart,
  Package, DollarSign, Calendar, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement, Filler
)

function SummaryCard({ icon: Icon, label, value, color, sub }) {
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

function TrendIcon({ trend }) {
  if (trend === 'increasing') return <TrendingUp size={16} color="#10b981" />
  if (trend === 'decreasing') return <TrendingDown size={16} color="#ef4444" />
  return <Minus size={16} color="#6b7280" />
}

export default function Predictions() {
  const [predictionData, setPredictionData] = useState(null)
  const [topSellingData, setTopSellingData] = useState(null)
  const [evolutionData, setEvolutionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [topSellingDays, setTopSellingDays] = useState(30)

  const loadData = async () => {
    try {
      const [pred, top, evo] = await Promise.all([
        getPredictions(),
        getTopSelling({ days: topSellingDays, limit: 10 }),
        getStockEvolution({ days: 30 })
      ])
      setPredictionData(pred.data)
      setTopSellingData(top.data)
      setEvolutionData(evo.data)
    } catch (err) {
      toast.error('Failed to load predictions')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (!loading) {
      getTopSelling({ days: topSellingDays, limit: 10 })
        .then(r => setTopSellingData(r.data))
        .catch(() => {})
    }
  }, [topSellingDays])

  const handleRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  if (loading) return <div className="spinner" />

  const { summary, predictions } = predictionData
  const needsReorder = predictions.filter(p => p.suggestion.needs_reorder)
  const critical = predictions.filter(p => (p.forecast.days_until_stockout ?? Infinity) <= 7)

  // Stock evolution chart
  const evolutionChartData = {
    labels: evolutionData?.data.map(d => d.date.slice(5)) || [],
    datasets: [
      {
        label: 'Stock In',
        data: evolutionData?.data.map(d => d.stock_in) || [],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Stock Out',
        data: evolutionData?.data.map(d => d.stock_out) || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // Top selling chart
  const topSellingChartData = {
    labels: topSellingData?.top_selling.map(p => p.product_name.slice(0, 15)) || [],
    datasets: [{
      label: 'Quantity Sold',
      data: topSellingData?.top_selling.map(p => p.quantity_sold) || [],
      backgroundColor: '#4f46e5',
      borderRadius: 6,
    }],
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Predictions & Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            AI-powered consumption analysis and order suggestions
          </p>
        </div>
        <button className="btn btn-outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <SummaryCard icon={Package} label="Total Products" value={summary.total_products} color="#4f46e5" />
        <SummaryCard icon={ShoppingCart} label="Need Reorder" value={summary.needs_reorder} color="#f59e0b" sub="awaiting restock" />
        <SummaryCard icon={AlertTriangle} label="Critical (≤7 days)" value={summary.critical} color="#ef4444" sub="urgent action required" />
        <SummaryCard icon={DollarSign} label="Reorder Value" value={`$${summary.total_reorder_value.toLocaleString()}`} color="#10b981" sub="estimated total" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Stock Evolution */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Stock Evolution (Last 30 Days)</span>
          </div>
          <Line data={evolutionChartData} options={{
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } },
          }} />
        </div>

        {/* Top Selling */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Top Selling Products</span>
            <select
              className="form-control"
              style={{ width: 120, padding: '6px 10px', fontSize: 13 }}
              value={topSellingDays}
              onChange={e => setTopSellingDays(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          {topSellingData?.top_selling.length > 0 ? (
            <Bar data={topSellingChartData} options={{
              responsive: true,
              indexAxis: 'y',
              plugins: { legend: { display: false } },
              scales: { x: { beginAtZero: true } },
            }} />
          ) : (
            <div className="empty-state"><p>No sales data for this period</p></div>
          )}
        </div>
      </div>

      {/* Reorder Suggestions */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <span className="card-title">🛒 Order Suggestions</span>
          <span className="badge badge-warning">{needsReorder.length} products</span>
        </div>
        {needsReorder.length === 0 ? (
          <div className="empty-state" style={{ padding: 40 }}>
            <p>All products are sufficiently stocked!</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Daily Consumption</th>
                  <th>Days Until Stockout</th>
                  <th>Trend</th>
                  <th>Suggested Order</th>
                  <th>Order Value</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {needsReorder.map(item => (
                  <tr key={item.product.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.product.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.product.category}</div>
                    </td>
                    <td>
                      <span className={item.forecast.is_low_stock ? 'badge badge-danger' : ''}>
                        {item.product.quantity}
                      </span>
                    </td>
                    <td>{item.consumption.daily} / day</td>
                    <td>
                      {item.forecast.days_until_stockout !== null ? (
                        <span className={`badge ${item.forecast.days_until_stockout <= 7 ? 'badge-danger' : item.forecast.days_until_stockout <= 14 ? 'badge-warning' : 'badge-success'}`}>
                          {item.forecast.days_until_stockout} days
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <TrendIcon trend={item.forecast.trend} />
                        <span style={{ fontSize: 12, textTransform: 'capitalize' }}>{item.forecast.trend}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#4f46e5' }}>
                      {item.suggestion.suggested_quantity} units
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ${item.suggestion.reorder_value.toLocaleString()}
                    </td>
                    <td>
                      {item.product.supplier ? (
                        <div>
                          <div style={{ fontWeight: 500 }}>{item.product.supplier.name}</div>
                          {item.product.supplier.email && (
                            <a href={`mailto:${item.product.supplier.email}`} style={{ fontSize: 12, color: '#4f46e5' }}>
                              {item.product.supplier.email}
                            </a>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>No supplier</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Products Predictions */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">📊 All Products Analysis</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Weekly Consumption</th>
                <th>Monthly Consumption</th>
                <th>Days Left</th>
                <th>Trend</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {predictions.slice(0, 20).map(item => (
                <tr key={item.product.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.product.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.product.category}</div>
                  </td>
                  <td>{item.product.quantity}</td>
                  <td>{item.consumption.weekly}</td>
                  <td>{item.consumption.monthly}</td>
                  <td>
                    {item.forecast.days_until_stockout !== null ? (
                      <span className={`badge ${item.forecast.days_until_stockout <= 7 ? 'badge-danger' : item.forecast.days_until_stockout <= 14 ? 'badge-warning' : 'badge-success'}`}>
                        {item.forecast.days_until_stockout}
                      </span>
                    ) : '∞'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <TrendIcon trend={item.forecast.trend} />
                    </div>
                  </td>
                  <td>
                    {item.suggestion.needs_reorder ? (
                      <span className="badge badge-warning">Needs Reorder</span>
                    ) : item.forecast.is_low_stock ? (
                      <span className="badge badge-danger">Low Stock</span>
                    ) : (
                      <span className="badge badge-success">OK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {predictions.length > 20 && (
          <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Showing first 20 of {predictions.length} products
          </div>
        )}
      </div>
    </div>
  )
}
