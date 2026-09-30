/**
 * Dealer Activity List — domain data & default ordering
 * ------------------------------------------------------------------
 * Holds the Activity Type master and offline mock ordering so the page
 * component stays lean. The API request's default sort fields are defined
 * separately below; mock Activity Type order follows the configured master
 * sequence rather than alphabetical order.
 */
import { DEFAULT_ROWS_PER_PAGE, type Pagination } from '@constants';

// ===== Types =====
export interface ActivityRecord {
  activityId: string;
  activityType: string | null;
  activityName: string;
  createdBy: string;
  createdDate: string | null;
  modifiedBy: string;
  modifiedDate: string | null;
  [key: string]: unknown;
}

/**
 * Query filter for GET /wcrm010200/search.
 * Mirrors the backend contract exactly; empty strings mean "no filter".
 */
export interface ActivitySearchFilter {
  dealerId: string;
  branchId: string;
  activityId: string;
  activityType: string;
  activityName: string;
}

export interface ActivitySortField {
  field: string;
  direction: 'ASC' | 'DESC';
}

/** Full request envelope used to build GET /wcrm010200/search query params. */
export interface ActivitySearchRequest {
  filter: ActivitySearchFilter;
  sortFields: ActivitySortField[];
  page: number;
  size: number;
}

/**
 * Payload carried inside the standard ApiResponse `data` field for the
 * search endpoint:
 * `{ data: { activities: [...], gridTotalRecords, pagination: {...} } }`.
 * The total row count lives in `pagination.totalRecords` (with
 * `gridTotalRecords` as a fallback), not on the outer envelope.
 */
export interface ActivitySearchData {
  activities: ActivityRecord[];
  gridTotalRecords?: number;
  pagination?: Pagination;
}

/**
 * Resolve the server-side total row count from a search `data` payload,
 * preferring `pagination.totalRecords` and falling back to
 * `gridTotalRecords`, then 0.
 */
export const getTotalRecords = (data?: ActivitySearchData | null): number =>
  data?.pagination?.totalRecords ?? data?.gridTotalRecords ?? 0;

// ===== Activity Name auto-suggestion =====

/** A single suggestion returned by the activity-name-suggestions endpoint. */
export interface ActivityNameSuggestion {
  activityId: string;
  activityName: string;
}

/** Request filter for GET activity-name suggestions. */
export interface ActivityNameSuggestionRequest {
  filter: { activityName: string };
}

/** Payload carried inside the ApiResponse `data` field for the suggestions endpoint. */
export interface ActivityNameSuggestionData {
  suggestions: ActivityNameSuggestion[];
}

/**
 * Mock Activity Name suggestions used as the offline/API-unavailable fallback
 * for the auto-suggest box. Mirrors the sample API contract
 * (`{ activityId, activityName }`) and includes the "Periodic Maintenance"
 * family so a query like "Per" returns realistic matches.
 */
export const MOCK_ACTIVITY_NAME_SUGGESTIONS: ActivityNameSuggestion[] = [
  { activityId: 'ACT000001', activityName: 'Periodic Maintenance' },
  { activityId: 'ACT000002', activityName: 'Periodic Maintenance 10K' },
  { activityId: 'ACT000003', activityName: 'Periodic Maintenance 40K' },
  { activityId: 'ACT000004', activityName: 'Periodic Maintenance 100K' },
  { activityId: 'ACT000005', activityName: 'Additional Rejected Job' },
  { activityId: 'ACT000006', activityName: 'DCM Vehicle Service' },
  { activityId: 'ACT000007', activityName: 'Body & Paint' },
  { activityId: 'ACT000008', activityName: 'Post Service Follow Up' },
];

/**
 * Build the suggestion list for a given query from mock data. Searches the
 * dedicated suggestion set first (which mirrors the API sample), then the
 * activity records, de-duplicating by activityId. Matches Activity Names
 * case-insensitively by substring and maps onto the { activityId,
 * activityName } contract. Shared by the MSW handler and the module
 * service's mock-data path.
 */
export const buildMockActivityNameSuggestions = (query: string): ActivityNameSuggestion[] => {
  const term = (query ?? '').trim().toLowerCase();
  if (term === '') return [];

  const fromRecords: ActivityNameSuggestion[] = MOCK_ACTIVITIES.map((row) => ({
    activityId: row.activityId,
    activityName: row.activityName,
  }));

  const seen = new Set<string>();
  return [...MOCK_ACTIVITY_NAME_SUGGESTIONS, ...fromRecords].filter((item) => {
    if (!item.activityName.toLowerCase().includes(term)) return false;
    if (seen.has(item.activityId)) return false;
    seen.add(item.activityId);
    return true;
  });
};

/** Default sort fields sent to the backend on load. */
export const DEFAULT_SORT_FIELDS: ActivitySortField[] = [
  { field: 'activityName', direction: 'DESC' },
  { field: 'activityId', direction: 'ASC' },
];

/** Sentinel value used by the Activity Type dropdown for "All". */
export const ACTIVITY_TYPE_ALL = 'all';

/**
 * Build the request filter for the search endpoint from the current UI state.
 * Trims free-text inputs and maps the "All" dropdown sentinel to an empty
 * string, matching the contract where empty means "do not filter".
 */
export const buildSearchFilter = (params: {
  dealerId: string;
  branchId: string;
  activityId: string;
  activityType: string;
  activityName: string;
}): ActivitySearchFilter => ({
  dealerId: params.dealerId,
  branchId: "HO" === params.branchId ? "HO" : params.branchId,
  activityId: params.activityId.trim(),
  activityType: params.activityType === ACTIVITY_TYPE_ALL ? '' : params.activityType,
  activityName: params.activityName.trim().replaceAll('*', ''),
});

// ===== Activity Type master (active types, in configured master sequence) =====
// Mirrors the COMBO_1_ACTIVITY_TYPE (ACTIVITY_TYPE_MASTER) response, ordered by
export const ACTIVITY_TYPES = [
  { value: 'PM', label: 'Periodic Maintenance', code: 'PM', id: 1 },
  { value: 'ARJ', label: 'Additional Rejected Job', code: 'ARJ', id: 2 },
  { value: 'DCM', label: 'DCM Vehicle', code: 'DCM', id: 3 },
  { value: 'TCFR', label: 'TCFR+', code: 'TCFR', id: 4 },
  { value: 'SSC', label: 'SSC/CSC', code: 'SSC', id: 5 },
  { value: 'BP', label: 'Body & Paint', code: 'BP', id: 6 },
  { value: 'BPIR', label: 'BP Insurance Renewal', code: 'BPIR', id: 7 },
  { value: 'PSFU', label: 'Post Service Follow Up', code: 'PSFU', id: 8 },
  { value: 'TMTU', label: 'TMT Upload', code: 'TMTU', id: 9 },
  { value: 'DU', label: 'Dealer Upload', code: 'DU', id: 10 },
];

/**
 * Master-sequence lookup used by the default sort. Keyed by both code and name
 * so it resolves whether a record stores the type as a code (e.g. 'PM') or the
 * full name (e.g. 'Periodic Maintenance').
 */
export const ACTIVITY_TYPE_ORDER = new Map<string, number>(
  ACTIVITY_TYPES.flatMap((type, i) => [
    [type.code, i],
    [type.label, i],
  ])
);

/**
 * Resolve an Activity Type selection (which may be a code like 'PM', a label
 * like 'Periodic Maintenance', or the 'all' sentinel) to the set of labels it
 * matches in the master. Returns null for "no type filter" (All / empty /
 * unknown), so callers can skip filtering by type.
 */
export const resolveActivityTypeLabels = (selected: string): string[] | null => {
  const value = (selected ?? '').trim();
  if (value === '' || value === ACTIVITY_TYPE_ALL) return null;
  const lower = value.toLowerCase();
  const matches = ACTIVITY_TYPES.filter(
    (t) => t.value.toLowerCase() === lower || t.code.toLowerCase() === lower || t.label.toLowerCase() === lower
  ).map((t) => t.label.toLowerCase());
  return matches.length > 0 ? matches : [lower];
};

/**
 * Filter the mock activity dataset by the same criteria the backend applies.
 * Empty / "all" fields mean "no filter". Activity Type accepts a code, a label,
 * or the 'all' sentinel. Used by the MSW handler and by the module service's
 * mock-data path.
 */
export const filterActivities = (
  data: ActivityRecord[],
  criteria: { activityId?: string; activityType?: string; activityName?: string }
): ActivityRecord[] => {
  const idTerm = (criteria.activityId ?? '').trim().toLowerCase();
  const nameTerm = (criteria.activityName ?? '').trim().replaceAll('*', '').toLowerCase();
  const typeLabels = resolveActivityTypeLabels(criteria.activityType ?? '');

  return data.filter((row) => {
    const matchesId = idTerm === '' || row.activityId.toLowerCase().includes(idTerm);
    const matchesName = nameTerm === '' || row.activityName.toLowerCase().includes(nameTerm);
    const rowType = (row.activityType ?? '').toLowerCase();
    const matchesType = typeLabels === null || typeLabels.some((label) => rowType.includes(label));
    return matchesId && matchesName && matchesType;
  });
};

/**
 * Build a search `data` payload (activities + pagination) from the mock
 * dataset for a given criteria/page/size. Shared by the MSW handler and the
 * module service's mock-data path so both produce an identical response.
 */
export const buildMockSearchData = (
  criteria: { activityId?: string; activityType?: string; activityName?: string },
  page: number,
  size: number
): ActivitySearchData => {
  const ordered = sortDefault(filterActivities(MOCK_ACTIVITIES, criteria));
  const start = page * size;
  const activities = ordered.slice(start, start + size);
  return {
    activities,
    gridTotalRecords: ordered.length,
    pagination: {
      pageSize: size,
      totalRecords: ordered.length,
      pageNo: page + 1,
      totalPages: size > 0 ? Math.ceil(ordered.length / size) : 0,
    },
  };
};

/** Full ApiResponse-shaped body for the search endpoint (used by mocks). */
export interface ActivitySearchResponseBody {
  success: boolean;
  data: ActivitySearchData;
  tableData: null;
}

/**
 * Build the complete search response body from a raw request envelope.
 * Encapsulates request parsing (filter/page/size defaults) and response
 * shaping so the MSW handler is a thin pass-through and all mock logic lives
 * in this module.
 */
export const buildMockSearchResponse = (
  body: ActivitySearchRequest | null | undefined
): ActivitySearchResponseBody => {
  const filter = body?.filter;
  const page = body?.page ?? 0;
  const size = body?.size ?? DEFAULT_ROWS_PER_PAGE;

  const data = buildMockSearchData(
    {
      activityId: filter?.activityId,
      activityType: filter?.activityType,
      activityName: filter?.activityName,
    },
    page,
    size
  );

  return { success: true, data, tableData: null };
};

/** Default sort: Activity Type (ASC, master sequence) then Activity Name (ASC). */
export const sortDefault = (data: ActivityRecord[]): ActivityRecord[] =>
  [...data].sort((a, b) => {
    const ta = ACTIVITY_TYPE_ORDER.get(a.activityType ?? '') ?? Number.MAX_SAFE_INTEGER;
    const tb = ACTIVITY_TYPE_ORDER.get(b.activityType ?? '') ?? Number.MAX_SAFE_INTEGER;
    if (ta !== tb) return ta - tb;
    return a.activityName.localeCompare(b.activityName, undefined, { numeric: true });
  });

// ===== Mock data (Screen With Data) =====
export const MOCK_ACTIVITIES: ActivityRecord[] = [
  { activityId: 'PM260001', activityType: 'Periodic Maintenance', activityName: 'Service PM 1K-200K', createdBy: 'Somchai Michai', createdDate: '19/06/2026', modifiedBy: 'Somchai Michai', modifiedDate: '19/06/2026' },
  { activityId: 'PM260002', activityType: 'Periodic Maintenance', activityName: 'Service PM N 400K', createdBy: 'Somchai Michai', createdDate: '19/06/2026', modifiedBy: 'Somchai Michai', modifiedDate: '19/06/2026' },
  { activityId: 'AA260001', activityType: 'Additional Rejected Job', activityName: 'Additional Rejected Job - 01', createdBy: 'Somchai Michai', createdDate: '19/06/2026', modifiedBy: 'Somchai Michai', modifiedDate: '19/06/2026' },
  { activityId: 'AV260001', activityType: 'DCM Vehicle', activityName: 'Service DCM Vehicle', createdBy: 'Somchai Michai', createdDate: '19/06/2026', modifiedBy: 'Somchai Michai', modifiedDate: '19/06/2026' },
  { activityId: 'AF260001', activityType: 'TCFR+', activityName: 'Service TCFR+', createdBy: 'Somchai Michai', createdDate: '19/06/2026', modifiedBy: 'Somchai Michai', modifiedDate: '19/06/2026' },
  { activityId: 'AC260001', activityType: 'SSC/CSC', activityName: 'Service SSC/CSC', createdBy: 'Somchai Michai', createdDate: '19/06/2026', modifiedBy: 'Somchai Michai', modifiedDate: '19/06/2026' },
  { activityId: 'AB260001', activityType: 'Body & Paint', activityName: 'Service Body & Paint', createdBy: 'Somchai Michai', createdDate: '19/06/2026', modifiedBy: 'Somchai Michai', modifiedDate: '19/06/2026' },
  { activityId: 'AI260001', activityType: 'BP Insurance Renewal', activityName: 'Service BP Insurance Renewal', createdBy: 'Somchai Michai', createdDate: '19/06/2026', modifiedBy: 'Somchai Michai', modifiedDate: '19/06/2026' },
  { activityId: 'AS260001', activityType: 'Post Service Follow Up (PSFU)', activityName: 'Post Service Follow Up (PSFU) 1', createdBy: 'Somchai Michai', createdDate: '19/06/2026', modifiedBy: 'Somchai Michai', modifiedDate: '19/06/2026' },
  { activityId: 'AS260002', activityType: 'Post Service Follow Up (PSFU)', activityName: 'Post Service Follow Up (PSFU) 2', createdBy: 'Somchai Michai', createdDate: '19/06/2026', modifiedBy: 'Somchai Michai', modifiedDate: '19/06/2026' },
];
