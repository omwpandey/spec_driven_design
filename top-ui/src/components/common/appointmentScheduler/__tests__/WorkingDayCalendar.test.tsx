import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@core/theme';
import WorkingDayCalendar from '../WorkingDayCalendar';
import type { WorkingDay } from '../../../../types/holiday.types';

const renderCal = (ui: React.ReactElement) =>
  render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  });

describe('WorkingDayCalendar', () => {
  it('renders the weekday headers and month/year label', () => {
    renderCal(<WorkingDayCalendar month={9} year={2026} />);
    expect(screen.getByText('SUNDAY')).toBeInTheDocument();
    expect(screen.getByText('SATURDAY')).toBeInTheDocument();
    expect(screen.getByText('September 2026')).toBeInTheDocument();
  });

  it('renders the legend by default', () => {
    renderCal(<WorkingDayCalendar month={9} year={2026} />);
    expect(screen.getByText('Working day')).toBeInTheDocument();
    expect(screen.getByText('Holiday')).toBeInTheDocument();
    expect(screen.getByText('Not editable')).toBeInTheDocument();
  });

  it('shows a call plan tag from day metadata', () => {
    const days: Record<string, WorkingDay> = {
      '2026-09-07': {
        date: '2026-09-07',
        type: 'working',
        editable: true,
        callPlanTag: 'Not Effect Call Plan',
      },
    };
    renderCal(<WorkingDayCalendar month={9} year={2026} days={days} />);
    expect(screen.getByText('Not Effect Call Plan')).toBeInTheDocument();
  });

  it('fires onDayClick for an editable in-month day', () => {
    const onDayClick = vi.fn();
    const days: Record<string, WorkingDay> = {
      '2026-09-15': { date: '2026-09-15', type: 'working', editable: true },
    };
    renderCal(<WorkingDayCalendar month={9} year={2026} days={days} onDayClick={onDayClick} />);
    fireEvent.click(screen.getByText('15'));
    expect(onDayClick).toHaveBeenCalledWith('2026-09-15', days['2026-09-15']);
  });

  it('calls month navigation handlers', () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    renderCal(
      <WorkingDayCalendar month={9} year={2026} onPrevMonth={onPrev} onNextMonth={onNext} />
    );
    fireEvent.click(screen.getByLabelText('Previous month'));
    fireEvent.click(screen.getByLabelText('Next month'));
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
