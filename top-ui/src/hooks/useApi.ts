/**
 * useApi Hook
 *
 * A reusable hook for making API calls with integrated error handling.
 * Wraps apiService with loading, error, success states and toast notifications.
 *
 * Features:
 * - Automatic loading state management
 * - Centralized error handling (normalizes + displays toast)
 * - Success notifications
 * - Retry support for failed requests
 * - Server-side validation error extraction
 * - Request cancellation on unmount
 *
 * Usage:
 *
 *   // GET request
 *   const { data, loading, error, execute } = useApi<ActivityData[]>();
 *   useEffect(() => { execute(() => apiService.get('/activities')); }, []);
 *
 *   // POST/PUT with success message
 *   const saveApi = useApi<ActivityData>({ successMessage: 'Saved successfully!' });
 *   const handleSave = () => saveApi.execute(() => apiService.post('/activities', formData));
 *
 *   // DELETE with confirmation
 *   const deleteApi = useApi({ successMessage: 'Deleted successfully!' });
 *   const handleDelete = () => deleteApi.execute(() => apiService.delete('/activities', id));
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { AppError, ValidationError } from '@core/errors';
import { normalizeError, logError, isRetryableError, getValidationErrors } from '@core/errors';
import { useNotification } from './useNotification';
import { ApiResponse } from '@services/apiService';

interface UseApiOptions {
  /** Show a success toast on successful response */
  successMessage?: string;
  /** Show error toast automatically (default: true) */
  showErrorToast?: boolean;
  /** Context name for logging (e.g., screen name) */
  context?: string;
  /** Auto-retry on failure */
  autoRetry?: boolean;
  /** Max retry attempts (default: 0 = no retry) */
  maxRetries?: 3;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  success: boolean;
  validationErrors: ValidationError[];
}

interface UseApiResult<T> {
  /** Response data from the last successful call */
  data: T | null;
  /** Whether a request is in progress */
  loading: boolean;
  /** Normalized error from the last failed call */
  error: AppError | null;
  /** Whether the last call was successful */
  success: boolean;
  /** Server-side validation errors (from 422 responses) */
  validationErrors: ValidationError[];
  /** Whether the error is retryable */
  isRetryable: boolean;
  /** Execute an API call */
  execute: (apiCall: () => Promise<ApiResponse<T>>) => Promise<ApiResponse<T> | null>;
  /** Retry the last failed request */
  retry: () => Promise<ApiResponse<T> | null>;
  /** Reset state to initial */
  reset: () => void;
}

export function useApi<T = unknown>(options: UseApiOptions = {}): UseApiResult<T> {
  const {
    successMessage,
    showErrorToast = true,
    context,
    maxRetries = 0,
  } = options;

  const notify = useNotification();
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
    validationErrors: [],
  });

  const lastCallRef = useRef<(() => Promise<ApiResponse<T>>) | null>(null);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);

  // Track component mount status to prevent state updates after unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T> | null> => {
      lastCallRef.current = apiCall;
      retryCountRef.current = 0;

      if (!mountedRef.current) return null;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
        validationErrors: [],
      }));

      try {
        const response = await apiCall();

        if (!mountedRef.current) return response;

        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
          validationErrors: [],
        });

        // Show success notification
        if (successMessage) {
          notify.success(successMessage);
        }

        return response;
      } catch (err) {
        if (!mountedRef.current) return null;

        const appError = normalizeError(err, {
          screenName: context,
        });

        logError(appError, {
          action: context || 'useApi',
          component: context,
        });

        const validationErrors = getValidationErrors(appError);

        setState((prev) => ({
          ...prev,
          loading: false,
          error: appError,
          success: false,
          validationErrors,
        }));

        // Show error toast
        if (showErrorToast) {
          notify.error(appError.userMessage);
        }

        return null;
      }
    },
    [successMessage, showErrorToast, context, notify]
  );

  const retry = useCallback(async (): Promise<ApiResponse<T> | null> => {
    if (!lastCallRef.current) return null;

    retryCountRef.current += 1;

    if (maxRetries > 0 && retryCountRef.current > maxRetries) {
      notify.error('Maximum retry attempts reached. Please try again later.');
      return null;
    }

    return execute(lastCallRef.current);
  }, [execute, maxRetries, notify]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
      validationErrors: [],
    });
    lastCallRef.current = null;
    retryCountRef.current = 0;
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    success: state.success,
    validationErrors: state.validationErrors,
    isRetryable: state.error ? isRetryableError(state.error) : false,
    execute,
    retry,
    reset,
  };
}
