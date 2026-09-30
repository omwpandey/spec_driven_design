/**
 * Enterprise Error Handling - Centralized Error Service
 *
 * Normalizes all error types into a consistent AppError structure.
 * Maps backend errors to user-friendly messages.
 * Determines error severity and category.
 */

import { AxiosError } from 'axios';
import {
  AppError,
  ApiErrorResponse,
  ErrorCategory,
  ErrorSeverity,
  ErrorMetadata,
  HttpErrorCode,
  ValidationError,
} from './types';
import {
  ERROR_MESSAGES,
  ERROR_CODES,
  HTTP_ERROR_CATEGORY,
  HTTP_ERROR_SEVERITY,
  RETRYABLE_STATUS_CODES,
} from './constants';

let errorIdCounter = 0;

function generateErrorId(): string {
  errorIdCounter += 1;
  return `err_${Date.now()}_${errorIdCounter}`;
}

function getBrowserInfo(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  return navigator.userAgent;
}

function getCurrentRoute(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname;
}

/**
 * Normalize any error into a consistent AppError
 */
export function normalizeError(error: unknown, context?: Partial<ErrorMetadata>): AppError {
  // Already normalized
  if (isAppError(error)) return error;

  // Axios/API errors
  if (isAxiosError(error)) return normalizeAxiosError(error, context);

  // Standard JS errors
  if (error instanceof Error) return normalizeJsError(error, context);

  // String errors
  if (typeof error === 'string') {
    return createAppError({
      code: ERROR_CODES.UNKNOWN,
      message: error,
      userMessage: ERROR_MESSAGES.UNKNOWN_ERROR,
      severity: 'error',
      category: 'unknown',
      retryable: false,
      metadata: context,
      originalError: error,
    });
  }

  // Completely unknown
  return createAppError({
    code: ERROR_CODES.UNKNOWN,
    message: 'An unknown error occurred',
    userMessage: ERROR_MESSAGES.UNKNOWN_ERROR,
    severity: 'error',
    category: 'unknown',
    retryable: false,
    metadata: context,
    originalError: error,
  });
}

/**
 * Normalize Axios errors with full status code handling
 */
function normalizeAxiosError(error: AxiosError<ApiErrorResponse>, context?: Partial<ErrorMetadata>): AppError {
  const status = error.response?.status as HttpErrorCode | undefined;
  const responseData = error.response?.data;
  const endpoint = error.config?.url || '';

  // Network error (no response received)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return createAppError({
        code: ERROR_CODES.NETWORK_TIMEOUT,
        message: `Request timeout: ${endpoint}`,
        userMessage: ERROR_MESSAGES.NETWORK_TIMEOUT,
        severity: 'warning',
        category: 'timeout',
        retryable: true,
        metadata: { ...context, endpoint, httpStatus: 0 },
        originalError: error,
      });
    }

    if (!navigator.onLine) {
      return createAppError({
        code: ERROR_CODES.NETWORK_OFFLINE,
        message: 'No internet connection',
        userMessage: ERROR_MESSAGES.NETWORK_OFFLINE,
        severity: 'warning',
        category: 'network',
        retryable: true,
        metadata: { ...context, endpoint, httpStatus: 0 },
        originalError: error,
      });
    }

    return createAppError({
      code: ERROR_CODES.NETWORK_ERROR,
      message: `Network error: ${error.message}`,
      userMessage: ERROR_MESSAGES.NETWORK_ERROR,
      severity: 'error',
      category: 'network',
      retryable: true,
      metadata: { ...context, endpoint, httpStatus: 0 },
      originalError: error,
    });
  }

  // Request was cancelled
  if (error.code === 'ERR_CANCELED') {
    return createAppError({
      code: ERROR_CODES.REQUEST_CANCELLED,
      message: 'Request was cancelled',
      userMessage: ERROR_MESSAGES.REQUEST_CANCELLED,
      severity: 'warning',
      category: 'client',
      retryable: false,
      metadata: { ...context, endpoint, httpStatus: 0 },
      originalError: error,
    });
  }

  // HTTP status errors
  if (status) {
    const category: ErrorCategory = HTTP_ERROR_CATEGORY[status] || 'unknown';
    const severity: ErrorSeverity = HTTP_ERROR_SEVERITY[status] || 'error';
    const retryable = RETRYABLE_STATUS_CODES.includes(status);
    const errorCode = `ERR_HTTP_${status}`;
    const messageKey = `HTTP_${status}`;

    // Extract validation errors from 422
    const validationErrors: ValidationError[] = [];
    if (status === 422 && responseData?.error?.details) {
      validationErrors.push(...responseData.error.details);
    }

    // Use backend message if available, fall back to standard message
    const backendMessage = responseData?.error?.message || responseData?.message;
    const userMessage = backendMessage || ERROR_MESSAGES[messageKey] || ERROR_MESSAGES.UNKNOWN_ERROR;

    return createAppError({
      code: errorCode,
      message: `HTTP ${status}: ${backendMessage || error.message}`,
      userMessage,
      severity,
      category,
      retryable,
      metadata: {
        ...context,
        endpoint,
        httpStatus: status,
        validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
        requestId: error.response?.headers?.['x-request-id'],
      },
      originalError: error,
    });
  }

  return createAppError({
    code: ERROR_CODES.UNKNOWN,
    message: error.message,
    userMessage: ERROR_MESSAGES.UNKNOWN_ERROR,
    severity: 'error',
    category: 'unknown',
    retryable: false,
    metadata: { ...context, endpoint },
    originalError: error,
  });
}

/**
 * Normalize standard JavaScript errors
 */
function normalizeJsError(error: Error, context?: Partial<ErrorMetadata>): AppError {
  // Chunk load errors (lazy loading failures)
  if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
    return createAppError({
      code: ERROR_CODES.CHUNK_LOAD,
      message: error.message,
      userMessage: ERROR_MESSAGES.CHUNK_LOAD_ERROR,
      severity: 'error',
      category: 'network',
      retryable: true,
      metadata: { ...context, stackTrace: error.stack },
      originalError: error,
    });
  }

  return createAppError({
    code: ERROR_CODES.RUNTIME,
    message: error.message,
    userMessage: ERROR_MESSAGES.RUNTIME_ERROR,
    severity: 'error',
    category: 'unknown',
    retryable: false,
    metadata: { ...context, stackTrace: error.stack },
    originalError: error,
  });
}

/**
 * Create a fully formed AppError
 */
function createAppError(params: {
  code: string;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  retryable: boolean;
  metadata?: Partial<ErrorMetadata>;
  originalError?: unknown;
}): AppError {
  return {
    id: generateErrorId(),
    code: params.code,
    message: params.message,
    userMessage: params.userMessage,
    severity: params.severity,
    category: params.category,
    timestamp: new Date().toISOString(),
    retryable: params.retryable,
    metadata: {
      browser: getBrowserInfo(),
      screenName: getCurrentRoute(),
      ...params.metadata,
    },
    originalError: params.originalError,
  };
}

/**
 * Type guard: check if error is already an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'id' in error &&
    'code' in error &&
    'userMessage' in error &&
    'category' in error
  );
}

/**
 * Type guard: check if error is an AxiosError
 */
function isAxiosError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: AppError): boolean {
  return error.retryable;
}

/**
 * Check if error requires authentication redirect
 */
export function isAuthError(error: AppError): boolean {
  return error.category === 'authentication';
}

/**
 * Check if error is a network connectivity issue
 */
export function isNetworkError(error: AppError): boolean {
  return error.category === 'network' || error.category === 'timeout';
}

/**
 * Extract validation errors from an AppError
 */
export function getValidationErrors(error: AppError): ValidationError[] {
  return error.metadata?.validationErrors || [];
}
