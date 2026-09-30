import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsyncOperation } from '../useAsyncOperation';

vi.mock('@core/errors', () => ({
  normalizeError: (err: unknown) => ({
    id: 'err-async',
    code: 'ERR_ASYNC',
    message: err instanceof Error ? err.message : 'Unknown',
    userMessage: 'Async operation failed',
    category: 'server',
    severity: 'error',
    retryable: true,
    timestamp: Date.now(),
    metadata: {},
  }),
  logError: vi.fn(),
  isRetryableError: (err: { retryable: boolean }) => err.retryable,
  withRetry: vi.fn(async (fn: () => Promise<unknown>, _config?: unknown, onRetry?: (n: number) => void) => {
    try {
      return await fn();
    } catch (e) {
      if (onRetry) onRetry(1);
      return await fn();
    }
  }),
}));

describe('useAsyncOperation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state', () => {
    const op = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsyncOperation(op));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.retryCount).toBe(0);
    expect(result.current.isRetryable).toBe(false);
  });

  it('executes operation and sets data on success', async () => {
    const op = vi.fn().mockResolvedValue('result-data');
    const { result } = renderHook(() => useAsyncOperation(op));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('result-data');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets loading true during execution', async () => {
    let resolveOp: (value: string) => void;
    const op = vi.fn(() => new Promise<string>((resolve) => { resolveOp = resolve; }));
    const { result } = renderHook(() => useAsyncOperation(op));

    act(() => {
      result.current.execute();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveOp!('done');
    });

    expect(result.current.loading).toBe(false);
  });

  it('sets error state on failure', async () => {
    const op = vi.fn().mockRejectedValue(new Error('operation failed'));
    const { result } = renderHook(() => useAsyncOperation(op));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.data).toBeNull();
  });

  it('calls onSuccess callback on successful execution', async () => {
    const onSuccess = vi.fn();
    const op = vi.fn().mockResolvedValue('ok');
    const { result } = renderHook(() => useAsyncOperation(op, { onSuccess }));

    await act(async () => {
      await result.current.execute();
    });

    expect(onSuccess).toHaveBeenCalledWith('ok');
  });

  it('calls onError callback on failed execution', async () => {
    const onError = vi.fn();
    const op = vi.fn().mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useAsyncOperation(op, { onError }));

    await act(async () => {
      await result.current.execute();
    });

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'ERR_ASYNC' }));
  });

  it('retry re-executes the last operation with same args', async () => {
    const op = vi.fn()
      .mockRejectedValueOnce(new Error('first fail'))
      .mockResolvedValueOnce('retry-success');
    const { result } = renderHook(() => useAsyncOperation(op));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).not.toBeNull();

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.data).toBe('retry-success');
    expect(op).toHaveBeenCalledTimes(2);
  });

  it('retry returns null if no previous execution', async () => {
    const op = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsyncOperation(op));

    let retryResult: unknown;
    await act(async () => {
      retryResult = await result.current.retry();
    });

    expect(retryResult).toBeNull();
  });

  it('reset clears all state', async () => {
    const op = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsyncOperation(op));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('data');

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.retryCount).toBe(0);
  });

  it('isRetryable reflects error retryable state', async () => {
    const op = vi.fn().mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useAsyncOperation(op));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.isRetryable).toBe(true);
  });

  it('passes arguments to the operation', async () => {
    const op = vi.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useAsyncOperation(op));

    await act(async () => {
      await result.current.execute('arg1', 'arg2');
    });

    expect(op).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('uses withRetry when autoRetry is enabled', async () => {
    const { withRetry } = await import('@core/errors');
    const op = vi.fn().mockResolvedValue('retried-result');
    const { result } = renderHook(() =>
      useAsyncOperation(op, { autoRetry: true, retry: { maxRetries: 2, baseDelay: 10 } })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(withRetry).toHaveBeenCalled();
  });

  it('returns data from execute on success', async () => {
    const op = vi.fn().mockResolvedValue('my-data');
    const { result } = renderHook(() => useAsyncOperation(op));

    let executeResult: unknown;
    await act(async () => {
      executeResult = await result.current.execute();
    });

    expect(executeResult).toBe('my-data');
  });

  it('returns null from execute on failure', async () => {
    const op = vi.fn().mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useAsyncOperation(op));

    let executeResult: unknown;
    await act(async () => {
      executeResult = await result.current.execute();
    });

    expect(executeResult).toBeNull();
  });
});
