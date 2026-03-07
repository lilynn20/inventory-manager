import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../components/ConfirmDialog'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react'
import DataTable from '../components/DataTable'
import { useTranslation } from 'react-i18next'

function CategoryModal({ category, onClose, onSave }) {
  const { t } = useTranslation();
  const [name, setName]             = useState(category?.name || '')
  const [description, setDescription] = useState(category?.description || '')
  const [saving, setSaving]           = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (category) {
        await updateCategory(category._id, { name, description })
        toast.success(t(category ? 'categories.updated' : 'categories.created'));
      } else {
        await createCategory({ name, description })
        toast.success(t('categories.created'));
      }
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || t('categories.errorSaving'));
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{category ? t('categories.edit') : t('categories.add')}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>{t('categories.name')} *</label>
              <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required placeholder={t('categories.namePlaceholder')} />
            </div>
            <div className="form-group">
              <label>{t('categories.description')}</label>
              <textarea className="form-control" value={description} onChange={e=>setDescription(e.target.value)} rows={3} placeholder={t('categories.descriptionPlaceholder')} style={{ resize:'vertical' }} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>{t('actions.cancel')}</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? t('actions.saving') : category ? t('actions.update') : t('actions.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Categories() {
  const { isAdmin }            = useAuth()
  const { confirm }            = useConfirm()
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null) // null | 'add' | category obj
  const { t } = useTranslation();

  const load = () => {
    getCategories()
      .then(r => setCategories(r.data))
      .catch(() => toast.error(t('categories.failedToLoad')))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (cat) => {
    const result = await confirm({
      title: t('categories.deleteTitle'),
      message: t('categories.deleteMessage', { name: cat.name }),
      confirmText: t('actions.delete'),
      variant: 'danger'
    })
    if (!result) return
    try {
      await deleteCategory(cat._id)
      toast.success(t('categories.deleted'))
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || t('categories.failedToDelete'))
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('categories.title')}</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> {t('categories.add')}
          </button>
        )}
      </div>

      {loading
        ? <div className="spinner" />
        : (
          <DataTable
            columns={[
              {
                key: 'index',
                label: '#',
                width: 60,
                render: (cat, index) => <span style={{ color:'var(--text-muted)' }}>{index + 1}</span>
              },
              {
                key: 'name',
                label: t('categories.name'),
                sortable: true,
                render: (cat) => <strong>{cat.name}</strong>
              },
              {
                key: 'description',
                label: t('categories.description'),
                render: (cat) => <span style={{ color:'var(--text-muted)', maxWidth:300 }}>{cat.description || '—'}</span>
              },
              {
                key: 'products_count',
                label: t('categories.products'),
                sortable: true,
                render: (cat) => <span className="badge badge-info">{cat.products_count ?? 0}</span>
              },
              {
                key: 'created_at',
                label: t('categories.created'),
                sortable: true,
                render: (cat) => <span style={{ color:'var(--text-muted)', fontSize:13 }}>{new Date(cat.created_at).toLocaleDateString()}</span>
              },
              ...(isAdmin ? [{
                key: 'actions',
                label: t('actions.actions'),
                render: (cat) => (
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setModal(cat)}>
                      <Pencil size={14} />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              }] : [])
            ]}
            data={categories}
            emptyIcon={<Tag size={40} />}
            emptyMessage={t('categories.empty')}
          />
        )
      }

      {modal && (
        <CategoryModal
          category={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
