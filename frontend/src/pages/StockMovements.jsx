import { useEffect, useState } from 'react'
import { getMovements, createMovement, getProducts, exportMovements } from '../services/api'
import toast from 'react-hot-toast'
import { Plus, X, ArrowUp, ArrowDown, ArrowLeftRight, Download } from 'lucide-react'
import DataTable from '../components/DataTable'

function MovementModal({ products, onClose, onSave }) {
  const [form, setForm] = useState({ product_id:'', type:'in', quantity:'', note:'' })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const selectedProduct = products.find(p => p._id === form.product_id)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createMovement(form)
      toast.success(`Stock ${form.type === 'in' ? 'added' : 'removed'} successfully`)
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error recording movement')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Record Stock Movement</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Product *</label>
              <select className="form-control" value={form.product_id} onChange={e=>set('product_id',e.target.value)} required>
                <option value="">Select a product</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} (Stock: {p.quantity})
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div style={{
                padding:'10px 14px', background:'#f8fafc', borderRadius:8,
                marginBottom:16, fontSize:13, color:'var(--text-muted)'
              }}>
                Current stock: <strong style={{ color:'var(--text)' }}>{selectedProduct.quantity} units</strong>
                {selectedProduct.quantity <= selectedProduct.low_stock_threshold && (
                  <span className="badge badge-warning" style={{ marginLeft:8 }}>Low Stock</span>
                )}
              </div>
            )}

            <div className="form-group">
              <label>Movement Type *</label>
              <div style={{ display:'flex', gap:12 }}>
                {[['in','Stock In','#10b981'],['out','Stock Out','#ef4444']].map(([val,label,color]) => (
                  <label
                    key={val}
                    style={{
                      flex:1, display:'flex', alignItems:'center', gap:8,
                      padding:'10px 16px', border:`2px solid ${form.type===val ? color : 'var(--border)'}`,
                      borderRadius:8, cursor:'pointer', background: form.type===val ? color+'12' : 'white',
                      transition:'all 0.2s'
                    }}
                  >
                    <input type="radio" name="type" value={val} checked={form.type===val} onChange={e=>set('type',e.target.value)} style={{ display:'none' }} />
                    <div style={{ width:8, height:8, borderRadius:'50%', background:color }} />
                    <span style={{ fontWeight:600, fontSize:14, color: form.type===val ? color : 'var(--text)' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number" min="1" className="form-control"
                value={form.quantity} onChange={e=>set('quantity',e.target.value)} required
                placeholder="Enter quantity"
              />
              {form.type === 'out' && selectedProduct && form.quantity && (
                <p style={{ fontSize:12, color: parseInt(form.quantity) > selectedProduct.quantity ? '#ef4444' : '#10b981', marginTop:4 }}>
                  {parseInt(form.quantity) > selectedProduct.quantity
                    ? `⚠️ Exceeds available stock (${selectedProduct.quantity})`
                    : `✓ After removal: ${selectedProduct.quantity - parseInt(form.quantity)} units`
                  }
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Note</label>
              <textarea
                className="form-control" rows={2} style={{ resize:'vertical' }}
                value={form.note} onChange={e=>set('note',e.target.value)}
                placeholder="Optional note (e.g. Sales order #123)"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Record Movement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function StockMovements() {
  const [movements, setMovements] = useState([])
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [filterType, setFilterType] = useState('')
  const [filterProduct, setFilterProduct] = useState('')

  const load = () => {
    const params = {}
    if (filterType)    params.type = filterType
    if (filterProduct) params.product_id = filterProduct
    getMovements(params)
      .then(r => setMovements(r.data))
      .catch(() => toast.error('Failed to load movements'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getProducts().then(r => setProducts(r.data)).catch(console.error)
  }, [])

  useEffect(() => { load() }, [filterType, filterProduct])

  const handleExport = async () => {
    try {
      const params = {}
      if (filterType) params.type = filterType
      const { data } = await exportMovements(params)
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `stock_movements_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Movements exported successfully')
    } catch (err) {
      toast.error('Failed to export movements')
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Stock Movements</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={handleExport}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <Plus size={16} /> Record Movement
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <select className="form-control" style={{ width:160 }} value={filterType} onChange={e=>setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="in">Stock In</option>
          <option value="out">Stock Out</option>
        </select>
        <select className="form-control" style={{ width:220 }} value={filterProduct} onChange={e=>setFilterProduct(e.target.value)}>
          <option value="">All Products</option>
          {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>

      {/* Summary badges */}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <div style={{ padding:'8px 16px', background:'#d1fae5', borderRadius:10, display:'flex', alignItems:'center', gap:6 }}>
          <ArrowUp size={14} color="#065f46" />
          <span style={{ fontSize:13, fontWeight:600, color:'#065f46' }}>
            In: {movements.filter(m=>m.type==='in').reduce((s,m)=>s+m.quantity,0)} units
          </span>
        </div>
        <div style={{ padding:'8px 16px', background:'#fee2e2', borderRadius:10, display:'flex', alignItems:'center', gap:6 }}>
          <ArrowDown size={14} color="#991b1b" />
          <span style={{ fontSize:13, fontWeight:600, color:'#991b1b' }}>
            Out: {movements.filter(m=>m.type==='out').reduce((s,m)=>s+m.quantity,0)} units
          </span>
        </div>
      </div>

      {loading
        ? <div className="spinner" />
        : (
          <DataTable
            columns={[
              {
                key: 'type',
                label: 'Type',
                sortable: true,
                render: (m) => (
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{
                      width:28, height:28, borderRadius:'50%',
                      background: m.type==='in' ? '#d1fae5' : '#fee2e2',
                      display:'flex', alignItems:'center', justifyContent:'center'
                    }}>
                      {m.type==='in'
                        ? <ArrowUp size={13} color="#065f46" />
                        : <ArrowDown size={13} color="#991b1b" />
                      }
                    </div>
                    <span className={`badge ${m.type==='in' ? 'badge-success' : 'badge-danger'}`}>
                      {m.type==='in' ? 'Stock In' : 'Stock Out'}
                    </span>
                  </div>
                )
              },
              {
                key: 'product.name',
                label: 'Product',
                sortable: true,
                render: (m) => <strong>{m.product?.name || '—'}</strong>
              },
              {
                key: 'quantity',
                label: 'Quantity',
                sortable: true,
                render: (m) => (
                  <>
                    <span style={{ fontWeight:700, color: m.type==='in' ? '#10b981' : '#ef4444', fontSize:16 }}>
                      {m.type==='in' ? '+' : '-'}{m.quantity}
                    </span>
                    <span style={{ fontSize:12, color:'var(--text-muted)', marginLeft:4 }}>units</span>
                  </>
                )
              },
              {
                key: 'user.name',
                label: 'By',
                sortable: true,
                render: (m) => <span style={{ fontSize:13 }}>{m.user?.name || '—'}</span>
              },
              {
                key: 'note',
                label: 'Note',
                render: (m) => <span style={{ color:'var(--text-muted)', fontSize:13, maxWidth:200 }}>{m.note || '—'}</span>
              },
              {
                key: 'created_at',
                label: 'Date',
                sortable: true,
                render: (m) => <span style={{ color:'var(--text-muted)', fontSize:13 }}>{new Date(m.created_at).toLocaleString()}</span>
              }
            ]}
            data={movements}
            emptyIcon={<ArrowLeftRight size={40} />}
            emptyMessage="No movements found"
          />
        )
      }

      {modal && (
        <MovementModal
          products={products}
          onClose={() => setModal(false)}
          onSave={() => { setModal(false); load() }}
        />
      )}
    </div>
  )
}
