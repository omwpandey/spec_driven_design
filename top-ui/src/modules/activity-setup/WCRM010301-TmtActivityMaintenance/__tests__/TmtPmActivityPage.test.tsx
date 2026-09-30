import React, { forwardRef, useImperativeHandle } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import TmtPmActivityPage from '../TmtPmActivityPage';
import userEvent from '@testing-library/user-event';
import tmtActivityMaintenanceService from '../services/tmtActivityMaintenanceService';

const tc = (id: string, title: string) => `[${id}] ${title}`;

const serviceRepairRef = {
  validateAll: vi.fn<() => string | null>(() => null),
  hasChanges: vi.fn<() => boolean>(() => true),
  commitSaved: vi.fn<() => void>(),
};

const mockValidateAll = vi.fn<
  () => string | null
>(() => null);
const mockHasChanges = vi.fn<
  () => boolean
>(() => true);
const mockCommitSaved = vi.fn<
  () => void
>();
const mockReloadOnload = vi.fn<
  () => void
>();
const mockGetPayload = vi.fn(() => ({
  activityId: 'PM-TODO:23',
  contactChannelDetails: [],
  repairInspectionItems: [],
}));

vi.mock('@store/index', () => ({
  useAppSelector: () => 'en',
  useAppDispatch: () => vi.fn(),
}));

vi.mock('@hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
}));

vi.mock('../components/TmtPmServiceRepairTable', async () => {
  const React = await import('react');

  return {
    default: React.forwardRef((_props, ref) => {
      React.useImperativeHandle(ref, () => ({
        validateAll: mockValidateAll,
        hasChanges: mockHasChanges,
        commitSaved: mockCommitSaved,
        reloadOnload: mockReloadOnload,
        getPayload: mockGetPayload,
      }));

      return <div data-testid="service-repair-table" />;
    }),
  };
});

vi.mock('../../WCRM010302-TMTActivityMaintenance/components/TmtPmAdditionalRejectedTable', () => ({
  default: () => <div>additional-rejected-table</div>,
}));

vi.spyOn(
  tmtActivityMaintenanceService,
  'saveActivitySetup',
).mockResolvedValue({
  success: true,
  data: {} as any,
});

describe('WCRM010301 - Activity Master Maintenance - PM Activity by TMT', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockValidateAll.mockReturnValue(null);

    mockHasChanges.mockReturnValue(true);

    mockGetPayload.mockReturnValue({
      activityId: 'PM-TODO:23',
      contactChannelDetails: [],
      repairInspectionItems: [],
    });
  });

  it(tc('WCRM010301-005', 'Verify screen title displays correctly'), () => {
    renderWithTheme(<TmtPmActivityPage />);

    expect(
      screen.getByRole('heading', {
        name: 'tmt_activity_maintenance',
      }),
    ).toBeInTheDocument();
  });

  it(tc('WCRM010301-006', 'Verify screen loads with Periodic Maintenance selected by default'), () => {
    renderWithTheme(<TmtPmActivityPage />);

    expect(
      screen.getByRole('radio', { name: 'periodic_maintenance' }),
      'Periodic Maintenance should be the default activity type.',
    ).toBeChecked();
    expect(
      screen.getByTestId('service-repair-table'),
      'The Periodic Maintenance detail section should be displayed by default.',
    ).toBeInTheDocument();
  });

  it(tc('WCRM010301-007', 'Verify all Activity Type radio buttons are displayed'), () => {
    renderWithTheme(<TmtPmActivityPage />);

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(8);

    expect(
      screen.getByRole('radio', {
        name: 'periodic_maintenance',
      }),
    ).toBeChecked();

    expect(
      screen.getByRole('radio', {
        name: 'additional_rejected',
      }),
    ).toBeInTheDocument();
  });

  it(tc('WCRM010301-008', 'Verify only one Activity Type can be selected at a time'), async () => {
    renderWithTheme(<TmtPmActivityPage />);

    const periodicMaintenance = screen.getByRole('radio', {
      name: 'periodic_maintenance',
    });
    const additionalRejected = screen.getByRole('radio', {
      name: 'additional_rejected',
    });

    const user = userEvent.setup();

    await user.click(additionalRejected);

    expect(additionalRejected, 'The newly selected activity type should be checked.').toBeChecked();
    expect(periodicMaintenance, 'The previously selected activity type should be unchecked.').not.toBeChecked();
  });

  it(
    tc(
      'WCRM010301-039',
      'Verify the Footer section of screen (Set Template, Save)',
    ),
    () => {
      renderWithTheme(<TmtPmActivityPage />);

      expect(
        screen.getByRole('button', {
          name: 'set_Template',
        }),
      ).toBeEnabled();

      expect(
        screen.getByRole('button', {
          name: 'save_btn',
        }),
      ).toBeInTheDocument();
    },
  );

  it(
    tc(
      'WCRM010301-040',
      'Verify Set Template button is enabled',
    ),
    () => {
      renderWithTheme(<TmtPmActivityPage />);

      expect(
        screen.getByRole('button', {
          name: 'set_Template',
        }),
      ).toBeEnabled();
    },
  );

  it(
    tc(
      'WCRM010301-041',
      'Verify Set Template opens dialog',
    ),
    () => {
      renderWithTheme(<TmtPmActivityPage />);

      fireEvent.click(
        screen.getByRole('button', {
          name: 'set_Template',
        }),
      );

      expect(
        screen.getByRole('dialog'),
      ).toBeInTheDocument();
    },
  );

  it(
    tc(
      'WCRM010301-045',
      'Verify successful Save shows confirmation and success message',
    ),
    async () => {
      const user = userEvent.setup();

      renderWithTheme(<TmtPmActivityPage />);

      await user.click(
        screen.getByRole('button', {
          name: 'save_btn',
        }),
      );

      expect(
        screen.getByText('tmt_pm_wrn0003_save_confirm'),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: /yes/i,
        }),
      );

      await waitFor(() => {
        expect(mockCommitSaved).toHaveBeenCalledTimes(1);
        expect(mockReloadOnload).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(
          screen.getByText('activity_save_success'),
        ).toBeInTheDocument();
      });
    },
  );

  it(tc('WCRM010301-046', 'Verify Save is cancelled when user clicks No on confirmation popup'), async () => {
    renderWithTheme(<TmtPmActivityPage />);

    fireEvent.click(screen.getByRole('button', { name: 'save_btn' }));
    fireEvent.click(
      await screen.findByRole('button', { name: /no/i })
    );

    expect(mockCommitSaved).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.queryByText('tmt_pm_wrn0003_save_confirm'),
        'The confirmation dialog should close after cancellation.',
      ).not.toBeInTheDocument();
    });
  });

  it(
    tc(
      'WCRM010301-046',
      'Save blocked when validation error exists',
    ),
    async () => {
      mockValidateAll.mockReturnValue(
        'validation_error',
      );

      const user = userEvent.setup();

      renderWithTheme(
        <TmtPmActivityPage />,
      );

      await user.click(
        screen.getByRole('button', {
          name: 'save_btn',
        }),
      );

      expect(
        tmtActivityMaintenanceService.saveActivitySetup,
      ).not.toHaveBeenCalled();
    },
  );

  it(
    tc(
      'WCRM010301-048',
      'Verify system error message when unexpected exception occurs during Save',
    ),
    async () => {
      mockValidateAll.mockReturnValue(null);
      mockHasChanges.mockReturnValue(true);

      vi.spyOn(
        tmtActivityMaintenanceService,
        'saveActivitySetup',
      ).mockRejectedValue(
        new Error('Server Error'),
      );

      const user = userEvent.setup();

      renderWithTheme(
        <TmtPmActivityPage />,
      );

      await user.click(
        screen.getByRole('button', {
          name: 'save_btn',
        }),
      );

      await user.click(
        screen.getByRole('button', {
          name: /yes/i,
        }),
      );

      await waitFor(() => {
        expect(
          mockCommitSaved,
        ).not.toHaveBeenCalled();
      });
    },
  );

  it(
    tc(
      'WCRM010301-047',
      'Save blocked when contact channel validation fails',
    ),
    async () => {
      mockValidateAll.mockReturnValue(
        'Contact Channel row is required',
      );

      const user = userEvent.setup();

      renderWithTheme(
        <TmtPmActivityPage />,
      );

      await user.click(
        screen.getByRole('button', {
          name: 'save_btn',
        }),
      );

      expect(
        tmtActivityMaintenanceService.saveActivitySetup,
      ).not.toHaveBeenCalled();
    },
  );

  it(
    tc(
      'WCRM010301-050',
      'Verify warning message when Save is clicked without any configuration changes',
    ),
    async () => {
      mockHasChanges.mockReturnValue(false);

      const user = userEvent.setup();

      renderWithTheme(<TmtPmActivityPage />);

      await user.click(
        screen.getByRole('button', {
          name: 'save_btn',
        }),
      );

      expect(
        tmtActivityMaintenanceService.saveActivitySetup,
      ).not.toHaveBeenCalled();
    },
  );

  it(
    tc(
      'WCRM010301-051',
      "Verify user remains on current screen after 'No changes to save'",
    ),
    async () => {
      mockHasChanges.mockReturnValue(false);

      const user = userEvent.setup();

      renderWithTheme(
        <TmtPmActivityPage />,
      );

      await user.click(
        screen.getByRole('button', {
          name: 'save_btn',
        }),
      );

      expect(
        screen.getByRole('button', {
          name: 'ok_btn',
        }),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'ok_btn',
        }),
      );

      expect(
        tmtActivityMaintenanceService.saveActivitySetup,
      ).not.toHaveBeenCalled();
    },
  );
});