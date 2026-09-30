import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import DemoPage from '../DemoPage';

vi.mock('@store/index', () => ({
  useAppSelector: () => 'en',
  useAppDispatch: () => vi.fn(),
}));

vi.mock('@hooks', () => ({
  useTranslation: () => ({ t: (key: string) => key, language: 'en' }),
  useErrorHandler: () => ({ handleError: vi.fn(() => ({
    id: 'err-1',
    code: 'ERR_TEST',
    category: 'test',
    severity: 'error',
    userMessage: 'Test error',
    message: 'Technical message',
    retryable: false,
    timestamp: Date.now(),
    metadata: {},
  })) }),
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

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('DemoPage', { timeout: 60000 }, () => {
  it('renders the page header', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByRole('heading', { name: 'Component Showcase' })).toBeInTheDocument();
  });

  it('renders text input section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Text Input Components')).toBeInTheDocument();
  });

  it('renders number input section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Number Input Components')).toBeInTheDocument();
  });

  it('renders date & time section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Date & Time Components')).toBeInTheDocument();
  });

  it('renders selection components section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Selection Components')).toBeInTheDocument();
  });

  it('renders file upload section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('File Upload & Misc')).toBeInTheDocument();
  });

  it('renders action buttons section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Action Buttons')).toBeInTheDocument();
  });

  it('renders badges section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Badges, Status & Avatars')).toBeInTheDocument();
  });

  it('renders info cards section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Info Cards & Summary Cards')).toBeInTheDocument();
  });

  it('renders progress bars section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Progress Bars & Tooltips')).toBeInTheDocument();
  });

  it('renders tabs section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Tabs Component')).toBeInTheDocument();
  });

  it('renders stepper section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Stepper Component')).toBeInTheDocument();
  });

  it('renders breadcrumb section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Breadcrumb')).toBeInTheDocument();
  });

  it('renders skeleton loaders section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Skeleton Loaders')).toBeInTheDocument();
  });

  it('renders state displays section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('State Displays')).toBeInTheDocument();
  });

  it('renders datatable section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Data Table Component')).toBeInTheDocument();
  });

  it('renders dialogs section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Dialogs & Notifications')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('Submit All Form Data')).toBeInTheDocument();
  });

  it('opens confirm save dialog', () => {
    renderWithTheme(<DemoPage />);
    fireEvent.click(screen.getByText('Confirm Save'));
    expect(screen.getByText('CONFIRMATION')).toBeInTheDocument();
    expect(screen.getByText('Are you sure, you want to save the operation?')).toBeInTheDocument();
  });

  it('opens delete record dialog', () => {
    renderWithTheme(<DemoPage />);
    fireEvent.click(screen.getByText('Delete Record'));
    expect(screen.getByText('DELETE RECORD')).toBeInTheDocument();
  });

  it('renders validation form section', () => {
    renderWithTheme(<DemoPage />);
    const matches = screen.getAllByText(/Form Validation Test/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders error handling demo section', () => {
    renderWithTheme(<DemoPage />);
    expect(screen.getByText('1. API Error Handling (All HTTP Status Codes)')).toBeInTheDocument();
  });
});
