import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import TopTable, { type ICropColumn, type ICropFormApi } from '../topTable';

vi.mock('@hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}));

vi.mock('@store', () => ({
  useAppSelector: () => ({ permissions: [] }),
}));

type Row = {
  id: number;
  name: string;
  amount: number;
  active: boolean;
  status: string;
  date: string;
};

const rows: Row[] = [
  { id: 1, name: 'Bravo', amount: 20, active: true, status: 'Open', date: '2026-01-02' },
  { id: 2, name: 'Alpha', amount: 10, active: false, status: 'Closed', date: '2026-01-01' },
];

const columns: ICropColumn<Row>[] = [
  { id: 'name', label: 'Name', fieldtype: 'label', isSortingRequired: true },
  { id: 'amount', label: 'Amount', fieldtype: 'label', cellType: 'Number', isSortingRequired: true },
  { id: 'active', label: 'Active', fieldtype: 'checkbox', filterType: 'checkbox' },
  {
    id: 'status',
    label: 'Status',
    fieldtype: 'dropdown',
    filterType: 'dropdown',
    preloadData: [
      { label: 'Open', value: 'Open' },
      { label: 'Closed', value: 'Closed' },
    ],
  },
  { id: 'date', label: 'Date', fieldtype: 'date', filterType: 'date' },
  { id: 'actions', label: 'Actions', fieldtype: 'action' },
];

const baseProps = () => ({
  rows,
  headerCell: columns,
  primaryKey: 'id',
  orderBy: '',
  orderDir: '' as const,
  page: 0,
  rowsPerPage: 10,
  editRowIndex: {},
  handleSort: vi.fn(),
  handleChangePage: vi.fn(),
  handleChangeRowsPerPage: vi.fn(),
  onFilterChange: vi.fn(),
});

const renderTable = (overrides: Record<string, unknown> = {}) =>
  renderWithTheme(<TopTable<Row> {...baseProps()} {...overrides} />);

const formApi = (values: Record<string, unknown> = {}): ICropFormApi => ({
  values,
  setValue: vi.fn(),
  setValues: vi.fn(),
  register: vi.fn((name: string) => ({
    name,
    value: values[name] ?? '',
    checked: undefined,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    isError: false,
    errorMessage: '',
  })),
  selectedRows: [],
  isRowEdit: true,
  isRowAdd: false,
});

describe('TopTable', () => {
  it('renders headers, rows, required markers, custom content, and summary values', () => {
    renderTable({
      headerCell: columns.map((column) =>
        column.id === 'name' ? { ...column, isRequired: true } : column
      ),
      headerActions: <button type="button">Add row</button>,
      summarizedRow: [{ label: 'Total', valueCallback: (data: Row[]) => data.length }],
      paginationChildren: <span>Extra controls</span>,
    });

    expect(screen.getByText('Name *')).toBeInTheDocument();
    expect(screen.getByText('Bravo')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Add row')).toBeInTheDocument();
    expect(screen.getByText('Total: 2')).toBeInTheDocument();
    expect(screen.getByText('Extra controls')).toBeInTheDocument();
  });

  it('sorts client-side data and forwards the sorted result', () => {
    const handleSort = vi.fn();
    renderTable({ handleSort });

    fireEvent.click(screen.getByText('Amount'));

    expect(handleSort).toHaveBeenCalledWith(
      expect.anything(),
      'amount',
      expect.arrayContaining([
        expect.objectContaining({ id: 2 }),
        expect.objectContaining({ id: 1 }),
      ])
    );
    const sorted = handleSort.mock.calls[0][2] as Row[];
    expect(sorted.map((row) => row.id)).toEqual([2, 1]);
  });

  it('uses server sorting when client sorting is disabled', () => {
    const handleSort = vi.fn();
    renderTable({ handleSort, isClientSort: false });

    fireEvent.click(screen.getByText('Name'));

    expect(handleSort).toHaveBeenCalledWith(expect.anything(), 'name');
  });

  it('filters client-side text input and forwards matching rows', () => {
    const onFilterChange = vi.fn();
    renderTable({
      onFilterChange,
      isFilterApplied: true,
      allData: rows,
      headerCell: [{ id: 'name', label: 'Name', fieldtype: 'label', filterType: 'textbox' }],
    });

    const filter = screen.getByPlaceholderText('common.search');
    fireEvent.change(filter, { target: { value: 'alp' } });

    expect(onFilterChange).toHaveBeenLastCalledWith([rows[1]]);
  });

  it('forwards filter state when client filtering is disabled', () => {
    const onFilterChange = vi.fn();
    renderTable({
      onFilterChange,
      isFilterApplied: true,
      isClientFilter: false,
      headerCell: [{ id: 'name', label: 'Name', fieldtype: 'label', filterType: 'textbox' }],
    });

    fireEvent.change(screen.getByPlaceholderText('common.search'), { target: { value: 'br' } });

    expect(onFilterChange).toHaveBeenCalledWith({ name: 'br' });
  });

  it('renders dropdown, checkbox, date, and empty filter controls', () => {
    renderTable({
      isFilterApplied: true,
      headerCell: [
        { id: 'status', label: 'Status', fieldtype: 'label', filterType: 'dropdown', preloadData: [{ label: 'Open', value: 'Open' }] },
        { id: 'active', label: 'Active', fieldtype: 'label', filterType: 'checkbox' },
        { id: 'date', label: 'Date', fieldtype: 'label', filterType: 'date' },
        { id: 'name', label: 'Name', fieldtype: 'label', filterType: 'none' },
      ],
    });

    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByDisplayValue('').length).toBeGreaterThanOrEqual(1);
  });

  it('handles row selection and select-all callbacks', () => {
    const onSelectionChange = vi.fn();
    renderTable({ rowSelection: true, onSelectionChange });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([rows[0]]);

    fireEvent.click(checkboxes[0]);
    expect(onSelectionChange).toHaveBeenLastCalledWith(rows);
  });

  it('renders editable fields and invokes row actions', () => {
    const onRowSave = vi.fn();
    const onRowCancel = vi.fn();
    const onRowReset = vi.fn();
    const onBlurChange = vi.fn();
    const editingForm = formApi();

    renderTable({
      editRowIndex: { '1': true },
      formApi: editingForm,
      onRowSave,
      onRowCancel,
      onRowReset,
      onBlurChange,
      headerCell: [
        { id: 'name', label: 'Name', fieldtype: 'textbox' },
        { id: 'actions', label: 'Actions', fieldtype: 'action' },
      ],
    });

    const input = screen.getAllByRole('textbox')[0];
    fireEvent.blur(input);
    expect(onBlurChange).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('common.save'));
    fireEvent.click(screen.getByLabelText('common.cancel'));
    fireEvent.click(screen.getByLabelText('common.reset'));
    expect(onRowSave).toHaveBeenCalledWith(rows[0], 0);
    expect(onRowCancel).toHaveBeenCalledWith(rows[0], 0);
    expect(onRowReset).toHaveBeenCalledWith(rows[0], 0);
  });

  it('renders editable dropdown, checkbox, and date fields', () => {
    renderTable({
      editRowIndex: { '1': true },
      formApi: formApi(),
      headerCell: [
        { id: 'status', label: 'Status', fieldtype: 'dropdown', preloadData: [{ label: 'Open', value: 'Open' }] },
        { id: 'active', label: 'Active', fieldtype: 'checkbox' },
        { id: 'date', label: 'Date', fieldtype: 'date' },
      ],
    });

    expect(screen.getAllByRole('checkbox')[0]).toBeInTheDocument();
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByDisplayValue('').length).toBeGreaterThanOrEqual(1);
  });

  it('supports custom cell and action renderers and pagination clicks', () => {
    const onChangePage = vi.fn();
    const customAction = vi.fn(() => <button type="button">Custom action</button>);

    renderTable({
      totalCount: 30,
      handleChangePage: onChangePage,
      headerCell: [
        { id: 'name', label: 'Name', fieldtype: 'custom', render: (value:any) => <strong>Cell: {String(value)}</strong> },
        { id: 'actions', label: 'Actions', fieldtype: 'action', renderActions: customAction },
      ],
    });

    expect(screen.getByText('Cell: Bravo')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('Custom action')[0]);
    expect(customAction).toHaveBeenCalledWith(rows[0], 0);
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));
    expect(onChangePage).toHaveBeenCalledWith(expect.anything(), 1);
  });

  it('renders view-mode actions and calls their handlers', () => {
    const handlers = {
      onRowEdit: vi.fn(),
      onRowCopy: vi.fn(),
      onRowDelete: vi.fn(),
    };

    renderTable({
      ...handlers,
      headerCell: [{ id: 'actions', label: 'Actions', fieldtype: 'action' }],
    });

    const firstRow = screen.getAllByRole('row')[1];
    fireEvent.click(within(firstRow).getByLabelText('common.edit'));
    fireEvent.click(within(firstRow).getByLabelText('common.copy'));
    fireEvent.click(within(firstRow).getByLabelText('common.delete'));
    expect(handlers.onRowEdit).toHaveBeenCalledWith(rows[0], 0);
    expect(handlers.onRowCopy).toHaveBeenCalledWith(rows[0], 0);
    expect(handlers.onRowDelete).toHaveBeenCalledWith(rows[0], 0);
  });

  it('renders no-data state and hides pagination when requested', () => {
    renderTable({ rows: [], emptyMessage: 'Nothing here', hidePagination: true });

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('pagination.goto')).not.toBeInTheDocument();
  });

  it('handles pagination, rows-per-page changes, and valid and invalid goto values', async () => {
    const handleChangePage = vi.fn();
    const handleChangeRowsPerPage = vi.fn();
    renderTable({
      handleChangePage,
      handleChangeRowsPerPage,
      totalCount: 30,
      rowsPerPage: 10,
    });

    fireEvent.change(screen.getByPlaceholderText('pagination.goto'), { target: { value: '2' } });
    await waitFor(() => expect(handleChangePage).toHaveBeenCalledWith(null, 1));

    fireEvent.change(screen.getByPlaceholderText('pagination.goto'), { target: { value: '99' } });
    expect(screen.getByText('pagination.invalid_page')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByText('25 pagination.rows'));
    expect(handleChangeRowsPerPage).toHaveBeenCalledWith({ target: { value: 25 } });
  });

  it('applies permission hiding and invokes row click and resize handlers', () => {
    const onRowClick = vi.fn();
    const hiddenColumn = { id: 'secret', label: 'Hidden', fieldtype: 'label' as const, hidden: true };
    renderTable({
      onRowClick,
      headerCell: [...columns, hiddenColumn],
    });

    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Bravo'));
    expect(onRowClick).toHaveBeenCalledWith(rows[0], 0, expect.anything());

    const resizeHandle = screen.getAllByRole('cell')[0].querySelector('div');
    if (resizeHandle) {
      fireEvent.mouseDown(resizeHandle, { clientX: 10 });
      fireEvent.mouseMove(document, { clientX: 30 });
      fireEvent.mouseUp(document);
    }
  });
});
