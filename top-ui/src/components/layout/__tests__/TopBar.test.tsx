import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import TopBar from '../TopBar';

vi.mock('@store/index', () => ({
  useAppSelector: (selector: (state: { config: { dealer: { name: string }; branch: { name: string; code: string } } }) => unknown) =>
    selector({
      config: {
        dealer: { name: 'T.BANGKOK CENTRAL' },
        branch: { name: 'Bangna', code: 'BKK-001' },
      },
    }),
}));

vi.mock('@hooks', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('TopBar', () => {
  it('renders dealer info', () => {
    renderWithTheme(<TopBar />);
    expect(screen.getByText(/T.BANGKOK CENTRAL/)).toBeInTheDocument();
  });

  it('renders the topbar container', () => {
    const { container } = renderWithTheme(<TopBar />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
