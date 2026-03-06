import { useState, useRef, useCallback } from 'react'

/**
 * Animated button with ripple effect
 */
export function RippleButton({ 
  children, 
  onClick, 
  className = '', 
  style = {},
  disabled = false,
  rippleColor = 'rgba(255,255,255,0.3)',
  ...props 
}) {
  const [ripples, setRipples] = useState([])
  const buttonRef = useRef(null)

  const handleClick = (e) => {
    if (disabled) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const size = Math.max(rect.width, rect.height) * 2

    const newRipple = {
      id: Date.now(),
      x: x - size / 2,
      y: y - size / 2,
      size,
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)

    onClick?.(e)
  }

  return (
    <button
      ref={buttonRef}
      className={className}
      onClick={handleClick}
      disabled={disabled}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            background: rippleColor,
            transform: 'scale(0)',
            animation: 'ripple 0.6s ease-out',
            pointerEvents: 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  )
}

/**
 * Animated card with hover lift effect
 */
export function HoverCard({ 
  children, 
  className = '', 
  style = {},
  onClick,
  liftAmount = 8,
  shadowIntensity = 0.15,
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? `translateY(-${liftAmount}px)` : 'translateY(0)',
        boxShadow: isHovered 
          ? `0 ${liftAmount * 2}px ${liftAmount * 4}px rgba(0,0,0,${shadowIntensity})`
          : '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Animated counter with number rolling effect
 */
export function AnimatedCounter({ 
  value, 
  duration = 1000,
  formatter = (n) => n.toLocaleString(),
  style = {},
}) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)

  // Animate when value changes
  useState(() => {
    const start = previousValue.current
    const end = value
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)
      
      const current = Math.round(start + (end - start) * eased)
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        previousValue.current = value
      }
    }

    if (start !== end) {
      requestAnimationFrame(animate)
    }
  })

  return <span style={style}>{formatter(displayValue)}</span>
}

/**
 * Pulse animation wrapper
 */
export function Pulse({ 
  children, 
  active = true, 
  color = '#4f46e5',
  size = 8,
}) {
  if (!active) return children

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      <span
        style={{
          position: 'absolute',
          top: -2,
          right: -2,
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
        }}
      >
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: color,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
      </span>
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </span>
  )
}

/**
 * Shake animation for errors
 */
export function Shake({ 
  children, 
  trigger = false, 
  intensity = 5,
  duration = 0.5,
}) {
  return (
    <div
      style={{
        animation: trigger ? `shake ${duration}s ease` : 'none',
      }}
    >
      {children}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-${intensity}px); }
          20%, 40%, 60%, 80% { transform: translateX(${intensity}px); }
        }
      `}</style>
    </div>
  )
}

/**
 * Bounce animation on mount
 */
export function BounceIn({ 
  children, 
  delay = 0,
  style = {},
}) {
  return (
    <div
      style={{
        animation: `bounceIn 0.5s ease ${delay}ms both`,
        ...style,
      }}
    >
      {children}
      <style>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

/**
 * Progress bar with animation
 */
export function AnimatedProgress({ 
  value = 0, 
  max = 100,
  color = '#4f46e5',
  height = 8,
  showLabel = false,
  style = {},
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      style={{
        width: '100%',
        height,
        background: 'var(--border)',
        borderRadius: height / 2,
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${percentage}%`,
          background: color,
          borderRadius: height / 2,
          transition: 'width 0.5s ease',
          position: 'relative',
        }}
      >
        {/* Shine effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
            borderRadius: `${height / 2}px ${height / 2}px 0 0`,
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 10,
            fontWeight: 600,
            color: percentage > 50 ? 'white' : 'var(--text)',
          }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}

/**
 * Skeleton loading with wave animation
 */
export function SkeletonWave({ 
  width = '100%', 
  height = 20,
  borderRadius = 4,
  style = {},
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--border) 50%, var(--bg-secondary) 75%)',
        backgroundSize: '200% 100%',
        animation: 'wave 1.5s ease-in-out infinite',
        ...style,
      }}
    >
      <style>{`
        @keyframes wave {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

/**
 * Hook for hover state
 */
export function useHover() {
  const [isHovered, setIsHovered] = useState(false)
  
  const bind = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }

  return [isHovered, bind]
}

/**
 * Hook for press/active state
 */
export function usePress() {
  const [isPressed, setIsPressed] = useState(false)
  
  const bind = {
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onMouseLeave: () => setIsPressed(false),
  }

  return [isPressed, bind]
}
