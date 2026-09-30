/**
 * Utility Functions
 *
 * Place shared utility functions here.
 *
 * Example:
 *   export { formatDate, formatCurrency } from './formatters';
 *   export { validateEmail, validatePhone } from './validators';
 *   export { parseDate, addDays } from './dateUtils';
 */

export {
  MONTH_NAMES,
  WEEKDAY_NAMES,
  toISODate,
  fromISODate,
  formatDisplayDate,
  formatLongDate,
  monthName,
  isWeekend,
  buildMonthGrid,
  daysInMonth,
  stepMonth,
  yearOptions,
} from './dateUtils';
export type { CalendarCell } from './dateUtils';
