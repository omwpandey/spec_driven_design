import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '../useErrorHandler';

const mockHandleError = vi.fn((error: unknown) => ({
  id: 'err-ctx',
  code: 'ERR_HANDLED',
  message: error instanceof Error ? error.message : 'Unknown',
  userMessage: 'An error occurred',
  category: 'server',
  severity: 'error' as const,
  retryable: false,
  timestamp: Date.now(),
  metadata: {},
}));

const mockClearAllErrors = vi.fn();
const mockDismissToast = vi.fn();

vi.mock('@core/errors/ErrorContext', () => ({
  useErrorContext: () => ({
    state: { errors: [] },
    handleError: mockHandleError,
    clearAllErrors: mockClearAllErrors,
    dismissToast: mockDismissToast,
    networkStatus: { isOnline: true, isSlowConnection: false },
  }),
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns handleError function', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.handleError).toBeDefined();
    expect(typeof result.current.handleError).toBe('function');
  });

  it('returns clearErrors function', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.clearErrors).toBeDefined();
    expect(typeof result.current.clearErrors).toBe('function');
  });

  it('returns dismissToast function', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.dismissToast).toBeDefined();
    expect(typeof result.current.dismissToast).toBe('function');
  });

  it('returns errors array from state', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.errors).toEqual([]);
  });

  it('returns network status', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.networkStatus).toEqual({
      isOnline: true,
      isSlowConnection: false,
    });
  });

  it('handleError delegates to context handleError', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('test error');

    let appError: unknown;
    act(() => {
      appError = result.current.handleError(error);
    });

    expect(mockHandleError).toHaveBeenCalledWith(error, undefined);
    expect(appError).toHaveProperty('code', 'ERR_HANDLED');
  });

  it('handleError passes display config to context', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('display test');
    const display = { type: 'toast' as const, showToast: true, showBanner: false };

    act(() => {
      result.current.handleError(error, display);
    });

    expect(mockHandleError).toHaveBeenCalledWith(error, display);
  });

  it('clearErrors calls context clearAllErrors', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.clearErrors();
    });

    expect(mockClearAllErrors).toHaveBeenCalled();
  });

  it('dismissToast calls context dismissToast', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.dismissToast();
    });

    expect(mockDismissToast).toHaveBeenCalled();
  });
});
