/**
 * Error Handling Demo Component
 *
 * Demonstrates all enterprise error handling capabilities:
 * - API errors (400, 401, 403, 404, 408, 409, 422, 429, 500, 502, 503, 504)
 * - Network errors (offline, timeout, slow connection)
 * - Runtime errors (Error Boundary catch)
 * - Form validation errors (server-side)
 * - Async operation errors with retry
 * - Unhandled promise rejections
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Chip,
  Stack,
  Paper,
  Divider,
  ErrorOutlinedIcon as ErrorIcon,
  OfflineIcon,
  RefreshIcon as RetryIcon,
  BugIcon,
  TimeoutIcon,
  LockIcon as AuthIcon,
  ServerIcon,
  WarningIcon,
  SuccessIcon,
} from '@components/common';
import { SectionCard } from '@components/layout';
import { useErrorHandler, useAsyncOperation, useNetworkStatus } from '@hooks';
import { normalizeError, withRetry, AppError } from '@core/errors';
import { AxiosError } from 'axios';

// ============================================================
// COMPONENT: Intentionally throws to test Error Boundary
// ============================================================
const CrashComponent: React.FC = () => {
  throw new Error('Intentional render crash for Error Boundary demo');
};

// ============================================================
// HELPER: Create a fake AxiosError for demos
// ============================================================
function createFakeAxiosError(status: number, message: string, details?: unknown): AxiosError {
  const error = new Error(message) as AxiosError;
  error.isAxiosError = true;
  error.code = status === 0 ? 'ERR_NETWORK' : undefined;
  error.config = { url: '/api/demo/endpoint', headers: {} } as AxiosError['config'];
  error.response = status > 0
    ? {
        status,
        statusText: message,
        data: {
          success: false,
          error: {
            code: `ERR_${status}`,
            message,
            details: details || undefined,
          },
        },
        headers: { 'x-request-id': `req_demo_${Date.now()}` },
        config: error.config!,
      }
    : undefined;
  error.toJSON = () => ({});
  return error;
}

// ============================================================
// MAIN DEMO COMPONENT
// ============================================================
const ErrorHandlingDemo: React.FC = () => {
  const { handleError } = useErrorHandler();
  const networkStatus = useNetworkStatus();
  const [lastError, setLastError] = useState<AppError | null>(null);
  const [showCrash, setShowCrash] = useState(false);
  const [retryLog, setRetryLog] = useState<string[]>([]);

  // Async operation demo with retry
  const flakyApi = useAsyncOperation(
    async () => {
      // Simulates a flaky API that fails 2 times then succeeds
      const attempts = (window as unknown as { __demoAttempts?: number }).__demoAttempts || 0;
      (window as unknown as { __demoAttempts: number }).__demoAttempts = attempts + 1;

      if (attempts < 2) {
        throw createFakeAxiosError(503, 'Service temporarily unavailable');
      }

      (window as unknown as { __demoAttempts: number }).__demoAttempts = 0;
      return { message: 'Success after retries!', data: [1, 2, 3] };
    },
    { autoRetry: true, retry: { maxRetries: 3, baseDelay: 500 }, context: 'ErrorHandlingDemo' }
  );

  // Trigger a specific HTTP error
  const triggerHttpError = (status: number, message: string, details?: unknown) => {
    const error = createFakeAxiosError(status, message, details);
    const appError = handleError(error);
    setLastError(appError);
  };

  // Trigger a network error
  const triggerNetworkError = (type: 'offline' | 'timeout' | 'generic') => {
    let error: AxiosError;
    switch (type) {
      case 'offline': {
        error = createFakeAxiosError(0, 'Network Error');
        error.response = undefined;
        error.code = 'ERR_NETWORK';
        break;
      }
      case 'timeout': {
        error = createFakeAxiosError(0, 'timeout of 30000ms exceeded');
        error.response = undefined;
        error.code = 'ECONNABORTED';
        break;
      }
      default: {
        error = createFakeAxiosError(0, 'Network Error');
        error.response = undefined;
        break;
      }
    }
    const appError = handleError(error);
    setLastError(appError);
  };

  // Trigger an unhandled promise rejection
  const triggerUnhandledRejection = () => {
    Promise.reject(new Error('Unhandled async failure — caught by ErrorProvider'));
  };

  // Trigger a runtime error
  const triggerRuntimeError = () => {
    try {
      const obj: unknown = null;
      (obj as { nonExistent: () => void }).nonExistent();
    } catch (err) {
      const appError = handleError(err);
      setLastError(appError);
    }
  };

  // Retry demo with logging
  const triggerRetryDemo = async () => {
    setRetryLog([]);
    let attempt = 0;

    try {
      await withRetry(
        async () => {
          attempt++;
          setRetryLog((prev) => [...prev, `Attempt ${attempt}: Calling API...`]);
          if (attempt < 3) {
            throw createFakeAxiosError(503, `Attempt ${attempt} failed`);
          }
          return 'Success!';
        },
        { maxRetries: 3, baseDelay: 800 },
        (retryNum) => {
          setRetryLog((prev) => [...prev, `  ↳ Retry #${retryNum} — waiting with exponential backoff...`]);
        }
      );
      setRetryLog((prev) => [...prev, `✅ Attempt ${attempt}: Success!`]);
    } catch {
      setRetryLog((prev) => [...prev, `❌ All retries exhausted`]);
    }
  };

  return (
    <Box>
      {/* Current Network Status */}
      <Box sx={{ mb: 2 }}>
        <Alert
          severity={networkStatus.isOnline ? 'success' : 'error'}
          icon={networkStatus.isOnline ? <SuccessIcon /> : <OfflineIcon />}
        >
          <strong>Network Status:</strong>{' '}
          {networkStatus.isOnline ? 'Online' : 'Offline'}
          {networkStatus.isSlowConnection && ' (Slow connection detected)'}
          {networkStatus.connectionType && ` — Type: ${networkStatus.connectionType}`}
        </Alert>
      </Box>

      {/* ====== API ERROR HANDLING ====== */}
      <SectionCard title="1. API Error Handling (All HTTP Status Codes)">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click any button to simulate an API error. The error is captured by the centralized
          error service, normalized into an AppError, logged, and displayed via toast notification.
        </Typography>

        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#EB0A1E' }}>
          Client Errors (4xx)
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
          <Button variant="outlined" size="small" color="warning" onClick={() => triggerHttpError(400, 'Invalid request body')}>
            400 Bad Request
          </Button>
          <Button variant="outlined" size="small" color="warning" onClick={() => triggerHttpError(401, 'Token expired')}>
            401 Unauthorized
          </Button>
          <Button variant="outlined" size="small" color="warning" onClick={() => triggerHttpError(403, 'Insufficient permissions')}>
            403 Forbidden
          </Button>
          <Button variant="outlined" size="small" color="warning" onClick={() => triggerHttpError(404, 'Resource not found')}>
            404 Not Found
          </Button>
          <Button variant="outlined" size="small" color="warning" onClick={() => triggerHttpError(408, 'Request timed out')}>
            408 Timeout
          </Button>
          <Button variant="outlined" size="small" color="warning" onClick={() => triggerHttpError(409, 'Record was modified by another user')}>
            409 Conflict
          </Button>
          <Button variant="outlined" size="small" color="warning" onClick={() => triggerHttpError(422, 'Validation failed', [
            { field: 'email', message: 'Email format is invalid' },
            { field: 'phone', message: 'Phone number is required' },
          ])}>
            422 Validation
          </Button>
          <Button variant="outlined" size="small" color="warning" onClick={() => triggerHttpError(429, 'Rate limit exceeded')}>
            429 Rate Limit
          </Button>
        </Stack>

        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#EB0A1E' }}>
          Server Errors (5xx)
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          <Button variant="outlined" size="small" color="error" onClick={() => triggerHttpError(500, 'Internal server error')}>
            500 Server Error
          </Button>
          <Button variant="outlined" size="small" color="error" onClick={() => triggerHttpError(502, 'Bad gateway')}>
            502 Bad Gateway
          </Button>
          <Button variant="outlined" size="small" color="error" onClick={() => triggerHttpError(503, 'Service unavailable')}>
            503 Unavailable
          </Button>
          <Button variant="outlined" size="small" color="error" onClick={() => triggerHttpError(504, 'Gateway timeout')}>
            504 Gateway Timeout
          </Button>
        </Stack>
      </SectionCard>

      {/* ====== NETWORK ERRORS ====== */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="2. Network Error Handling">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Simulates network failures. The framework detects offline mode, timeouts, and
            connection failures — showing a persistent banner and toast notifications.
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <Button variant="outlined" size="small" startIcon={<OfflineIcon />} onClick={() => triggerNetworkError('offline')}>
              Internet Disconnected
            </Button>
            <Button variant="outlined" size="small" startIcon={<TimeoutIcon />} onClick={() => triggerNetworkError('timeout')}>
              Request Timeout
            </Button>
            <Button variant="outlined" size="small" startIcon={<ServerIcon />} onClick={() => triggerNetworkError('generic')}>
              Network Failure
            </Button>
          </Stack>
        </SectionCard>
      </Box>

      {/* ====== RUNTIME / ERROR BOUNDARY ====== */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="3. Runtime Errors & Error Boundary">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tests runtime errors caught by try/catch and component render crashes
            caught by the Error Boundary (prevents full app crash).
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
            <Button variant="outlined" size="small" startIcon={<BugIcon />} color="error" onClick={triggerRuntimeError}>
              Runtime Error (try/catch)
            </Button>
            <Button variant="outlined" size="small" startIcon={<WarningIcon />} color="error" onClick={triggerUnhandledRejection}>
              Unhandled Promise Rejection
            </Button>
            <Button variant="contained" size="small" startIcon={<ErrorIcon />} color="error" onClick={() => setShowCrash(true)}>
              Trigger Render Crash (Error Boundary)
            </Button>
          </Stack>
          {showCrash && <CrashComponent />}
        </SectionCard>
      </Box>

      {/* ====== RETRY MECHANISM ====== */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="4. Retry Mechanism (Exponential Backoff)">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Demonstrates automatic retry with exponential backoff. The operation fails 2 times
            then succeeds on the 3rd attempt.
          </Typography>
          <Stack direction="row" gap={1} sx={{ mb: 2 }}>
            <Button variant="outlined" size="small" startIcon={<RetryIcon />} onClick={triggerRetryDemo}>
              Manual Retry (withRetry)
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RetryIcon />}
              onClick={() => {
                (window as unknown as { __demoAttempts: number }).__demoAttempts = 0;
                flakyApi.execute();
              }}
            >
              useAsyncOperation (Auto-Retry)
            </Button>
          </Stack>

          {/* Retry log */}
          {retryLog.length > 0 && (
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#FAFAFA', fontFamily: 'monospace', fontSize: '0.75rem' }}>
              {retryLog.map((line, i) => (
                <Typography key={i} sx={{ fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: 1.8 }}>
                  {line}
                </Typography>
              ))}
            </Paper>
          )}

          {/* Async operation state */}
          {flakyApi.loading && (
            <Alert severity="info" sx={{ mt: 1 }}>Loading... (attempt {flakyApi.retryCount + 1})</Alert>
          )}
          {flakyApi.error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              Failed: {flakyApi.error.userMessage}
              {flakyApi.isRetryable && (
                <Button size="small" onClick={flakyApi.retry} sx={{ ml: 1 }}>Retry</Button>
              )}
            </Alert>
          )}
          {flakyApi.data && (
            <Alert severity="success" sx={{ mt: 1 }}>
              {(flakyApi.data as { message: string }).message}
            </Alert>
          )}
        </SectionCard>
      </Box>

      {/* ====== FORM VALIDATION ERRORS (SERVER-SIDE) ====== */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="5. Server-Side Validation Errors (422)">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            When a form is submitted and the server returns 422 with field-level errors,
            the framework maps them to react-hook-form field errors automatically.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            color="warning"
            onClick={() => triggerHttpError(422, 'Validation failed', [
              { field: 'firstName', message: 'First name must be at least 2 characters' },
              { field: 'email', message: 'Email already exists in the system' },
              { field: 'phone', message: 'Phone number format is invalid (expected: 0812345678)' },
              { field: 'salary', message: 'Salary must be a positive number' },
            ])}
          >
            Simulate 422 with Field Errors
          </Button>
        </SectionCard>
      </Box>

      {/* ====== LAST ERROR DETAILS ====== */}
      {lastError && (
        <Box sx={{ mt: 2 }}>
          <SectionCard title="Last Captured Error (Internal Debug View)">
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              This shows the normalized AppError structure — never shown to end users.
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#FFF8F8' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary">Error ID</Typography>
                  <Typography variant="body2" fontWeight={500}>{lastError.id}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary">Code</Typography>
                  <Typography variant="body2" fontWeight={500}>{lastError.code}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary">Category</Typography>
                  <Chip label={lastError.category} size="small" color="default" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary">Severity</Typography>
                  <Chip
                    label={lastError.severity}
                    size="small"
                    color={lastError.severity === 'critical' ? 'error' : lastError.severity === 'error' ? 'error' : 'warning'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">User Message (shown to user)</Typography>
                  <Typography variant="body2">{lastError.userMessage}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Technical Message (logged only)</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {lastError.message}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Retryable</Typography>
                  <Typography variant="body2">{lastError.retryable ? '✅ Yes' : '❌ No'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Endpoint</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {lastError.metadata?.endpoint || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Timestamp</Typography>
                  <Typography variant="body2">{new Date(lastError.timestamp).toLocaleTimeString()}</Typography>
                </Grid>
                {lastError.metadata?.validationErrors && lastError.metadata.validationErrors.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">Validation Errors</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {lastError.metadata.validationErrors.map((ve, i) => (
                        <Typography key={i} variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          • <strong>{ve.field}</strong>: {ve.message}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </SectionCard>
        </Box>
      )}

      {/* ====== SUMMARY ====== */}
      <Box sx={{ mt: 2 }}>
        <SectionCard title="Error Handling Coverage Summary">
          <Grid container spacing={2}>
            {[
              { label: '400 Bad Request', category: 'Client', handled: true },
              { label: '401 Unauthorized', category: 'Auth', handled: true },
              { label: '403 Forbidden', category: 'Auth', handled: true },
              { label: '404 Not Found', category: 'Client', handled: true },
              { label: '408 Request Timeout', category: 'Timeout', handled: true },
              { label: '409 Conflict', category: 'Client', handled: true },
              { label: '422 Validation', category: 'Validation', handled: true },
              { label: '429 Rate Limit', category: 'Rate Limit', handled: true },
              { label: '500 Server Error', category: 'Server', handled: true },
              { label: '502 Bad Gateway', category: 'Server', handled: true },
              { label: '503 Unavailable', category: 'Server', handled: true },
              { label: '504 Gateway Timeout', category: 'Timeout', handled: true },
              { label: 'Network Offline', category: 'Network', handled: true },
              { label: 'Request Timeout', category: 'Network', handled: true },
              { label: 'Render Crash', category: 'Boundary', handled: true },
              { label: 'Runtime Error', category: 'JS Error', handled: true },
              { label: 'Unhandled Promise', category: 'Async', handled: true },
              { label: 'Auto-Retry', category: 'Recovery', handled: true },
              { label: 'Token Refresh', category: 'Auth', handled: true },
              { label: 'Form Validation', category: 'Validation', handled: true },
            ].map((item) => (
              <Grid key={item.label} size={{ xs: 6, sm: 4, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <SuccessIcon sx={{ fontSize: 16, color: '#4CAF50' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    {item.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </SectionCard>
      </Box>
    </Box>
  );
};

export default ErrorHandlingDemo;
