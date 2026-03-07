import { useEffect, useState } from 'react'
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../components/ConfirmDialog'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Truck, Search, Mail, Phone, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function SupplierModal({ supplier, onClose, onSave }) {
  const { t } = useTranslation()
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
        toast.success(t(supplier ? 'suppliers.updated' : 'suppliers.created'))
      } else {
        await createSupplier(form)
        toast.success(t('suppliers.created'))
      }
      onSave()
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).flat().forEach(m => toast.error(m))
      } else {
        toast.error(err.response?.data?.error || t('suppliers.errorSaving'))
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{supplier ? t('suppliers.edit') : t('suppliers.add')}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>{t('suppliers.name')} *</label>
              <input
                className="form-control"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
                placeholder={t('suppliers.namePlaceholder')}
              />
            </div>
            <div className="form-group">
              <label>{t('suppliers.email')}</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder={t('suppliers.emailPlaceholder')}
              />
            </div>
            <div className="form-group">
              <label>{t('suppliers.phone')}</label>
              <input
                className="form-control"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder={t('suppliers.phonePlaceholder')}
              />
            </div>
            <div className="form-group">
              <label>{t('suppliers.address')}</label>
              <textarea
                className="form-control"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                rows={2}
                style={{ resize: 'vertical' }}
                placeholder={t('suppliers.addressPlaceholder')}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>{t('actions.cancel')}</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? t('actions.saving') : supplier ? t('actions.update') : t('actions.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Suppliers() {
  const { t } = useTranslation()
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
      .catch(() => toast.error(t('suppliers.failedToLoad')))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search])

  const handleDelete = async (s) => {
    const result = await confirm({
      title: t('suppliers.deleteTitle'),
      message: t('suppliers.deleteMessage', { name: s.name }),
      confirmText: t('actions.delete'),
      variant: 'danger'
    })
    if (!result) return
    try {
      await deleteSupplier(s._id)
      toast.success(t('suppliers.deleted'))
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || t('suppliers.failedToDelete'))
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('suppliers.title')}</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> {t('suppliers.add')}
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
            placeholder={t('suppliers.searchPlaceholder')}
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
          <p>{t('suppliers.empty')}</p>
          {isAdmin && (
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setModal('add')}>
              {t('suppliers.addFirst')}
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
                    <button className="btn-icon" onClick={() => setModal(s)} title={t('actions.edit')}>
                      <Pencil size={14} />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(s)} title={t('actions.delete')}>
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
                  <span style={{ fontStyle: 'italic', opacity: 0.6 }}>{t('suppliers.noContact')}</span>
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
