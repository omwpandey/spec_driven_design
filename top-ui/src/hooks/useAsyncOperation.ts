/**
 * useAsyncOperation Hook
 *
 * Provides a standard pattern for executing async operations
 * with loading states, error handling, and retry support.
 *
 * Usage:
 *   const { execute, loading, error, data, retry } = useAsyncOperation(fetchData);
 *   await execute(params);
 */

import { useState, useCallback, useRef } from 'react';
import { AppError } from '@core/errors';
import { normalizeError, logError, isRetryableError } from '@core/errors';
import { withRetry } from '@core/errors';
import { RetryConfig } from '@core/errors';

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  retryCount: number;
}

interface AsyncOperationOptions {
  retry?: Partial<RetryConfig>;
  autoRetry?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: AppError) => void;
  context?: string;
}

interface AsyncOperationResult<T, P extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  execute: (...args: P) => Promise<T | null>;
  retry: () => Promise<T | null>;
  reset: () => void;
  retryCount: number;
  isRetryable: boolean;
}

export function useAsyncOperation<T, P extends unknown[] = []>(
  operation: (...args: P) => Promise<T>,
  options: AsyncOperationOptions = {}
): AsyncOperationResult<T, P> {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const lastArgsRef = useRef<P | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      // Cancel any previous operation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      lastArgsRef.current = args;
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let result: T;

        if (options.autoRetry) {
          result = await withRetry(
            () => operation(...args),
            options.retry,
            (attempt) => {
              setState((prev) => ({ ...prev, retryCount: attempt }));
            }
          );
        } else {
          result = await operation(...args);
        }

        setState({ data: result, loading: false, error: null, retryCount: 0 });

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (err) {
        const appError = normalizeError(err, {
          screenName: options.context,
        });

        logError(appError, { action: options.context || 'asyncOperation' });

        setState((prev) => ({
          ...prev,
          loading: false,
          error: appError,
        }));

        if (options.onError) {
          options.onError(appError);
        }

        return null;
      }
    },
    [operation, options.autoRetry, options.retry, options.onSuccess, options.onError, options.context]
  );

  const retry = useCallback(async (): Promise<T | null> => {
    if (lastArgsRef.current) {
      return execute(...lastArgsRef.current);
    }
    return null;
  }, [execute]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({ data: null, loading: false, error: null, retryCount: 0 });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    retry,
    reset,
    retryCount: state.retryCount,
    isRetryable: state.error ? isRetryableError(state.error) : false,
  };
}
