import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../components/ConfirmDialog'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react'
import DataTable from '../components/DataTable'

function CategoryModal({ category, onClose, onSave }) {
  const [name, setName]             = useState(category?.name || '')
  const [description, setDescription] = useState(category?.description || '')
  const [saving, setSaving]           = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (category) {
        await updateCategory(category._id, { name, description })
        toast.success('Category updated')
      } else {
        await createCategory({ name, description })
        toast.success('Category created')
      }
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Error saving category')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{category ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Name *</label>
              <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required placeholder="e.g. Electronics" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" value={description} onChange={e=>setDescription(e.target.value)} rows={3} placeholder="Optional description" style={{ resize:'vertical' }} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : category ? 'Update' : 'Create'}
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

  const load = () => {
    getCategories()
      .then(r => setCategories(r.data))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (cat) => {
    const result = await confirm({
      title: 'Delete Category',
      message: `Are you sure you want to delete "${cat.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger'
    })
    if (!result) return
    try {
      await deleteCategory(cat._id)
      toast.success('Category deleted')
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete')
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add Category
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
                label: 'Name',
                sortable: true,
                render: (cat) => <strong>{cat.name}</strong>
              },
              {
                key: 'description',
                label: 'Description',
                render: (cat) => <span style={{ color:'var(--text-muted)', maxWidth:300 }}>{cat.description || '—'}</span>
              },
              {
                key: 'products_count',
                label: 'Products',
                sortable: true,
                render: (cat) => <span className="badge badge-info">{cat.products_count ?? 0}</span>
              },
              {
                key: 'created_at',
                label: 'Created',
                sortable: true,
                render: (cat) => <span style={{ color:'var(--text-muted)', fontSize:13 }}>{new Date(cat.created_at).toLocaleDateString()}</span>
              },
              ...(isAdmin ? [{
                key: 'actions',
                label: 'Actions',
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
            emptyMessage="No categories found"
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
