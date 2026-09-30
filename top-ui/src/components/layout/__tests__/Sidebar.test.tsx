import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithTheme } from '@/tests/test-utils';
import Sidebar from '../Sidebar';

const mockUseAppSelector = vi.fn();

vi.mock('@store', () => ({
  useAppSelector: (selector: (state: { app: { sidebarCollapsed: boolean } }) => unknown) =>
    mockUseAppSelector(selector),
}));

vi.mock('@hooks', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    mockUseAppSelector.mockImplementation((selector) =>
      selector({
        app: {
          sidebarCollapsed: true,
        },
      })
    );
  });

  it('renders the sidebar in collapsed mode without showing text labels', () => {
    const { container } = renderWithTheme(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    // MUI's ListItemButton renders as <div role="button">, not a native <button>,
    // so query by the accessible role rather than the element tag.
    expect(container.querySelectorAll('[role="button"]').length).toBeGreaterThan(0);
    expect(screen.queryByText('nav_dashboard')).not.toBeInTheDocument();
  });

  it('renders the sidebar labels when expanded', () => {
    mockUseAppSelector.mockImplementation((selector) =>
      selector({
        app: {
          sidebarCollapsed: false,
        },
      })
    );

    renderWithTheme(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('nav_dashboard')).toBeInTheDocument();
  });
});
