/**
 * Global Error Boundary
 *
 * Catches unhandled runtime errors in React component tree.
 * Prevents full application crash. Shows user-friendly fallback.
 * Logs error details for debugging.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { ErrorOutlinedIcon as ErrorIcon, RefreshIcon, HomeIcon } from '../Icon';
import { normalizeError, logError, ERROR_CODES } from '@core/errors';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'app' | 'page' | 'section';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorId: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = normalizeError(error, {
      stackTrace: errorInfo.componentStack || error.stack,
    });

    // Override code to indicate render error
    appError.code = ERROR_CODES.RENDER;

    // Log the error
    logError(appError, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
    });

    this.setState({ errorId: appError.id });

    // Call parent error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorId: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { level = 'page' } = this.props;

      // App-level: full screen fallback
      if (level === 'app') {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              backgroundColor: '#F5F5F5',
              p: 3,
            }}
          >
            <Paper elevation={0} sx={{ p: 5, textAlign: 'center', maxWidth: 480, borderRadius: 2 }}>
              <ErrorIcon sx={{ fontSize: 72, color: '#EB0A1E', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Something went wrong
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                An unexpected error occurred. Your data is safe. Please try refreshing the page
                or returning to the home screen.
              </Typography>
              {this.state.errorId && (
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 3 }}>
                  Error Reference: {this.state.errorId}
                </Typography>
              )}
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReload}
                  sx={{ backgroundColor: '#EB0A1E', '&:hover': { backgroundColor: '#c50818' } }}
                >
                  Refresh Page
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={this.handleGoHome}
                >
                  Go to Home
                </Button>
              </Stack>
            </Paper>
          </Box>
        );
      }

      // Section-level: compact inline fallback
      if (level === 'section') {
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 40, color: '#F44336', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              This section encountered an error.
            </Typography>
            <Button size="small" variant="outlined" onClick={this.handleRetry}>
              Try Again
            </Button>
          </Box>
        );
      }

      // Page-level: default
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            px: 3,
          }}
        >
          <ErrorIcon sx={{ fontSize: 56, color: '#EB0A1E', mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 400, mb: 3 }}>
            An unexpected error occurred while loading this page. Please try again.
          </Typography>
          {this.state.errorId && (
            <Typography variant="caption" color="text.disabled" sx={{ mb: 2 }}>
              Reference: {this.state.errorId}
            </Typography>
          )}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleRetry}
              size="small"
              sx={{ backgroundColor: '#EB0A1E', '&:hover': { backgroundColor: '#c50818' } }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={this.handleGoHome}
              size="small"
            >
              Go Home
            </Button>
          </Stack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
