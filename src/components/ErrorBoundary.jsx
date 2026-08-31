import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    })
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#F8FAF7',
            padding: '20px',
            fontFamily: 'Nunito, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(36,50,42,0.06)',
            }}
          >
            <h1 style={{ color: '#24322A', marginTop: 0, fontSize: '24px' }}>
              Oops! Something went wrong
            </h1>
            <p style={{ color: '#5B6A61', fontSize: '16px', lineHeight: '1.5' }}>
              We're sorry, but the app encountered an unexpected error. Please try refreshing the
              page or restart the application.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details
                style={{
                  marginTop: '20px',
                  textAlign: 'left',
                  backgroundColor: '#F0F0F0',
                  borderRadius: '10px',
                  padding: '15px',
                  color: '#333',
                  fontSize: '12px',
                  maxHeight: '200px',
                  overflow: 'auto',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              style={{
                marginTop: '30px',
                padding: '12px 30px',
                backgroundColor: '#3F6B4F',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#2E5140')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#3F6B4F')}
            >
              Go to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
