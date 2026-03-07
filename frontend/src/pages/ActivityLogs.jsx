import { useEffect, useState } from 'react'
import { getActivityLogs, getActivityLogTypes } from '../services/api'
import toast from 'react-hot-toast'
import { Activity, Search, ChevronLeft, ChevronRight, Filter, User, Calendar, Package, Tag, Truck, ArrowLeftRight } from 'lucide-react'

const iconMap = {
  product: Package,
  category: Tag,
  supplier: Truck,
  stock_movement: ArrowLeftRight,
  user: User,
  employee: User,
}

const actionColors = {
  created: '#10b981',
  updated: '#3b82f6',
  deleted: '#ef4444',
  stock_in: '#10b981',
  stock_out: '#f59e0b',
  login: '#8b5cf6',
  logout: '#64748b',
  export: '#06b6d4',
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [types, setTypes] = useState({ actions: [], entity_types: [] })
  const [filters, setFilters] = useState({
    action: '',
    entity_type: '',
    from: '',
    to: '',
    page: 1,
    per_page: 20,
  })

  const loadLogs = async () => {
    setLoading(true)
    try {
      const params = { ...filters, paginate: true }
      const { data } = await getActivityLogs(params)
      setLogs(data.data || [])
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      })
    } catch (err) {
      toast.error('Failed to load activity logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getActivityLogTypes().then(r => setTypes(r.data)).catch(console.error)
  }, [])

  useEffect(() => {
    loadLogs()
  }, [filters])

  const setPage = (page) => {
    setFilters(f => ({ ...f, page }))
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString()
  }

  const getActionBadge = (action) => {
    const color = actionColors[action] || '#64748b'
    return (
      <span style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: color + '20',
        color: color,
        textTransform: 'capitalize',
      }}>
        {action.replace('_', ' ')}
      </span>
    )
  }

  const getEntityIcon = (entityType) => {
    const Icon = iconMap[entityType] || Activity
    return <Icon size={16} />
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Activity Logs</h1>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          {pagination.total} total activities
        </span>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Action</label>
            <select
              className="form-control"
              style={{ width: 150 }}
              value={filters.action}
              onChange={e => setFilters(f => ({ ...f, action: e.target.value, page: 1 }))}
            >
              <option value="">All Actions</option>
              {types.actions.map(a => (
                <option key={a} value={a}>{a.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Entity</label>
            <select
              className="form-control"
              style={{ width: 150 }}
              value={filters.entity_type}
              onChange={e => setFilters(f => ({ ...f, entity_type: e.target.value, page: 1 }))}
            >
              <option value="">All Entities</option>
              {types.entity_types.map(t2 => (
                <option key={t2} value={t2}>{t2.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>From</label>
            <input
              type="date"
              className="form-control"
              value={filters.from}
              onChange={e => setFilters(f => ({ ...f, from: e.target.value, page: 1 }))}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>To</label>
            <input
              type="date"
              className="form-control"
              value={filters.to}
              onChange={e => setFilters(f => ({ ...f, to: e.target.value, page: 1 }))}
            />
          </div>
          <button
            className="btn btn-outline"
            onClick={() => setFilters({ action: '', entity_type: '', from: '', to: '', page: 1, per_page: 20 })}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : logs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Activity size={40} />
            <p>No activity logs found</p>
          </div>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 13, color: 'var(--text-muted)' }}>
                      {formatDate(log.created_at)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                          {log.user_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span style={{ fontWeight: 500, fontSize: 13 }}>{log.user_name || 'System'}</span>
                      </div>
                    </td>
                    <td>{getActionBadge(log.action)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {getEntityIcon(log.entity_type)}
                        <span style={{ textTransform: 'capitalize', fontSize: 13 }}>{log.entity_type?.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: 200 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{log.entity_name || '—'}</div>
                      {log.details && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {log.details.quantity && `Qty: ${log.details.quantity}`}
                          {log.details.note && ` - ${log.details.note}`}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{log.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Showing page {pagination.current_page} of {pagination.last_page}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
