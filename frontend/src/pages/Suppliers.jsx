import { useEffect, useState } from 'react'
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../components/ConfirmDialog'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Truck, Search, Mail, Phone, MapPin } from 'lucide-react'

function SupplierModal({ supplier, onClose, onSave }) {
  const [form, setForm] = useState({
    name: supplier?.name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
  })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (supplier) {
        await updateSupplier(supplier._id, form)
        toast.success('Supplier updated')
      } else {
        await createSupplier(form)
        toast.success('Supplier created')
      }
      onSave()
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).flat().forEach(m => toast.error(m))
      } else {
        toast.error(err.response?.data?.error || 'Error saving supplier')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{supplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Supplier Name *</label>
              <input
                className="form-control"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
                placeholder="Enter supplier name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="supplier@example.com"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                className="form-control"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                className="form-control"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                rows={2}
                style={{ resize: 'vertical' }}
                placeholder="Full address"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : supplier ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Suppliers() {
  const { isAdmin } = useAuth()
  const { confirm } = useConfirm()
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  const load = () => {
    const params = search ? { search } : {}
    getSuppliers(params)
      .then(r => setSuppliers(r.data))
      .catch(() => toast.error('Failed to load suppliers'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search])

  const handleDelete = async (s) => {
    const result = await confirm({
      title: 'Delete Supplier',
      message: `Are you sure you want to delete "${s.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger'
    })
    if (!result) return
    try {
      await deleteSupplier(s._id)
      toast.success('Supplier deleted')
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete')
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add Supplier
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <div className="search-bar" style={{ maxWidth: 350 }}>
          <Search size={16} className="search-icon" />
          <input
            className="form-control"
            style={{ paddingLeft: 38 }}
            placeholder="Search suppliers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : suppliers.length === 0 ? (
        <div className="card empty-state">
          <Truck size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p>No suppliers found</p>
          {isAdmin && (
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setModal('add')}>
              Add your first supplier
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {suppliers.map(s => (
            <div key={s._id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: '#4f46e518', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Truck size={20} color="#4f46e5" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{s.name}</div>
                  </div>
                </div>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-icon" onClick={() => setModal(s)} title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(s)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                {s.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Mail size={14} />
                    <a href={`mailto:${s.email}`} style={{ color: '#4f46e5', textDecoration: 'none' }}>{s.email}</a>
                  </div>
                )}
                {s.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Phone size={14} />
                    <a href={`tel:${s.phone}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>{s.phone}</a>
                  </div>
                )}
                {s.address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{s.address}</span>
                  </div>
                )}
                {!s.email && !s.phone && !s.address && (
                  <span style={{ fontStyle: 'italic', opacity: 0.6 }}>No contact info</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <SupplierModal
          supplier={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
