/**
 * Shared Type Definitions
 *
 * Place common types, interfaces, and enums here that are
 * shared across multiple modules/features.
 *
 * Example:
 *   export type { Customer } from './customer.types';
 *   export type { Dealer } from './dealer.types';
 *   export type { ApiResponse, PaginationParams } from './common.types';
 */

export type {
  DayType,
  HolidayRemark,
  Branch,
  WorkingDay,
  BranchHoliday,
  SetBranchHolidayPayload,
  CopyHolidaysPayload,
  CallCenterStaff,
  DailyCallAvailability,
  SaveDailyAvailabilityPayload,
  MonthlyAvailabilityDay,
  SaveMonthlyAvailabilityPayload,
  WorkingCalendarQuery,
} from './holiday.types';
