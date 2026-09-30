/**
 * Date / calendar utilities (native Date, no external deps)
 *
 * House display format is en-GB (dd/mm/yyyy). Month values in the public
 * API of these helpers are 1-based (1 = January) to match the backend and
 * the Month dropdowns; internally we convert to JS's 0-based months.
 */

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const WEEKDAY_NAMES = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] as const;

/** Zero-pad a number to 2 digits. */
const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Format a Date as an ISO date string (YYYY-MM-DD), local time. */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Parse an ISO date string (YYYY-MM-DD) into a local Date. */
export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Format an ISO date string as en-GB dd/mm/yyyy. */
export function formatDisplayDate(iso: string): string {
  const d = fromISODate(iso);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Format an ISO date string as e.g. "Tuesday, 01 December 2026". */
export function formatLongDate(iso: string): string {
  const d = fromISODate(iso);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/** Human month name from a 1-based month number. */
export function monthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? '';
}

/** True if the date (0-based month) falls on Sat/Sun. */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export interface CalendarCell {
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  /** Day-of-month number (1-31). */
  day: number;
  /** Whether the cell belongs to the month being displayed. */
  inCurrentMonth: boolean;
  /** Whether the date is Sat/Sun. */
  weekend: boolean;
}

/**
 * Build a 6-row x 7-col (42-cell) month grid starting on Sunday. Leading and
 * trailing cells from adjacent months are included with `inCurrentMonth: false`
 * so the grid always renders a full rectangle (matches the design).
 *
 * @param month 1-based month (1 = January)
 * @param year  full year, e.g. 2026
 */
export function buildMonthGrid(month: number, year: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month - 1, 1);
  const startOffset = firstOfMonth.getDay(); // 0 (Sun) .. 6 (Sat)
  const gridStart = new Date(year, month - 1, 1 - startOffset);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    cells.push({
      date: toISODate(d),
      day: d.getDate(),
      inCurrentMonth: d.getMonth() === month - 1,
      weekend: isWeekend(d),
    });
  }
  return cells;
}

/**
 * Return the number of days in a given 1-based month/year.
 */
export function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

/** Step a {month (1-based), year} pair by +/-1 month. */
export function stepMonth(
  month: number,
  year: number,
  delta: number
): { month: number; year: number } {
  const zero = month - 1 + delta;
  const newYear = year + Math.floor(zero / 12);
  const newMonth = ((zero % 12) + 12) % 12;
  return { month: newMonth + 1, year: newYear };
}

/** A short list of years centered on a base year (for Year dropdowns). */
export function yearOptions(base: number, span = 2): number[] {
  const years: number[] = [];
  for (let y = base - span; y <= base + span; y += 1) years.push(y);
  return years;
}
