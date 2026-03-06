import { useState, useRef } from 'react'
import { Upload, Download, FileSpreadsheet, Package, Truck, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { importProducts, importSuppliers, downloadTemplate } from '../services/api'
import toast from 'react-hot-toast'

export default function Import() {
  const [activeTab, setActiveTab] = useState('products')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleTemplateDownload = async (type) => {
    try {
      const { data } = await downloadTemplate(type)
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `${type}_template.csv`
      link.click()
      window.URL.revokeObjectURL(url)
      toast.success('Template downloaded')
    } catch (err) {
      toast.error('Failed to download template')
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file')
      return
    }

    setUploading(true)
    setResult(null)

    try {
      const importFn = activeTab === 'products' ? importProducts : importSuppliers
      const { data } = await importFn(file)
      setResult(data)
      toast.success(data.message)
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Import failed'
      toast.error(errorMsg)
      setResult({ error: errorMsg, details: err.response?.data })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
  ]

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Upload size={26} />
            Import Data
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            Bulk import products or suppliers from CSV files
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid var(--border)', marginBottom: 24 }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setResult(null) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              fontWeight: 600,
              fontSize: 14,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: activeTab === id ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: -2,
              color: activeTab === id ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
        {/* Instructions */}
        <div style={{
          padding: 24,
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)'
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0, marginBottom: 8 }}>
            Import {activeTab === 'products' ? 'Products' : 'Suppliers'}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, marginBottom: 12 }}>
            {activeTab === 'products' ? (
              <>Upload a CSV file with columns: <code style={{ background: 'var(--border)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>name, description, category, supplier, price, quantity, low_stock_threshold, sku</code></>
            ) : (
              <>Upload a CSV file with columns: <code style={{ background: 'var(--border)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>name, email, phone, address</code></>
            )}
          </p>
          <button
            onClick={() => handleTemplateDownload(activeTab)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Download size={16} />
            Download template CSV
          </button>
        </div>

        {/* Upload Area */}
        <div style={{ padding: 24 }}>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 200,
              border: '2px dashed var(--border)',
              borderRadius: 12,
              cursor: uploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              background: 'var(--bg)',
            }}
            onMouseEnter={e => {
              if (!uploading) {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.background = 'rgba(99,102,241,0.05)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'var(--bg)'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            {uploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
                <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
                <span style={{ fontWeight: 600 }}>Processing...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
                <FileSpreadsheet size={40} />
                <span style={{ fontWeight: 600 }}>Click to upload CSV</span>
                <span style={{ fontSize: 14 }}>or drag and drop</span>
              </div>
            )}
          </label>
        </div>

        {/* Results */}
        {result && (
          <div style={{ padding: 24, borderTop: '1px solid var(--border)' }}>
            {result.error ? (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 12,
                padding: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontWeight: 600, marginBottom: 8 }}>
                  <AlertCircle size={20} />
                  Import Failed
                </div>
                <p style={{ color: '#ef4444', fontSize: 14, margin: 0 }}>{result.error}</p>
                {result.details?.required && (
                  <p style={{ fontSize: 14, color: '#ef4444', margin: 0, marginTop: 8 }}>
                    Required columns: {result.details.required.join(', ')}
                  </p>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: 12,
                  padding: 16
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22c55e', fontWeight: 600 }}>
                    <CheckCircle size={20} />
                    {result.message}
                  </div>
                </div>

                {result.errors?.length > 0 && (
                  <div style={{
                    background: 'rgba(234,179,8,0.1)',
                    border: '1px solid rgba(234,179,8,0.3)',
                    borderRadius: 12,
                    padding: 16
                  }}>
                    <div style={{ fontWeight: 600, color: '#eab308', marginBottom: 8 }}>
                      {result.errors.length} row(s) had errors:
                    </div>
                    <ul style={{ fontSize: 14, color: '#ca8a04', margin: 0, paddingLeft: 20, maxHeight: 160, overflowY: 'auto' }}>
                      {result.errors.map((err, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>
                          Row {err.row}: {err.errors.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tips Box */}
      <div style={{
        background: 'rgba(59,130,246,0.1)',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: 12,
        padding: 20
      }}>
        <h3 style={{ fontWeight: 600, color: 'var(--primary)', margin: 0, marginBottom: 12 }}>
          Tips for successful import
        </h3>
        <ul style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>Download and use the template CSV to ensure correct column format</li>
          <li>Categories and suppliers will be automatically created if they don't exist</li>
          <li>Make sure prices are numbers (e.g., 29.99 not $29.99)</li>
          <li>Maximum file size: 5MB</li>
        </ul>
      </div>
    </div>
  )
}
