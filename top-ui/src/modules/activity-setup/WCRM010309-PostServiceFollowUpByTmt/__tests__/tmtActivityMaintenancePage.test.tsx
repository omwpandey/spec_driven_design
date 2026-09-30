import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import TmtActivityMaintenancePage from '../tmtActivityMaintenancePage';

vi.mock('@store/index', () => ({
  useAppSelector: () => 'en',
  useAppDispatch: () => vi.fn(),
}));

vi.mock('@hooks', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      if (params?.field) return `${params.field} is required.`;
      return key;
    },
    language: 'en',
  }),
  useApi: () => ({
    data: null,
    loading: false,
    error: null,
    success: false,
    validationErrors: [],
    isRetryable: false,
    execute: vi.fn().mockResolvedValue(null),
    retry: vi.fn().mockResolvedValue(null),
    reset: vi.fn(),
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/activity-setup/tmt-activity-maintenance' }),
}));

describe('TmtActivityMaintenancePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title', () => {
    renderWithTheme(<TmtActivityMaintenancePage />);
    expect(screen.getByText('psfu_page_title')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderWithTheme(<TmtActivityMaintenancePage />);
    expect(screen.getByText('psfu_breadcrumb_activity_setup')).toBeInTheDocument();
    expect(screen.getByText('psfu_breadcrumb_tmt_activity_maintenance')).toBeInTheDocument();
  });

  it('renders the Activity Type section', () => {
    renderWithTheme(<TmtActivityMaintenancePage />);
    expect(screen.getByText('psfu_activity_type_section')).toBeInTheDocument();
  });

  it('selects Post Service Follow Up (PSFU) by default and shows the PSFU section', () => {
    renderWithTheme(<TmtActivityMaintenancePage />);
    const psfu = screen.getByRole('radio', { name: 'psfu_activity_post_service' });
    expect(psfu).toBeChecked();
    expect(screen.getByText('psfu_item_section')).toBeInTheDocument();
  });

  it('shows the PSFU Item section when Post Service Follow Up is selected', async () => {
    renderWithTheme(<TmtActivityMaintenancePage />);
    fireEvent.click(screen.getByRole('radio', { name: 'psfu_activity_post_service' }));
    await waitFor(() => {
      expect(screen.getByText('psfu_item_section')).toBeInTheDocument();
    });
  });

  it('renders the Save button in the footer', () => {
    renderWithTheme(<TmtActivityMaintenancePage />);
    expect(screen.getByText('psfu_save_btn')).toBeInTheDocument();
  });

  it('shows the No Changes dialog when saving without edits', async () => {
    renderWithTheme(<TmtActivityMaintenancePage />);
    fireEvent.click(screen.getByRole('radio', { name: 'psfu_activity_post_service' }));
    await waitFor(() => expect(screen.getByText('psfu_item_section')).toBeInTheDocument());
    fireEvent.click(screen.getByText('psfu_save_btn'));
    await waitFor(() => {
      expect(screen.getByText('psfu_wrn0001_no_changes')).toBeInTheDocument();
    });
  });
});
