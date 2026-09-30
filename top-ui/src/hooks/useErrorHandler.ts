/**
 * useErrorHandler Hook
 *
 * Simple hook for components to handle errors consistently.
 * Wraps the ErrorContext for easy access in any component.
 *
 * Usage:
 *   const { handleError, clearErrors } = useErrorHandler();
 *
 *   try {
 *     await someOperation();
 *   } catch (error) {
 *     handleError(error);
 *   }
 */

import { useCallback } from 'react';
import { useErrorContext } from '@core/errors/ErrorContext';
import { AppError, ErrorDisplayConfig } from '@core/errors';

interface ErrorHandlerResult {
  handleError: (error: unknown, display?: ErrorDisplayConfig) => AppError;
  clearErrors: () => void;
  dismissToast: () => void;
  errors: AppError[];
  networkStatus: { isOnline: boolean; isSlowConnection: boolean };
}

export function useErrorHandler(): ErrorHandlerResult {
  const { state, handleError, clearAllErrors, dismissToast, networkStatus } = useErrorContext();

  const wrappedHandleError = useCallback(
    (error: unknown, display?: ErrorDisplayConfig): AppError => {
      return handleError(error, display);
    },
    [handleError]
  );

  return {
    handleError: wrappedHandleError,
    clearErrors: clearAllErrors,
    dismissToast,
    errors: state.errors,
    networkStatus: {
      isOnline: networkStatus.isOnline,
      isSlowConnection: networkStatus.isSlowConnection,
    },
  };
}
