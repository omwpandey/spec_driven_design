/**
 * Redux Error Middleware
 *
 * Automatically catches rejected async thunk actions
 * and normalizes/logs them through the centralized error service.
 * Prevents unhandled rejections from crashing the app.
 */

import { Middleware, isRejectedWithValue, isRejected } from '@reduxjs/toolkit';
import { normalizeError, logError } from '@core/errors';

/**
 * Middleware that intercepts rejected thunks and logs them
 * through the centralized error service.
 */
export const errorMiddleware: Middleware = () => (next) => (action: unknown) => {
  // Handle rejected async thunks with explicit rejectWithValue
  if (isRejectedWithValue(action)) {
    const appError = normalizeError(action.payload, {
      screenName: action.type,
    });

    logError(appError, {
      action: action.type,
      component: 'redux-thunk',
    });
  }
  // Handle rejected async thunks (unhandled errors)
  else if (isRejected(action)) {
    const errorPayload = action.error;
    const appError = normalizeError(
      errorPayload?.message ? new Error(errorPayload.message) : 'Unknown thunk error',
      { screenName: action.type }
    );

    logError(appError, {
      action: action.type,
      component: 'redux-thunk',
    });
  }

  return next(action);
};
