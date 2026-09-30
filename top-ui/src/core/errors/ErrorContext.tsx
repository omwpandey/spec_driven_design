/**
 * Enterprise Error Handling - Error Context Provider
 *
 * Provides centralized error state management through React Context.
 * Handles global error notifications, network status monitoring,
 * and error display coordination.
 */

import React, { createContext, useContext, useCallback, useReducer, useEffect, useRef } from 'react';
import { AppError, NetworkStatus, ErrorDisplayConfig } from './types';
import { normalizeError, isAuthError, isNetworkError } from './errorService';
import { logError } from './loggingService';

// State
interface ErrorState {
  errors: AppError[];
  currentToast: AppError | null;
  networkStatus: NetworkStatus;
  isGlobalLoading: boolean;
}

// Actions
type ErrorAction =
  | { type: 'ADD_ERROR'; payload: AppError }
  | { type: 'DISMISS_ERROR'; payload: string }
  | { type: 'DISMISS_TOAST' }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_NETWORK_STATUS'; payload: Partial<NetworkStatus> }
  | { type: 'SET_GLOBAL_LOADING'; payload: boolean };

// Context value
interface ErrorContextValue {
  state: ErrorState;
  handleError: (error: unknown, display?: ErrorDisplayConfig) => AppError;
  dismissError: (errorId: string) => void;
  dismissToast: () => void;
  clearAllErrors: () => void;
  networkStatus: NetworkStatus;
}

const initialNetworkStatus: NetworkStatus = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSlowConnection: false,
  lastChecked: new Date().toISOString(),
};

const initialState: ErrorState = {
  errors: [],
  currentToast: null,
  networkStatus: initialNetworkStatus,
  isGlobalLoading: false,
};

function errorReducer(state: ErrorState, action: ErrorAction): ErrorState {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        errors: [action.payload, ...state.errors].slice(0, 50),
        currentToast: action.payload,
      };
    case 'DISMISS_ERROR':
      return {
        ...state,
        errors: state.errors.filter((e) => e.id !== action.payload),
      };
    case 'DISMISS_TOAST':
      return {
        ...state,
        currentToast: null,
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        errors: [],
        currentToast: null,
      };
    case 'SET_NETWORK_STATUS':
      return {
        ...state,
        networkStatus: { ...state.networkStatus, ...action.payload, lastChecked: new Date().toISOString() },
      };
    case 'SET_GLOBAL_LOADING':
      return {
        ...state,
        isGlobalLoading: action.payload,
      };
    default:
      return state;
  }
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

interface ErrorProviderProps {
  children: React.ReactNode;
  onAuthError?: (error: AppError) => void;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children, onAuthError }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);
  const onAuthErrorRef = useRef(onAuthError);
  onAuthErrorRef.current = onAuthError;

  // Handle errors centrally
  const handleError = useCallback(
    (error: unknown, _display?: ErrorDisplayConfig): AppError => {
      const appError = normalizeError(error);

      // Log the error
      logError(appError);

      // Handle auth errors (redirect to login)
      if (isAuthError(appError)) {
        if (onAuthErrorRef.current) {
          onAuthErrorRef.current(appError);
        }
        return appError;
      }

      // Dispatch to state
      dispatch({ type: 'ADD_ERROR', payload: appError });

      return appError;
    },
    []
  );

  const dismissError = useCallback((errorId: string) => {
    dispatch({ type: 'DISMISS_ERROR', payload: errorId });
  }, []);

  const dismissToast = useCallback(() => {
    dispatch({ type: 'DISMISS_TOAST' });
  }, []);

  const clearAllErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      dispatch({ type: 'SET_NETWORK_STATUS', payload: { isOnline: true } });
    };

    const handleOffline = () => {
      dispatch({ type: 'SET_NETWORK_STATUS', payload: { isOnline: false } });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Detect slow connection
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as unknown as { connection: { effectiveType?: string; downlink?: number; addEventListener: (e: string, fn: () => void) => void; removeEventListener: (e: string, fn: () => void) => void } }).connection;

      const updateConnectionInfo = () => {
        const isSlow = connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g' || (connection.downlink !== undefined && connection.downlink < 1);
        dispatch({
          type: 'SET_NETWORK_STATUS',
          payload: {
            isSlowConnection: isSlow,
            connectionType: connection.effectiveType,
            downlinkSpeed: connection.downlink,
          },
        });
      };

      updateConnectionInfo();
      connection.addEventListener('change', updateConnectionInfo);

      return () => {
        connection.removeEventListener('change', updateConnectionInfo);
      };
    }
  }, []);

  // Global unhandled promise rejection handler
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      handleError(event.reason);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [handleError]);

  // Global error event handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      // Prevent default browser error handling
      event.preventDefault();
      handleError(event.error || new Error(event.message));
    };

    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, [handleError]);

  const value: ErrorContextValue = {
    state,
    handleError,
    dismissError,
    dismissToast,
    clearAllErrors,
    networkStatus: state.networkStatus,
  };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};

/**
 * Hook to access the error context
 */
export function useErrorContext(): ErrorContextValue {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
}
