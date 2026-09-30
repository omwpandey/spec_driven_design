/**
 * WCRM010301 - TMT Activity Maintenance data source
 *
 * Provides the three lookups used by the maintenance page:
 *   - Repair / inspection list
 *   - Contact-process combo options
 *   - Contact-channel combo options
 *
 * Data source is switched by the TOPS_USE_MOCK_DATA flag:
 *   - TOPS_USE_MOCK_DATA=true  -> load from local JSON files in
 *                                 src/mocks/WCRM010301-TmtActivityMaintenance
 *   - TOPS_USE_MOCK_DATA=false -> call the real API via apiService
 *
 * Both paths resolve to the same ApiResponse<T> shape so callers
 * (e.g. the useApi hook)P can consume them uniformly.
 */

import apiService, { type ApiResponse } from '@services/apiService';
import { ENDPOINTS } from '@services/endpoints';
import onloadDataMock from '@/mocks/WCRM010301-TmtActivityMaintenance/onloadData.json';
import { contactProcessMock } from '../index';
import { contactChannelMock } from '../index';
import { repairInspectionMock } from '../index';
import type {
  ComboOption,
  RepairInspectionItem,
  TmtListResponse,
} from '../tmtActivityPm.type';

export type { ComboOption, RepairInspectionItem, TmtListResponse };

export interface TmtPmOnloadFilter {
  activityType: string;
  activityId: string;
  dealerId: string;
  branchId: string;
}

export interface TmtPmContactChannelDetail {
  activityId: string;
  dealerId: string;
  branchId: string;
  processType: string;
  channelType: string;
  activityDay: number;
  groupId: number;
  activityMasterId: string;
  version: number;
  deleted: boolean;
  id: number;
  rowStatus: string | null;
}

export interface TmtPmRepairInspectionItem {
  activityId: string;
  branchId: string;
  dealerId: string;
  mandatoryFlg: 'Y' | 'N';
  repairInspectionCode: string;
  rowStatus: string | null;
  version: number;
}

export interface TmtPmOnloadData {
  activityId: string;
  dealerId: string;
  branchId: string;
  activityTypeId: number;
  activityTypeCode: string;
  activityTypeName: string;
  version: number;
  contactChannelDetails: TmtPmContactChannelDetail[];
  repairInspectionItems: TmtPmRepairInspectionItem[];
  rowStatus: string | null;
}

export interface TmtPmSavePayload extends TmtPmOnloadData {
  contactChannelDetails: TmtPmContactChannelDetail[];
  repairInspectionItems: TmtPmRepairInspectionItem[];
}

export interface TmtPmSaveRequest {
  data: TmtPmSavePayload;
}

/** True when the app should read from local JSON mocks instead of the API. */
export const useMockData = import.meta.env.TOPS_USE_MOCK_DATA === 'true';

/** Wrap a static mock payload in the ApiResponse envelope used by useApi. */
function toApiResponse<T>(payload: T): ApiResponse<T> {
  return { data: payload, success: true };
}

// ===== Data source =====

const ENDPOINT = ENDPOINTS.TMT_ACTIVITY_MAINTENANCE;

const inFlightRequests = new Map<string, Promise<unknown>>();

function dedupeRequest<T>(
  key: string,
  request: () => Promise<T>,
): Promise<T> {
  const existingRequest = inFlightRequests.get(key) as Promise<T> | undefined;
  if (existingRequest) return existingRequest;

  const pendingRequest = request().finally(() => {
    inFlightRequests.delete(key);
  });
  inFlightRequests.set(key, pendingRequest);
  return pendingRequest;
}

/** Fetch combo options for a given code-master comboType (e.g. CONTACT_PROCESS). */
async function getComboOptions(
  comboType: string,
): Promise<ApiResponse<TmtListResponse<ComboOption>>> {
  return dedupeRequest(`combo:${comboType}`, async () => {
    const response = await apiService.get<TmtListResponse<ComboOption> | null>(
      ENDPOINTS.COMMON.CODE_MASTER_PROCESS_SEARCH,
      undefined,
      { params: { filter: JSON.stringify({ filter: { comboType, activeOnly: true } }) } },
    );

    // This endpoint returns tableData at the top level and data as null,
    // unlike the standard ApiResponse envelope expected by useApi.
    const payload = response.data ?? (response as unknown as TmtListResponse<ComboOption>);

    return {
      ...response,
      data: payload,
      success: response.success ?? true,
      totalCount: response.totalCount ?? payload.totalCount,
      page: response.page ?? payload.page,
      pageSize: response.pageSize ?? payload.size,
    };
  });
}


export const tmtActivityMaintenanceService = {
  /** Onload data used by the PM activity setup screen. */
  getOnloadData: (
    filter: TmtPmOnloadFilter = {
      activityType: 'PM',
      activityId: '',
      dealerId: 'TMT',
      branchId: 'HO',
    },
  ): Promise<ApiResponse<TmtPmOnloadData>> => {
    if (useMockData) {
      return Promise.resolve(
        toApiResponse((onloadDataMock as { data: TmtPmOnloadData }).data),
      );
    }

    return dedupeRequest(`onload:${JSON.stringify(filter)}`, () =>
      apiService.get<TmtPmOnloadData>(
        ENDPOINTS.WCRM010301.SEARCH,
        undefined,
        {
          params: {
            filter: JSON.stringify({
              filter,
            }),
          },
        },
      ),
    );
  },

  saveActivitySetup: (
    payload: TmtPmSavePayload,
  ): Promise<ApiResponse<TmtPmSaveRequest>> => {
    if (useMockData) {
      return Promise.resolve({
        data: { data: payload },
        success: true,
      });
    }

    return apiService.post<TmtPmSaveRequest>(
      ENDPOINTS.WCRM010301.SAVE,
      { data: payload },
    );
  },

  /** Repair / inspection catalogue used by the Service & Repair table. */
  getRepairInspectionList: async (): Promise<
    ApiResponse<TmtListResponse<RepairInspectionItem>>
  > => {
    if (useMockData) {
      return Promise.resolve(
        toApiResponse(
          repairInspectionMock as TmtListResponse<RepairInspectionItem>,
        ),
      );
    }
    const response = await apiService.get<
      TmtListResponse<RepairInspectionItem> | null
    >(
      ENDPOINTS.WCRM010301.REPAIR_INSPECTION,
      undefined,
      {
        params: {
          filter: JSON.stringify({ filter: {} }),
        },
      },
    );

    // This endpoint returns tableData at the top level and data as null,
    // so normalize it to the list response shape consumed by the table.
    const payload =
      response.data ??
      (response as unknown as TmtListResponse<RepairInspectionItem>);

    return {
      ...response,
      data: payload,
      success: response.success ?? true,
      totalCount: response.totalCount ?? payload.totalCount,
      page: response.page ?? payload.page,
      pageSize: response.pageSize ?? payload.size,
    };
  },

  /** Contact-process combo options. */
  getContactProcessOptions: (): Promise<
    ApiResponse<TmtListResponse<ComboOption>>
  > => {
    if (useMockData) {
      return Promise.resolve(
        toApiResponse(contactProcessMock as TmtListResponse<ComboOption>),
      );
    }
    return getComboOptions('CONTACT_PROCESS');
  },

  /** Contact-channel combo options. */
  getContactChannelOptions: (): Promise<
    ApiResponse<TmtListResponse<ComboOption>>
  > => {
    if (useMockData) {
      return Promise.resolve(
        toApiResponse(contactChannelMock as TmtListResponse<ComboOption>),
      );
    }
    return getComboOptions('CONTACT_CHANNEL');
  },
};

export default tmtActivityMaintenanceService;
