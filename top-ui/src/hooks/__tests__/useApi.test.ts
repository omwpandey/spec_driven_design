import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useApi } from '../useApi';

// Mock dependencies
const mockNotify = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

vi.mock('@store/index', () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock('../useNotification', () => ({
  useNotification: () => mockNotify,
}));

vi.mock('@core/errors', () => ({
  normalizeError: (err: unknown) => ({
    id: 'err-1',
    code: 'ERR_TEST',
    message: err instanceof Error ? err.message : 'Unknown error',
    userMessage: 'Something went wrong',
    category: 'server',
    severity: 'error',
    retryable: true,
    timestamp: Date.now(),
    metadata: { validationErrors: [] },
  }),
  logError: vi.fn(),
  isRetryableError: (err: { retryable: boolean }) => err.retryable,
  getValidationErrors: (err: { metadata?: { validationErrors: unknown[] } }) =>
    err.metadata?.validationErrors || [],
}));

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useApi());
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
    expect(result.current.validationErrors).toEqual([]);
    expect(result.current.isRetryable).toBe(false);
  });

  it('sets loading state during execution', async () => {
    const { result } = renderHook(() => useApi());
    let resolvePromise: (value: unknown) => void;
    const apiCall = () =>
      new Promise<{ data: string; success: boolean }>((resolve) => {
        resolvePromise = resolve as (value: unknown) => void;
      });

    act(() => {
      result.current.execute(apiCall);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({ data: 'test', success: true });
    });

    expect(result.current.loading).toBe(false);
  });

  it('sets data on successful API call', async () => {
    const { result } = renderHook(() => useApi<string>());
    const apiCall = () => Promise.resolve({ data: 'response-data', success: true });

    await act(async () => {
      await result.current.execute(apiCall);
    });

    expect(result.current.data).toBe('response-data');
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('shows success notification when successMessage is provided', async () => {
    const { result } = renderHook(() =>
      useApi<string>({ successMessage: 'Saved!' })
    );
    const apiCall = () => Promise.resolve({ data: 'ok', success: true });

    await act(async () => {
      await result.current.execute(apiCall);
    });

    expect(mockNotify.success).toHaveBeenCalledWith('Saved!');
  });

  it('does not show success notification when successMessage is not provided', async () => {
    const { result } = renderHook(() => useApi<string>());
    const apiCall = () => Promise.resolve({ data: 'ok', success: true });

    await act(async () => {
      await result.current.execute(apiCall);
    });

    expect(mockNotify.success).not.toHaveBeenCalled();
  });

  it('sets error state on failed API call', async () => {
    const { result } = renderHook(() => useApi<string>());
    const apiCall = () => Promise.reject(new Error('Network failure'));

    await act(async () => {
      await result.current.execute(apiCall);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.success).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('shows error toast on failure when showErrorToast is true', async () => {
    const { result } = renderHook(() => useApi<string>({ showErrorToast: true }));
    const apiCall = () => Promise.reject(new Error('fail'));

    await act(async () => {
      await result.current.execute(apiCall);
    });

    expect(mockNotify.error).toHaveBeenCalledWith('Something went wrong');
  });

  it('does not show error toast when showErrorToast is false', async () => {
    const { result } = renderHook(() => useApi<string>({ showErrorToast: false }));
    const apiCall = () => Promise.reject(new Error('fail'));

    await act(async () => {
      await result.current.execute(apiCall);
    });

    expect(mockNotify.error).not.toHaveBeenCalled();
  });

  it('retry calls the last API function again', async () => {
    const apiCall = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ data: 'success', success: true });

    const { result } = renderHook(() => useApi<string>());

    await act(async () => {
      await result.current.execute(apiCall);
    });

    expect(result.current.error).not.toBeNull();

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.data).toBe('success');
    expect(result.current.success).toBe(true);
    expect(apiCall).toHaveBeenCalledTimes(2);
  });

  it('retry returns null if no previous call exists', async () => {
    const { result } = renderHook(() => useApi<string>());

    let retryResult: unknown;
    await act(async () => {
      retryResult = await result.current.retry();
    });

    expect(retryResult).toBeNull();
  });

  it('retry calls execute with the last API call', async () => {
    const apiCall = vi.fn()
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'));
    const { result } = renderHook(() => useApi<string>({ maxRetries: 3 }));

    await act(async () => {
      await result.current.execute(apiCall);
    });

    // Retry should re-call the same API function
    await act(async () => { await result.current.retry(); });

    expect(apiCall).toHaveBeenCalledTimes(2);
  });

  it('reset clears all state', async () => {
    const { result } = renderHook(() => useApi<string>());
    const apiCall = () => Promise.resolve({ data: 'test', success: true });

    await act(async () => {
      await result.current.execute(apiCall);
    });

    expect(result.current.data).toBe('test');

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
  });

  it('isRetryable reflects error retryable property', async () => {
    const { result } = renderHook(() => useApi<string>());
    const apiCall = () => Promise.reject(new Error('retryable'));

    await act(async () => {
      await result.current.execute(apiCall);
    });

    expect(result.current.isRetryable).toBe(true);
  });

  it('returns response from execute on success', async () => {
    const { result } = renderHook(() => useApi<string>());
    const response = { data: 'hello', success: true };
    const apiCall = () => Promise.resolve(response);

    let executeResult: unknown;
    await act(async () => {
      executeResult = await result.current.execute(apiCall);
    });

    expect(executeResult).toEqual(response);
  });

  it('returns null from execute on failure', async () => {
    const { result } = renderHook(() => useApi<string>());
    const apiCall = () => Promise.reject(new Error('fail'));

    let executeResult: unknown;
    await act(async () => {
      executeResult = await result.current.execute(apiCall);
    });

    expect(executeResult).toBeNull();
  });
});
