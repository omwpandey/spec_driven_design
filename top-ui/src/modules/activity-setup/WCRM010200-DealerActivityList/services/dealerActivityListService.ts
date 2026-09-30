import apiService, { type ApiResponse } from '@services/apiService';
import axiosInstance from '@services/axios';
import { ENDPOINTS } from '@services/endpoints';
import {
  ACTIVITY_TYPES,
  buildMockActivityNameSuggestions,
  buildMockSearchData,
  type ActivityNameSuggestionData,
  type ActivitySearchFilter,
  type ActivitySearchData,
  type ActivitySearchRequest,
} from '../dealerActivityList.type';

export interface ActivityTypeOption {
  value: string;
  label: string;
}

export const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const toApiResponse = <T>(data: T): ApiResponse<T> => ({ data, success: true });

interface ActivityTypeApiItem {
  id: number;
  comboType: string;
  code: string;
  name: string;
  active: boolean | null;
  attributes: Record<string, unknown>;
  description: string | null;
  displayOrder: number | null;
  parentCode: string | null;
  parentId: number | null;
  rowStatus: string | null;
  version: number | null;
}

interface ActivityTypeApiData {
  tableData?: ActivityTypeApiItem[];
}

export interface ActivityTypeOption {
  value: string;
  label: string;
}

const getActivityTypeOptions = async (): Promise<
  ApiResponse<ActivityTypeOption[]>
> => {
  try {
    const response = await axiosInstance.get<ActivityTypeApiData>(
      ENDPOINTS.WCRM010200.COMBO_1_ACTIVITY_TYPE.SEARCH,
      {
        params: {
          filter: JSON.stringify({
            filter: {
              comboType: 'ACTIVITY_TYPE_MASTER',
              activeOnly: true,
            },
          }),
        },
      },
    );
    const tableData: ActivityTypeApiItem[] = Array.isArray(
      response.data?.tableData,
    )
      ? response.data.tableData
      : [];

    const options: ActivityTypeOption[] = tableData
      .filter(
        (item) =>
          typeof item.code === 'string' &&
          item.code.trim().length > 0 &&
          typeof item.name === 'string' &&
          item.name.trim().length > 0,
      )
      .sort((firstItem, secondItem) => {
        const firstDisplayOrder =
          firstItem.displayOrder ?? Number.MAX_SAFE_INTEGER;

        const secondDisplayOrder =
          secondItem.displayOrder ?? Number.MAX_SAFE_INTEGER;

        if (firstDisplayOrder !== secondDisplayOrder) {
          return firstDisplayOrder - secondDisplayOrder;
        }

        return firstItem.name.localeCompare(secondItem.name);
      })
      .map((item) => ({
        value: item.code.trim(),
        label: item.name.trim(),
      }));

    return toApiResponse(options);
  } catch (error: unknown) {
    console.error('getActivityTypeOptions error:', error);

    return toApiResponse([]);
  }
};

export const dealerActivityListService = {
  search(request: ActivitySearchRequest): Promise<ApiResponse<ActivitySearchData>> {
    if (useMockData) {
      return Promise.resolve(
        toApiResponse(
          buildMockSearchData(
            {
              activityId: request.filter.activityId,
              activityType: request.filter.activityType,
              activityName: request.filter.activityName,
            },
            request.page,
            request.size,
          ),
        ),
      );
    }

    return apiService.get<ActivitySearchData>(ENDPOINTS.WCRM010200.SEARCH, undefined, {
      params: {
        filter: JSON.stringify({
          filter: Object.fromEntries(
            Object.entries(request.filter).filter(([, value]) => value !== ''),
          ),
          sortFields: request.sortFields,
        }),
      },
    });
  },

  getActivityTypeOptions(): Promise<ApiResponse<ActivityTypeOption[]>> {
    if (useMockData) {
      return Promise.resolve(
        toApiResponse(ACTIVITY_TYPES.map(({ value, label }) => ({ value, label }))),
      );
    }

    return getActivityTypeOptions();
  },

  getActivityNameSuggestions(
    filter: ActivitySearchFilter,
  ): Promise<ApiResponse<ActivityNameSuggestionData>> {
    if (useMockData) {
      return Promise.resolve(
        toApiResponse({ suggestions: buildMockActivityNameSuggestions(filter.activityName) }),
      );
    }

    return apiService.get<ActivityNameSuggestionData>(
      ENDPOINTS.WCRM010200.SUGGESTION_LIST,
      undefined,
      {
        params: {
          filter: JSON.stringify({
            filter: {
              dealerId: filter.dealerId,
              branchId: filter.branchId,
              activityName: filter.activityName,
            },
          }),
        },
      },
    );
  },
};

export default dealerActivityListService;