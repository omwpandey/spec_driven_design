/**
 * Enterprise Error Handling - Public API
 */

// Types
export type {
  AppError,
  ApiErrorResponse,
  ErrorCategory,
  ErrorSeverity,
  ErrorMetadata,
  HttpErrorCode,
  ValidationError,
  ErrorDisplayConfig,
  NetworkStatus,
  ErrorLogEntry,
  RetryConfig,
} from './types';

// Error Service
export {
  normalizeError,
  isAppError,
  isRetryableError,
  isAuthError,
  isNetworkError,
  getValidationErrors,
} from './errorService';

// Constants
export {
  ERROR_MESSAGES,
  ERROR_CODES,
  HTTP_ERROR_CATEGORY,
  HTTP_ERROR_SEVERITY,
  RETRYABLE_STATUS_CODES,
  DEFAULT_RETRY_CONFIG,
  AUTH_REDIRECT_STATUSES,
  SERVER_DOWN_STATUSES,
} from './constants';

// Logging
export {
  logError,
  logWarning,
  logInfo,
  getErrorLogs,
  clearErrorLogs,
  exportErrorLogs,
  configureLogging,
} from './loggingService';

// Retry
export { withRetry, createRetryableOperation } from './retryService';
