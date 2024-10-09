import React from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <RedirectToHome />;
    }

    return this.props.children;
  }
}

const RedirectToHome = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/layout');
  }, [navigate]);

  return null;
};

export default ErrorBoundary;
