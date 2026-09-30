import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@core/theme';
import DailyCallAvailabilityDialog from '../DailyCallAvailabilityDialog';
import type { CallCenterStaff } from '../../../../types/holiday.types';

const renderWithTheme = (ui: React.ReactElement) =>
  render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  });

const staff: CallCenterStaff[] = [
  {
    id: 1,
    code: 'CC001',
    name: 'Chalicia Kittikul',
    nickName: 'Fah',
    position: 'Senior Call Center Agent',
  },
  {
    id: 2,
    code: 'CC002',
    name: 'Ekkachai Prasert',
    nickName: 'New',
    position: 'Call Center Agent',
  },
];

describe('DailyCallAvailabilityDialog', () => {
  it('renders staff rows and saves availability for each', () => {
    const onSave = vi.fn();
    renderWithTheme(
      <DailyCallAvailabilityDialog
        open
        branchCode="PKT01"
        branchName="Phuket"
        date="2026-12-01"
        staff={staff}
        onClose={vi.fn()}
        onSave={onSave}
      />
    );
    expect(screen.getByText('Chalicia Kittikul')).toBeInTheDocument();
    expect(screen.getByText('Ekkachai Prasert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'SAVE AVAILABILITY' }));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ branchCode: 'PKT01', date: '2026-12-01' })
    );
    expect(onSave.mock.calls[0][0].entries).toHaveLength(2);
  });
});
