/**
 * [WCRM010200] Dealer Activity List
 * Behaviour implemented per the DR:
 *  - Default API sort: Activity Name (DESC) then Activity ID (ASC)
 *  - Activity Type dropdown defaults to "All"
 *  - Search filters across all records; resets pagination to page 1
 *  - Activity Name wild-card search requires at least 3 characters
 *  - 10 rows per page by default; "No Data Found" when empty
 *  - Add navigates to the Setup Activity by Dealer screen (Add mode)
 *  - Activity Name hyperlink navigates to the same screen (Edit mode)
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Link,
  ToastNotification,
  SearchAutocomplete,
  AddIcon,
  SearchIcon,
  RefreshIcon,
} from '@components/common';
import { PageContainer, PageFooter, PageHeader, SectionCard } from '@components/layout';
import { TopTable, useTablePaginationAndSort } from '@components/table';
import type { ICropColumn } from '@components/table';
import { useTranslation, useApi } from '@hooks';
import { useAppSelector } from '@store';
import { DEFAULT_ROWS_PER_PAGE } from '@constants';
import { dealerActivityListStyles as styles } from './dealerActivityList.styles';
import dealerActivityListService from './services/dealerActivityListService';
import {
  ACTIVITY_TYPES,
  ACTIVITY_TYPE_ALL,
  buildSearchFilter,
  getTotalRecords,
  DEFAULT_SORT_FIELDS,
  type ActivityRecord,
  type ActivitySearchRequest,
  type ActivitySearchData,
  type ActivityNameSuggestion,
} from './dealerActivityList.type';

const s = styles.page;

const MIN_NAME_SEARCH_CHARS = 3;

const DealerActivityListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Dealer/branch context for the current session (falls back to app defaults).
  const dealerId = useAppSelector((state) => state.config.dealer.code);
  const branchId = 'HO';

  // Header (search) section state
  const [activityId, setActivityId] = useState('');
  const [activityType, setActivityType] = useState(ACTIVITY_TYPE_ALL);
  const [activityName, setActivityName] = useState('');

  // The search criteria currently applied to the grid. Kept separate from the
  // input state so pagination/sort re-query with the last *applied* filter,
  // not whatever the user is mid-typing.
  const [appliedCriteria, setAppliedCriteria] = useState({
    activityId: '',
    activityType: ACTIVITY_TYPE_ALL,
    activityName: '',
  });

  // Toast for validation warnings (WRN0008 / WRN0009)
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'warning' | 'info'>('warning');

  // Table state (server sort + server pagination; the backend owns filtering/ordering).
  const table = useTablePaginationAndSort<ActivityRecord>({ initialRowsPerPage: DEFAULT_ROWS_PER_PAGE });

  // API hook to load the Activity list from the backend (GET /wcrm010200/search).
  const listApi = useApi<ActivitySearchData>({
    context: 'DealerActivityListPage',
    showErrorToast: true,
  });

  // Server-reported total row count, used to drive server-side pagination.
  const [totalCount, setTotalCount] = useState(0);

  // Activity Type dropdown options, loaded from the combo API.
  // Falls back to the static master list until the combo API is deployed.
  const [activityTypeOptions, setActivityTypeOptions] =
    useState<{ value: string; label: string }[]>([]);

  /**
   * Query the search endpoint with the given criteria and 0-based page/size.
   * Maps the standard ApiResponse envelope ({ data: { activities }, totalCount })
   * onto the grid, and keeps `appliedCriteria` in sync so paging/sort re-query
   * with the same filter.
   */
  const fetchActivities = (
    criteria: { activityId: string; activityType: string; activityName: string },
    pageIndex: number,
    size: number
  ) => {
    const request: ActivitySearchRequest = {
      filter: buildSearchFilter({
        dealerId,
        branchId,
        activityId: criteria.activityId,
        activityType: criteria.activityType,
        activityName: criteria.activityName,
      }),
      sortFields: DEFAULT_SORT_FIELDS,
      page: pageIndex,
      size,
    };

    return listApi
      .execute(() => dealerActivityListService.search(request))
      .then((response) => {
        // On success, render the server payload. The total row count is nested
        // inside `data.pagination.totalRecords` (with `gridTotalRecords` as a
        // fallback), not on the outer envelope.
        if (response?.data) {
          setTotalCount(getTotalRecords(response.data));
          return response;
        }

        return response;
      });
  };
type ActivityTypeComboResponse = {
  tableData?: Array<{ code: string; name: string }>;
};
 
  // Load the Activity list from the API on mount (onLoad = unfiltered search).
  useEffect(() => {
    let cancelled = false;

    dealerActivityListService
      .getActivityTypeOptions()
      .then((response) => {
        const comboResponse = response as unknown as ActivityTypeComboResponse;
        console.log(comboResponse)
        const options = (comboResponse?.tableData ?? []).map(
          (item: { code: string; name: string }) => ({
            value: item.code,
            label: item.name,
          })
        );

        if (!cancelled) {
          setActivityTypeOptions(options);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setActivityTypeOptions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Load Activity Type dropdown values from the combo API on mount.
  // The combo endpoint returns { data, tableData, ... } (not the standard
  // envelope), so it is called directly. Value and label are the same string.
  useEffect(() => {
    let cancelled = false;
    dealerActivityListService.getActivityTypeOptions().then((response) => {
      const options = response.data ?? [];
      if (!cancelled && options.length > 0) {
        setActivityTypeOptions(options);
      }
    })
      .catch(() => {
        // API not deployed yet / failed — keep the static fallback list.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // When the API response arrives, render the returned page of activities and
  // record the server-side total. The backend already applies the DR default
  // ordering, so no client re-sort is needed.
  useEffect(() => {
    if (!listApi.data) return;
    const activities = listApi.data.activities ?? [];
    table.setRows(activities);
    // Keep the server-side total in sync with the rendered page. Prefer the
    // pagination total from the payload; fall back to the number of rows
    // returned so the pagination bar renders as soon as data is available.
    setTotalCount(getTotalRecords(listApi.data) || activities.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listApi.data]);

  /**
   * Load Activity Name suggestions for the auto-suggest box. Injected into the
   * reusable SearchAutocomplete; returns the { activityId, activityName } list
  * from GET /v1/WCRM010200-SUGGESTION_LIST. Failures resolve to an
   * empty list so the field degrades gracefully.
   */
  const fetchActivityNameSuggestions = (query: string): Promise<ActivityNameSuggestion[]> => {
    // Guard against a hanging request (e.g. mock server not running / proxy
    // not responding): if the API doesn't settle in time, resolve to no results
    // so the suggestion box never gets stuck on the loading state.
    const timeout = new Promise<ActivityNameSuggestion[]>((resolve) => {
      setTimeout(() => resolve([]), 2500);
    });

    const request = dealerActivityListService
      .getActivityNameSuggestions(
        buildSearchFilter({
          dealerId,
          branchId,
          activityId: '',
          activityType: ACTIVITY_TYPE_ALL,
          activityName: query,
        })
      )
      .then((response) => {
        const suggestions = response?.data?.suggestions;
        return suggestions ?? [];
      })
      .catch(() => []);

    return Promise.race([request, timeout]);
  };

  const showWarn = (message: string, severity: 'warning' | 'info' = 'warning') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  /** Apply the current search criteria via the server (resets to page 1). */
  const handleSearch = () => {
    const name = activityName.trim();

    // WRN0008: wild-card search needs at least 3 characters.
    if (name.length > 0 && name.replace(/\*/g, '').length > 0 && name.length < MIN_NAME_SEARCH_CHARS) {
      showWarn(t('dal_warn_min_chars'));
      return;
    }

    const criteria = { activityId, activityType, activityName };
    setAppliedCriteria(criteria);
    table.setPage(0);

    // Search resets pagination to the first page.
    fetchActivities(criteria, 0, table.rowsPerPage).then((response) => {
      // WRN0009: entered criteria but nothing matched.
      const hasCriteria =
        activityId.trim() !== '' ||
        activityType !== ACTIVITY_TYPE_ALL ||
        name.replace(/\*/g, '') !== '';
      if (hasCriteria && getTotalRecords(response?.data) === 0) {
        showWarn(t('dal_warn_no_record'), 'info');
      }
    });
  };

  /** Clear all search criteria and reload the default (unfiltered) list. */
  const handleReset = () => {
    setActivityId('');
    setActivityType(ACTIVITY_TYPE_ALL);
    setActivityName('');
    const criteria = { activityId: '', activityType: ACTIVITY_TYPE_ALL, activityName: '' };
    setAppliedCriteria(criteria);
    table.setPage(0);
    fetchActivities(criteria, 0, table.rowsPerPage);
  };

  /** Re-query the current applied criteria when the page changes. */
  const handleChangePage = (event: unknown, newPage: number) => {
    table.handleChangePage(event, newPage);
    fetchActivities(appliedCriteria, newPage, table.rowsPerPage);
  };

  /** Re-query from page 1 when the rows-per-page changes. */
  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    table.handleChangeRowsPerPage(event);
    const size = Number.parseInt(event.target.value, 10);
    fetchActivities(appliedCriteria, 0, size);
  };

  const handleAdd = () => navigate('/activity-setup/add');

  const handleEdit = (row: ActivityRecord) =>
    navigate(`/activity-setup/edit/${encodeURIComponent(row.activityId)}`);

  // ===== Grid columns (per DR: NO, ACTIVITY ID, ACTIVITY TYPE, ACTIVITY NAME,
  // CREATED BY, CREATED DATE, MODIFIED BY, MODIFIED DATE) =====
  const columns: ICropColumn<ActivityRecord>[] = useMemo(
    () => [
      {
        id: 'rowNo',
        label: t('dal_col_no'),
        fieldtype: 'label',
        align: 'center',
        headerAlign: 'center',
        width: 60,
        isSortingRequired: false,
        render: (_v, _row, index) => table.page * table.rowsPerPage + index + 1,
      },
      {
        id: 'activityId',
        label: t('dal_col_activity_id'),
        fieldtype: 'label',
        cellType: 'String',
        isSortingRequired: false,
        headerMinWidth: 120,
      },
      {
        id: 'activityType',
        label: t('dal_col_activity_type'),
        fieldtype: 'label',
        cellType: 'String',
        isSortingRequired: true,
        headerMinWidth: 180,
      },
      {
        id: 'activityName',
        label: t('dal_col_activity_name'),
        fieldtype: 'custom',
        cellType: 'String',
        isSortingRequired: true,
        headerMinWidth: 240,
        render: (_v, row) => (
          <Link component="button" type="button" onClick={() => handleEdit(row)} sx={s.activityNameLink}>
            {row.activityName}
          </Link>
        ),
      },
      {
        id: 'createdBy',
        label: t('dal_col_created_by'),
        fieldtype: 'label',
        cellType: 'String',
        isSortingRequired: false,
        headerMinWidth: 140,
      },
      {
        id: 'createdDate',
        label: t('dal_col_created_date'),
        fieldtype: 'label',
        cellType: 'Date',
        isSortingRequired: false,
        headerMinWidth: 140,
      },
      {
        id: 'modifiedBy',
        label: t('dal_col_modified_by'),
        fieldtype: 'label',
        cellType: 'String',
        isSortingRequired: false,
        headerMinWidth: 140,
      },
      {
        id: 'modifiedDate',
        label: t('dal_col_modified_date'),
        fieldtype: 'label',
        cellType: 'Date',
        isSortingRequired: false,
        headerMinWidth: 140,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, table.page, table.rowsPerPage]
  );

  return (
    <PageContainer>
      <PageHeader
        title={t('dal_page_title')}
        breadcrumbs={[
          { label: t('dal_breadcrumb_activity_setup'), path: '/activity-setup' },
          { label: t('dal_breadcrumb_activity_list') },
        ]}
      />

      <Box sx={s.columnGap}>
        {/* ===== Activity Search Section ===== */}
        <SectionCard title={t('dal_search_section')}>
          <Grid container spacing={2} sx={s.searchGrid}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography component="label" sx={s.fieldLabel}>
                {t('dal_field_activity_id')}
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 10 } }}
                sx={s.input}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography component="label" sx={s.fieldLabel}>
                {t('dal_field_activity_type')}
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={activityType} onChange={(e) => setActivityType(String(e.target.value))} sx={s.input}>
                  <MenuItem value="all">{t('dal_activity_type_all')}</MenuItem>
                  {activityTypeOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography component="label" sx={s.fieldLabel}>
                {t('dal_field_activity_name')}
              </Typography>
              <SearchAutocomplete<ActivityNameSuggestion>
                value={activityName}
                onInputChange={setActivityName}
                onSelect={(option) => setActivityName(option?.activityName ?? '')}
                onEnter={handleSearch}
                fetchSuggestions={fetchActivityNameSuggestions}
                getOptionLabel={(option) => option.activityName}
                getOptionKey={(option) => option.activityId}
                minChars={MIN_NAME_SEARCH_CHARS}
                maxLength={250}
                showSearchIcon={false}
                placeholder={t('dal_field_activity_name')}
                loadingText={t('dal_suggest_loading')}
                noOptionsText={t('dal_suggest_no_match')}
                sx={s.input}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={s.searchActions}>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleReset} sx={s.resetButton}>
                  {t('dal_btn_reset')}
                </Button>
                <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} sx={s.searchButton}>
                  {t('dal_btn_search')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </SectionCard>

        {/* ===== Activity List Section ===== */}
        <SectionCard
          title={t('dal_list_section')}
          actions={
            <Button startIcon={<AddIcon />} onClick={handleAdd} sx={s.addButton}>
              {t('dal_btn_add')}
            </Button>
          }
        >
          <TopTable<ActivityRecord>
            rows={table.rows}
            headerCell={columns}
            primaryKey="activityId"
            orderBy={table.orderBy}
            orderDir={table.orderDir}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            editRowIndex={table.editRowIndex}
            isClientSort={false}
            isClientFilter={false}
            isServerPagination
            totalCount={totalCount}
            handleSort={table.handleSort}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            onFilterChange={table.onFilterChange}
            emptyMessage={t('dal_no_data_found')}
            stickyHeader
            maxTableHeight={520}
          />
        </SectionCard>
      </Box>
      <PageFooter />

      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />
    </PageContainer>
  );
};

export default DealerActivityListPage;
