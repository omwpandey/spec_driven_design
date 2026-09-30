import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiService from '@services/apiService';
import tmtActivityMaintenanceService from '../services/tmtActivityMaintenanceService';

vi.mock('@services/apiService', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('tmtActivityMaintenanceService request deduplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiService.get).mockResolvedValue({
      data: { tableData: [], totalCount: 0, page: 0, size: 10 },
      success: true,
    });
  });

  it('shares concurrent combo requests for the same type only', async () => {
    await Promise.all([
      tmtActivityMaintenanceService.getContactProcessOptions(),
      tmtActivityMaintenanceService.getContactProcessOptions(),
      tmtActivityMaintenanceService.getContactChannelOptions(),
    ]);

    expect(apiService.get).toHaveBeenCalledTimes(2);
  });

  it('shares concurrent onload requests with the same filter only', async () => {
    const filter = {
      activityType: 'PM',
      activityId: 'PM-1',
      dealerId: 'TMT',
      branchId: 'HO',
    };

    await Promise.all([
      tmtActivityMaintenanceService.getOnloadData(filter),
      tmtActivityMaintenanceService.getOnloadData(filter),
      tmtActivityMaintenanceService.getOnloadData({ ...filter, activityId: 'PM-2' }),
    ]);

    expect(apiService.get).toHaveBeenCalledTimes(2);
  });

  it('[WCRM010301-055] retrieves repair inspection list', async () => {
  vi.mocked(apiService.get).mockResolvedValue({
    data: {
      tableData: [
        {
          repairInspectionCode: '10000',
          description: '10,000 km Service',
        },
      ],
      totalCount: 1,
      page: 0,
      size: 10,
    },
    success: true,
  });

  const result =
    await tmtActivityMaintenanceService.getRepairInspectionList();

  expect(result.success).toBe(true);

  expect(
    result.data.tableData[0].repairInspectionCode,
  ).toBe('10000');
});

it('[WCRM010301-062] retrieves contact process options', async () => {
  vi.mocked(apiService.get).mockResolvedValue({
    data: {
      tableData: [
        {
          comboType: 'CONTACT_PROCESS',
          code: 'SFU',
          name: 'Service Follow-up',
        },
      ],
      totalCount: 1,
      page: 0,
      size: 10,
    },
    success: true,
  });

  const result =
    await tmtActivityMaintenanceService.getContactProcessOptions();

  expect(result.success).toBe(true);

  expect(
    result.data.tableData[0].comboType,
  ).toBe('CONTACT_PROCESS');
});

it('[WCRM010301-058] retrieves contact channel options', async () => {
  vi.mocked(apiService.get).mockResolvedValue({
    data: {
      tableData: [
        {
          comboType: 'CONTACT_CHANNEL',
          code: 'E',
          name: 'Email',
        },
      ],
      totalCount: 1,
      page: 0,
      size: 10,
    },
    success: true,
  });

  const result =
    await tmtActivityMaintenanceService.getContactChannelOptions();

  expect(result.success).toBe(true);

  expect(
    result.data.tableData[0].comboType,
  ).toBe('CONTACT_CHANNEL');
});

it('[WCRM010301] retrieves onload data', async () => {
  vi.mocked(apiService.get).mockResolvedValue({
    data: {
      activityId: 'PM-1',
      contactChannelDetails: [],
      repairInspectionItems: [],
    },
    success: true,
  });

  const result =
    await tmtActivityMaintenanceService.getOnloadData({
      activityType: 'PM',
      activityId: 'PM-1',
      dealerId: 'TMT',
      branchId: 'HO',
    });

  expect(result.success).toBe(true);

  expect(result.data.activityId).toBe('PM-1');
});

it('[WCRM010301-048] propagates save errors', async () => {
  vi.mocked(apiService.post).mockRejectedValue(
    new Error('Save failed'),
  );

  await expect(
    tmtActivityMaintenanceService.saveActivitySetup(
      {} as any,
    ),
  ).rejects.toThrow('Save failed');
});

});
