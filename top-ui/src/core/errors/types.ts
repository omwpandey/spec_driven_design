/**
 * Enterprise Error Handling - Type Definitions
 *
 * Centralized error types used across the entire application.
 */

// Error severity levels
export type ErrorSeverity = 'warning' | 'error' | 'critical';

// Error categories
export type ErrorCategory =
  | 'network'
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'server'
  | 'client'
  | 'timeout'
  | 'rate_limit'
  | 'unknown';

// HTTP error codes handled by the framework
export type HttpErrorCode =
  | 400
  | 401
  | 403
  | 404
  | 408
  | 409
  | 422
  | 429
  | 500
  | 502
  | 503
  | 504;

// Normalized application error
export interface AppError {
  id: string;
  code: string;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: string;
  metadata?: ErrorMetadata;
  retryable: boolean;
  originalError?: unknown;
}

// Additional metadata for logging/debugging
export interface ErrorMetadata {
  httpStatus?: number;
  endpoint?: string;
  requestId?: string;
  userId?: string;
  screenName?: string;
  browser?: string;
  stackTrace?: string;
  validationErrors?: ValidationError[];
}

// Form validation error
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  value?: unknown;
}

// API error response shape from backend
export interface ApiErrorResponse {
  success: false;
  error?: {
    code?: string;
    message?: string;
    details?: ValidationError[];
  };
  message?: string;
  statusCode?: number;
}

// Error display configuration
export interface ErrorDisplayConfig {
  type: 'toast' | 'dialog' | 'inline' | 'banner' | 'page' | 'silent';
  duration?: number;
  dismissible?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

// Network status
export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType?: string;
  downlinkSpeed?: number;
  lastChecked: string;
}

// Error log entry for monitoring
export interface ErrorLogEntry {
  id: string;
  error: AppError;
  context: {
    url: string;
    route: string;
    component?: string;
    action?: string;
  };
  environment: {
    browser: string;
    os: string;
    appVersion: string;
    timestamp: string;
  };
}

// Retry configuration
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}
