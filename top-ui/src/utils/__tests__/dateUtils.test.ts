import { describe, it, expect } from 'vitest';
import {
  toISODate,
  fromISODate,
  formatDisplayDate,
  monthName,
  buildMonthGrid,
  daysInMonth,
  stepMonth,
  yearOptions,
} from '../dateUtils';

describe('dateUtils', () => {
  it('round-trips ISO date strings', () => {
    const iso = '2026-09-15';
    expect(toISODate(fromISODate(iso))).toBe(iso);
  });

  it('formats display date as en-GB dd/mm/yyyy', () => {
    expect(formatDisplayDate('2026-12-01')).toBe('01/12/2026');
  });

  it('maps 1-based month numbers to names', () => {
    expect(monthName(1)).toBe('January');
    expect(monthName(12)).toBe('December');
  });

  it('builds a 42-cell grid starting on Sunday', () => {
    const grid = buildMonthGrid(9, 2026);
    expect(grid).toHaveLength(42);
    // Sept 1 2026 is a Tuesday -> first cell is the preceding Sunday (Aug 30).
    expect(grid[0].date).toBe('2026-08-30');
    expect(grid[0].inCurrentMonth).toBe(false);
    const first = grid.find((c) => c.day === 1 && c.inCurrentMonth);
    expect(first?.date).toBe('2026-09-01');
  });

  it('computes days in month', () => {
    expect(daysInMonth(2, 2024)).toBe(29); // leap year
    expect(daysInMonth(2, 2026)).toBe(28);
    expect(daysInMonth(9, 2026)).toBe(30);
  });

  it('steps months across year boundaries', () => {
    expect(stepMonth(12, 2026, 1)).toEqual({ month: 1, year: 2027 });
    expect(stepMonth(1, 2026, -1)).toEqual({ month: 12, year: 2025 });
  });

  it('builds a centered list of years', () => {
    expect(yearOptions(2026, 2)).toEqual([2024, 2025, 2026, 2027, 2028]);
  });
});
