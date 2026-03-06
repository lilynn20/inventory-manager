import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Package, Tag, Truck, ArrowRight, Command, CornerDownLeft } from 'lucide-react'
import { getProducts, getCategories, getSuppliers } from '../services/api'

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ products: [], categories: [], suppliers: [] })
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Flatten results for keyboard navigation
  const allResults = [
    ...results.products.map(p => ({ type: 'product', data: p, label: p.name, sub: p.category?.name || 'Product', path: '/products', icon: Package })),
    ...results.categories.map(c => ({ type: 'category', data: c, label: c.name, sub: `${c.products_count || 0} products`, path: '/categories', icon: Tag })),
    ...results.suppliers.map(s => ({ type: 'supplier', data: s, label: s.name, sub: s.email || 'Supplier', path: '/suppliers', icon: Truck })),
  ]

  // Open with Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setResults({ products: [], categories: [], suppliers: [] })
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], categories: [], suppliers: [] })
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
          getProducts({ search: query }),
          getCategories(),
          getSuppliers({ search: query }),
        ])
        
        const searchLower = query.toLowerCase()
        
        setResults({
          products: productsRes.data.slice(0, 5),
          categories: categoriesRes.data.filter(c => 
            c.name.toLowerCase().includes(searchLower)
          ).slice(0, 3),
          suppliers: suppliersRes.data.slice(0, 3),
        })
        setSelectedIndex(0)
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, allResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && allResults[selectedIndex]) {
      e.preventDefault()
      handleSelect(allResults[selectedIndex])
    }
  }, [allResults, selectedIndex])

  const handleSelect = (item) => {
    setIsOpen(false)
    navigate(item.path)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
        zIndex: 9999,
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          background: 'var(--card)',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          margin: '0 16px',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <Search size={20} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, categories, suppliers..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 16,
              color: 'var(--text)',
            }}
          />
          <kbd style={{
            padding: '4px 8px',
            background: 'var(--bg-secondary)',
            borderRadius: 6,
            fontSize: 12,
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{
          maxHeight: 400,
          overflowY: 'auto',
          padding: query ? '8px' : '16px 20px',
        }}>
          {!query ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
              <Command size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
              <p style={{ fontSize: 14 }}>Start typing to search...</p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12, fontSize: 12 }}>
                <span><kbd style={{ padding: '2px 6px', background: 'var(--bg-secondary)', borderRadius: 4, marginRight: 4 }}>↑↓</kbd> Navigate</span>
                <span><kbd style={{ padding: '2px 6px', background: 'var(--bg-secondary)', borderRadius: 4, marginRight: 4 }}>↵</kbd> Select</span>
              </div>
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              Searching...
            </div>
          ) : allResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
              <Search size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
              <p>No results for "{query}"</p>
            </div>
          ) : (
            <>
              {results.products.length > 0 && (
                <ResultSection
                  title="Products"
                  items={results.products.map(p => ({
                    type: 'product', data: p, label: p.name,
                    sub: p.category?.name || 'Product', path: '/products', icon: Package
                  }))}
                  allResults={allResults}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelect}
                  setSelectedIndex={setSelectedIndex}
                />
              )}
              {results.categories.length > 0 && (
                <ResultSection
                  title="Categories"
                  items={results.categories.map(c => ({
                    type: 'category', data: c, label: c.name,
                    sub: `${c.products_count || 0} products`, path: '/categories', icon: Tag
                  }))}
                  allResults={allResults}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelect}
                  setSelectedIndex={setSelectedIndex}
                />
              )}
              {results.suppliers.length > 0 && (
                <ResultSection
                  title="Suppliers"
                  items={results.suppliers.map(s => ({
                    type: 'supplier', data: s, label: s.name,
                    sub: s.email || 'Supplier', path: '/suppliers', icon: Truck
                  }))}
                  allResults={allResults}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelect}
                  setSelectedIndex={setSelectedIndex}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {allResults.length > 0 && (
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-secondary)',
            fontSize: 12,
            color: 'var(--text-muted)',
          }}>
            <span>{allResults.length} result{allResults.length !== 1 ? 's' : ''}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CornerDownLeft size={12} />
              <span>to select</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ResultSection({ title, items, allResults, selectedIndex, onSelect, setSelectedIndex }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        padding: '8px 12px 4px',
        letterSpacing: 0.5,
      }}>
        {title}
      </div>
      {items.map(item => {
        const globalIndex = allResults.findIndex(r => r.type === item.type && r.data._id === item.data._id)
        const isSelected = globalIndex === selectedIndex
        const Icon = item.icon
        
        return (
          <div
            key={item.data._id}
            onClick={() => onSelect(item)}
            onMouseEnter={() => setSelectedIndex(globalIndex)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 8,
              cursor: 'pointer',
              background: isSelected ? 'var(--hover-bg)' : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: isSelected ? 'var(--primary)' : 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={16} color={isSelected ? '#fff' : 'var(--text-muted)'} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 600,
                fontSize: 14,
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {item.sub}
              </div>
            </div>
            {isSelected && (
              <ArrowRight size={16} color="var(--text-muted)" />
            )}
          </div>
        )
      })}
    </div>
  )
}
