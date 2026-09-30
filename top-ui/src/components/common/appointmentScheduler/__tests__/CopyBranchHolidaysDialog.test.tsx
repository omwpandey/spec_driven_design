import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@core/theme';
import CopyBranchHolidaysDialog from '../CopyBranchHolidaysDialog';
import type { Branch } from '../../../../types/holiday.types';

const renderWithTheme = (ui: React.ReactElement) =>
  render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  });

const branches: Branch[] = [
  { code: 'BKK01', name: 'Toyota Metropolitan Bangkok' },
  { code: 'CNX01', name: 'Chiang Mai' },
];

describe('CopyBranchHolidaysDialog', () => {
  it('renders source/target sections and copies with payload', () => {
    const onCopy = vi.fn();
    renderWithTheme(
      <CopyBranchHolidaysDialog
        open
        branches={branches}
        baseYear={2026}
        defaultSourceMonth={11}
        defaultSourceYear={2026}
        onClose={vi.fn()}
        onCopy={onCopy}
      />
    );
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'COPY' }));
    expect(onCopy).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceMonth: 11,
        sourceYear: 2026,
        targetBranchCode: 'BKK01',
        targetMonth: 11,
        targetYear: 2026,
      })
    );
  });

  it('does not render when closed', () => {
    renderWithTheme(
      <CopyBranchHolidaysDialog
        open={false}
        branches={branches}
        onClose={vi.fn()}
        onCopy={vi.fn()}
      />
    );
    expect(screen.queryByText('Copy Branch Holidays')).not.toBeInTheDocument();
  });
});
