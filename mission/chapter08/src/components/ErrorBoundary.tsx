import { Component, type ErrorInfo, type ReactNode } from 'react';
import ErrorState from './ui/ErrorState';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          message="예기치 않은 오류가 발생했습니다."
          actionLabel="홈으로"
          onAction={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
