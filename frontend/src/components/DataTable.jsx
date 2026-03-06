import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Trash2, Download, CheckSquare, Square, MinusSquare } from 'lucide-react'

/**
 * Reusable DataTable with sorting, pagination, and bulk selection
 * 
 * @param {Array} columns - Array of { key, label, sortable?, render?, width? }
 * @param {Array} data - Array of data rows
 * @param {number} pageSize - Items per page (default: 10)
 * @param {string} emptyMessage - Message when no data
 * @param {ReactNode} emptyIcon - Icon for empty state
 * @param {boolean} selectable - Enable row selection (default: false)
 * @param {Array} bulkActions - Array of { label, icon, onClick, variant } for bulk operations
 * @param {Function} getRowId - Function to get unique ID from row (default: row._id || row.id)
 */
export default function DataTable({
  columns,
  data,
  pageSize = 10,
  emptyMessage = 'No data found',
  emptyIcon = null,
  onRowClick = null,
  selectable = false,
  bulkActions = [],
  getRowId = (row) => row._id || row.id,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState(new Set())

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' }
        if (prev.direction === 'desc') return { key: null, direction: 'asc' }
      }
      return { key, direction: 'asc' }
    })
    setCurrentPage(1) // Reset to first page on sort
  }

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      let aVal = a[sortConfig.key]
      let bVal = b[sortConfig.key]

      // Handle nested keys like 'category.name'
      if (sortConfig.key.includes('.')) {
        const keys = sortConfig.key.split('.')
        aVal = keys.reduce((obj, k) => obj?.[k], a)
        bVal = keys.reduce((obj, k) => obj?.[k], b)
      }

      // Handle null/undefined
      if (aVal == null) return 1
      if (bVal == null) return -1

      // Handle numbers
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
      }

      // Handle strings
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = sortedData.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const showPages = 5
    let start = Math.max(1, currentPage - Math.floor(showPages / 2))
    let end = Math.min(totalPages, start + showPages - 1)
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown size={14} style={{ opacity: 0.3 }} />
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} /> 
      : <ChevronDown size={14} />
  }

  // Selection helpers
  const allPageIds = paginatedData.map(row => getRowId(row))
  const allSelected = allPageIds.length > 0 && allPageIds.every(id => selectedIds.has(id))
  const someSelected = allPageIds.some(id => selectedIds.has(id)) && !allSelected
  const selectedCount = selectedIds.size

  const toggleSelectAll = () => {
    if (allSelected) {
      // Deselect all on current page
      const newSet = new Set(selectedIds)
      allPageIds.forEach(id => newSet.delete(id))
      setSelectedIds(newSet)
    } else {
      // Select all on current page
      const newSet = new Set(selectedIds)
      allPageIds.forEach(id => newSet.add(id))
      setSelectedIds(newSet)
    }
  }

  const toggleSelectRow = (id) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  const clearSelection = () => setSelectedIds(new Set())

  const getSelectedRows = () => data.filter(row => selectedIds.has(getRowId(row)))

  return (
    <div>
      {/* Bulk Action Bar */}
      {selectable && selectedCount > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 16px',
          marginBottom: 16,
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          borderRadius: 12,
          animation: 'slideIn 0.2s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white' }}>
            <CheckSquare size={18} />
            <span style={{ fontWeight: 600 }}>{selectedCount} selected</span>
          </div>
          
          <div style={{ flex: 1 }} />
          
          <div style={{ display: 'flex', gap: 8 }}>
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.onClick(getSelectedRows(), clearSelection)}
                className={`btn btn-sm ${action.variant === 'danger' ? 'btn-danger' : 'btn-outline'}`}
                style={{
                  background: action.variant === 'danger' ? '#ef4444' : 'rgba(255,255,255,0.2)',
                  borderColor: 'transparent',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {action.icon && <action.icon size={14} />}
                {action.label}
              </button>
            ))}
            <button
              onClick={clearSelection}
              className="btn btn-sm btn-outline"
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {selectable && (
                <th style={{ width: 40 }}>
                  <button
                    onClick={toggleSelectAll}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text)',
                      padding: 4,
                    }}
                  >
                    {allSelected ? <CheckSquare size={18} /> : someSelected ? <MinusSquare size={18} /> : <Square size={18} />}
                  </button>
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.sortable !== false && <SortIcon columnKey={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <div className="empty-state">
                    {emptyIcon}
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const rowId = getRowId(row)
                const isSelected = selectedIds.has(rowId)
                return (
                  <tr
                    key={rowId || idx}
                    onClick={() => onRowClick?.(row)}
                    style={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      background: isSelected ? 'rgba(79, 70, 229, 0.1)' : undefined,
                    }}
                  >
                    {selectable && (
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSelectRow(rowId)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isSelected ? '#4f46e5' : 'var(--text-muted)',
                            padding: 4,
                          }}
                        >
                          {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className={col.hideOnMobile ? 'hide-mobile' : ''}>
                        {col.render ? col.render(row, startIndex + idx) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline btn-sm"
              style={{ padding: '6px 10px' }}
            >
              <ChevronLeft size={16} />
            </button>
            
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
                style={{ minWidth: 36 }}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-outline btn-sm"
              style={{ padding: '6px 10px' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
