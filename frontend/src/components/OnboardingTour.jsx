import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Package, Tag, ArrowLeftRight, BarChart3, Users, Settings, ChevronRight, X, Check, Sparkles } from 'lucide-react'

const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to StockFlow! 🎉',
    description: 'Let\'s take a quick tour to help you get started with managing your inventory.',
    icon: Sparkles,
    color: '#4f46e5',
    route: '/dashboard',
  },
  {
    id: 'products',
    title: 'Manage Your Products',
    description: 'Add, edit, and track all your products in one place. Set stock levels and get alerts when running low.',
    icon: Package,
    color: '#4f46e5',
    route: '/dashboard/products',
  },
  {
    id: 'categories',
    title: 'Organize with Categories',
    description: 'Group your products into categories for better organization and reporting.',
    icon: Tag,
    color: '#10b981',
    route: '/dashboard/categories',
  },
  {
    id: 'movements',
    title: 'Track Stock Movements',
    description: 'Record stock in and stock out movements. Keep a complete history of all inventory changes.',
    icon: ArrowLeftRight,
    color: '#f59e0b',
    route: '/dashboard/movements',
  },
  {
    id: 'analytics',
    title: 'Powerful Analytics',
    description: 'View charts, reports, and predictions to make data-driven decisions.',
    icon: BarChart3,
    color: '#3b82f6',
    route: '/dashboard/predictions',
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    description: 'You\'re ready to start managing your inventory like a pro. Need help? Check the keyboard shortcuts with "?".',
    icon: Check,
    color: '#10b981',
    route: '/dashboard',
  },
]

export default function OnboardingTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const step = tourSteps[currentStep]
  const isLastStep = currentStep === tourSteps.length - 1
  const isFirstStep = currentStep === 0

  useEffect(() => {
    // Navigate to the route for current step
    if (step.route && location.pathname !== step.route) {
      navigate(step.route)
    }
  }, [currentStep, step.route, navigate, location.pathname])

  const handleNext = () => {
    if (isLastStep) {
      handleComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem('onboarding_completed', 'true')
    onComplete?.()
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 9998,
          animation: 'fadeIn 0.3s ease',
        }}
      />

      {/* Tour Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 480,
          background: 'var(--card)',
          borderRadius: 20,
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          zIndex: 9999,
          overflow: 'hidden',
          animation: 'slideIn 0.3s ease',
        }}
      >
        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--border)' }}>
          <div
            style={{
              height: '100%',
              width: `${((currentStep + 1) / tourSteps.length) * 100}%`,
              background: step.color,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Header */}
        <div style={{ padding: '24px 24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: step.color + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <step.icon size={28} color={step.color} />
            </div>
            <button
              onClick={handleSkip}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
            {step.title}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {step.description}
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '0 24px' }}>
          {tourSteps.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentStep ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: index === currentStep ? step.color : 'var(--border)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{ padding: 24, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button
            onClick={handleSkip}
            style={{
              padding: '12px 20px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Skip Tour
          </button>
          
          <div style={{ display: 'flex', gap: 8 }}>
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                style={{
                  padding: '12px 20px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                padding: '12px 24px',
                borderRadius: 10,
                border: 'none',
                background: step.color,
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  )
}

// Hook to check if onboarding should be shown
export function useOnboarding() {
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed')
    if (!completed) {
      // Delay showing tour to let the page load first
      const timer = setTimeout(() => setShowTour(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const startTour = () => setShowTour(true)
  const completeTour = () => {
    setShowTour(false)
    localStorage.setItem('onboarding_completed', 'true')
  }
  const resetTour = () => {
    localStorage.removeItem('onboarding_completed')
    setShowTour(true)
  }

  return { showTour, startTour, completeTour, resetTour }
}
