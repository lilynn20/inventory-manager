import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // You could log to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/dashboard'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: 'var(--bg)',
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: 480,
            width: '100%',
          }}>
            {/* Error Icon */}
            <div style={{
              width: 80,
              height: 80,
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AlertTriangle size={40} color="#dc2626" />
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: 12,
            }}>
              Something went wrong
            </h1>

            {/* Description */}
            <p style={{
              color: 'var(--text-muted)',
              fontSize: 15,
              marginBottom: 24,
              lineHeight: 1.6,
            }}>
              We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
            </p>

            {/* Error Details (collapsible) */}
            {this.state.error && (
              <details style={{
                marginBottom: 24,
                textAlign: 'left',
                background: 'var(--bg-secondary)',
                borderRadius: 12,
                padding: 16,
                border: '1px solid var(--border)',
              }}>
                <summary style={{
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 8,
                }}>
                  Technical Details
                </summary>
                <pre style={{
                  fontSize: 12,
                  color: '#dc2626',
                  background: '#fef2f2',
                  padding: 12,
                  borderRadius: 8,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: '8px 0 0 0',
                  maxHeight: 200,
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={this.handleReset}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Home size={16} />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
