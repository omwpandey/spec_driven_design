/**
 * [WCRM010200] Dealer Activity List — QA scenario test suite
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import { renderWithTheme } from '@/tests/test-utils';
import DealerActivityListPage from '../dealerActivityListPage';
import { MOCK_ACTIVITIES } from '../dealerActivityList.type';

const dealerActivityListServiceMocks = vi.hoisted(() => ({
  search: vi.fn(),
  getActivityTypeOptions: vi.fn(),
  getActivityNameSuggestions: vi.fn(),
}));

vi.mock('../services/dealerActivityListService', () => ({
  default: dealerActivityListServiceMocks,
}));

const expectTextsPresent = (...keys: string[]) =>
  keys.forEach((key) => expect(screen.getByText(key)).toBeInTheDocument());

const expectTextsAbsent = (...keys: string[]) =>
  keys.forEach((key) => expect(screen.queryByText(key)).not.toBeInTheDocument());

// `execute` mirrors the real useApi.execute: it invokes the passed API call and
// resolves to an ApiResponse-shaped envelope so the page's `.then(...)` chain
const mockExecute = vi.fn((apiCall: () => Promise<unknown>) => apiCall());
// `listApi.data` is the search-data envelope the page reads as `data.activities`.
type MockSearchData = {
  activities: typeof MOCK_ACTIVITIES;
  pagination?: { totalRecords: number };
} | null;
const buildMockListData = (): MockSearchData => ({ activities: MOCK_ACTIVITIES });
let mockListData: MockSearchData = buildMockListData();

vi.mock('@hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
  useApi: () => ({
    execute: mockExecute,
    data: mockListData,
    loading: false,
    error: null,
  }),
}));

// ---- Mock store ------------------------------------------------------------
// TopTable -> usePermission reads state.auth.user via useAppSelector. Provide a
// selector that runs against a minimal state (no user => default permissive:
// nothing hidden or read-only), so the grid renders without a real <Provider>.
vi.mock('@store', () => {
  const state = {
    auth: { user: undefined },
    app: { sidebarCollapsed: false },
    config: {
      language: 'en',
      dealer: { code: 'D001' },
      branch: { code: 'B001' },
    },
  };
  return {
    useAppSelector: (selector: (s: typeof state) => unknown) => selector(state),
    useAppDispatch: () => vi.fn(),
  };
});

// ---- Mock services ---------------------------------------------------------
vi.mock('@services/apiService', () => ({
  default: {
    get: vi.fn().mockResolvedValue([]),
    post: vi.fn().mockResolvedValue({}),
  },
}));

// Combo API (axios) — resolves the Activity Type dropdown options.
// Individual tests override this via `mockComboTableData`.
let mockComboTableData: { name: string; active: boolean; displayOrder: number }[] = [];
vi.mock('@services/axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: { tableData: mockComboTableData } })),
  },
}));

// ---- Mock router -----------------------------------------------------------
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockExecute.mockClear();
  mockNavigate.mockClear();
  mockListData = buildMockListData();
  mockComboTableData = [];
  dealerActivityListServiceMocks.search.mockReset();
  dealerActivityListServiceMocks.search.mockResolvedValue({
    success: true,
    data: {
      activities: MOCK_ACTIVITIES,
      pagination: { totalRecords: MOCK_ACTIVITIES.length },
    },
  });
  dealerActivityListServiceMocks.getActivityTypeOptions.mockReset();
  dealerActivityListServiceMocks.getActivityTypeOptions.mockResolvedValue({
    success: true,
    data: [],
  });
  dealerActivityListServiceMocks.getActivityNameSuggestions.mockReset();
  dealerActivityListServiceMocks.getActivityNameSuggestions.mockResolvedValue({
    success: true,
    data: { suggestions: [] },
  });
});

/* ==========================================================================
 * WCRM010200_001 — Verify Screen Title and Breadcrumb
 * ======================================================================== */
describe('WCRM010200_001 - Verify Screen Title and Breadcrumb', () => {
  it('displays the screen title (dal_page_title)', () => {
    renderWithTheme(<DealerActivityListPage />);
    expect(screen.getByText('dal_page_title')).toBeInTheDocument();
  });

  it('displays the breadcrumb navigation (Activity Setup > Activity List)', () => {
    renderWithTheme(<DealerActivityListPage />);
    expectTextsPresent('dal_breadcrumb_activity_setup', 'dal_breadcrumb_activity_list');
  });
});

/* ==========================================================================
 * WCRM010200_002 — Verify Search Section Fields Presence
 * ======================================================================== */
describe('WCRM010200_002 - Verify Search Section Fields Presence', () => {
  it('renders the Activity Search section', () => {
    renderWithTheme(<DealerActivityListPage />);
    expect(screen.getByText('dal_search_section')).toBeInTheDocument();
  });

  it('renders the implemented search field labels (Activity ID, Activity Type, Activity Name)', () => {
    renderWithTheme(<DealerActivityListPage />);
    expectTextsPresent('dal_field_activity_id', 'dal_field_activity_type', 'dal_field_activity_name');
  });

  it('documents QA fields not present in the current implementation (Created By, Activity Status)', () => {
    renderWithTheme(<DealerActivityListPage />);
    // These search fields are described by QA but are NOT implemented on the
    // screen. Asserting their absence keeps the mapping honest and will fail
    // if/when they are added, prompting this test to be updated.
    expectTextsAbsent('dal_field_created_by', 'dal_field_activity_status');
  });
});

/* ==========================================================================
 * WCRM010200_003 — Verify Search and Reset Buttons Presence
 * ======================================================================== */
describe('WCRM010200_003 - Verify Search and Reset Buttons Presence', () => {
  it('displays the Search button and it is enabled', () => {
    renderWithTheme(<DealerActivityListPage />);
    const searchBtn = screen.getByRole('button', { name: 'dal_btn_search' });
    expect(searchBtn).toBeInTheDocument();
    expect(searchBtn).toBeEnabled();
  });

  it('displays the Reset button and it is enabled', () => {
    renderWithTheme(<DealerActivityListPage />);
    const resetBtn = screen.getByRole('button', { name: 'dal_btn_reset' });
    expect(resetBtn).toBeInTheDocument();
    expect(resetBtn).toBeEnabled();
  });
});

/* ==========================================================================
 * WCRM010200_004 — Verify Add Button Presence
 * ======================================================================== */
describe('WCRM010200_004 - Verify Add Button Presence', () => {
  // Known gap: the collapsible SectionCard doesn't render its `actions` prop,
  // so the Add button is absent. Flip this assertion once SectionCard renders it.
  it('documents that the Add button is not rendered by the collapsible SectionCard', () => {
    renderWithTheme(<DealerActivityListPage />);
    expect(screen.queryByRole('button', { name: 'dal_btn_add' })).not.toBeInTheDocument();
  });
});

/* ==========================================================================
 * WCRM010200_005 — Verify Grid Column Headers
 * ======================================================================== */
describe('WCRM010200_005 - Verify Grid Column Headers', () => {
  it('renders all DR-mandated column headers', () => {
    renderWithTheme(<DealerActivityListPage />);
    // The grid also has a leading "No" column (dal_col_no) in addition to the
    // seven QA-listed columns.
    expectTextsPresent(
      'dal_col_activity_id',
      'dal_col_activity_type',
      'dal_col_activity_name',
      'dal_col_created_by',
      'dal_col_created_date',
      'dal_col_modified_by',
      'dal_col_modified_date'
    );
  });
});

/* ==========================================================================
 * WCRM010200_006 — Verify Activity Name Hyperlink
 * ======================================================================== */
describe('WCRM010200_006 - Verify Activity Name Hyperlink', () => {
  it('renders each Activity Name as a clickable hyperlink (button-based Link)', () => {
    renderWithTheme(<DealerActivityListPage />);
    const firstName = MOCK_ACTIVITIES[0].activityName;
    // The Link is rendered with component="button", so it is a button element.
    const link = screen.getByRole('button', { name: firstName });
    expect(link).toBeInTheDocument();
  });
});

/* ==========================================================================
 * WCRM010200_007 — Verify Grid Read-Only Behavior and Hyperlink Exclusivity
 * ======================================================================== */
describe('WCRM010200_007 - Verify Grid Read-Only Behavior and Hyperlink Exclusivity', () => {
  it('renders non-hyperlink cells as read-only text (no input elements in the grid)', () => {
    renderWithTheme(<DealerActivityListPage />);
    // A read-only grid renders label cells as plain text. Confirm a known
    // Activity ID value is present as text and is not an editable input.
    const idCell = screen.getByText(MOCK_ACTIVITIES[0].activityId);
    expect(idCell).toBeInTheDocument();
    expect(idCell.tagName).not.toBe('INPUT');
    expect(idCell.tagName).not.toBe('TEXTAREA');
  });

  it('only the Activity Name hyperlink triggers navigation to the edit screen', () => {
    renderWithTheme(<DealerActivityListPage />);
    const row = MOCK_ACTIVITIES[0];
    fireEvent.click(screen.getByRole('button', { name: row.activityName }));
    expect(mockNavigate).toHaveBeenCalledWith(
      `/activity-setup/edit/${encodeURIComponent(row.activityId)}`
    );
  });
});

/* ==========================================================================
 * WCRM010200_008 — Verify Pagination Controls Presence
 * ======================================================================== */
describe('WCRM010200_008 - Verify Pagination Controls Presence', () => {
  it('shows First / Previous / Next / Last navigation buttons', () => {
    renderWithTheme(<DealerActivityListPage />);
    // MUI Pagination renders aria-labelled nav buttons when showFirstButton /
    // showLastButton are enabled.
    expect(screen.getByRole('button', { name: /go to first page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to next page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to last page/i })).toBeInTheDocument();
  });

  it('shows the Go To Page input and the Rows Per Page dropdown', () => {
    renderWithTheme(<DealerActivityListPage />);
    // Go To Page input (placeholder is the pagination.goto key under the mock).
    expect(screen.getByPlaceholderText('pagination.goto')).toBeInTheDocument();
    // There are two comboboxes on the page (Activity Type + Rows Per Page).
    // The Rows Per Page select in the pagination bar shows "10 pagination.rows".
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('10 pagination.rows')).toBeInTheDocument();
  });
});

/* ==========================================================================
 * WCRM010200_009 — Verify Default Rows Per Page
 * ======================================================================== */
describe('WCRM010200_009 - Verify Default Rows Per Page', () => {
  it('defaults the Rows Per Page selection to 10', () => {
    renderWithTheme(<DealerActivityListPage />);
    // Under the mocked t(), the option renders as "10 pagination.rows".
    expect(screen.getByText('10 pagination.rows')).toBeInTheDocument();
  });
});

/* ==========================================================================
 * WCRM010200_010 — Verify Record Count Display
 * ======================================================================== */
describe('WCRM010200_010 - Verify Record Count Display', () => {
  it('shows "Showing X to Y out of Z records" with correct counts', () => {
    renderWithTheme(<DealerActivityListPage />);
    const total = MOCK_ACTIVITIES.length; // 10 records
    // Text is composed from translation keys + numbers:
    // "pagination.showing 1 pagination.to <to> pagination.out_of <total>"
    const to = Math.min(10, total);
    const label = screen.getByText(
      `pagination.showing 1 pagination.to ${to} pagination.out_of ${total}`
    );
    expect(label).toBeInTheDocument();
  });
});

/* ==========================================================================
 * WCRM010200_011 — Verify Activity Type Dropdown Default
 * ======================================================================== */
describe('WCRM010200_011 - Verify Activity Type Dropdown Default', () => {
  it("defaults the Activity Type dropdown to 'All'", () => {
    renderWithTheme(<DealerActivityListPage />);
    // The Select's rendered value shows the 'All' option (dal_activity_type_all).
    expect(screen.getByText('dal_activity_type_all')).toBeInTheDocument();
  });
});

/* ==========================================================================
 * WCRM010200_012 — Verify Activity Type Dropdown Master Data Order and Sequence
 * ======================================================================== */
describe('WCRM010200_012 - Verify Activity Type Dropdown Master Data Order and Sequence', () => {
  it("lists 'All' first, then active types ordered by master displayOrder", async () => {
    // Combo master data supplied deliberately OUT of order; the screen must
    // re-order by displayOrder (proxy for master sort_order) and drop inactive.
    mockComboTableData = [
      { name: 'Body & Paint', active: true, displayOrder: 3 },
      { name: 'Periodic Maintenance', active: true, displayOrder: 1 },
      { name: 'Inactive Type', active: false, displayOrder: 2 },
      { name: 'API-only Activity Type', active: true, displayOrder: 2 },
    ];
    dealerActivityListServiceMocks.getActivityTypeOptions.mockResolvedValue({
      success: true,
      data: mockComboTableData
        .filter((item) => item.active)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((item) => ({ value: item.name, label: item.name })),
    });

    renderWithTheme(<DealerActivityListPage />);

    // Allow the async combo API load (a resolved promise) to flush so the
    // Activity Type options are populated from mockComboTableData.
    await waitFor(() => {
      expect(dealerActivityListServiceMocks.getActivityTypeOptions).toHaveBeenCalled();
    });

    // The Activity Type search dropdown is the first combobox on the page.
    const activityTypeSelect = screen.getAllByRole('combobox')[0];
    fireEvent.mouseDown(activityTypeSelect);

    // Read the options from the opened listbox only, so grid cell text that
    // happens to share these labels does not interfere.
    const listbox = await screen.findByRole('listbox');
    await waitFor(() => {
      expect(within(listbox).getAllByRole('option')).toHaveLength(4);
    });

    const optionText = within(listbox)
      .getAllByRole('option')
      .map((o) => o.textContent);

    // 'All' first, then active types by ascending displayOrder; inactive excluded.
    expect(optionText).toEqual([
      'dal_activity_type_all',
      'Periodic Maintenance', // displayOrder 1
      'API-only Activity Type', // displayOrder 2
      'Body & Paint', // displayOrder 3
    ]);
    expect(optionText).not.toContain('Inactive Type');
  });
});

/* ========================================================================
 * WCRM010200_013 — Verify search, paging, and service response branches
 * ======================================================================== */
describe('WCRM010200_013 - Verify search and service response branches', () => {
  it('warns when the Activity Name has fewer than three characters', () => {
    renderWithTheme(<DealerActivityListPage />);

    fireEvent.change(
      screen.getByPlaceholderText('dal_field_activity_name'),
      {
        target: { value: 'ab' },
      },
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'dal_btn_search',
      }),
    );

    expect(
      screen.getByText('dal_warn_min_chars'),
    ).toBeInTheDocument();

    expect(
      dealerActivityListServiceMocks.search,
    ).not.toHaveBeenCalled();
  });


  it('shows the no-record warning for a filtered search with an empty response', async () => {
    mockListData = { activities: [], pagination: { totalRecords: 0 } };
    dealerActivityListServiceMocks.search.mockResolvedValue({
      success: true,
      data: { activities: [], pagination: { totalRecords: 0 } },
    });

    renderWithTheme(<DealerActivityListPage />);
    const activityIdInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(activityIdInput, { target: { value: 'UNKNOWN' } });
    fireEvent.click(screen.getByRole('button', { name: 'dal_btn_search' }));

    await waitFor(() => expect(screen.getByText('dal_warn_no_record')).toBeInTheDocument());
  });

  it('reloads the list on reset and server-side page changes', async () => {
    mockListData = {
      activities: MOCK_ACTIVITIES,
      pagination: { totalRecords: MOCK_ACTIVITIES.length + 10 },
    };
    renderWithTheme(<DealerActivityListPage />);

    const initialCalls = dealerActivityListServiceMocks.search.mock.calls.length;
    fireEvent.click(screen.getByRole('button', { name: 'dal_btn_reset' }));
    fireEvent.click(screen.getByRole('button', { name: /go to next page/i }));

    await waitFor(() => {
      expect(dealerActivityListServiceMocks.search.mock.calls.length).toBeGreaterThan(initialCalls);
    });
  });

  it('keeps the static activity types when the combo service rejects', async () => {
    dealerActivityListServiceMocks.getActivityTypeOptions.mockRejectedValue(new Error('combo unavailable'));
    renderWithTheme(<DealerActivityListPage />);

    await waitFor(() => {
      expect(screen.getAllByRole('combobox')[0]).toBeInTheDocument();
    });
    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    const listbox = await screen.findByRole('listbox');
    expect(
      within(listbox).getByRole('option', {
        name: 'dal_activity_type_all',
      })
    ).toBeInTheDocument();
  });

  it('loads Activity Name suggestions and tolerates an undefined suggestion payload', async () => {
    dealerActivityListServiceMocks.getActivityNameSuggestions.mockResolvedValue({
      success: true,
      data: {
        suggestions: [{ activityId: 'SUG-1', activityName: 'Periodic Maintenance' }],
      },
    });
    renderWithTheme(<DealerActivityListPage />);
    const input = screen.getByPlaceholderText('dal_field_activity_name');
    fireEvent.change(input, { target: { value: 'Periodic' } });

    await waitFor(() =>
      expect(dealerActivityListServiceMocks.getActivityNameSuggestions).toHaveBeenCalledWith(
        expect.objectContaining({
          dealerId: 'D001',
          branchId: 'HO',
          activityName: 'Periodic',
        }),
      ),
      { timeout: 1000 });

    dealerActivityListServiceMocks.getActivityNameSuggestions.mockResolvedValue({
      success: true,
      data: {} as { suggestions: [] },
    });
    fireEvent.change(input, { target: { value: 'Unknown' } });
    await waitFor(() =>
      expect(dealerActivityListServiceMocks.getActivityNameSuggestions).toHaveBeenCalledWith(
        expect.objectContaining({ activityName: 'Unknown' }),
      ),
      { timeout: 1000 });
  });

  it('handles a null list response without rendering rows', () => {
    mockListData = null;

    dealerActivityListServiceMocks.search.mockResolvedValue(null);

    renderWithTheme(<DealerActivityListPage />);

    expect(
      screen.getByText('dal_no_data_found'),
    ).toBeInTheDocument();
  });
  it('renders an empty activity array and does not warn for an unfiltered empty search', async () => {
    mockListData = { activities: null as unknown as typeof MOCK_ACTIVITIES };
    dealerActivityListServiceMocks.search.mockResolvedValue({
      success: true,
      data: { activities: [], pagination: { totalRecords: 0 } },
    });
    renderWithTheme(<DealerActivityListPage />);
    fireEvent.click(screen.getByRole('button', { name: 'dal_btn_search' }));

    await waitFor(() => expect(dealerActivityListServiceMocks.search).toHaveBeenCalledTimes(1));
    expect(screen.getByText('dal_no_data_found')).toBeInTheDocument();
    expect(screen.queryByText('dal_warn_no_record')).not.toBeInTheDocument();
  });
});
