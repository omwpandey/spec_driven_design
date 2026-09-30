import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormErrorHandler } from '../useFormErrorHandler';
import type { UseFormSetError, FieldValues } from 'react-hook-form';

vi.mock('@core/errors', () => ({
  normalizeError: (err: unknown) => {
    if (err && typeof err === 'object' && 'metadata' in err) {
      return err;
    }
    return {
      id: 'err-form',
      code: 'ERR_VALIDATION',
      message: err instanceof Error ? err.message : 'Error',
      userMessage: 'Form submission failed',
      category: 'validation',
      severity: 'warning',
      retryable: false,
      timestamp: Date.now(),
      metadata: { validationErrors: [] },
    };
  },
  getValidationErrors: (err: { metadata?: { validationErrors?: unknown[] } }) =>
    err.metadata?.validationErrors || [],
}));

describe('useFormErrorHandler', () => {
  let mockSetError: UseFormSetError<FieldValues>;

  beforeEach(() => {
    mockSetError = vi.fn() as unknown as UseFormSetError<FieldValues>;
    vi.clearAllMocks();
  });

  it('returns initial state with no errors', () => {
    const { result } = renderHook(() => useFormErrorHandler(mockSetError));

    expect(result.current.serverErrors).toEqual([]);
    expect(result.current.generalError).toBeNull();
  });

  it('handleSubmitError normalizes the error and returns AppError', () => {
    const { result } = renderHook(() => useFormErrorHandler(mockSetError));

    let appError: unknown;
    act(() => {
      appError = result.current.handleSubmitError(new Error('submit failed'));
    });

    expect(appError).toHaveProperty('code', 'ERR_VALIDATION');
    expect(appError).toHaveProperty('userMessage', 'Form submission failed');
  });

  it('sets generalError when no field-level validation errors', () => {
    const { result } = renderHook(() => useFormErrorHandler(mockSetError));

    act(() => {
      result.current.handleSubmitError(new Error('generic error'));
    });

    expect(result.current.generalError).toBe('Form submission failed');
    expect(result.current.serverErrors).toEqual([]);
  });

  it('maps validation errors to form fields via setError', () => {
    const { result } = renderHook(() => useFormErrorHandler(mockSetError));

    const errorWithValidation = {
      id: 'err-422',
      code: 'ERR_422',
      message: 'Validation failed',
      userMessage: 'Please fix the errors',
      category: 'validation',
      severity: 'warning',
      retryable: false,
      timestamp: Date.now(),
      metadata: {
        validationErrors: [
          { field: 'email', message: 'Email is required' },
          { field: 'phone', message: 'Phone format is invalid' },
        ],
      },
    };

    act(() => {
      result.current.handleSubmitError(errorWithValidation);
    });

    expect(mockSetError).toHaveBeenCalledTimes(2);
    expect(mockSetError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'Email is required',
    });
    expect(mockSetError).toHaveBeenCalledWith('phone', {
      type: 'server',
      message: 'Phone format is invalid',
    });
  });

  it('sets serverErrors state with validation errors', () => {
    const { result } = renderHook(() => useFormErrorHandler(mockSetError));

    const errorWithValidation = {
      id: 'err-422',
      code: 'ERR_422',
      message: 'Validation failed',
      userMessage: 'Fix errors',
      category: 'validation',
      severity: 'warning',
      retryable: false,
      timestamp: Date.now(),
      metadata: {
        validationErrors: [
          { field: 'name', message: 'Name is required' },
        ],
      },
    };

    act(() => {
      result.current.handleSubmitError(errorWithValidation);
    });

    expect(result.current.serverErrors).toEqual([
      { field: 'name', message: 'Name is required' },
    ]);
    expect(result.current.generalError).toBeNull();
  });

  it('clearServerErrors resets serverErrors and generalError', () => {
    const { result } = renderHook(() => useFormErrorHandler(mockSetError));

    act(() => {
      result.current.handleSubmitError(new Error('fail'));
    });

    expect(result.current.generalError).not.toBeNull();

    act(() => {
      result.current.clearServerErrors();
    });

    expect(result.current.serverErrors).toEqual([]);
    expect(result.current.generalError).toBeNull();
  });

  it('does not call setError when no field validation errors exist', () => {
    const { result } = renderHook(() => useFormErrorHandler(mockSetError));

    act(() => {
      result.current.handleSubmitError(new Error('generic'));
    });

    expect(mockSetError).not.toHaveBeenCalled();
  });
});
