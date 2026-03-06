import { useState, useEffect } from 'react'
import { Bell, Send, AlertTriangle, Package, Users, Loader2 } from 'lucide-react'
import { getLowStockPreview, sendLowStockAlert } from '../services/api'
import { useConfirm } from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

export default function Notifications() {
  const { confirm } = useConfirm()
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [preview, setPreview] = useState({ products: [], admin_count: 0 })

  useEffect(() => {
    fetchPreview()
  }, [])

  const fetchPreview = async () => {
    try {
      const { data } = await getLowStockPreview()
      setPreview(data)
    } catch (err) {
      toast.error('Failed to load low stock preview')
    } finally {
      setLoading(false)
    }
  }

  const handleSendAlert = async () => {
    if (preview.products.length === 0) {
      toast.error('No low stock products to notify about')
      return
    }

    const result = await confirm({
      title: 'Send Low Stock Alert',
      message: `Send email notification to ${preview.admin_count} admin(s) about ${preview.products.length} low stock product(s)?`,
      confirmText: 'Send Alert',
      variant: 'warning'
    })
    if (!result) return

    setSending(true)
    try {
      const { data } = await sendLowStockAlert()
      toast.success(data.message)
      if (data.failed?.length > 0) {
        toast.error(`Failed to send to: ${data.failed.join(', ')}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send notifications')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={26} />
            Notifications
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            Manage email notifications for your team
          </p>
        </div>
      </div>

      {/* Low Stock Alert Card */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
        {/* Card Header */}
        <div style={{
          padding: 24,
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, rgba(251,146,60,0.1) 0%, rgba(234,179,8,0.1) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(251,146,60,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <AlertTriangle size={24} color="#f97316" />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                  Low Stock Alert
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>
                  Send email notifications to admins about products running low
                </p>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleSendAlert}
              disabled={sending || preview.products.length === 0}
              style={{ background: '#f97316' }}
            >
              {sending ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Alert
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
          <div style={{ padding: 20, textAlign: 'center', borderRight: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 6 }}>
              <Package size={16} />
              <span style={{ fontSize: 14 }}>Low Stock Products</span>
            </div>
            <p style={{
              fontSize: 28, fontWeight: 800, margin: 0,
              color: preview.products.length > 0 ? '#f97316' : '#22c55e'
            }}>
              {preview.products.length}
            </p>
          </div>
          <div style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 6 }}>
              <Users size={16} />
              <span style={{ fontSize: 14 }}>Admin Recipients</span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, margin: 0, color: 'var(--primary)' }}>
              {preview.admin_count}
            </p>
          </div>
        </div>

        {/* Products List */}
        {preview.products.length > 0 ? (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {preview.products.map((product, idx) => (
              <div
                key={product.id}
                style={{
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: idx < preview.products.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text)', margin: 0 }}>{product.name}</p>
                  {product.sku && (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
                      SKU: {product.sku}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontWeight: 700, margin: 0,
                    color: product.quantity === 0 ? '#ef4444' : '#f97316'
                  }}>
                    {product.quantity} units
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
                    Threshold: {product.low_stock_threshold}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(34,197,94,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Package size={32} color="#22c55e" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
              All Stock Levels OK
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0, marginTop: 8 }}>
              No products are currently below their low stock threshold
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div style={{
        background: 'rgba(59,130,246,0.1)',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: 12,
        padding: 20
      }}>
        <h3 style={{ fontWeight: 600, color: 'var(--primary)', margin: 0, marginBottom: 8 }}>
          About Automatic Notifications
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          The system automatically checks for low stock products daily at 8:00 AM and sends email
          notifications to all admin users. You can also use this page to manually trigger
          notifications at any time.
        </p>
      </div>
    </div>
  )
}
