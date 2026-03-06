import { useState, useRef, useCallback } from 'react'

/**
 * Drag & drop reorderable list component
 */
export default function DraggableList({
  items = [],
  onReorder,
  renderItem,
  keyExtractor = (item) => item.id,
  direction = 'vertical',
  dragHandleSelector = null,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)
  const dragNode = useRef(null)

  const handleDragStart = (e, index) => {
    dragNode.current = e.target
    setDraggedIndex(index)
    
    // For visual feedback
    setTimeout(() => {
      if (dragNode.current) {
        dragNode.current.classList.add('dragging')
      }
    }, 0)
  }

  const handleDragEnter = (e, index) => {
    if (draggedIndex === null || draggedIndex === index) return
    setOverIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && overIndex !== null && draggedIndex !== overIndex) {
      const newItems = [...items]
      const [draggedItem] = newItems.splice(draggedIndex, 1)
      newItems.splice(overIndex, 0, draggedItem)
      onReorder?.(newItems)
    }

    if (dragNode.current) {
      dragNode.current.classList.remove('dragging')
    }
    
    dragNode.current = null
    setDraggedIndex(null)
    setOverIndex(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div 
      className={`draggable-list ${direction}`}
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: '0.5rem',
      }}
    >
      {items.map((item, index) => (
        <div
          key={keyExtractor(item)}
          className={`draggable-item ${draggedIndex === index ? 'dragging' : ''} ${overIndex === index ? 'over' : ''}`}
          draggable={!dragHandleSelector}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          {dragHandleSelector ? (
            <div className="drag-content">
              <div
                className="drag-handle"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8-16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                </svg>
              </div>
              {renderItem(item, index)}
            </div>
          ) : (
            renderItem(item, index)
          )}
        </div>
      ))}
      <style>{`
        .draggable-item {
          position: relative;
          transition: transform 0.2s ease, opacity 0.2s ease;
          cursor: grab;
          border-radius: 8px;
        }

        .draggable-item.dragging {
          opacity: 0.5;
          cursor: grabbing;
        }

        .draggable-item.over {
          transform: scale(1.02);
        }

        .draggable-item.over::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: -4px;
          height: 4px;
          background: var(--primary);
          border-radius: 2px;
        }

        .draggable-list.horizontal .draggable-item.over::before {
          top: 0;
          bottom: 0;
          left: -4px;
          width: 4px;
          height: auto;
        }

        .drag-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .drag-handle {
          cursor: grab;
          padding: 0.25rem;
          color: var(--text-secondary);
          border-radius: 4px;
          transition: color 0.2s, background 0.2s;
        }

        .drag-handle:hover {
          color: var(--text);
          background: var(--bg-secondary);
        }

        .drag-handle:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  )
}

/**
 * Sortable table rows with drag & drop
 */
export function DraggableTable({
  items = [],
  columns = [],
  onReorder,
  keyExtractor = (item) => item.id,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragEnter = (index) => {
    if (draggedIndex === null || draggedIndex === index) return
    setOverIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && overIndex !== null && draggedIndex !== overIndex) {
      const newItems = [...items]
      const [draggedItem] = newItems.splice(draggedIndex, 1)
      newItems.splice(overIndex, 0, draggedItem)
      onReorder?.(newItems)
    }
    
    setDraggedIndex(null)
    setOverIndex(null)
  }

  return (
    <table className="draggable-table">
      <thead>
        <tr>
          <th style={{ width: 40 }}></th>
          {columns.map(col => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr
            key={keyExtractor(item)}
            className={`${draggedIndex === index ? 'dragging' : ''} ${overIndex === index ? 'over' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
            <td className="drag-handle-cell">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8-16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
              </svg>
            </td>
            {columns.map(col => (
              <td key={col.key}>
                {col.render ? col.render(item[col.key], item) : item[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <style>{`
        .draggable-table {
          width: 100%;
          border-collapse: collapse;
        }

        .draggable-table th,
        .draggable-table td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }

        .draggable-table th {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .draggable-table tr {
          transition: background 0.2s, opacity 0.2s;
          cursor: grab;
        }

        .draggable-table tr:hover {
          background: var(--bg-secondary);
        }

        .draggable-table tr.dragging {
          opacity: 0.5;
          cursor: grabbing;
        }

        .draggable-table tr.over {
          background: var(--primary);
          background: linear-gradient(180deg, var(--primary) 0%, var(--primary) 2px, var(--bg-secondary) 2px);
        }

        .drag-handle-cell {
          color: var(--text-secondary);
          cursor: grab;
        }

        .drag-handle-cell:hover {
          color: var(--text);
        }
      `}</style>
    </table>
  )
}

/**
 * Drag & drop grid for cards
 */
export function DraggableGrid({
  items = [],
  onReorder,
  renderItem,
  keyExtractor = (item) => item.id,
  columns = 3,
  gap = '1rem',
}) {
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragEnter = (index) => {
    if (draggedIndex === null || draggedIndex === index) return
    setOverIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && overIndex !== null && draggedIndex !== overIndex) {
      const newItems = [...items]
      const [draggedItem] = newItems.splice(draggedIndex, 1)
      newItems.splice(overIndex, 0, draggedItem)
      onReorder?.(newItems)
    }
    
    setDraggedIndex(null)
    setOverIndex(null)
  }

  return (
    <div 
      className="draggable-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {items.map((item, index) => (
        <div
          key={keyExtractor(item)}
          className={`grid-item ${draggedIndex === index ? 'dragging' : ''} ${overIndex === index ? 'over' : ''}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          {renderItem(item, index)}
        </div>
      ))}
      <style>{`
        .grid-item {
          position: relative;
          cursor: grab;
          transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
        }

        .grid-item:active {
          cursor: grabbing;
        }

        .grid-item.dragging {
          opacity: 0.5;
          transform: scale(0.95);
        }

        .grid-item.over {
          transform: scale(1.05);
          box-shadow: 0 0 0 3px var(--primary);
          border-radius: 8px;
        }
      `}</style>
    </div>
  )
}

/**
 * Hook for drag & drop logic
 */
export function useDragDrop(items, onReorder) {
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  const getDragProps = useCallback((index) => ({
    draggable: true,
    onDragStart: () => setDraggedIndex(index),
    onDragEnter: () => {
      if (draggedIndex !== null && draggedIndex !== index) {
        setOverIndex(index)
      }
    },
    onDragOver: (e) => e.preventDefault(),
    onDragEnd: () => {
      if (draggedIndex !== null && overIndex !== null && draggedIndex !== overIndex) {
        const newItems = [...items]
        const [draggedItem] = newItems.splice(draggedIndex, 1)
        newItems.splice(overIndex, 0, draggedItem)
        onReorder?.(newItems)
      }
      setDraggedIndex(null)
      setOverIndex(null)
    },
  }), [items, draggedIndex, overIndex, onReorder])

  return {
    getDragProps,
    isDragging: draggedIndex !== null,
    draggedIndex,
    overIndex,
  }
}
