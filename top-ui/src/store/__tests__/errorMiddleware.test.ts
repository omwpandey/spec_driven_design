// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeError, logError } from '@core/errors';
import { errorMiddleware } from '../middleware/errorMiddleware';

// Mock the error services
vi.mock('@core/errors', () => ({
  normalizeError: vi.fn((err) => ({
    id: 'mock-id',
    code: 'ERR_TEST',
    message: typeof err === 'string' ? err : err?.message || 'Unknown',
    userMessage: 'Test error',
    severity: 'error',
    category: 'unknown',
    timestamp: new Date().toISOString(),
    retryable: false,
    metadata: {},
  })),
  logError: vi.fn(),
}));

describe('errorMiddleware', () => {
  const next = vi.fn((action) => action);
  const store = { dispatch: vi.fn(), getState: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes normal actions through', () => {
    const action = { type: 'test/action', payload: 'data' };
    const middleware = errorMiddleware(store)(next);
    const result = middleware(action);
    expect(next).toHaveBeenCalledWith(action);
    expect(result).toEqual(action);
  });

  it('handles rejectedWithValue actions', () => {
    const action = {
      type: 'auth/login/rejected',
      payload: 'Login failed',
      meta: { rejectedWithValue: true, arg: {}, requestId: '1', requestStatus: 'rejected' as const, aborted: false, condition: false },
      error: { message: 'Rejected' },
    };
    const middleware = errorMiddleware(store)(next);
    middleware(action);
    expect(normalizeError).toHaveBeenCalledWith('Login failed', expect.any(Object));
    expect(logError).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('handles rejected actions with error', () => {
    const action = {
      type: 'data/fetch/rejected',
      error: { name: 'Error', message: 'Network failure' },
      meta: { arg: {}, requestId: '2', requestStatus: 'rejected' as const, aborted: false, condition: false },
    };
    const middleware = errorMiddleware(store)(next);
    middleware(action);
    expect(normalizeError).toHaveBeenCalled();
    expect(logError).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('handles rejected actions without error message', () => {
    const action = {
      type: 'data/fetch/rejected',
      error: {},
      meta: { arg: {}, requestId: '3', requestStatus: 'rejected' as const, aborted: false, condition: false },
    };
    const middleware = errorMiddleware(store)(next);
    middleware(action);
    expect(normalizeError).toHaveBeenCalledWith('Unknown thunk error', expect.any(Object));
  });
});
