import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import ActivitySetupPage from '../activitySetupPage';

const mockExecute = vi.fn();
const mockApiData = {
  summary: {
    totalVehicles: 5000,
    totalIndividualCustomers: 3000,
    individualPercentage: '60%',
    totalCorporateCustomers: 2000,
    corporatePercentage: '40%',
  },
  activityTypes: [
    { value: 'periodic_maintenance', label: 'Periodic Maintenance' },
    { value: 'additional_rejected', label: 'Additional Rejected' },
  ],
  customerTypes: [
    { value: 'individual', label: 'Individual' },
    { value: 'corporate', label: 'Corporate' },
  ],
  formData: {
    activityType: 'periodic_maintenance',
    activityId: 'PM001',
    activityName: 'Test Activity',
    activityDescription: 'Test Description',
    customerType: 'individual',
    suppressDays: 30,
  },
  repairItems: [],
  contactChannels: [],
  mileageRanges: [],
  contactProcessOptions: [],
  channelOptions: [],
};

let mockLoadingState = false;
let mockErrorState: null | { userMessage: string } = null;
let mockDataState: typeof mockApiData | null = mockApiData;

vi.mock('@store/index', () => ({
  useAppSelector: () => 'en',
  useAppDispatch: () => vi.fn(),
}));

vi.mock('@hooks', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      if (params) return `${key}`;
      return key;
    },
    language: 'en',
  }),
  useApi: () => ({
    execute: mockExecute,
    data: mockDataState,
    loading: mockLoadingState,
    error: mockErrorState,
  }),
  useFormErrorHandler: () => ({ handleSubmitError: vi.fn() }),
}));

vi.mock('@services/apiService', () => ({
  default: {
    get: vi.fn().mockResolvedValue({}),
    post: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
}));

describe('ActivitySetupPage', () => {
  beforeEach(() => {
    mockLoadingState = false;
    mockErrorState = null;
    mockDataState = mockApiData;
    mockExecute.mockClear();
  });

  it('renders the page header with title', () => {
    renderWithTheme(<ActivitySetupPage />);
    expect(screen.getByText('activity_setup_title')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderWithTheme(<ActivitySetupPage />);
    expect(screen.getByText('breadcrumb_activity_setup')).toBeInTheDocument();
    expect(screen.getByText('breadcrumb_activity_list')).toBeInTheDocument();
    expect(screen.getByText('breadcrumb_setup_by_dealer')).toBeInTheDocument();
  });

  it('renders the activity type section', () => {
    renderWithTheme(<ActivitySetupPage />);
    expect(screen.getByText('activity_type_section')).toBeInTheDocument();
  });

  it('renders the activity setup section', () => {
    renderWithTheme(<ActivitySetupPage />);
    expect(screen.getByText('activity_setup_section')).toBeInTheDocument();
  });

  it('renders summary cards with API data', () => {
    renderWithTheme(<ActivitySetupPage />);
    expect(screen.getByText('total_vehicles_db')).toBeInTheDocument();
    expect(screen.getByText('total_individual_customers')).toBeInTheDocument();
    expect(screen.getByText('total_corporate_customers')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    renderWithTheme(<ActivitySetupPage />);
    expect(screen.getByText('activity_id')).toBeInTheDocument();
    expect(screen.getByText('activity_name')).toBeInTheDocument();
    expect(screen.getByText('activity_description')).toBeInTheDocument();
    expect(screen.getByText('customer_type')).toBeInTheDocument();
    expect(screen.getByText('suppress_days')).toBeInTheDocument();
  });

  it('renders footer action buttons', () => {
    renderWithTheme(<ActivitySetupPage />);
    expect(screen.getByText('delete_activity')).toBeInTheDocument();
    expect(screen.getByText('set_Template')).toBeInTheDocument();
    expect(screen.getByText('save_btn')).toBeInTheDocument();
  });

  it('shows loading spinner when data is loading', () => {
    mockLoadingState = true;
    mockDataState = null;
    renderWithTheme(<ActivitySetupPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state when API fails', () => {
    mockLoadingState = false;
    mockErrorState = { userMessage: 'Something went wrong' };
    mockDataState = null;
    renderWithTheme(<ActivitySetupPage />);
    expect(screen.getByText('error_load_activity_setup')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows delete confirmation dialog when delete is clicked', () => {
    renderWithTheme(<ActivitySetupPage />);
    fireEvent.click(screen.getByText('delete_activity'));
    expect(screen.getByText('delete_dialog_title')).toBeInTheDocument();
    expect(screen.getByText('delete_dialog_message')).toBeInTheDocument();
  });

  it('closes delete dialog on cancel', async () => {
    renderWithTheme(<ActivitySetupPage />);
    fireEvent.click(screen.getByText('delete_activity'));
    fireEvent.click(
      await screen.findByRole('button', { name: /no/i })
    );
    await waitFor(() => {
      expect(screen.queryByText('delete_dialog_title')).not.toBeInTheDocument();
    });
  });

  it('renders ServiceRepairSection within error boundary', () => {
    renderWithTheme(<ActivitySetupPage />);
    expect(screen.getByText('service_repair_section')).toBeInTheDocument();
  });

  it('renders ContactChannelSection within error boundary', () => {
    renderWithTheme(<ActivitySetupPage />);
    expect(screen.getByText('contact_channel_section')).toBeInTheDocument();
  });
});
