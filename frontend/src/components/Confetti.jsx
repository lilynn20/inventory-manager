import { useEffect, useState } from 'react'

/**
 * Confetti celebration component
 * Shows colorful confetti particles on screen
 */
export default function Confetti({ 
  duration = 3000, 
  particleCount = 100,
  onComplete 
}) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#fbbf24']
    
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: (Math.random() - 0.5) * 100,
      shape: Math.random() > 0.5 ? 'square' : 'circle',
    }))

    setParticles(newParticles)

    const timer = setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, particleCount, onComplete])

  if (particles.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : 2,
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-fall ${2 + Math.random()}s ease-out forwards`,
            animationDelay: `${p.delay}s`,
            opacity: 0.9,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Hook to trigger confetti
 */
export function useConfetti() {
  const [showConfetti, setShowConfetti] = useState(false)

  const triggerConfetti = () => {
    setShowConfetti(true)
  }

  const confettiComponent = showConfetti ? (
    <Confetti onComplete={() => setShowConfetti(false)} />
  ) : null

  return { triggerConfetti, confettiComponent }
}
