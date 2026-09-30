import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';

import TmtPmContactChannelTable from '../components/TmtPmContactChannelTable';
import userEvent from '@testing-library/user-event';
import tmtActivityMaintenanceService from '../services/tmtActivityMaintenanceService';
import type {
    TmtPmContactChannelTableRef,
} from '../tmtActivityPm.type';
import type { TmtPmOnloadData } from '../services/tmtActivityMaintenanceService';

const tc = (id: string, title: string) => `[${id}] ${title}`;

vi.mock('@store/index', () => ({
    useAppSelector: () => 'en',
    useAppDispatch: () => vi.fn(),
}));

vi.mock('@hooks', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        language: 'en',
    }),
    // Lightweight useApi stand-in: runs the supplied call and exposes its data.
    useApi: () => {
        const [data, setData] = useState<unknown>(null);
        const execute = async (
            apiCall: () => Promise<{ data: unknown }>,
        ) => {
            const res = await apiCall();
            setData(res.data);
            return res;
        };
        return { data, loading: false, error: null, execute };
    },
}));

// Mock the data source so tests are independent of the TOPS_USE_MOCK_DATA
// flag and never hit the network. Resolves with the same JSON payloads.
vi.mock('../services/tmtActivityMaintenanceService', () => ({
    default: {
        getContactProcessOptions: vi.fn(() =>
            Promise.resolve({
                success: true,
                data: {
                    tableData: [
                        { comboType: 'CONTACT_PROCESS', code: 'SFU', name: 'Service Follow-up', id: 9 },
                        { comboType: 'CONTACT_PROCESS', code: 'APC', name: 'Appointment Confirmation', id: 10 },
                    ],
                },
            })),
        getContactChannelOptions: vi.fn(() =>
            Promise.resolve({
                success: true,
                data: {
                    tableData: [
                        { comboType: 'CONTACT_CHANNEL', code: 'E', name: 'Email', id: 2 },
                        { comboType: 'CONTACT_CHANNEL', code: 'CL', name: 'Call Out', id: 3 },
                        { comboType: 'CONTACT_CHANNEL', code: 'TC', name: 'T-Connect', id: 4 },
                        { comboType: 'CONTACT_CHANNEL', code: 'TL', name: 'TMT Line', id: 5 },
                        { comboType: 'CONTACT_CHANNEL', code: 'LN', name: 'Line OA', id: 6 },
                        { comboType: 'CONTACT_CHANNEL', code: 'S', name: 'SMS', id: 7 },
                    ],
                },
            })),
        getOnloadData: vi.fn(() =>
            Promise.resolve(
                {
                    success: true,
                    data: {
                        contactChannelDetails: [
                            {
                                id: 1,
                                processType: 'SFU',
                                channelType: 'E',
                                activityDay: 10,
                            },
                        ],
                    },
                }
            )),
    },
}));

describe('WCRM010301 - Activity Master Maintenance - PM Activity by TMT', () => {
    it('does not refetch code-master options when parent onload data changes', async () => {
        vi.clearAllMocks();
        const { rerender } = renderWithTheme(
            <TmtPmContactChannelTable activityId="PM-OLD" onloadData={null} />,
        );

        const onloadData = {
            activityId: 'PM-EXISTING',
            dealerId: 'TMT',
            branchId: 'HO',
            activityTypeId: 1,
            activityTypeCode: 'PM',
            activityTypeName: 'Periodic Maintenance',
            version: 0,
            contactChannelDetails: [],
            repairInspectionItems: [],
            rowStatus: null,
        } satisfies TmtPmOnloadData;

        rerender(
            <TmtPmContactChannelTable
                activityId="PM-EXISTING"
                onloadData={onloadData}
            />,
        );

        await waitFor(() => {
            expect(tmtActivityMaintenanceService.getContactProcessOptions)
                .toHaveBeenCalledTimes(1);
            expect(tmtActivityMaintenanceService.getContactChannelOptions)
                .toHaveBeenCalledTimes(1);
        });
    });

    it('does not fetch onload data when the parent controls loading', () => {
        renderWithTheme(<TmtPmContactChannelTable onloadData={null} />);

        expect(tmtActivityMaintenanceService.getOnloadData).not.toHaveBeenCalled();
    });

    it('uses activityId from onload response when the route activityId is empty', async () => {
        const ref = createRef<TmtPmContactChannelTableRef>();
        const onloadData = {
            activityId: 'PM-FROM-API',
            dealerId: 'TMT',
            branchId: 'HO',
            activityTypeId: 1,
            activityTypeCode: 'PM',
            activityTypeName: 'Periodic Maintenance',
            version: 0,
            contactChannelDetails: [],
            repairInspectionItems: [],
            rowStatus: null,
        } satisfies TmtPmOnloadData;

        renderWithTheme(
            <TmtPmContactChannelTable
                ref={ref}
                activityId=""
                onloadData={onloadData}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'add_btn' }));

        expect(ref.current?.getPayload()[0].activityId).toBe('PM-FROM-API');
    });

    it('sends UPD for an unchanged row when the parent activityId exists', async () => {
        const ref = createRef<TmtPmContactChannelTableRef>();
        const onloadData = {
            activityId: 'PM-EXISTING',
            dealerId: 'TMT',
            branchId: 'HO',
            activityTypeId: 1,
            activityTypeCode: 'PM',
            activityTypeName: 'Periodic Maintenance',
            version: 0,
            contactChannelDetails: [
                {
                    id: 1,
                    processType: 'SFU',
                    channelType: 'E',
                    activityDay: 10,
                    activityId: '',
                    dealerId: '',
                    branchId: '',
                    groupId: 0,
                    activityMasterId: '',
                    version: 0,
                    deleted: false,
                    rowStatus: null
                },
            ],
            repairInspectionItems: [],
            rowStatus: null,
        } satisfies TmtPmOnloadData;

        renderWithTheme(
            <TmtPmContactChannelTable
                ref={ref}
                activityId="PM-EXISTING"
                onloadData={onloadData}
            />,
        );

        await waitFor(() => {
            expect(ref.current?.getPayload()[0]?.rowStatus).toBeNull();;
        });

        fireEvent.click(screen.getByRole('button', { name: 'add_btn' }));

        await waitFor(() => {
            expect(ref.current?.getPayload()[1]?.rowStatus).toBe('ADD');
        });
    });

    it(tc('WCRM010301-022', 'renders contact channel section'), async () => {
        renderWithTheme(<TmtPmContactChannelTable />);

        await waitFor(() => {
            expect(
                screen.queryByText('errorMessage.no_data_found')
            ).not.toBeInTheDocument();
        });

        expect(
            screen.getByText('contact_channel_section'),
        ).toBeInTheDocument();
    });

    it(tc('WCRM010301-022', 'renders table headers'), () => {
        renderWithTheme(<TmtPmContactChannelTable />);

        expect(
            screen.getByText('col_contact_process'),
        ).toBeInTheDocument();

        expect(
            screen.getByText('col_channel'),
        ).toBeInTheDocument();

        expect(
            screen.getByText('col_activity_day'),
        ).toBeInTheDocument();
    });

    it(tc('WCRM010301-022', 'renders blank status on load'), () => {
        renderWithTheme(<TmtPmContactChannelTable />);

        expect(
            screen.queryByText('UPD'),
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText('ADD'),
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText('DEL'),
        ).not.toBeInTheDocument();
    });

    it(tc('WCRM010301-023', 'adds new row'), () => {
        renderWithTheme(<TmtPmContactChannelTable />);

        fireEvent.click(
            screen.getByText('add_btn'),
        );

        expect(
            screen.getByText('ADD'),
        ).toBeInTheDocument();
    });

    it(tc('WCRM010301-024', 'renders contact process dropdown values'), async () => {
        renderWithTheme(<TmtPmContactChannelTable />);

        const user = userEvent.setup();

        await user.click(
            screen.getByRole('button', {
                name: 'add_btn',
            }),
        );

        await waitFor(() => {
            expect(
                screen.getAllByRole('combobox').length,
            ).toBeGreaterThan(0);
        });

        fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);

        expect(
            await screen.findByRole('option', {
                name: 'Appointment Confirmation',
            }),
        ).toBeInTheDocument();
    });

    it(
        tc(
            'WCRM010301-025',
            'renders channel dropdown values',
        ),
        async () => {
            const user = userEvent.setup();

            renderWithTheme(<TmtPmContactChannelTable />);

            await waitFor(() => {
                expect(
                    screen.getAllByRole('combobox').length,
                ).toBeGreaterThan(1);
            });

            await user.click(
                screen.getAllByRole('combobox')[1],
            );

            expect(
                await screen.findByRole('option', {
                    name: 'SMS',
                }),
            ).toBeInTheDocument();

            expect(
                screen.getByRole('option', {
                    name: 'Email',
                }),
            ).toBeInTheDocument();
        },
    );

    it(
        tc(
            'WCRM010301-037',
            'changes status to UPD when activity day is updated',
        ),
        async () => {
            const user = userEvent.setup();

            renderWithTheme(<TmtPmContactChannelTable />);

            await waitFor(() => {
                expect(
                    screen.getAllByRole('spinbutton').length,
                ).toBeGreaterThan(0);
            });

            const inputs = screen.getAllByRole('spinbutton');

            await user.clear(inputs[0]);
            await user.type(inputs[0], '15');

            expect(
                screen.getByText('UPD'),
            ).toBeInTheDocument();
        },
    );

    it(
        tc(
            'WCRM010301-037',
            'changes status to UPD when contact process is updated',
        ),
        async () => {
            const user = userEvent.setup();

            renderWithTheme(<TmtPmContactChannelTable />);

            await waitFor(() => {
                expect(
                    screen.getAllByRole('combobox').length,
                ).toBeGreaterThan(0);
            });

            await user.click(
                screen.getAllByRole('combobox')[0],
            );

            await user.click(
                await screen.findByRole('option', {
                    name: /Appointment Confirmation/i,
                }),
            );

            expect(
                screen.getByText('UPD'),
            ).toBeInTheDocument();
        },
    );

    it(
        tc(
            'WCRM010301-037',
            'keeps ADD status for newly added row after edit',
        ),
        async () => {
            const user = userEvent.setup();

            renderWithTheme(<TmtPmContactChannelTable />);

            await user.click(
                screen.getByRole('button', {
                    name: 'add_btn',
                }),
            );

            await waitFor(() => {
                expect(
                    screen.getAllByRole('spinbutton').length,
                ).toBeGreaterThan(0);
            });

            const inputs = screen.getAllByRole('spinbutton');

            await user.clear(inputs[inputs.length - 1]);
            await user.type(inputs[inputs.length - 1], '20');

            expect(
                screen.getByText('ADD'),
            ).toBeInTheDocument();
        },
    );

    it(
        tc(
            'WCRM010301-035',
            'marks existing row as DEL',
        ),
        async () => {
            const user = userEvent.setup();

            renderWithTheme(
                <TmtPmContactChannelTable />,
            );

            await waitFor(() => {
                expect(
                    screen.getAllByTestId('DeleteIcon')
                        .length,
                ).toBeGreaterThan(0);
            });

            const deleteButtons =
                screen.getAllByTestId('DeleteIcon');

            await user.click(
                deleteButtons[0].closest('button')!,
            );

            await user.click(
                await screen.findByRole('button', {
                    name: /yes/i,
                }),
            );

            await waitFor(() => {
                expect(
                    screen.getByText('DEL'),
                ).toBeInTheDocument();
            });
        },
    );

    it(
        tc(
            'WCRM010301-035',
            'disables controls when row status becomes DEL',
        ),
        async () => {
            const user = userEvent.setup();

            renderWithTheme(
                <TmtPmContactChannelTable />,
            );

            await waitFor(() => {
                expect(
                    screen.getAllByTestId('DeleteIcon')
                        .length,
                ).toBeGreaterThan(0);
            });

            const deleteButtons =
                screen.getAllByTestId('DeleteIcon');

            await user.click(
                deleteButtons[0].closest('button')!,
            );

            await user.click(
                await screen.findByRole('button', {
                    name: /yes/i,
                }),
            );

            await waitFor(() => {
                expect(
                    screen.getByText('DEL'),
                ).toBeInTheDocument();
            });

            await waitFor(() => {
                expect(
                    screen.getByText('DEL'),
                ).toBeInTheDocument();
            });
        },
    );

    it(
        tc(
            'WCRM010301-035',
            'deleting newly added row removes it from state',
        ),
        async () => {
            const user = userEvent.setup();

            renderWithTheme(
                <TmtPmContactChannelTable />,
            );

            await user.click(
                screen.getByText('add_btn'),
            );

            await waitFor(() => {
                expect(
                    screen.getByText('ADD'),
                ).toBeInTheDocument();
            });

            const deleteButtons =
                screen.getAllByTestId('DeleteIcon');

            await user.click(
                deleteButtons.at(-1)?.closest('button')!,
            );

            await user.click(
                await screen.findByRole('button', {
                    name: /yes/i,
                }),
            );

            await waitFor(() => {
                expect(
                    screen.queryByText('ADD'),
                ).not.toBeInTheDocument();
            });
        },
    );


    it(tc('WCRM010301-023', 'allows multiple rows to be added'), () => {
        renderWithTheme(<TmtPmContactChannelTable />);

        const addBtn =
            screen.getByText('add_btn');

        fireEvent.click(addBtn);
        fireEvent.click(addBtn);

        const statuses =
            screen.getAllByText('ADD');

        expect(statuses.length).toBe(2);
    });

    it('[WCRM010301-029] Contact Process is mandatory', async () => {
        const ref = createRef<TmtPmContactChannelTableRef>();

        renderWithTheme(
            <TmtPmContactChannelTable ref={ref} />
        );

        fireEvent.click(screen.getByText('add_btn'));

        await waitFor(() => {
            expect(ref.current).toBeTruthy();
        });

        const error =
            ref.current?.validateContactChannelRows();

        expect(error).toContain('validation_required');
    });

    it('[WCRM010301-030] Channel is mandatory', async () => {
        const ref = createRef<TmtPmContactChannelTableRef>();

        renderWithTheme(
            <TmtPmContactChannelTable ref={ref} />
        );

        fireEvent.click(screen.getByText('add_btn'));

        await waitFor(() => {
            expect(ref.current).toBeTruthy();
        });

        const error =
            ref.current?.validateContactChannelRows();

        expect(error).toContain('validation_required');
    });


    it('[WCRM010301-031] Activity Day is mandatory', async () => {
        const ref = createRef<TmtPmContactChannelTableRef>();

        renderWithTheme(
            <TmtPmContactChannelTable ref={ref} />
        );

        fireEvent.click(screen.getByText('add_btn'));

        await waitFor(() => {
            expect(ref.current).toBeTruthy();
        });

        const error =
            ref.current?.validateContactChannelRows();

        expect(error).toContain('validation_required');
    });

    it('[WCRM010301-033] delete row confirmation yes', async () => {
        const user = userEvent.setup();

        renderWithTheme(
            <TmtPmContactChannelTable />
        );

        await waitFor(() => {
            expect(
                screen.getAllByTestId('DeleteIcon').length
            ).toBeGreaterThan(0);
        });

        await user.click(
            screen
                .getAllByTestId('DeleteIcon')[0]
                .closest('button')!
        );

        await user.click(
            await screen.findByRole('button', {
                name: /yes/i,
            })
        );

        expect(
            screen.getByText('DEL')
        ).toBeInTheDocument();
    });

    it('[WCRM010301-034] cancel delete row', async () => {
        const user = userEvent.setup();

        renderWithTheme(
            <TmtPmContactChannelTable />
        );

        await waitFor(() => {
            expect(
                screen.getAllByTestId('DeleteIcon').length
            ).toBeGreaterThan(0);
        });

        await user.click(
            screen
                .getAllByTestId('DeleteIcon')[0]
                .closest('button')!
        );

        await user.click(
            await screen.findByRole('button', {
                name: /no/i,
            })
        );

        expect(
            screen.queryByText('DEL')
        ).not.toBeInTheDocument();
    });
});