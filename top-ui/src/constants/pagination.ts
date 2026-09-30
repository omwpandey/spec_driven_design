/**
 * Shared pagination constants & types.
 * ------------------------------------------------------------------
 * Central home for pagination defaults and the server-side pagination
 * response shape so individual list pages don't re-declare the same
 * `pageSize` default, rows-per-page options, or `Pagination` interface.
 */

/** Default number of rows shown per page across list screens. */
export const DEFAULT_ROWS_PER_PAGE = 10;

/** Selectable rows-per-page options for the pagination bar. */
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

/** Server-side pagination metadata nested inside a search `data` field. */
export interface Pagination {
  pageSize: number;
  totalRecords: number;
  pageNo: number;
  totalPages: number;
}
