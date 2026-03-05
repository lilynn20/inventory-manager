import { useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Package, Search, AlertTriangle } from 'lucide-react'

function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm]   = useState({
    name: product?.name || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    price: product?.price || '',
    quantity: product?.quantity ?? '',
    low_stock_threshold: product?.low_stock_threshold ?? 10,
  })
  const [image, setImage]   = useState(null)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('image', image)
      if (product?.image && !image) fd.append('_keep_image', '1')

      if (product) {
        await updateProduct(product._id, fd)
        toast.success('Product updated')
      } else {
        await createProduct(fd)
        toast.success('Product created')
      }
      onSave()
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).flat().forEach(m => toast.error(m))
      } else {
        toast.error(err.response?.data?.error || 'Error saving product')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
            <div className="form-group" style={{ gridColumn:'1/-1' }}>
              <label>Product Name *</label>
              <input className="form-control" value={form.name} onChange={e=>set('name',e.target.value)} required />
            </div>
            <div className="form-group" style={{ gridColumn:'1/-1' }}>
              <label>Description</label>
              <textarea className="form-control" value={form.description} onChange={e=>set('description',e.target.value)} rows={2} style={{ resize:'vertical' }} />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select className="form-control" value={form.category_id} onChange={e=>set('category_id',e.target.value)} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Price ($) *</label>
              <input type="number" step="0.01" min="0" className="form-control" value={form.price} onChange={e=>set('price',e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input type="number" min="0" className="form-control" value={form.quantity} onChange={e=>set('quantity',e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Low Stock Threshold</label>
              <input type="number" min="0" className="form-control" value={form.low_stock_threshold} onChange={e=>set('low_stock_threshold',e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn:'1/-1' }}>
              <label>Product Image</label>
              <input type="file" accept="image/*" className="form-control" onChange={e=>setImage(e.target.files[0])} />
              {product?.image && !image && (
                <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>Current image will be kept unless a new one is selected.</p>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Products() {
  const { isAdmin }           = useAuth()
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null)
  const [search, setSearch]         = useState('')
  const [filterCat, setFilterCat]   = useState('')
  const [filterLow, setFilterLow]   = useState(false)

  const load = () => {
    const params = {}
    if (search)    params.search = search
    if (filterCat) params.category_id = filterCat
    if (filterLow) params.low_stock = 1
    getProducts(params)
      .then(r => setProducts(r.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(console.error)
  }, [])

  useEffect(() => { load() }, [search, filterCat, filterLow])

  const handleDelete = async (p) => {
    if (!confirm(`Delete product "${p.name}"?`)) return
    try {
      await deleteProduct(p._id)
      toast.success('Product deleted')
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete')
    }
  }

  const isLow = (p) => p.quantity <= p.low_stock_threshold

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <div className="search-bar" style={{ maxWidth:300 }}>
          <Search size={16} className="search-icon" />
          <input
            className="form-control"
            style={{ paddingLeft:38 }}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="form-control" style={{ width:180 }} value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, cursor:'pointer', padding:'8px 14px', background:'white', border:'1px solid var(--border)', borderRadius:8 }}>
          <input type="checkbox" checked={filterLow} onChange={e=>setFilterLow(e.target.checked)} />
          <AlertTriangle size={14} color="#f59e0b" />
          Low Stock Only
        </label>
      </div>

      {loading
        ? <div className="spinner" />
        : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Added</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.length === 0
                  ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-state">
                          <Package size={40} />
                          <p>No products found</p>
                        </div>
                      </td>
                    </tr>
                  )
                  : products.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          {p.image
                            ? <img src={`/storage/${p.image}`} alt={p.name} style={{ width:36, height:36, borderRadius:8, objectFit:'cover' }} />
                            : <div style={{ width:36, height:36, borderRadius:8, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <Package size={16} color="#94a3b8" />
                              </div>
                          }
                          <div>
                            <div style={{ fontWeight:600 }}>{p.name}</div>
                            <div style={{ fontSize:12, color:'var(--text-muted)', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                              {p.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">{p.category?.name || '—'}</span>
                      </td>
                      <td style={{ fontWeight:600 }}>${parseFloat(p.price).toFixed(2)}</td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: isLow(p) ? '#f59e0b' : 'var(--text)'
                        }}>
                          {p.quantity}
                        </span>
                        <span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:4 }}>units</span>
                      </td>
                      <td>
                        {isLow(p)
                          ? <span className="badge badge-warning">Low Stock</span>
                          : <span className="badge badge-success">In Stock</span>
                        }
                      </td>
                      <td style={{ color:'var(--text-muted)', fontSize:13 }}>
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      {isAdmin && (
                        <td>
                          <div style={{ display:'flex', gap:6 }}>
                            <button className="btn btn-outline btn-sm" onClick={() => setModal(p)}>
                              <Pencil size={14} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )
      }

      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
