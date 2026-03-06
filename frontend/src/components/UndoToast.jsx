import toast from 'react-hot-toast'
import { Undo2, X } from 'lucide-react'

/**
 * Show a toast with an undo action
 * @param {string} message - The message to display
 * @param {Function} onUndo - Callback when undo is clicked
 * @param {Object} options - Additional options
 * @param {number} options.duration - Toast duration in ms (default: 5000)
 * @param {string} options.undoLabel - Label for undo button (default: 'Undo')
 */
export function showUndoToast(message, onUndo, options = {}) {
  const { duration = 5000, undoLabel = 'Undo' } = options

  const toastId = toast(
    (t) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '4px 0',
        }}
      >
        <span style={{ flex: 1 }}>{message}</span>
        <button
          onClick={() => {
            toast.dismiss(t.id)
            onUndo?.()
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 6,
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#4338ca')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#4f46e5')}
        >
          <Undo2 size={14} />
          {undoLabel}
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            borderRadius: 4,
            background: 'transparent',
            color: '#9ca3af',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <X size={14} />
        </button>
      </div>
    ),
    {
      duration,
      style: {
        background: 'var(--card, #1f2937)',
        color: 'var(--text, #f9fafb)',
        padding: '12px 16px',
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        border: '1px solid var(--border, #374151)',
      },
    }
  )

  return toastId
}

/**
 * Delete with undo functionality
 * @param {Object} params
 * @param {Function} params.deleteAction - Async function to perform the delete
 * @param {Function} params.undoAction - Async function to restore the item
 * @param {string} params.itemName - Name of the item being deleted
 * @param {Function} params.onSuccess - Called after successful delete (or undo timeout)
 * @param {Function} params.onUndo - Called when undo is clicked
 */
export async function deleteWithUndo({
  deleteAction,
  undoAction,
  itemName = 'Item',
  onSuccess,
  onUndo,
}) {
  let undoClicked = false

  try {
    // Perform the delete
    await deleteAction()

    // Show undo toast
    showUndoToast(
      `${itemName} deleted`,
      async () => {
        undoClicked = true
        try {
          await undoAction?.()
          toast.success(`${itemName} restored`)
          onUndo?.()
        } catch (err) {
          toast.error('Failed to restore')
        }
      },
      { duration: 5000 }
    )

    // Call success after timeout if not undone
    setTimeout(() => {
      if (!undoClicked) {
        onSuccess?.()
      }
    }, 5500)
  } catch (err) {
    toast.error(`Failed to delete ${itemName}`)
    throw err
  }
}

export default showUndoToast
