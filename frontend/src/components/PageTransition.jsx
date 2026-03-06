import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Page transition wrapper component
 * Wraps children with fade/slide animation on route changes
 */
export default function PageTransition({ children, type = 'fade' }) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState('entering')
  const prevLocation = useRef(location.pathname)

  useEffect(() => {
    if (location.pathname !== prevLocation.current) {
      setTransitionStage('exiting')
      
      setTimeout(() => {
        setDisplayChildren(children)
        setTransitionStage('entering')
        prevLocation.current = location.pathname
      }, 150)
    } else {
      setDisplayChildren(children)
    }
  }, [location, children])

  const getTransitionStyles = () => {
    const baseStyles = {
      transition: 'all 0.15s ease-out',
    }

    if (type === 'fade') {
      return {
        ...baseStyles,
        opacity: transitionStage === 'entering' ? 1 : 0,
      }
    }

    if (type === 'slide') {
      return {
        ...baseStyles,
        opacity: transitionStage === 'entering' ? 1 : 0,
        transform: transitionStage === 'entering' 
          ? 'translateY(0)' 
          : 'translateY(8px)',
      }
    }

    if (type === 'scale') {
      return {
        ...baseStyles,
        opacity: transitionStage === 'entering' ? 1 : 0,
        transform: transitionStage === 'entering' 
          ? 'scale(1)' 
          : 'scale(0.98)',
      }
    }

    return baseStyles
  }

  return (
    <div style={getTransitionStyles()}>
      {displayChildren}
    </div>
  )
}

/**
 * Hook for staggered list animations
 * Items appear one by one with delay
 */
export function useStaggeredAnimation(items, delay = 50) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)
    
    if (items.length === 0) return

    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= items.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, delay)

    return () => clearInterval(interval)
  }, [items.length, delay])

  return visibleCount
}

/**
 * Animated list item wrapper
 */
export function AnimatedListItem({ index, visibleCount, children, delay = 50 }) {
  const isVisible = index < visibleCount

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: `all 0.2s ease-out ${index * delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/**
 * CSS animations for use in style tags
 */
export const pageAnimations = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .fade-in { animation: fadeIn 0.3s ease; }
  .slide-in { animation: slideIn 0.3s ease; }
  .slide-in-right { animation: slideInRight 0.3s ease; }
  .scale-in { animation: scaleIn 0.2s ease; }
`
