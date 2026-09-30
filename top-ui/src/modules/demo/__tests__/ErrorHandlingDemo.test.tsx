import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import ErrorHandlingDemo from '../ErrorHandlingDemo';

const mockHandleError = vi.fn(() => ({
  id: 'err-123',
  code: 'ERR_400',
  category: 'client',
  severity: 'error' as const,
  userMessage: 'Bad Request',
  message: 'Invalid request body',
  retryable: false,
  timestamp: Date.now(),
  metadata: { endpoint: '/api/demo/endpoint', validationErrors: [] },
}));

vi.mock('@store/index', () => ({
  useAppSelector: () => 'en',
  useAppDispatch: () => vi.fn(),
}));

vi.mock('@hooks', () => ({
  useTranslation: () => ({ t: (key: string) => key, language: 'en' }),
  useErrorHandler: () => ({ handleError: mockHandleError }),
  useAsyncOperation: () => ({
    execute: vi.fn(),
    loading: false,
    error: null,
    data: null,
    retryCount: 0,
    isRetryable: false,
    retry: vi.fn(),
  }),
  useNetworkStatus: () => ({
    isOnline: true,
    isSlowConnection: false,
    connectionType: '4g',
  }),
}));

vi.mock('@core/errors', () => ({
  normalizeError: vi.fn(),
  withRetry: vi.fn().mockResolvedValue('success'),
  AppError: class AppError extends Error {},
}));

describe('ErrorHandlingDemo', () => {
  it('renders the network status alert (online)', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    expect(screen.getByText(/Network Status:/)).toBeInTheDocument();
    expect(screen.getByText(/Online/)).toBeInTheDocument();
  });

  it('renders API error handling section', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    expect(screen.getByText('1. API Error Handling (All HTTP Status Codes)')).toBeInTheDocument();
  });

  it('renders client error buttons', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    expect(screen.getAllByText('400 Bad Request').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('401 Unauthorized').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('403 Forbidden').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('404 Not Found').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('408 Timeout').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('409 Conflict').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('422 Validation').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('429 Rate Limit').length).toBeGreaterThanOrEqual(1);
  });

  it('renders server error buttons', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    expect(screen.getAllByText('500 Server Error').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('502 Bad Gateway').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('503 Unavailable').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('504 Gateway Timeout').length).toBeGreaterThanOrEqual(1);
  });

  it('renders network error section', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    expect(screen.getByText('2. Network Error Handling')).toBeInTheDocument();
    expect(screen.getByText('Internet Disconnected')).toBeInTheDocument();
    expect(screen.getAllByText('Request Timeout').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Network Failure')).toBeInTheDocument();
  });

  it('renders runtime error section', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    expect(screen.getByText('3. Runtime Errors & Error Boundary')).toBeInTheDocument();
    expect(screen.getByText('Runtime Error (try/catch)')).toBeInTheDocument();
    expect(screen.getByText('Unhandled Promise Rejection')).toBeInTheDocument();
    expect(screen.getByText('Trigger Render Crash (Error Boundary)')).toBeInTheDocument();
  });

  it('renders retry mechanism section', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    expect(screen.getByText('4. Retry Mechanism (Exponential Backoff)')).toBeInTheDocument();
    expect(screen.getByText('Manual Retry (withRetry)')).toBeInTheDocument();
    expect(screen.getByText('useAsyncOperation (Auto-Retry)')).toBeInTheDocument();
  });

  it('renders validation errors section', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    expect(screen.getByText('5. Server-Side Validation Errors (422)')).toBeInTheDocument();
    expect(screen.getByText('Simulate 422 with Field Errors')).toBeInTheDocument();
  });

  it('renders error handling coverage summary', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    expect(screen.getByText('Error Handling Coverage Summary')).toBeInTheDocument();
  });

  it('calls handleError when 400 button is clicked', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    const buttons = screen.getAllByText('400 Bad Request');
    fireEvent.click(buttons[0]);
    expect(mockHandleError).toHaveBeenCalled();
  });

  it('shows last error details after triggering an error', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    const buttons = screen.getAllByText('400 Bad Request');
    fireEvent.click(buttons[0]);
    expect(screen.getByText('Last Captured Error (Internal Debug View)')).toBeInTheDocument();
    expect(screen.getByText('err-123')).toBeInTheDocument();
    expect(screen.getByText('ERR_400')).toBeInTheDocument();
  });

  it('calls handleError when network error button is clicked', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    fireEvent.click(screen.getByText('Internet Disconnected'));
    expect(mockHandleError).toHaveBeenCalled();
  });

  it('calls handleError when runtime error button is clicked', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    fireEvent.click(screen.getByText('Runtime Error (try/catch)'));
    expect(mockHandleError).toHaveBeenCalled();
  });

  it('renders connection type in network status', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    expect(screen.getByText(/Type: 4g/)).toBeInTheDocument();
  });

  it('renders all summary items', () => {
    renderWithTheme(<ErrorHandlingDemo />);
    // These appear in summary section (some also appear as buttons)
    expect(screen.getAllByText('400 Bad Request').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Network Offline')).toBeInTheDocument();
    expect(screen.getByText('Auto-Retry')).toBeInTheDocument();
    expect(screen.getByText('Token Refresh')).toBeInTheDocument();
    expect(screen.getByText('Form Validation')).toBeInTheDocument();
  });
});
