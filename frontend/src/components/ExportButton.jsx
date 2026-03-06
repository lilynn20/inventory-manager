import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Export data to PDF or Excel
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of { key, label } for headers
 * @param {string} filename - Base filename without extension
 */
export default function ExportButton({ data, columns, filename = 'export' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [exporting, setExporting] = useState(null)

  const exportToCSV = () => {
    setExporting('csv')
    try {
      // Build CSV content
      const headers = columns.map(col => col.label).join(',')
      const rows = data.map(row => 
        columns.map(col => {
          let value = col.key.includes('.') 
            ? col.key.split('.').reduce((obj, k) => obj?.[k], row)
            : row[col.key]
          
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string') {
            value = value.replace(/"/g, '""')
            if (value.includes(',') || value.includes('\n')) {
              value = `"${value}"`
            }
          }
          return value ?? ''
        }).join(',')
      ).join('\n')

      const csv = `${headers}\n${rows}`
      downloadFile(csv, `${filename}.csv`, 'text/csv')
      toast.success('Exported to CSV!')
    } catch (err) {
      toast.error('Export failed')
    } finally {
      setExporting(null)
      setIsOpen(false)
    }
  }

  const exportToExcel = async () => {
    setExporting('excel')
    try {
      // Create Excel-compatible XML
      const xmlHeader = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>'
      const workbookStart = '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
      const workbookEnd = '</Workbook>'
      const worksheetStart = '<Worksheet ss:Name="Sheet1"><Table>'
      const worksheetEnd = '</Table></Worksheet>'

      // Header row
      const headerRow = '<Row>' + columns.map(col => 
        `<Cell><Data ss:Type="String">${escapeXml(col.label)}</Data></Cell>`
      ).join('') + '</Row>'

      // Data rows
      const dataRows = data.map(row => {
        const cells = columns.map(col => {
          let value = col.key.includes('.') 
            ? col.key.split('.').reduce((obj, k) => obj?.[k], row)
            : row[col.key]
          
          const type = typeof value === 'number' ? 'Number' : 'String'
          return `<Cell><Data ss:Type="${type}">${escapeXml(String(value ?? ''))}</Data></Cell>`
        }).join('')
        return `<Row>${cells}</Row>`
      }).join('')

      const xml = xmlHeader + workbookStart + worksheetStart + headerRow + dataRows + worksheetEnd + workbookEnd
      downloadFile(xml, `${filename}.xls`, 'application/vnd.ms-excel')
      toast.success('Exported to Excel!')
    } catch (err) {
      toast.error('Export failed')
    } finally {
      setExporting(null)
      setIsOpen(false)
    }
  }

  const exportToPDF = async () => {
    setExporting('pdf')
    try {
      // Create printable HTML
      const style = `
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #1e1b4b; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #4f46e5; color: white; padding: 12px 8px; text-align: left; }
          td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; }
          tr:nth-child(even) { background: #f9fafb; }
          .footer { margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      `
      
      const headers = columns.map(col => `<th>${escapeHtml(col.label)}</th>`).join('')
      const rows = data.map(row => {
        const cells = columns.map(col => {
          let value = col.key.includes('.') 
            ? col.key.split('.').reduce((obj, k) => obj?.[k], row)
            : row[col.key]
          return `<td>${escapeHtml(String(value ?? ''))}</td>`
        }).join('')
        return `<tr>${cells}</tr>`
      }).join('')

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${filename}</title>
          ${style}
        </head>
        <body>
          <h1>${filename}</h1>
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="footer">
            Generated on ${new Date().toLocaleString()} • ${data.length} records
          </div>
        </body>
        </html>
      `

      // Open print dialog
      const printWindow = window.open('', '_blank')
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
      }
      
      toast.success('PDF ready for printing!')
    } catch (err) {
      toast.error('Export failed')
    } finally {
      setExporting(null)
      setIsOpen(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline"
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <Download size={16} />
        Export
        <ChevronDown size={14} style={{ marginLeft: 4 }} />
      </button>

      {isOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              minWidth: 180,
              zIndex: 50,
              overflow: 'hidden',
              animation: 'slideIn 0.15s ease',
            }}
          >
            <button
              onClick={exportToCSV}
              disabled={exporting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text)',
                fontSize: 14,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <FileSpreadsheet size={16} style={{ color: '#10b981' }} />
              {exporting === 'csv' ? 'Exporting...' : 'Export as CSV'}
            </button>
            
            <button
              onClick={exportToExcel}
              disabled={exporting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text)',
                fontSize: 14,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <FileSpreadsheet size={16} style={{ color: '#4f46e5' }} />
              {exporting === 'excel' ? 'Exporting...' : 'Export as Excel'}
            </button>

            <div style={{ height: 1, background: 'var(--border)' }} />
            
            <button
              onClick={exportToPDF}
              disabled={exporting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text)',
                fontSize: 14,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <FileText size={16} style={{ color: '#ef4444' }} />
              {exporting === 'pdf' ? 'Preparing...' : 'Export as PDF'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// Helper functions
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
