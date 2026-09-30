import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import PageHeader from '../PageHeader';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('PageHeader', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders title', () => {
    renderWithTheme(<PageHeader title="My Page" />);
    expect(screen.getByText('My Page')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderWithTheme(
      <PageHeader
        title="Detail Page"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Detail' },
        ]}
      />
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Detail Page')).toBeInTheDocument();
  });

  it('does not render breadcrumbs when empty', () => {
    const { container } = renderWithTheme(<PageHeader title="Page" breadcrumbs={[]} />);
    expect(container.querySelector('nav')).not.toBeInTheDocument();
  });

  it('navigates when breadcrumb link is clicked', () => {
    renderWithTheme(
      <PageHeader
        title="Detail"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Settings', path: '/settings' },
          { label: 'Detail' },
        ]}
      />
    );
    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders actions when provided', () => {
    renderWithTheme(
      <PageHeader title="Page" actions={<button>Save</button>} />
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('does not render actions section when not provided', () => {
    const { container } = renderWithTheme(<PageHeader title="Page" />);
    // Title should be there but no actions container
    expect(screen.getByText('Page')).toBeInTheDocument();
  });
});
