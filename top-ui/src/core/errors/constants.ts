/**
 * Enterprise Error Handling - Constants
 *
 * Error codes, user-friendly messages, and configuration.
 */

import { ErrorCategory, ErrorSeverity, HttpErrorCode, RetryConfig } from './types';

// HTTP status to error category mapping
export const HTTP_ERROR_CATEGORY: Record<HttpErrorCode, ErrorCategory> = {
  400: 'client',
  401: 'authentication',
  403: 'authorization',
  404: 'client',
  408: 'timeout',
  409: 'client',
  422: 'validation',
  429: 'rate_limit',
  500: 'server',
  502: 'server',
  503: 'server',
  504: 'timeout',
};

// HTTP status to severity mapping
export const HTTP_ERROR_SEVERITY: Record<HttpErrorCode, ErrorSeverity> = {
  400: 'warning',
  401: 'warning',
  403: 'warning',
  404: 'warning',
  408: 'warning',
  409: 'warning',
  422: 'warning',
  429: 'warning',
  500: 'error',
  502: 'error',
  503: 'error',
  504: 'error',
};

// User-friendly error messages (no technical details)
export const ERROR_MESSAGES: Record<string, string> = {
  // HTTP errors
  HTTP_400: 'The request contains invalid data. Please check your input and try again.',
  HTTP_401: 'Your session has expired. Please log in again.',
  HTTP_403: 'You do not have permission to perform this action.',
  HTTP_404: 'The requested resource was not found.',
  HTTP_408: 'The request took too long. Please try again.',
  HTTP_409: 'This record has been modified by another user. Please refresh and try again.',
  HTTP_422: 'The submitted data could not be processed. Please correct the errors and try again.',
  HTTP_429: 'Too many requests. Please wait a moment before trying again.',
  HTTP_500: 'An unexpected server error occurred. Please try again later.',
  HTTP_502: 'The server is temporarily unreachable. Please try again later.',
  HTTP_503: 'The service is currently unavailable. Please try again later.',
  HTTP_504: 'The server took too long to respond. Please try again.',

  // Network errors
  NETWORK_OFFLINE: 'You are currently offline. Please check your internet connection.',
  NETWORK_SLOW: 'Your connection appears to be slow. Some features may take longer to load.',
  NETWORK_TIMEOUT: 'The connection timed out. Please check your internet and try again.',
  NETWORK_ERROR: 'A network error occurred. Please check your connection and try again.',

  // Client errors
  REQUEST_CANCELLED: 'The request was cancelled.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  CHUNK_LOAD_ERROR: 'Failed to load application resources. Please refresh the page.',

  // Runtime errors
  RUNTIME_ERROR: 'Something went wrong. Please refresh the page.',
  RENDER_ERROR: 'A display error occurred. Please try refreshing the page.',

  // Form/validation
  VALIDATION_FAILED: 'Please correct the highlighted errors before submitting.',
  DUPLICATE_RECORD: 'A record with the same information already exists.',
};

// Error codes
export const ERROR_CODES = {
  // Network
  NETWORK_OFFLINE: 'ERR_NETWORK_OFFLINE',
  NETWORK_SLOW: 'ERR_NETWORK_SLOW',
  NETWORK_TIMEOUT: 'ERR_NETWORK_TIMEOUT',
  NETWORK_ERROR: 'ERR_NETWORK_ERROR',

  // HTTP
  HTTP_BAD_REQUEST: 'ERR_HTTP_400',
  HTTP_UNAUTHORIZED: 'ERR_HTTP_401',
  HTTP_FORBIDDEN: 'ERR_HTTP_403',
  HTTP_NOT_FOUND: 'ERR_HTTP_404',
  HTTP_TIMEOUT: 'ERR_HTTP_408',
  HTTP_CONFLICT: 'ERR_HTTP_409',
  HTTP_VALIDATION: 'ERR_HTTP_422',
  HTTP_RATE_LIMIT: 'ERR_HTTP_429',
  HTTP_SERVER_ERROR: 'ERR_HTTP_500',
  HTTP_BAD_GATEWAY: 'ERR_HTTP_502',
  HTTP_UNAVAILABLE: 'ERR_HTTP_503',
  HTTP_GATEWAY_TIMEOUT: 'ERR_HTTP_504',

  // Client
  REQUEST_CANCELLED: 'ERR_REQUEST_CANCELLED',
  UNKNOWN: 'ERR_UNKNOWN',
  CHUNK_LOAD: 'ERR_CHUNK_LOAD',
  RUNTIME: 'ERR_RUNTIME',
  RENDER: 'ERR_RENDER',

  // Validation
  VALIDATION_FAILED: 'ERR_VALIDATION',
  DUPLICATE_RECORD: 'ERR_DUPLICATE',
} as const;

// Retryable HTTP status codes
export const RETRYABLE_STATUS_CODES: HttpErrorCode[] = [408, 429, 500, 502, 503, 504];

// Default retry configuration
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

// Statuses that should redirect to login
export const AUTH_REDIRECT_STATUSES: HttpErrorCode[] = [401];

// Statuses considered as "server down"
export const SERVER_DOWN_STATUSES: HttpErrorCode[] = [502, 503, 504];
