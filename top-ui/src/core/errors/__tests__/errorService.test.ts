// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  normalizeError,
  isAppError,
  isRetryableError,
  isAuthError,
  isNetworkError,
  getValidationErrors,
} from '../errorService';

describe('errorService', () => {
  describe('normalizeError', () => {
    it('normalizes a string error', () => {
      const err = normalizeError('Something failed');
      expect(err.id).toBeDefined();
      expect(err.code).toBe('ERR_UNKNOWN');
      expect(err.userMessage).toBeDefined();
      expect(err.category).toBe('unknown');
      expect(err.retryable).toBe(false);
    });

    it('normalizes a standard Error', () => {
      const err = normalizeError(new Error('Runtime crash'));
      expect(err.code).toBe('ERR_RUNTIME');
      expect(err.message).toBe('Runtime crash');
      expect(err.category).toBe('unknown');
    });

    it('normalizes a ChunkLoadError', () => {
      const error = new Error('Loading chunk 5 failed');
      error.name = 'ChunkLoadError';
      const err = normalizeError(error);
      expect(err.code).toBe('ERR_CHUNK_LOAD');
      expect(err.retryable).toBe(true);
      expect(err.category).toBe('network');
    });

    it('normalizes an unknown value', () => {
      const err = normalizeError(42);
      expect(err.code).toBe('ERR_UNKNOWN');
      expect(err.retryable).toBe(false);
    });

    it('returns an already-normalized AppError unchanged', () => {
      const appError = normalizeError('first');
      const result = normalizeError(appError);
      expect(result).toBe(appError);
    });

    it('normalizes an Axios timeout error', () => {
      const axiosError = {
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded',
        config: { url: '/api/test' },
        response: undefined,
      };
      const err = normalizeError(axiosError);
      expect(err.code).toContain('TIMEOUT');
      expect(err.retryable).toBe(true);
      expect(err.category).toBe('timeout');
    });

    it('normalizes an Axios network error (offline)', () => {
      const axiosError = {
        isAxiosError: true,
        code: 'ERR_NETWORK',
        message: 'Network Error',
        config: { url: '/api/test' },
        response: undefined,
      };
      // navigator.onLine might be true in test env, so it falls to general network error
      const err = normalizeError(axiosError);
      expect(err.category).toBe('network');
      expect(err.retryable).toBe(true);
    });

    it('normalizes an Axios 401 response', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Request failed with status code 401',
        config: { url: '/api/data' },
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
          headers: {},
        },
      };
      const err = normalizeError(axiosError);
      expect(err.category).toBe('authentication');
      expect(err.retryable).toBe(false);
    });

    it('normalizes an Axios 500 response', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Request failed with status code 500',
        config: { url: '/api/data' },
        response: {
          status: 500,
          data: { error: { message: 'Internal Server Error' } },
          headers: {},
        },
      };
      const err = normalizeError(axiosError);
      expect(err.category).toBe('server');
      expect(err.retryable).toBe(true);
    });

    it('normalizes an Axios 422 with validation errors', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Request failed with status code 422',
        config: { url: '/api/data' },
        response: {
          status: 422,
          data: {
            error: {
              message: 'Validation failed',
              details: [{ field: 'email', message: 'Invalid email' }],
            },
          },
          headers: {},
        },
      };
      const err = normalizeError(axiosError);
      expect(err.category).toBe('validation');
      expect(err.metadata?.validationErrors).toHaveLength(1);
    });

    it('normalizes a cancelled request', () => {
      const axiosError = {
        isAxiosError: true,
        code: 'ERR_CANCELED',
        message: 'canceled',
        config: { url: '/api/test' },
        response: { status: 0, data: null, headers: {} },
      };
      const err = normalizeError(axiosError);
      expect(err.code).toContain('CANCELLED');
      expect(err.retryable).toBe(false);
    });

    it('includes context metadata', () => {
      const err = normalizeError('fail', { screenName: 'DashboardPage' });
      expect(err.metadata?.screenName).toBe('DashboardPage');
    });
  });

  describe('isAppError', () => {
    it('returns true for AppError objects', () => {
      const err = normalizeError('test');
      expect(isAppError(err)).toBe(true);
    });

    it('returns false for plain objects', () => {
      expect(isAppError({ message: 'hi' })).toBe(false);
    });

    it('returns false for non-objects', () => {
      expect(isAppError('string')).toBe(false);
      expect(isAppError(null)).toBe(false);
    });
  });

  describe('isRetryableError', () => {
    it('returns true for retryable errors', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'timeout',
        config: { url: '/api' },
        response: { status: 503, data: {}, headers: {} },
      };
      const err = normalizeError(axiosError);
      expect(isRetryableError(err)).toBe(true);
    });

    it('returns false for non-retryable errors', () => {
      const err = normalizeError(new Error('crash'));
      expect(isRetryableError(err)).toBe(false);
    });
  });

  describe('isAuthError', () => {
    it('returns true for 401 errors', () => {
      const axiosError = {
        isAxiosError: true,
        message: '401',
        config: { url: '/api' },
        response: { status: 401, data: {}, headers: {} },
      };
      const err = normalizeError(axiosError);
      expect(isAuthError(err)).toBe(true);
    });

    it('returns false for non-auth errors', () => {
      const err = normalizeError(new Error('not auth'));
      expect(isAuthError(err)).toBe(false);
    });
  });

  describe('isNetworkError', () => {
    it('returns true for network errors', () => {
      const axiosError = {
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'timeout',
        config: { url: '/api' },
        response: undefined,
      };
      const err = normalizeError(axiosError);
      expect(isNetworkError(err)).toBe(true);
    });
  });

  describe('getValidationErrors', () => {
    it('extracts validation errors from metadata', () => {
      const axiosError = {
        isAxiosError: true,
        message: '422',
        config: { url: '/api' },
        response: {
          status: 422,
          data: { error: { details: [{ field: 'name', message: 'Required' }] } },
          headers: {},
        },
      };
      const err = normalizeError(axiosError);
      const valErrors = getValidationErrors(err);
      expect(valErrors).toHaveLength(1);
      expect(valErrors[0].field).toBe('name');
    });

    it('returns empty array when no validation errors', () => {
      const err = normalizeError(new Error('test'));
      expect(getValidationErrors(err)).toEqual([]);
    });
  });
});

describe('errorService - additional branch coverage', () => {
  it('normalizes Axios 403 forbidden', () => {
    const axiosError = {
      isAxiosError: true,
      message: '403',
      config: { url: '/api/admin' },
      response: { status: 403, data: { message: 'Forbidden' }, headers: {} },
    };
    const err = normalizeError(axiosError);
    expect(err.category).toBe('authorization');
    expect(err.retryable).toBe(false);
  });

  it('normalizes Axios 404 not found', () => {
    const axiosError = {
      isAxiosError: true,
      message: '404',
      config: { url: '/api/missing' },
      response: { status: 404, data: {}, headers: {} },
    };
    const err = normalizeError(axiosError);
    expect(err.category).toBe('client');
    expect(err.retryable).toBe(false);
  });

  it('normalizes Axios 429 rate limit', () => {
    const axiosError = {
      isAxiosError: true,
      message: '429',
      config: { url: '/api/data' },
      response: { status: 429, data: {}, headers: {} },
    };
    const err = normalizeError(axiosError);
    expect(err.category).toBe('rate_limit');
    expect(err.retryable).toBe(true);
  });

  it('normalizes Axios 408 timeout via HTTP status', () => {
    const axiosError = {
      isAxiosError: true,
      message: '408',
      config: { url: '/api/slow' },
      response: { status: 408, data: {}, headers: {} },
    };
    const err = normalizeError(axiosError);
    expect(err.category).toBe('timeout');
    expect(err.retryable).toBe(true);
  });

  it('normalizes Axios 502 bad gateway', () => {
    const axiosError = {
      isAxiosError: true,
      message: '502',
      config: { url: '/api' },
      response: { status: 502, data: {}, headers: {} },
    };
    const err = normalizeError(axiosError);
    expect(err.category).toBe('server');
    expect(err.retryable).toBe(true);
  });

  it('normalizes Axios 504 gateway timeout', () => {
    const axiosError = {
      isAxiosError: true,
      message: '504',
      config: { url: '/api' },
      response: { status: 504, data: {}, headers: {} },
    };
    const err = normalizeError(axiosError);
    expect(err.category).toBe('timeout');
    expect(err.retryable).toBe(true);
  });

  it('normalizes Axios 409 conflict', () => {
    const axiosError = {
      isAxiosError: true,
      message: '409',
      config: { url: '/api' },
      response: { status: 409, data: { error: { message: 'Conflict' } }, headers: {} },
    };
    const err = normalizeError(axiosError);
    expect(err.category).toBe('client');
    expect(err.userMessage).toBe('Conflict');
  });

  it('normalizes Axios error with request-id header', () => {
    const axiosError = {
      isAxiosError: true,
      message: '500',
      config: { url: '/api' },
      response: { status: 500, data: {}, headers: { 'x-request-id': 'req-123' } },
    };
    const err = normalizeError(axiosError);
    expect(err.metadata?.requestId).toBe('req-123');
  });

  it('normalizes Axios error with no config url', () => {
    const axiosError = {
      isAxiosError: true,
      message: '500',
      config: {},
      response: { status: 500, data: {}, headers: {} },
    };
    const err = normalizeError(axiosError);
    expect(err.metadata?.endpoint).toBe('');
  });

  it('normalizes Axios 422 without details array', () => {
    const axiosError = {
      isAxiosError: true,
      message: '422',
      config: { url: '/api' },
      response: { status: 422, data: { error: { message: 'Invalid data' } }, headers: {} },
    };
    const err = normalizeError(axiosError);
    expect(err.category).toBe('validation');
    expect(err.metadata?.validationErrors).toBeUndefined();
  });

  it('handles error with Loading chunk in message', () => {
    const error = new Error('Loading chunk abc123 failed');
    const err = normalizeError(error);
    expect(err.code).toBe('ERR_CHUNK_LOAD');
    expect(err.retryable).toBe(true);
  });

  it('normalizes null error', () => {
    const err = normalizeError(null);
    expect(err.code).toBe('ERR_UNKNOWN');
  });

  it('normalizes undefined error', () => {
    const err = normalizeError(undefined);
    expect(err.code).toBe('ERR_UNKNOWN');
  });
});
