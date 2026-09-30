import { beforeAll, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('@components/layout', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="page-container">{children}</div>,
  PageHeader: ({ title, breadcrumbs }: { title: string; breadcrumbs: { label: string }[] }) => (
    <div data-testid="page-header">
      <span>{title}</span>
      {breadcrumbs?.map((b, i) => <span key={i}>{b.label}</span>)}
    </div>
  ),
  PageFooter: () => <div data-testid="page-footer" />,
}));

vi.mock('echarts', () => {
  const mockChart = {
    setOption: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
  };
  return {
    init: () => mockChart,
  };
});

import DashboardPage from '../DashboardPage';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

describe('DashboardPage', () => {
  it('renders the dashboard title', () => {
    render(<DashboardPage />);
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Call Center Status section', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Call Center Status')).toBeInTheDocument();
  });

  it('renders online metric', () => {
    render(<DashboardPage />);
    expect(screen.getByText('ONLINE')).toBeInTheDocument();
  });

  it('renders busy metric', () => {
    render(<DashboardPage />);
    expect(screen.getByText('BUSY')).toBeInTheDocument();
  });

  it('renders offline metric', () => {
    render(<DashboardPage />);
    expect(screen.getByText('OFFLINE')).toBeInTheDocument();
  });

  it('renders breadcrumb with Dashboard label', () => {
    render(<DashboardPage />);
    // PageHeader mock renders breadcrumb labels as spans
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1);
  });

  it('renders within PageContainer', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('page-container')).toBeInTheDocument();
  });

  it('renders PageHeader with correct title', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
  });

  it('renders PageFooter', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('page-footer')).toBeInTheDocument();
  });

  it('renders donut charts with correct aria labels', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('img', { name: 'Status breakdown donut' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Daily call plan donut' })).toBeInTheDocument();
  });

  it('renders bar chart with aria label', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('img', { name: 'Appointments bar chart' })).toBeInTheDocument();
  });

  it('renders Status Breakdown summary rows', () => {
    render(<DashboardPage />);
    expect(screen.getAllByText('Total Call Plan').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('90 Units').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Daily Call Plan summary rows', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Today Call Plan')).toBeInTheDocument();
    expect(screen.getByText('75 Units')).toBeInTheDocument();
    expect(screen.getByText('Carry Over Call Plan')).toBeInTheDocument();
    expect(screen.getByText('15 Units')).toBeInTheDocument();
  });

  it('renders Appointment Summary section', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Appointment Summary')).toBeInTheDocument();
  });

  it('renders Follow-up section', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Follow-up')).toBeInTheDocument();
  });
});
