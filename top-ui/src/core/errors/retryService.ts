/**
 * Enterprise Error Handling - Retry Service
 *
 * Implements exponential backoff retry logic for failed operations.
 * Supports cancellation and maximum attempt limits.
 */

import { RetryConfig } from './types';
import { DEFAULT_RETRY_CONFIG } from './constants';

/**
 * Generate a cryptographically secure random number between 0 and 1.
 * Used for retry jitter to satisfy security scanning requirements.
 */
function secureRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xFFFFFFFF + 1);
}

export interface RetryState {
  attempt: number;
  maxRetries: number;
  isRetrying: boolean;
  lastError?: unknown;
}

/**
 * Execute an async operation with automatic retry
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {},
  onRetryAttempt?: (attempt: number, error: unknown) => void
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay, backoffMultiplier } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) break;

      // Notify about retry attempt
      if (onRetryAttempt) {
        onRetryAttempt(attempt + 1, error);
      }

      // Calculate delay with exponential backoff + jitter
      const delay = Math.min(
        baseDelay * Math.pow(backoffMultiplier, attempt) + secureRandom() * 1000,
        maxDelay
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Create a retryable wrapper around a function
 */
export function createRetryableOperation<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): {
  execute: () => Promise<T>;
  cancel: () => void;
} {
  let cancelled = false;

  const execute = async (): Promise<T> => {
    const { maxRetries, baseDelay, maxDelay, backoffMultiplier } = {
      ...DEFAULT_RETRY_CONFIG,
      ...config,
    };

    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (cancelled) throw new Error('Operation cancelled');

      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries) break;

        const delay = Math.min(
          baseDelay * Math.pow(backoffMultiplier, attempt) + secureRandom() * 1000,
          maxDelay
        );

        await sleep(delay);
      }
    }

    throw lastError;
  };

  const cancel = () => {
    cancelled = true;
  };

  return { execute, cancel };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
