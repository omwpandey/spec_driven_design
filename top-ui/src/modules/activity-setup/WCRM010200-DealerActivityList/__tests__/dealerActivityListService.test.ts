import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import apiService from '@services/apiService';
import axiosInstance from '@services/axios';
import { ENDPOINTS } from '@services/endpoints';

vi.mock('@services/axios', () => ({
  default: { get: vi.fn() },
}));

let dealerActivityListService: typeof import('../services/dealerActivityListService').dealerActivityListService;

beforeAll(async () => {
  vi.stubEnv('VITE_USE_MOCK_DATA', 'false');
  ({ dealerActivityListService } = await import('../services/dealerActivityListService'));
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe('dealerActivityListService', () => {
  beforeEach(() => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: { tableData: [] },
    } as never);
  });

  it('loads active activity types from the WCRM010200 combo endpoint', async () => {
    await dealerActivityListService.getActivityTypeOptions();

    expect(axiosInstance.get).toHaveBeenCalledWith(
      ENDPOINTS.WCRM010200.COMBO_1_ACTIVITY_TYPE.SEARCH,
      {
        params: {
          filter: JSON.stringify({
            filter: { comboType: 'ACTIVITY_TYPE_MASTER', activeOnly: true },
          }),
        },
      },
    );
  });

  it('maps active combo table data to dropdown options in display order', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        tableData: [
          {
            code: 'TYPE_B',
            name: 'API Type B',
            active: true,
            displayOrder: 2,
          },
          {
            code: 'INACTIVE',
            name: 'Inactive API Type',
            active: false,
            displayOrder: 3,
          },
          {
            code: 'TYPE_A',
            name: 'API Type A',
            active: true,
            displayOrder: 1,
          },
        ],
      },
    } as never);


    const response = await dealerActivityListService.getActivityTypeOptions();

    expect(response.data).toEqual([
      {
        value: 'TYPE_A',
        label: 'API Type A',
      },
      {
        value: 'TYPE_B',
        label: 'API Type B',
      },
      {
        value: 'INACTIVE',
        label: 'Inactive API Type',
      },
    ]);
  });

  it('searches activities with the expected GET query parameters', async () => {
    expect(ENDPOINTS.WCRM010200.SEARCH).toBe('crm/v1/wcrm010200/search');

    const getSpy = vi.spyOn(apiService, 'get').mockResolvedValue({
      success: true,
      data: { activities: [] },
    } as never);
    const request = {
      filter: {
        dealerId: 'D0001',
        branchId: 'HO',
        activityId: '',
        activityType: '',
        activityName: '',
      },
      sortFields: [
        { field: 'activityName', direction: 'DESC' as const },
        { field: 'activityId', direction: 'ASC' as const },
      ],
      page: 0,
      size: 10,
    };

    await dealerActivityListService.search(request);

    expect(getSpy).toHaveBeenCalledWith(ENDPOINTS.WCRM010200.SEARCH, undefined, {
      params: {
        filter: JSON.stringify({
          filter: { dealerId: 'D0001', branchId: 'HO' },
          sortFields: request.sortFields,
        }),
      },
    });
    getSpy.mockRestore();
  });

  it('loads activity-name suggestions with a serialized filter query parameter', async () => {
    const getSpy = vi.spyOn(apiService, 'get').mockResolvedValue({
      success: true,
      data: { suggestions: [] },
    } as never);

    const filter = {
      dealerId: 'D0001',
      branchId: '01',
      activityId: '',
      activityType: '',
      activityName: 'Periodic',
    };

    await dealerActivityListService.getActivityNameSuggestions(filter);

    expect(getSpy).toHaveBeenCalledWith(
      ENDPOINTS.WCRM010200.SUGGESTION_LIST,
      undefined,
      {
        params: {
          filter: JSON.stringify({
            filter: {
              dealerId: 'D0001',
              branchId: '01',
              activityName: 'Periodic',
            },
          }),
        },
      },
    );
    getSpy.mockRestore();
  });
});