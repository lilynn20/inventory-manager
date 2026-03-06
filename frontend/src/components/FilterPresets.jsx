import { useState, useEffect } from 'react'

const STORAGE_KEY = 'inventory_filter_presets'

/**
 * Advanced filtering component with saved presets
 */
export default function FilterPresets({
  filters,
  onFilterChange,
  filterConfig = [],
  entityName = 'items',
}) {
  const [presets, setPresets] = useState([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [showPresets, setShowPresets] = useState(false)

  // Load presets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${entityName}`)
    if (saved) {
      try {
        setPresets(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load presets:', e)
      }
    }
  }, [entityName])

  // Save presets to localStorage
  const savePresets = (newPresets) => {
    setPresets(newPresets)
    localStorage.setItem(`${STORAGE_KEY}_${entityName}`, JSON.stringify(newPresets))
  }

  const handleSavePreset = () => {
    if (!presetName.trim()) return

    const newPreset = {
      id: Date.now(),
      name: presetName.trim(),
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    }

    savePresets([...presets, newPreset])
    setPresetName('')
    setShowSaveDialog(false)
  }

  const handleLoadPreset = (preset) => {
    onFilterChange(preset.filters)
    setShowPresets(false)
  }

  const handleDeletePreset = (presetId, e) => {
    e.stopPropagation()
    savePresets(presets.filter(p => p.id !== presetId))
  }

  const handleClearFilters = () => {
    const clearedFilters = {}
    filterConfig.forEach(config => {
      clearedFilters[config.key] = config.type === 'range' ? { min: '', max: '' } : ''
    })
    onFilterChange(clearedFilters)
  }

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (typeof value === 'object') {
      return value.min || value.max
    }
    return value && value !== ''
  }).length

  return (
    <div className="filter-presets">
      {/* Quick filters */}
      <div className="filter-quick-actions">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="filter-presets-btn"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          Presets ({presets.length})
        </button>

        {activeFilterCount > 0 && (
          <>
            <button onClick={() => setShowSaveDialog(true)} className="filter-save-btn">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save
            </button>
            <button onClick={handleClearFilters} className="filter-clear-btn">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear ({activeFilterCount})
            </button>
          </>
        )}
      </div>

      {/* Filter fields */}
      <div className="filter-fields">
        {filterConfig.map(config => (
          <FilterField
            key={config.key}
            config={config}
            value={filters[config.key]}
            onChange={(value) => onFilterChange({ ...filters, [config.key]: value })}
          />
        ))}
      </div>

      {/* Presets dropdown */}
      {showPresets && (
        <div className="filter-presets-dropdown">
          {presets.length === 0 ? (
            <div className="filter-presets-empty">
              No saved presets. Apply filters and click "Save" to create one.
            </div>
          ) : (
            presets.map(preset => (
              <div
                key={preset.id}
                className="filter-preset-item"
                onClick={() => handleLoadPreset(preset)}
              >
                <div className="filter-preset-info">
                  <span className="filter-preset-name">{preset.name}</span>
                  <span className="filter-preset-filters">
                    {Object.keys(preset.filters).filter(k => {
                      const v = preset.filters[k]
                      return typeof v === 'object' ? v.min || v.max : v && v !== ''
                    }).length} filters
                  </span>
                </div>
                <button
                  className="filter-preset-delete"
                  onClick={(e) => handleDeletePreset(preset.id, e)}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Save preset dialog */}
      {showSaveDialog && (
        <div className="filter-save-dialog">
          <div className="filter-save-dialog-content">
            <h4>Save Filter Preset</h4>
            <input
              type="text"
              placeholder="Preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
            />
            <div className="filter-save-dialog-actions">
              <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
              <button onClick={handleSavePreset} className="primary">Save</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .filter-presets {
          position: relative;
          margin-bottom: 1rem;
        }

        .filter-quick-actions {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .filter-presets-btn,
        .filter-save-btn,
        .filter-clear-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .filter-presets-btn:hover,
        .filter-save-btn:hover {
          background: var(--bg-secondary);
        }

        .filter-clear-btn {
          color: #ef4444;
          border-color: #ef4444;
        }

        .filter-clear-btn:hover {
          background: #fef2f2;
        }

        .dark .filter-clear-btn:hover {
          background: #2a1515;
        }

        .filter-fields {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filter-presets-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 50;
          min-width: 250px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .filter-presets-empty {
          padding: 1rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-align: center;
        }

        .filter-preset-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.2s;
        }

        .filter-preset-item:last-child {
          border-bottom: none;
        }

        .filter-preset-item:hover {
          background: var(--bg-secondary);
        }

        .filter-preset-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .filter-preset-name {
          font-weight: 500;
        }

        .filter-preset-filters {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .filter-preset-delete {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .filter-preset-delete:hover {
          color: #ef4444;
          background: #fef2f2;
        }

        .filter-save-dialog {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.5);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .filter-save-dialog-content {
          background: var(--bg);
          border-radius: 12px;
          padding: 1.5rem;
          min-width: 300px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .filter-save-dialog-content h4 {
          margin: 0 0 1rem;
          font-size: 1.125rem;
        }

        .filter-save-dialog-content input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg);
          color: var(--text);
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .filter-save-dialog-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .filter-save-dialog-actions button {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-save-dialog-actions button.primary {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .filter-save-dialog-actions button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}

/**
 * Individual filter field component
 */
function FilterField({ config, value, onChange }) {
  const { type, key, label, options, placeholder } = config

  switch (type) {
    case 'select':
      return (
        <div className="filter-field">
          <label>{label}</label>
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">All</option>
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <style>{`
            .filter-field {
              display: flex;
              flex-direction: column;
              gap: 0.25rem;
              min-width: 150px;
            }
            .filter-field label {
              font-size: 0.75rem;
              font-weight: 500;
              color: var(--text-secondary);
            }
            .filter-field select,
            .filter-field input {
              padding: 0.5rem;
              border: 1px solid var(--border);
              border-radius: 6px;
              background: var(--bg);
              color: var(--text);
              font-size: 0.875rem;
            }
          `}</style>
        </div>
      )

    case 'range':
      return (
        <div className="filter-field filter-field-range">
          <label>{label}</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              placeholder="Min"
              value={value?.min || ''}
              onChange={(e) => onChange({ ...value, min: e.target.value })}
              style={{ width: '80px' }}
            />
            <span style={{ alignSelf: 'center', color: 'var(--text-secondary)' }}>-</span>
            <input
              type="number"
              placeholder="Max"
              value={value?.max || ''}
              onChange={(e) => onChange({ ...value, max: e.target.value })}
              style={{ width: '80px' }}
            />
          </div>
          <style>{`
            .filter-field-range input {
              padding: 0.5rem;
              border: 1px solid var(--border);
              border-radius: 6px;
              background: var(--bg);
              color: var(--text);
              font-size: 0.875rem;
            }
          `}</style>
        </div>
      )

    case 'date':
      return (
        <div className="filter-field">
          <label>{label}</label>
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )

    case 'text':
    default:
      return (
        <div className="filter-field">
          <label>{label}</label>
          <input
            type="text"
            placeholder={placeholder || `Filter by ${label.toLowerCase()}...`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )
  }
}

/**
 * Quick filter chips component
 */
export function QuickFilters({ filters, onSelect, activeFilter }) {
  return (
    <div className="quick-filters">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`quick-filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onSelect(filter)}
        >
          {filter.icon && <span className="quick-filter-icon">{filter.icon}</span>}
          {filter.label}
          {filter.count !== undefined && (
            <span className="quick-filter-count">{filter.count}</span>
          )}
        </button>
      ))}
      <style>{`
        .quick-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .quick-filter-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--bg);
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-filter-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .quick-filter-chip.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .quick-filter-icon {
          font-size: 1rem;
        }

        .quick-filter-count {
          background: rgba(255,255,255,0.2);
          padding: 0.125rem 0.5rem;
          border-radius: 10px;
          font-size: 0.75rem;
        }

        .quick-filter-chip:not(.active) .quick-filter-count {
          background: var(--bg-secondary);
        }
      `}</style>
    </div>
  )
}
