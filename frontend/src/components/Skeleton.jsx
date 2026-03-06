/**
 * Skeleton loading components with proper dark mode support
 */

const skeletonBase = {
  background: 'var(--border)',
  animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}

export function Skeleton({ width, height, circle = false, style = {} }) {
  return (
    <div
      style={{
        ...skeletonBase,
        width: width || '100%',
        height: height || '1rem',
        borderRadius: circle ? '50%' : 6,
        ...style
      }}
    />
  )
}

export function SkeletonText({ lines = 1 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          height="0.875rem" 
          width={i === lines - 1 ? '75%' : '100%'} 
        />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <Skeleton circle width="48px" height="48px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height="1rem" width="40%" />
          <Skeleton height="0.75rem" width="60%" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '1px solid var(--border)', 
        background: 'var(--bg-secondary)', 
        padding: 16, 
        display: 'flex', 
        gap: 16 
      }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height="0.875rem" width={`${Math.floor(100 / cols) - 2}%`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div 
          key={row} 
          style={{ 
            padding: 16, 
            borderBottom: row < rows - 1 ? '1px solid var(--border)' : 'none', 
            display: 'flex', 
            gap: 16, 
            alignItems: 'center' 
          }}
        >
          {Array.from({ length: cols }).map((_, col) => (
            <Skeleton 
              key={col} 
              height="0.875rem" 
              width={`${Math.floor(100 / cols) - 2}%`} 
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonStats({ count = 4 }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
      gap: 16 
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Skeleton width="60%" height="0.875rem" />
            <Skeleton circle width="40px" height="40px" />
          </div>
          <Skeleton width="40%" height="1.75rem" style={{ marginBottom: 8 }} />
          <Skeleton width="50%" height="0.75rem" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonProductGrid({ count = 6 }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: 16 
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <Skeleton height="160px" style={{ borderRadius: 0 }} />
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton height="1rem" width="80%" />
            <Skeleton height="0.75rem" width="60%" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
              <Skeleton height="1.25rem" width="30%" />
              <Skeleton height="2rem" width="25%" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonForm({ fields = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton height="0.875rem" width="25%" />
          <Skeleton height="2.5rem" width="100%" />
        </div>
      ))}
      <div style={{ paddingTop: 8 }}>
        <Skeleton height="2.75rem" width="100%" />
      </div>
    </div>
  )
}
