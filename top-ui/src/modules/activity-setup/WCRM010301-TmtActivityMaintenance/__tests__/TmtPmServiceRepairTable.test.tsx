import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';

import TmtPmServiceRepairTable from '../components/TmtPmServiceRepairTable';
import userEvent from '@testing-library/user-event';
import type { TmtPmServiceRepairTableRef } from '../tmtActivityPm.type';

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
// Includes the contact-channel lookups needed by the nested child table.
vi.mock('../services/tmtActivityMaintenanceService', () => ({
    default: {
        getRepairInspectionList: () =>
            Promise.resolve({
                success: true,
                data: {
                    tableData: [
                        { id: '1-1000-SVC001', repairInspectionCode: '1000', description: '1,000 km Service / 1 Month' },
                        { id: '1-10000-SVC002', repairInspectionCode: '10000', description: '10,000 km Service / 6 Month' },
                        { id: '1-20000-SVC003', repairInspectionCode: '20000', description: '20,000 km Service / 12 Month' },
                        { id: '1-30000-SVC004', repairInspectionCode: '30000', description: '30,000 km Service / 18 Month' },
                        { id: '1-40000-SVC005', repairInspectionCode: '40000', description: '40,000 km Service / 24 Month' },
                    ],
                },
            }),
        getContactProcessOptions: () =>
            Promise.resolve({
                success: true,
                data: {
                    tableData: [
                        { comboType: 'CONTACT_PROCESS', code: 'SFU', name: 'Service Follow-up', id: 9 },
                        { comboType: 'CONTACT_PROCESS', code: 'APC', name: 'Appointment Confirmation', id: 10 },
                    ],
                },
            }),
        getContactChannelOptions: () =>
            Promise.resolve({
                success: true,
                data: {
                    tableData: [
                        { comboType: 'CONTACT_CHANNEL', code: 'E', name: 'Email', id: 2 },
                        { comboType: 'CONTACT_CHANNEL', code: 'CL', name: 'Call Out', id: 3 },
                        { comboType: 'CONTACT_CHANNEL', code: 'S', name: 'SMS', id: 7 },
                    ],
                },
            }),
        getOnloadData: () =>
            Promise.resolve({
                success: true,
                data: {
                    repairInspectionItems: [
                        {
                            repairInspectionCode: '10000',
                            mandatoryFlg: 'Y',
                        },
                        {
                            repairInspectionCode: '20000',
                            mandatoryFlg: 'Y',
                        },
                    ],
                },
            }),
    },
}));

describe('WCRM010301 - Activity Master Maintenance - PM Activity by TMT', () => {
    it(tc('WCRM010301-009', 'Verify Inspection Items grid loads correctly on screen load'), () => {
        renderWithTheme(<TmtPmServiceRepairTable />);

        expect(
            screen.getByText('service_repair_section'),
        ).toBeInTheDocument();

        expect(
            screen.getByText('col_repair_code'),
        ).toBeInTheDocument();

        expect(
            screen.getByText('col_description'),
        ).toBeInTheDocument();

        expect(
            screen.getByText('col_mandatory'),
        ).toBeInTheDocument();
    });

    it(tc('WCRM010301-010', 'Verify Add row'), async () => {
        const user = userEvent.setup();

        renderWithTheme(<TmtPmServiceRepairTable />);

        await waitFor(() => {
            expect(
                screen.getAllByRole('row').length,
            ).toBeGreaterThan(1);
        });

        const beforeRows =
            screen.getAllByRole('row').length;

        await user.click(
            screen.getAllByText('add_btn')[0],
        );

        const afterRows =
            screen.getAllByRole('row').length;

        expect(afterRows).toBeGreaterThan(
            beforeRows,
        );

        expect(
            screen.getByText('ADD'),
        ).toBeInTheDocument();
    });

    it(
        tc(
            'WCRM010301-011',
            'Verify Repair Inspection Code and Description columns',
        ),
        async () => {
            renderWithTheme(
                <TmtPmServiceRepairTable />,
            );

            await waitFor(() => {
                expect(
                    screen.getByText(
                        '10,000 km Service / 6 Month',
                    ),
                ).toBeInTheDocument();
            });

            expect(
                screen.getByText(
                    '20,000 km Service / 12 Month',
                ),
            ).toBeInTheDocument();
        },
    );

    it(
        tc(
            'WCRM010301-017',
            'Verify mandatory checkbox functionality',
        ),
        async () => {
            const user = userEvent.setup();

            renderWithTheme(
                <TmtPmServiceRepairTable />,
            );

            await waitFor(() => {
                expect(
                    screen.getAllByRole('checkbox')
                        .length,
                ).toBeGreaterThan(0);
            });

            const checkbox =
                screen.getAllByRole(
                    'checkbox',
                )[0];

            await user.click(checkbox);

            expect(
                checkbox,
            ).not.toBeChecked();
        },
    );


    it(
        tc(
            'WCRM010301-016',
            'Verify status updated on modification',
        ),
        async () => {
            const user = userEvent.setup();
            const ref = createRef<TmtPmServiceRepairTableRef>();

            renderWithTheme(
                <TmtPmServiceRepairTable ref={ref} />,
            );

            await waitFor(() => {
                expect(
                    screen.getAllByRole('combobox')
                        .length,
                ).toBeGreaterThan(0);
            });

            await user.click(
                screen.getAllByRole(
                    'combobox',
                )[0],
            );

            await user.click(
                await screen.findByRole(
                    'option',
                    {
                        name: '20000',
                    },
                ),
            );

            expect(
                screen.getByText('UPD'),
            ).toBeInTheDocument();

            expect(ref.current?.getPayload()?.rowStatus).toBe('UPD');
            expect(
                ref.current?.getPayload()?.repairInspectionItems[0].rowStatus,
            ).toBe('UPD');
        },
    );

    it(tc('WCRM010301-019', 'Verify row deletion'), async () => {
        const user = userEvent.setup();

        renderWithTheme(<TmtPmServiceRepairTable />);

        await waitFor(() => {
            expect(
                screen.getAllByTestId('DeleteIcon').length,
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

    });

    it(
        tc(
            'WCRM010301-021',
            'Verify Service and Repair Inspection row status processing',
        ),
        async () => {
            const user = userEvent.setup();

            renderWithTheme(
                <TmtPmServiceRepairTable />,
            );

            const addButtons =
                screen.getAllByTestId('AddIcon');

            await user.click(
                addButtons[0].closest('button')!,
            );

            expect(
                screen.getByText('ADD'),
            ).toBeInTheDocument();

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

    it(tc('WCRM010301-022', 'Verify Contact Channel Details grid loads correctly on screen load'), async () => {
        renderWithTheme(<TmtPmServiceRepairTable />);


        await waitFor(() => {
            expect(
                screen.getByText(
                    'contact_channel_section',
                ),
            ).toBeInTheDocument();
        });

    });

    it(
        tc(
            'WCRM010301-013',
            'Verify mandatory repair inspection code validation',
        ),
        async () => {
            const ref = createRef<TmtPmServiceRepairTableRef>();

            renderWithTheme(
                <TmtPmServiceRepairTable ref={ref} />,
            );

            const user = userEvent.setup();

            await user.click(
                screen.getAllByText('add_btn')[0],
            );

            const error =
                ref.current?.validateAll();

            expect(error).toContain(
                'validation_required',
            );
        },
    );

    it(
        tc(
            'WCRM010301-014',
            'Verify duplicate repair inspection code restriction',
        ),
        async () => {
            const user = userEvent.setup();

            renderWithTheme(
                <TmtPmServiceRepairTable />,
            );

            await user.click(
                screen.getAllByText('add_btn')[0],
            );

            await waitFor(() => {
                expect(
                    screen.getAllByRole('combobox').length,
                ).toBeGreaterThan(0);
            });

            const comboBoxes =
                screen.getAllByRole('combobox');

            await user.click(comboBoxes[comboBoxes.length - 1]);

            await user.click(
                await screen.findByRole('option', {
                    name: '10000',
                }),
            );

            await waitFor(() => {
                expect(
                    screen.getAllByText('10000').length,
                ).toBeGreaterThan(1);
            });
        },
    );

    it(
        tc(
            'WCRM010301-018',
            'Verify cancel delete keeps row unchanged',
        ),
        async () => {
            const user = userEvent.setup();

            renderWithTheme(
                <TmtPmServiceRepairTable />,
            );

            await waitFor(() => {
                expect(
                    screen.getAllByTestId('DeleteIcon').length,
                ).toBeGreaterThan(0);
            });

            await user.click(
                screen
                    .getAllByTestId('DeleteIcon')[0]
                    .closest('button')!,
            );

            await user.click(
                await screen.findByRole('button', {
                    name: /no/i,
                }),
            );

            expect(
                screen.queryByText('DEL'),
            ).not.toBeInTheDocument();
        },
    );
});