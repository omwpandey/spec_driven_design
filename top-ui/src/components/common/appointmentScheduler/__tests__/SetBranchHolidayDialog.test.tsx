import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@core/theme';
import SetBranchHolidayDialog from '../SetBranchHolidayDialog';

const renderWithTheme = (ui: React.ReactElement) =>
  render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  });

describe('SetBranchHolidayDialog', () => {
  it('renders and keeps save disabled until a remark is chosen', () => {
    const onSave = vi.fn();
    renderWithTheme(
      <SetBranchHolidayDialog
        open
        branchCode="BKK01"
        date="2026-12-01"
        onClose={vi.fn()}
        onSave={onSave}
      />
    );
    expect(screen.getByText('Set Branch Holiday')).toBeInTheDocument();
    const saveBtn = screen.getByRole('button', { name: 'SAVE HOLIDAY' });
    expect(saveBtn).toBeDisabled();
  });

  it('does not render when closed', () => {
    renderWithTheme(
      <SetBranchHolidayDialog
        open={false}
        branchCode="BKK01"
        date="2026-12-01"
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.queryByText('Set Branch Holiday')).not.toBeInTheDocument();
  });

  it('saves with payload once a remark is selected', () => {
    const onSave = vi.fn();
    renderWithTheme(
      <SetBranchHolidayDialog
        open
        branchCode="BKK01"
        date="2026-12-01"
        initialRemark="PUBLIC_HOLIDAY"
        onClose={vi.fn()}
        onSave={onSave}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'SAVE HOLIDAY' }));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        branchCode: 'BKK01',
        date: '2026-12-01',
        remark: 'PUBLIC_HOLIDAY',
      })
    );
  });
});
