import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react'

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
    if (!confirm(`Delete category "${cat.name}"?`)) return
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
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Products</th>
                  <th>Created</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {categories.length === 0
                  ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">
                          <Tag size={40} />
                          <p>No categories found</p>
                        </div>
                      </td>
                    </tr>
                  )
                  : categories.map((cat, i) => (
                    <tr key={cat._id}>
                      <td style={{ color:'var(--text-muted)', width:40 }}>{i+1}</td>
                      <td><strong>{cat.name}</strong></td>
                      <td style={{ color:'var(--text-muted)', maxWidth:300 }}>{cat.description || '—'}</td>
                      <td>
                        <span className="badge badge-info">{cat.products_count ?? 0}</span>
                      </td>
                      <td style={{ color:'var(--text-muted)', fontSize:13 }}>
                        {new Date(cat.created_at).toLocaleDateString()}
                      </td>
                      {isAdmin && (
                        <td>
                          <div style={{ display:'flex', gap:6 }}>
                            <button className="btn btn-outline btn-sm" onClick={() => setModal(cat)}>
                              <Pencil size={14} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat)}>
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
        <CategoryModal
          category={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
