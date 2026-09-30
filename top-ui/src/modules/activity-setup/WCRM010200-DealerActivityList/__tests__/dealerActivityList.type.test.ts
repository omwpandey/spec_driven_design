import { describe, expect, it } from 'vitest';
import {
  ACTIVITY_TYPE_ALL,
  DEFAULT_SORT_FIELDS,
  MOCK_ACTIVITIES,
  buildMockActivityNameSuggestions,
  buildMockSearchData,
  buildMockSearchResponse,
  buildSearchFilter,
  filterActivities,
  getTotalRecords,
  resolveActivityTypeLabels,
  sortDefault,
} from '../dealerActivityList.type';

describe('dealerActivityList.type helpers', () => {
  it('resolves totals from pagination, grid fallback, and empty data', () => {
    expect(
      getTotalRecords({
        pagination: { totalRecords: 7, pageSize: 10, pageNo: 1, totalPages: 1 },
        activities: [],
      }),
    ).toBe(7);
    expect(getTotalRecords({ gridTotalRecords: 4, activities: [] })).toBe(4);
    expect(getTotalRecords(undefined)).toBe(0);
    expect(getTotalRecords(null)).toBe(0);
  });

  it('builds normalized search filters and defines the default sort fields', () => {
    expect(
      buildSearchFilter({
        dealerId: ' D001 ',
        branchId: 'HO',
        activityId: '  PM1 ',
        activityType: ACTIVITY_TYPE_ALL,
        activityName: ' *Periodic* ',
      }),
    ).toEqual({
      dealerId: ' D001 ',
      branchId: 'HO',
      activityId: 'PM1',
      activityType: '',
      activityName: 'Periodic',
    });
    expect(DEFAULT_SORT_FIELDS).toEqual([
      { field: 'activityName', direction: 'DESC' },
      { field: 'activityId', direction: 'ASC' },
    ]);
  });

  it('resolves activity types by code, label, all, empty, and unknown value', () => {
    expect(resolveActivityTypeLabels(' pm ')).toEqual(['periodic maintenance']);
    expect(resolveActivityTypeLabels('Periodic Maintenance')).toEqual(['periodic maintenance']);
    expect(resolveActivityTypeLabels(ACTIVITY_TYPE_ALL)).toBeNull();
    expect(resolveActivityTypeLabels('')).toBeNull();
    expect(resolveActivityTypeLabels('not-real')).toEqual(['not-real']);
  });

  it('filters by id, name, type, wildcard, and null activity type', () => {
    expect(filterActivities(MOCK_ACTIVITIES, { activityId: 'pm260001' })).toHaveLength(1);
    expect(filterActivities(MOCK_ACTIVITIES, { activityName: '*PM 1K*' })).toHaveLength(1);
    expect(filterActivities(MOCK_ACTIVITIES, { activityType: 'PM' })).toHaveLength(2);
    expect(filterActivities(MOCK_ACTIVITIES, { activityType: 'unknown' })).toHaveLength(0);
    expect(
      filterActivities(
        [{ ...MOCK_ACTIVITIES[0], activityType: null }],
        { activityType: ACTIVITY_TYPE_ALL },
      ),
    ).toHaveLength(1);
    expect(filterActivities(MOCK_ACTIVITIES, {})).toHaveLength(MOCK_ACTIVITIES.length);
  });

  it('sorts by master activity order, then activity name, and puts unknown types last', () => {
    const rows = [
      { ...MOCK_ACTIVITIES[1], activityName: 'Service PM 2' },
      { ...MOCK_ACTIVITIES[0], activityName: 'Service PM 1' },
      { ...MOCK_ACTIVITIES[0], activityId: 'UNKNOWN', activityType: 'Unconfigured', activityName: 'Unknown' },
      { ...MOCK_ACTIVITIES[2] },
    ];

    expect(sortDefault(rows).map((row) => row.activityName)).toEqual([
      'Service PM 1',
      'Service PM 2',
      'Additional Rejected Job - 01',
      'Unknown',
    ]);
    expect(rows[0].activityName).toBe('Service PM 2');
  });

  it('builds paged mock search data with totals and zero-size pagination', () => {
    const page = buildMockSearchData({}, 1, 2);
    expect(page.activities).toHaveLength(2);
    expect(page.pagination).toEqual({
      pageSize: 2,
      totalRecords: MOCK_ACTIVITIES.length,
      pageNo: 2,
      totalPages: Math.ceil(MOCK_ACTIVITIES.length / 2),
    });

    const emptyPage = buildMockSearchData({ activityId: 'missing' }, 0, 0);
    expect(emptyPage.activities).toEqual([]);
    expect(emptyPage.pagination?.totalPages).toBe(0);
  });

  it('builds search response with request values and defaults missing values', () => {
    const response = buildMockSearchResponse({
      filter: {
        dealerId: 'D001',
        branchId: 'HO',
        activityId: 'PM',
        activityType: 'PM',
        activityName: '',
      },
      sortFields: DEFAULT_SORT_FIELDS,
      page: 0,
      size: 5,
    });
    expect(response.success).toBe(true);
    expect(response.tableData).toBeNull();
    expect(response.data.pagination?.pageSize).toBe(5);

    const defaults = buildMockSearchResponse(null);
    expect(defaults.data.pagination?.pageSize).toBe(10);
    expect(defaults.data.pagination?.pageNo).toBe(1);
  });

  it('builds case-insensitive, deduplicated name suggestions', () => {
    expect(buildMockActivityNameSuggestions('')).toEqual([]);
    const suggestions = buildMockActivityNameSuggestions('periodic');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(new Set(suggestions.map((item) => item.activityId)).size).toBe(suggestions.length);
    expect(suggestions.every((item) => item.activityName.toLowerCase().includes('periodic'))).toBe(true);
  });
});
