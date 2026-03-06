import { useEffect, useRef, useCallback, useState } from 'react'

/**
 * Screen reader only text (visually hidden)
 */
export function ScreenReaderOnly({ children, as: Component = 'span' }) {
  return (
    <Component
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </Component>
  )
}

/**
 * Live region for screen reader announcements
 */
export function LiveRegion({ 
  message, 
  politeness = 'polite',
  clearAfter = 5000,
}) {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (message) {
      setAnnouncement(message)
      
      if (clearAfter > 0) {
        const timer = setTimeout(() => setAnnouncement(''), clearAfter)
        return () => clearTimeout(timer)
      }
    }
  }, [message, clearAfter])

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {announcement}
    </div>
  )
}

/**
 * Hook for live announcements
 */
export function useAnnounce() {
  const [message, setMessage] = useState('')
  
  const announce = useCallback((text, options = {}) => {
    // Clear and then set to ensure re-announcement
    setMessage('')
    requestAnimationFrame(() => setMessage(text))
  }, [])

  return { message, announce, LiveRegion: () => <LiveRegion message={message} /> }
}

/**
 * Focus trap for modals and dialogs
 */
export function FocusTrap({ children, active = true, className = '' }) {
  const containerRef = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!active) return

    previousFocus.current = document.activeElement

    const container = containerRef.current
    if (!container) return

    // Focus first focusable element
    const focusableElements = getFocusableElements(container)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return

      const focusable = getFocusableElements(container)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus
      if (previousFocus.current && previousFocus.current.focus) {
        previousFocus.current.focus()
      }
    }
  }, [active])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

/**
 * Skip link for keyboard navigation
 */
export function SkipLink({ targetId = 'main-content', children = 'Skip to main content' }) {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      onClick={(e) => {
        e.preventDefault()
        const target = document.getElementById(targetId)
        if (target) {
          target.tabIndex = -1
          target.focus()
        }
      }}
    >
      {children}
      <style>{`
        .skip-link {
          position: absolute;
          top: -100%;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary, #4f46e5);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0 0 8px 8px;
          text-decoration: none;
          font-weight: 500;
          z-index: 10000;
          transition: top 0.3s ease;
        }

        .skip-link:focus {
          top: 0;
          outline: 2px solid var(--primary, #4f46e5);
          outline-offset: 2px;
        }
      `}</style>
    </a>
  )
}

/**
 * Accessible icon button
 */
export function IconButton({
  onClick,
  label,
  icon,
  className = '',
  disabled = false,
  size = 'md',
  ...props
}) {
  const sizes = {
    sm: { button: '28px', icon: 14 },
    md: { button: '36px', icon: 18 },
    lg: { button: '44px', icon: 22 },
  }

  const { button: buttonSize, icon: iconSize } = sizes[size]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`icon-button ${className}`}
      style={{
        width: buttonSize,
        height: buttonSize,
      }}
      {...props}
    >
      {typeof icon === 'string' ? (
        <span style={{ fontSize: iconSize }}>{icon}</span>
      ) : (
        icon
      )}
      <ScreenReaderOnly>{label}</ScreenReaderOnly>
      <style>{`
        .icon-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          border-radius: 6px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-button:hover:not(:disabled) {
          background: var(--bg-secondary);
          color: var(--text);
        }

        .icon-button:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        .icon-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  )
}

/**
 * Accessible toggle switch
 */
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}) {
  const toggleId = id || `toggle-${Math.random().toString(36).slice(2)}`

  return (
    <div className="toggle-container">
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => !disabled && onChange?.(!checked)}
        disabled={disabled}
        className={`toggle ${checked ? 'checked' : ''}`}
      >
        <span className="toggle-thumb" />
      </button>
      {label && (
        <label htmlFor={toggleId} className="toggle-label">
          {label}
        </label>
      )}
      <style>{`
        .toggle-container {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
        }

        .toggle {
          position: relative;
          width: 44px;
          height: 24px;
          background: var(--border);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .toggle.checked {
          background: var(--primary, #4f46e5);
        }

        .toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .toggle:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .toggle.checked .toggle-thumb {
          transform: translateX(20px);
        }

        .toggle-label {
          color: var(--text);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

/**
 * Progress indicator with ARIA
 */
export function Progress({
  value,
  max = 100,
  label,
  showValue = true,
}) {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className="progress-container">
      {label && <span className="progress-label">{label}</span>}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${percentage}%`}
        className="progress-bar"
      >
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="progress-value" aria-hidden="true">
          {percentage}%
        </span>
      )}
      <style>{`
        .progress-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .progress-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          min-width: 100px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: var(--border);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--primary, #4f46e5);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-value {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
          min-width: 40px;
          text-align: right;
        }
      `}</style>
    </div>
  )
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(shortcut, callback, options = {}) {
  const { 
    enabled = true, 
    preventDefault = true,
    target = document,
  } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e) => {
      const keys = shortcut.toLowerCase().split('+')
      const modifiers = {
        ctrl: e.ctrlKey || e.metaKey,
        alt: e.altKey,
        shift: e.shiftKey,
      }

      const keyMatch = keys.every((key) => {
        if (key === 'ctrl' || key === 'cmd') return modifiers.ctrl
        if (key === 'alt') return modifiers.alt
        if (key === 'shift') return modifiers.shift
        return e.key.toLowerCase() === key
      })

      if (keyMatch) {
        if (preventDefault) e.preventDefault()
        callback(e)
      }
    }

    target.addEventListener('keydown', handleKeyDown)
    return () => target.removeEventListener('keydown', handleKeyDown)
  }, [shortcut, callback, enabled, preventDefault, target])
}

/**
 * Reduced motion hook
 */
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handler = (e) => setReducedMotion(e.matches)
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}

// Helper function to get focusable elements
function getFocusableElements(container) {
  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ]

  return Array.from(
    container.querySelectorAll(focusableSelectors.join(', '))
  ).filter((el) => {
    return el.offsetParent !== null // Filter hidden elements
  })
}
