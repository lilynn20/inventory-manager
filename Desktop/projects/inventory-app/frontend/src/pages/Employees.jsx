import { useState, useEffect } from 'react'
import { getEmployees, addEmployee, deleteEmployee } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Users, Plus, Trash2, Shield, User, Mail, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Employees() {
  const { isAdmin, user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const { data } = await getEmployees()
      setEmployees(data)
    } catch (err) {
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addEmployee(form)
      toast.success('Employee added successfully')
      setShowModal(false)
      setForm({ name: '', email: '', password: '', role: 'employee' })
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add employee')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return
    try {
      await deleteEmployee(id)
      toast.success('Employee removed')
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove employee')
    }
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        <Shield size={48} style={{ marginBottom: 16, color: '#94a3b8' }} />
        <h2>Access Denied</h2>
        <p>Only administrators can manage employees.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>Team Members</h1>
          <p style={{ color: '#64748b', marginTop: 4 }}>Manage your company's employees</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>
      ) : employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
          <Users size={48} style={{ marginBottom: 16, color: '#94a3b8' }} />
          <p>No employees yet. Add your first team member!</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Added</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td style={{ fontWeight: 500 }}>
                    {emp.name}
                    {emp.is_owner && (
                      <span style={{
                        marginLeft: 8,
                        padding: '2px 8px',
                        background: '#fef3c7',
                        color: '#92400e',
                        fontSize: 11,
                        borderRadius: 4,
                        fontWeight: 600,
                      }}>
                        Owner
                      </span>
                    )}
                  </td>
                  <td style={{ color: '#64748b' }}>{emp.email}</td>
                  <td>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: emp.role === 'admin' ? '#dbeafe' : '#f1f5f9',
                      color: emp.role === 'admin' ? '#1d4ed8' : '#475569',
                    }}>
                      {emp.role}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: 13 }}>
                    {new Date(emp.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    {!emp.is_owner && emp._id !== user.id && (
                      <button
                        className="btn btn-ghost"
                        style={{ color: '#ef4444', padding: 6 }}
                        onClick={() => handleDelete(emp._id, emp.name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Employee</h2>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      style={{ paddingLeft: 38 }}
                      placeholder="Employee name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      style={{ paddingLeft: 38 }}
                      placeholder="employee@company.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    className="form-control"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
