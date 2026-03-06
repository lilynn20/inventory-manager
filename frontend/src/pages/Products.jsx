import { useEffect, useState, useCallback } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, getSuppliers, exportProducts, exportLowStock } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useEscapeKey, useNewItemShortcut } from '../context/KeyboardContext'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Package, Search, AlertTriangle, Truck, Download, Printer } from 'lucide-react'
import { SkeletonTable } from '../components/Skeleton'
import { useConfirm } from '../components/ConfirmDialog'
import PrintLabels from '../components/PrintLabels'
import DataTable from '../components/DataTable'

function ProductModal({ product, categories, suppliers, onClose, onSave }) {
  const [form, setForm]   = useState({
    name: product?.name || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    supplier_id: product?.supplier_id || '',
    price: product?.price || '',
    quantity: product?.quantity ?? '',
    low_stock_threshold: product?.low_stock_threshold ?? 10,
  })
  const [image, setImage]   = useState(null)
  const [saving, setSaving] = useState(false)
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})

  // Validation rules
  const validate = (name, value) => {
    switch (name) {
      case 'name':
        if (!value?.trim()) return 'Product name is required'
        if (value.length < 2) return 'Name must be at least 2 characters'
        if (value.length > 100) return 'Name must not exceed 100 characters'
        return null
      case 'category_id':
        if (!value) return 'Please select a category'
        return null
      case 'price':
        if (value === '' || value === null) return 'Price is required'
        if (Number(value) < 0) return 'Price cannot be negative'
        return null
      case 'quantity':
        if (value === '' || value === null) return 'Quantity is required'
        if (Number(value) < 0) return 'Quantity cannot be negative'
        if (!Number.isInteger(Number(value))) return 'Quantity must be a whole number'
        return null
      case 'low_stock_threshold':
        if (value !== '' && Number(value) < 0) return 'Threshold cannot be negative'
        return null
      default:
        return null
    }
  }

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (touched[k]) {
      setErrors(e => ({ ...e, [k]: validate(k, v) }))
    }
  }

  const handleBlur = (k) => {
    setTouched(t => ({ ...t, [k]: true }))
    setErrors(e => ({ ...e, [k]: validate(k, form[k]) }))
  }

  const validateAll = () => {
    const newErrors = {}
    Object.keys(form).forEach(k => {
      const error = validate(k, form[k])
      if (error) newErrors[k] = error
    })
    setErrors(newErrors)
    setTouched(Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {}))
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateAll()) {
      toast.error('Please fix the form errors')
      return
    }
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

  const FieldError = ({ name }) => (
    touched[name] && errors[name] ? (
      <p className="form-error">{errors[name]}</p>
    ) : null
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
            <div className="form-group" style={{ gridColumn:'1/-1' }}>
              <label>Product Name *</label>
              <input 
                className={`form-control ${touched.name && errors.name ? 'form-control-error' : ''}`} 
                value={form.name} 
                onChange={e=>set('name',e.target.value)} 
                onBlur={() => handleBlur('name')}
              />
              <FieldError name="name" />
            </div>
            <div className="form-group" style={{ gridColumn:'1/-1' }}>
              <label>Description</label>
              <textarea className="form-control" value={form.description} onChange={e=>set('description',e.target.value)} rows={2} style={{ resize:'vertical' }} />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select 
                className={`form-control ${touched.category_id && errors.category_id ? 'form-control-error' : ''}`} 
                value={form.category_id} 
                onChange={e=>set('category_id',e.target.value)}
                onBlur={() => handleBlur('category_id')}
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <FieldError name="category_id" />
            </div>
            <div className="form-group">
              <label>Supplier</label>
              <select className="form-control" value={form.supplier_id} onChange={e=>set('supplier_id',e.target.value)}>
                <option value="">No supplier</option>
                {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Price ($) *</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                className={`form-control ${touched.price && errors.price ? 'form-control-error' : ''}`} 
                value={form.price} 
                onChange={e=>set('price',e.target.value)}
                onBlur={() => handleBlur('price')}
              />
              <FieldError name="price" />
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input 
                type="number" 
                min="0" 
                className={`form-control ${touched.quantity && errors.quantity ? 'form-control-error' : ''}`} 
                value={form.quantity} 
                onChange={e=>set('quantity',e.target.value)}
                onBlur={() => handleBlur('quantity')}
              />
              <FieldError name="quantity" />
            </div>
            <div className="form-group">
              <label>Low Stock Threshold</label>
              <input 
                type="number" 
                min="0" 
                className={`form-control ${touched.low_stock_threshold && errors.low_stock_threshold ? 'form-control-error' : ''}`} 
                value={form.low_stock_threshold} 
                onChange={e=>set('low_stock_threshold',e.target.value)}
                onBlur={() => handleBlur('low_stock_threshold')}
              />
              <FieldError name="low_stock_threshold" />
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
  const { confirm }           = useConfirm()
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null)
  const [showPrintLabels, setShowPrintLabels] = useState(false)
  const [search, setSearch]         = useState('')
  const [filterCat, setFilterCat]   = useState('')
  const [filterLow, setFilterLow]   = useState(false)

  // Keyboard shortcuts
  const closeModals = useCallback(() => {
    if (showPrintLabels) setShowPrintLabels(false)
    else if (modal) setModal(null)
  }, [modal, showPrintLabels])
  
  useEscapeKey(closeModals)
  useNewItemShortcut(isAdmin ? () => setModal('add') : null)

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
    Promise.all([
      getCategories().then(r => setCategories(r.data)),
      getSuppliers().then(r => setSuppliers(r.data))
    ]).catch(console.error)
  }, [])

  useEffect(() => { load() }, [search, filterCat, filterLow])

  const handleDelete = async (p) => {
    const result = await confirm({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${p.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger'
    })
    if (!result) return
    try {
      await deleteProduct(p._id)
      toast.success('Product deleted')
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete')
    }
  }

  const isLow = (p) => p.quantity <= p.low_stock_threshold

  const handleExport = async () => {
    try {
      const { data } = await exportProducts()
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Products exported successfully')
    } catch (err) {
      toast.error('Failed to export products')
    }
  }

  const handleExportLowStock = async () => {
    try {
      const { data } = await exportLowStock()
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `low_stock_report_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Low stock report exported')
    } catch (err) {
      toast.error('Failed to export low stock report')
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => setShowPrintLabels(true)}>
            <Printer size={16} /> Print Labels
          </button>
          <button className="btn btn-outline" onClick={handleExport}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-outline" onClick={handleExportLowStock}>
            <AlertTriangle size={16} /> Low Stock Report
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setModal('add')}>
              <Plus size={16} /> Add Product
            </button>
          )}
        </div>
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
        <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, cursor:'pointer', padding:'8px 14px', background:'var(--card)', border:'1px solid var(--border)', borderRadius:8 }}>
          <input type="checkbox" checked={filterLow} onChange={e=>setFilterLow(e.target.checked)} />
          <AlertTriangle size={14} color="var(--warning)" />
          Low Stock Only
        </label>
      </div>

      {loading
        ? <SkeletonTable rows={6} cols={8} />
        : (
          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Product',
                sortable: true,
                render: (p) => (
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    {p.image
                      ? <img src={`/storage/${p.image}`} alt={p.name} style={{ width:36, height:36, borderRadius:8, objectFit:'cover' }} />
                      : <div style={{ width:36, height:36, borderRadius:8, background:'var(--bg-secondary)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <Package size={16} color="var(--text-muted)" />
                        </div>
                    }
                    <div>
                      <div style={{ fontWeight:600 }}>{p.name}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {p.description}
                      </div>
                    </div>
                  </div>
                )
              },
              {
                key: 'category.name',
                label: 'Category',
                sortable: true,
                render: (p) => <span className="badge badge-info">{p.category?.name || '—'}</span>
              },
              {
                key: 'supplier.name',
                label: 'Supplier',
                sortable: true,
                render: (p) => p.supplier ? (
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <Truck size={14} color="var(--text-muted)" />
                    <span style={{ fontSize:13 }}>{p.supplier.name}</span>
                  </div>
                ) : (
                  <span style={{ color:'var(--text-muted)', fontSize:12 }}>—</span>
                )
              },
              {
                key: 'price',
                label: 'Price',
                sortable: true,
                render: (p) => <span style={{ fontWeight:600 }}>${parseFloat(p.price).toFixed(2)}</span>
              },
              {
                key: 'quantity',
                label: 'Quantity',
                sortable: true,
                render: (p) => (
                  <>
                    <span style={{ fontWeight:700, color: isLow(p) ? 'var(--warning)' : 'var(--text)' }}>{p.quantity}</span>
                    <span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:4 }}>units</span>
                  </>
                )
              },
              {
                key: 'status',
                label: 'Status',
                render: (p) => isLow(p)
                  ? <span className="badge badge-warning">Low Stock</span>
                  : <span className="badge badge-success">In Stock</span>
              },
              {
                key: 'created_at',
                label: 'Added',
                sortable: true,
                render: (p) => <span style={{ color:'var(--text-muted)', fontSize:13 }}>{new Date(p.created_at).toLocaleDateString()}</span>
              },
              ...(isAdmin ? [{
                key: 'actions',
                label: 'Actions',
                render: (p) => (
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setModal(p)}>
                      <Pencil size={14} />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              }] : [])
            ]}
            data={products}
            emptyIcon={<Package size={40} />}
            emptyMessage="No products found"
          />
        )
      }

      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          categories={categories}
          suppliers={suppliers}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}

      {showPrintLabels && (
        <PrintLabels
          products={products}
          onClose={() => setShowPrintLabels(false)}
        />
      )}
    </div>
  )
}
