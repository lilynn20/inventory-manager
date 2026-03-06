import { useState, useEffect, useRef } from 'react'
import { ImageOff } from 'lucide-react'

/**
 * Lazy loading image with blur placeholder
 * Uses Intersection Observer for efficient loading
 */
export default function LazyImage({
  src,
  alt = '',
  width,
  height,
  className = '',
  style = {},
  placeholder = 'blur', // 'blur' | 'skeleton' | 'none'
  fallback = null,
  threshold = 0.1,
  rootMargin = '100px',
  onLoad,
  onError,
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)
  const containerRef = useRef(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  const containerStyle = {
    position: 'relative',
    width: width || '100%',
    height: height || 'auto',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-secondary)',
    ...style,
  }

  // Blur placeholder styles
  const blurPlaceholder = placeholder === 'blur' && !isLoaded && !hasError && (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--border) 100%)',
        filter: 'blur(20px)',
        transform: 'scale(1.1)',
      }}
    />
  )

  // Skeleton placeholder styles
  const skeletonPlaceholder = placeholder === 'skeleton' && !isLoaded && !hasError && (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--border) 50%, var(--bg-secondary) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  )

  // Error fallback
  if (hasError) {
    if (fallback) return fallback

    return (
      <div
        ref={containerRef}
        style={{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 8,
          color: 'var(--text-muted)',
        }}
        className={className}
      >
        <ImageOff size={24} />
        <span style={{ fontSize: 12 }}>Failed to load</span>
      </div>
    )
  }

  return (
    <div ref={containerRef} style={containerStyle} className={className}>
      {blurPlaceholder}
      {skeletonPlaceholder}
      
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          loading="lazy"
          decoding="async"
        />
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}

/**
 * Hook for lazy loading any content
 */
export function useLazyLoad(options = {}) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  const { threshold = 0.1, rootMargin = '100px', triggerOnce = true } = options

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            observer.disconnect()
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isInView }
}

/**
 * Component wrapper for lazy loading
 */
export function LazyLoad({ 
  children, 
  placeholder = null, 
  threshold = 0.1,
  rootMargin = '100px',
}) {
  const { ref, isInView } = useLazyLoad({ threshold, rootMargin })

  return (
    <div ref={ref}>
      {isInView ? children : placeholder}
    </div>
  )
}
