import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for PWA features: offline detection, service worker, install prompt
 */
export function usePWA() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [registration, setRegistration] = useState(null)

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered')
          setRegistration(reg)

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
              }
            })
          })
        })
        .catch((error) => {
          console.log('[PWA] Service Worker registration failed:', error)
        })

      // Listen for controller change (new version activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }
  }, [])

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Install prompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Install app
  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    setDeferredPrompt(null)
    setIsInstallable(false)

    return outcome === 'accepted'
  }, [deferredPrompt])

  // Update app
  const updateApp = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }, [registration])

  // Cache specific URLs
  const cacheUrls = useCallback((urls) => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_URLS',
        urls,
      })
    }
  }, [])

  return {
    isOnline,
    isInstallable,
    isInstalled,
    updateAvailable,
    installApp,
    updateApp,
    cacheUrls,
  }
}

/**
 * Offline indicator component
 */
export function OfflineIndicator() {
  const { isOnline } = usePWA()
  const [show, setShow] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setShow(true)
      setWasOffline(true)
    } else if (wasOffline) {
      // Show "back online" briefly
      setTimeout(() => setShow(false), 3000)
    }
  }, [isOnline, wasOffline])

  if (!show) return null

  return (
    <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
      <div className="offline-indicator-content">
        {isOnline ? (
          <>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Back online</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
            <span>You're offline. Some features may be unavailable.</span>
          </>
        )}
      </div>
      <style>{`
        .offline-indicator {
          position: fixed;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .offline-indicator-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        .offline-indicator.offline .offline-indicator-content {
          background: #fef3c7;
          color: #92400e;
        }

        .offline-indicator.online .offline-indicator-content {
          background: #d1fae5;
          color: #047857;
        }
      `}</style>
    </div>
  )
}

/**
 * Install prompt banner
 */
export function InstallPrompt({ onDismiss }) {
  const { isInstallable, installApp } = usePWA()
  const [dismissed, setDismissed] = useState(false)

  const handleInstall = async () => {
    const accepted = await installApp()
    if (accepted) {
      setDismissed(true)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  if (!isInstallable || dismissed) return null

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-prompt-info">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <div>
            <strong>Install Inventory Manager</strong>
            <p>Add to your home screen for quick access</p>
          </div>
        </div>
        <div className="install-prompt-actions">
          <button onClick={handleDismiss} className="dismiss">Not now</button>
          <button onClick={handleInstall} className="install">Install</button>
        </div>
      </div>
      <style>{`
        .install-prompt {
          position: fixed;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          z-index: 9999;
          animation: slideUp 0.3s ease;
        }

        @media (min-width: 640px) {
          .install-prompt {
            left: auto;
            right: 1rem;
            max-width: 400px;
          }
        }

        .install-prompt-content {
          background: var(--bg, white);
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .install-prompt-info {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .install-prompt-info svg {
          flex-shrink: 0;
          color: var(--primary, #4f46e5);
        }

        .install-prompt-info strong {
          display: block;
          color: var(--text, #1f2937);
          margin-bottom: 0.25rem;
        }

        .install-prompt-info p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-secondary, #6b7280);
        }

        .install-prompt-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .install-prompt-actions button {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .install-prompt-actions .dismiss {
          background: none;
          border: none;
          color: var(--text-secondary, #6b7280);
        }

        .install-prompt-actions .dismiss:hover {
          color: var(--text, #1f2937);
        }

        .install-prompt-actions .install {
          background: var(--primary, #4f46e5);
          border: none;
          color: white;
        }

        .install-prompt-actions .install:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}

/**
 * Update available banner
 */
export function UpdatePrompt() {
  const { updateAvailable, updateApp } = usePWA()

  if (!updateAvailable) return null

  return (
    <div className="update-prompt">
      <div className="update-prompt-content">
        <span>A new version is available!</span>
        <button onClick={updateApp}>Update now</button>
      </div>
      <style>{`
        .update-prompt {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          color: white;
          padding: 0.75rem 1rem;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .update-prompt-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          font-size: 0.875rem;
        }

        .update-prompt button {
          background: white;
          color: #4f46e5;
          border: none;
          padding: 0.375rem 0.75rem;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .update-prompt button:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}

/**
 * Hook for offline data sync
 */
export function useOfflineSync() {
  const { isOnline } = usePWA()

  // Queue operation for sync when offline
  const queueOperation = useCallback(async (operation) => {
    if (isOnline) {
      // Execute immediately
      return fetch(operation.url, {
        method: operation.method,
        headers: operation.headers,
        body: JSON.stringify(operation.body),
      })
    }

    // Store in IndexedDB
    const db = await openDB()
    await addPending(db, operation)

    // Request background sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register('sync-pending-changes')
    }

    return { queued: true }
  }, [isOnline])

  return { queueOperation, isOnline }
}

// IndexedDB helpers
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('inventory-offline', 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('pending')) {
        db.createObjectStore('pending', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

function addPending(db, operation) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pending', 'readwrite')
    const store = transaction.objectStore('pending')
    const request = store.add({
      ...operation,
      timestamp: Date.now(),
    })
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
