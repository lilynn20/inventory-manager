import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Keyboard } from 'lucide-react'

const KeyboardContext = createContext()

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], action: 'search', description: 'Focus search box' },
  { keys: ['Ctrl', 'H'], action: 'home', description: 'Go to Dashboard' },
  { keys: ['Ctrl', 'P'], action: 'products', description: 'Go to Products' },
  { keys: ['Ctrl', 'I'], action: 'inventory', description: 'Go to Stock Movements' },
  { keys: ['Ctrl', 'Shift', 'N'], action: 'new', description: 'New item (context-aware)' },
  { keys: ['Escape'], action: 'escape', description: 'Close modal/dialog' },
  { keys: ['?'], action: 'help', description: 'Show keyboard shortcuts' },
]

export function KeyboardProvider({ children }) {
  const navigate = useNavigate()
  const [showHelp, setShowHelp] = useState(false)
  const [handlers, setHandlers] = useState({})

  // Register a handler for a specific action
  const registerHandler = useCallback((action, handler) => {
    setHandlers(prev => ({ ...prev, [action]: handler }))
    return () => setHandlers(prev => {
      const next = { ...prev }
      delete next[action]
      return next
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs (except for Escape)
      const target = e.target
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      
      // Escape always works
      if (e.key === 'Escape') {
        if (showHelp) {
          setShowHelp(false)
          e.preventDefault()
          return
        }
        if (handlers.escape) {
          handlers.escape()
          e.preventDefault()
        }
        return
      }

      // ? key for help (only when not in input)
      if (e.key === '?' && !isInput && !e.ctrlKey && !e.metaKey) {
        setShowHelp(prev => !prev)
        e.preventDefault()
        return
      }

      // Skip other shortcuts if in input
      if (isInput) return

      // Ctrl+K - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('.search-bar input, input[placeholder*="Search"]')
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
        return
      }

      // Ctrl+H - Dashboard
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault()
        navigate('/')
        return
      }

      // Ctrl+P - Products (prevent print dialog)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p' && !e.shiftKey) {
        e.preventDefault()
        navigate('/products')
        return
      }

      // Ctrl+I - Inventory/Stock Movements
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault()
        navigate('/inventory')
        return
      }

      // Ctrl+Shift+N - New item
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        if (handlers.new) {
          handlers.new()
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, handlers, showHelp])

  return (
    <KeyboardContext.Provider value={{ registerHandler, showHelp, setShowHelp }}>
      {children}
      {showHelp && <ShortcutsHelp onClose={() => setShowHelp(false)} />}
    </KeyboardContext.Provider>
  )
}

function ShortcutsHelp({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        style={{ maxWidth: 480 }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Keyboard size={20} />
            Keyboard Shortcuts
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body" style={{ padding: 0 }}>
          <table style={{ width: '100%' }}>
            <tbody>
              {SHORTCUTS.map((shortcut, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {shortcut.keys.map((key, j) => (
                        <span key={j}>
                          <kbd style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            fontSize: 12,
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            color: 'var(--text)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: 4,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}>
                            {key}
                          </kbd>
                          {j < shortcut.keys.length - 1 && (
                            <span style={{ margin: '0 2px', color: 'var(--text-muted)' }}>+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    {shortcut.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Press <kbd style={{ padding: '2px 6px', fontSize: 11, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 3 }}>?</kbd> to toggle this help
          </span>
        </div>
      </div>
    </div>
  )
}

export function useKeyboard() {
  const context = useContext(KeyboardContext)
  if (!context) {
    throw new Error('useKeyboard must be used within KeyboardProvider')
  }
  return context
}

// Hook for registering escape handler
export function useEscapeKey(handler) {
  const { registerHandler } = useKeyboard()
  
  useEffect(() => {
    if (handler) {
      return registerHandler('escape', handler)
    }
  }, [handler, registerHandler])
}

// Hook for registering "new item" handler
export function useNewItemShortcut(handler) {
  const { registerHandler } = useKeyboard()
  
  useEffect(() => {
    if (handler) {
      return registerHandler('new', handler)
    }
  }, [handler, registerHandler])
}
