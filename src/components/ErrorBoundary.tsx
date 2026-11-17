import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Surface } from './ui';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected display error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Portfolio runtime error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-background p-6">
          <Surface role="alert" className="max-w-lg space-y-4 p-8">
            <h1 className="font-display text-2xl text-foreground">
              Unable to display this gallery view
            </h1>
            <p className="text-sm leading-relaxed text-muted">
              {this.state.message}. Reload the portfolio to return to the current exhibition
              catalogue.
            </p>
            <Button tone="primary" onClick={() => window.location.reload()}>
              Reload portfolio
            </Button>
          </Surface>
        </div>
      );
    }

    return this.props.children;
  }
}
