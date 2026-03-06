import { Loader2 } from 'lucide-react'

export default function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 400,
      width: '100%',
      background: 'var(--bg)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          <Loader2 
            size={24} 
            color="white" 
            style={{ animation: 'spin 1s linear infinite' }} 
          />
        </div>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 14,
          fontWeight: 500,
          margin: 0,
        }}>
          Loading...
        </p>
      </div>
    </div>
  )
}
