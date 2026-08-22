
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-left p-6 bg-muted/30 rounded-2xl border border-border m-4">
          <h2 className="text-2xl font-bold text-destructive mb-2">Application Error Caught</h2>
          <p className="text-muted-foreground mb-4">
            We've encountered an unexpected error. Please screenshot this and share it.
          </p>
          <div className="w-full max-w-2xl bg-black text-red-400 p-4 rounded-xl overflow-auto text-xs font-mono mb-4 text-left">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.error && this.state.error.stack}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
