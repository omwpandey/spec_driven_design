/**
 * Axios Instance with Enterprise Error Handling
 *
 * Centralized HTTP client with:
 * - Automatic token injection
 * - Token refresh on 401
 * - Full error normalization for all HTTP status codes
 * - Request/response logging
 * - Request cancellation support
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { normalizeError, logError, logWarning } from '@core/errors';
import {
  acquireApiToken,
  isEntraAuthEnabled,
  isEntraConfigured,
  msalInstance,
} from '@core/auth/msalConfig';

const BASE_URL = import.meta.env.TOPS_API_BASE_URL || '/api';

/**
 * Resolve the bearer token for outgoing requests.
 *
 * Entra API tokens are acquired silently; other auth modes use the stored token.
 */
async function resolveAccessToken(): Promise<string | null> {
  if (isEntraAuthEnabled && isEntraConfigured) {
    return acquireApiToken(msalInstance);
  }
  return localStorage.getItem('accessToken');
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if a token refresh is already in progress
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
}

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token: string | null = null;
    try {
      token = await resolveAccessToken();
    } catch {
      config.authTokenUnavailable = true;
      logWarning('Microsoft access token unavailable; sending API request without Authorization.');
    }
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for performance monitoring
    config.metadata = { startTime: Date.now() };

    return config;
  },
  (error) => {
    const appError = normalizeError(error);
    logError(appError, { action: 'request-interceptor' });
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log slow requests (> 5 seconds)
    const startTime = (response.config as InternalAxiosRequestConfig & { metadata?: { startTime: number } }).metadata
      ?.startTime;
    if (startTime) {
      const duration = Date.now() - startTime;
      if (duration > 5000) {
        logWarning(`Slow API response: ${response.config.url} took ${duration}ms`);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - Token expired (with queue to prevent multiple refresh calls)
    if (
      isEntraAuthEnabled &&
      !isEntraConfigured &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.authTokenUnavailable
    ) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        processQueue(null, accessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear stale auth state; RouteGuard owns the interactive login redirect.
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, normalize and log, then reject
    const appError = normalizeError(error);
    logError(appError, {
      action: 'api-response',
      component: error.config?.url,
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;

// Augment AxiosRequestConfig for metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
    _retry?: boolean;
    authTokenUnavailable?: boolean;
  }
}
