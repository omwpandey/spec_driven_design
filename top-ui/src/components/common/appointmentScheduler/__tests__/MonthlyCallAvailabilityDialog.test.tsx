import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@core/theme';
import MonthlyCallAvailabilityDialog from '../MonthlyCallAvailabilityDialog';
import type { Branch, CallCenterStaff } from '../../../../types/holiday.types';

const renderWithTheme = (ui: React.ReactElement) =>
  render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  });

const branches: Branch[] = [
  { code: 'CNX01', name: 'Chiang Mai' },
  { code: 'BKK01', name: 'Toyota Metropolitan Bangkok' },
];

const staff: CallCenterStaff[] = [
  { id: 1, code: 'CC001', name: 'Chalicia Kittikul', nickName: 'Fah', position: 'Senior Call Center Agent' },
  { id: 2, code: 'CC002', name: 'Ekkachai Prasert', nickName: 'Bank', position: 'Call Center Agent' },
];

describe('MonthlyCallAvailabilityDialog', () => {
  it('renders the selector form when open', () => {
    renderWithTheme(
      <MonthlyCallAvailabilityDialog
        open
        branches={branches}
        staff={staff}
        baseYear={2026}
        defaultBranchCode="CNX01"
        defaultMonth={9}
        defaultYear={2026}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByText('Monthly Call Center Availability')).toBeInTheDocument();
    expect(screen.getByText('Nick Name')).toBeInTheDocument();
  });

  it('allows typing a custom nick name', () => {
    renderWithTheme(
      <MonthlyCallAvailabilityDialog
        open
        branches={branches}
        staff={staff}
        baseYear={2026}
        defaultBranchCode="CNX01"
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    const nickInput = screen.getByPlaceholderText('Nick Name') as HTMLInputElement;
    expect(nickInput).not.toBeDisabled();
    fireEvent.change(nickInput, { target: { value: 'Bank' } });
    expect(nickInput.value).toBe('Bank');
  });

  it('does not render when closed', () => {
    renderWithTheme(
      <MonthlyCallAvailabilityDialog
        open={false}
        branches={branches}
        staff={staff}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.queryByText('Monthly Call Center Availability')).not.toBeInTheDocument();
  });
});
