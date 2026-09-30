/**
 * Branch Holiday Master / Working Day Calendar — shared types
 *
 * These types model the data exchanged with the backend for the
 * Branch Holiday Master screen (working-day calendar, holidays, and
 * call-center availability). Field names are camelCase; the API layer
 * (apiService) wraps responses in ApiResponse<T>.
 */

/** Kind of a calendar day, used for cell styling and the legend. */
export type DayType = 'working' | 'weekend' | 'holiday' | 'notEditable';

/** Remark categories available when marking a branch holiday. */
export type HolidayRemark =
  | 'PUBLIC_HOLIDAY'
  | 'SPECIAL_HOLIDAY'
  | 'SUBSTITUTE_HOLIDAY'
  | 'BRANCH_HOLIDAY'
  | 'COMPANY_HOLIDAY';

/** A selectable branch. */
export interface Branch {
  /** Branch code, e.g. "BKK01". */
  code: string;
  /** Display name, e.g. "Toyota Metropolitan Bangkok". */
  name: string;
}

/**
 * A single day within the working-day calendar for a given branch/month.
 * `date` is an ISO date string (YYYY-MM-DD).
 */
export interface WorkingDay {
  date: string;
  type: DayType;
  /** Whether this cell can be edited by the current user. */
  editable: boolean;
  /** Optional holiday attached to the day. */
  holiday?: BranchHoliday | null;
  /** Free-form tag shown on the cell (e.g. "Not Effect Call Plan"). */
  callPlanTag?: string | null;
}

/** A holiday assigned to a specific branch + date. */
export interface BranchHoliday {
  id?: string | number;
  branchCode: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  remark: HolidayRemark;
  additionalRemark?: string;
}

/** Payload for the "Set Branch Holiday" dialog. */
export interface SetBranchHolidayPayload {
  branchCode: string;
  date: string;
  remark: HolidayRemark;
  additionalRemark?: string;
}

/** Payload for the "Copy Branch Holidays" dialog. */
export interface CopyHolidaysPayload {
  sourceMonth: number; // 1-12
  sourceYear: number;
  targetBranchCode: string;
  targetMonth: number; // 1-12
  targetYear: number;
}

/** A call-center staff member. */
export interface CallCenterStaff {
  id: string | number;
  /** Staff code, e.g. "CC002". */
  code: string;
  name: string;
  nickName: string;
  position: string;
}

/** Per-staff call availability for a single day (Daily dialog). */
export interface DailyCallAvailability {
  staffId: string | number;
  callIn: boolean;
  callOut: boolean;
  status?: string;
}

/** Payload to save the Daily Call Center Availability. */
export interface SaveDailyAvailabilityPayload {
  branchCode: string;
  date: string;
  entries: DailyCallAvailability[];
}

/** One day's Call In / Call Out flags in the Monthly availability grid. */
export interface MonthlyAvailabilityDay {
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  callIn: boolean;
  callOut: boolean;
}

/** Payload to save the Monthly Call Center Availability for a staff member. */
export interface SaveMonthlyAvailabilityPayload {
  branchCode: string;
  staffCode: string;
  nickName?: string;
  month: number; // 1-12
  year: number;
  days: MonthlyAvailabilityDay[];
}

/** Query params to load a working-day calendar. */
export interface WorkingCalendarQuery {
  branchCode: string;
  month: number; // 1-12
  year: number;
}
