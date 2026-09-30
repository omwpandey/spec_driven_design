import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  AddIcon,
  SearchIcon,
  ExportIcon,
} from '@components/common';
import { useNavigate } from 'react-router-dom';
import { PageContainer, PageHeader } from '@components/layout';
import { TopTable } from '@components/table';
import type { ICropColumn } from '@components/table';
import { ConfirmDialog } from '@components/common';
import { apiService } from '@services';
import { usePermission } from '@hooks/usePermission';
import { CrudConfig } from './types';

interface CrudListPageProps {
  config: CrudConfig;
}

type CrudRow = Record<string, unknown>;

/**
 * Standardized query state model for server-side operations
 */
interface QueryState {
  page: number;
  pageSize: number;
  sort?: { field: string; order: 'asc' | 'desc' };
  search?: string;
}

const CrudListPage: React.FC<CrudListPageProps> = ({ config }) => {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [data, setData] = useState<CrudRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  // Unified query state
  const [query, setQuery] = useState<QueryState>({
    page: 0,
    pageSize: config.pageSize || 10,
    sort: config.defaultSort,
    search: undefined,
  });

  const features = config.features || { create: true, edit: true, delete: true, search: true, pagination: true };

  // Permission-based feature flags
  const canCreate = features.create && (!config.permissions?.create || hasPermission(config.permissions.create));
  const canEdit = features.edit && (!config.permissions?.update || hasPermission(config.permissions.update));
  const canDelete = features.delete && (!config.permissions?.delete || hasPermission(config.permissions.delete));
  const canView = !config.permissions?.read || hasPermission(config.permissions.read);

  // Build iCROP columns from the CRUD field config.
  const columns: ICropColumn<CrudRow>[] = useMemo(() => {
    const cols: ICropColumn<CrudRow>[] = config.fields
      .filter((f) => f.visibleInTable !== false)
      .map((field) => ({
        id: field.name,
        label: field.label,
        fieldtype: 'label',
        // Server-side sorting: enable per column, TopTable routes the click
        // through handleSort (see isClientSort={false}).
        isSortingRequired: field.sortable !== false,
        render: field.render
          ? (value, row) => field.render!(value, row)
          : undefined,
      }));

    // Add action column if user has edit or delete permission
    if (canEdit || canDelete) {
      cols.push({
        id: 'actions',
        label: 'Actions',
        fieldtype: 'action',
        align: 'center',
        isSortingRequired: false,
        renderActions: (row) => (
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
            {canEdit && (
              <Button
                size="small"
                variant="text"
                onClick={() => navigate(`/${config.resource}/edit/${(row as CrudRow).id}`)}
              >
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                size="small"
                variant="text"
                color="error"
                onClick={() => setDeleteId(String((row as CrudRow).id))}
              >
                Delete
              </Button>
            )}
          </Box>
        ),
      });
    }

    return cols;
  }, [config.fields, config.resource, canEdit, canDelete, navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: query.page + 1,
        pageSize: query.pageSize,
      };

      // Wire sort to API
      if (query.sort) {
        params.sortField = query.sort.field;
        params.sortOrder = query.sort.order;
      }

      // Wire search to API
      if (query.search) {
        params.search = query.search;
      }

      const response = await apiService.get<CrudRow[]>(config.endpoint, params);
      setData(response.data);
      setTotalCount(response.totalCount || 0);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [config.endpoint, query]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiService.delete(config.endpoint, deleteId);
      setDeleteId(null);
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  // TopTable server sort: handleSort(event, property). Toggle asc/desc.
  const handleSortChange = (_event: unknown, field: string) => {
    setQuery((prev) => {
      const isAsc = prev.sort?.field === field && prev.sort.order === 'asc';
      return { ...prev, sort: { field, order: isAsc ? 'desc' : 'asc' }, page: 0 };
    });
  };

  const handleSearch = (search: string) => {
    setSearchText(search);
    setQuery((prev) => ({ ...prev, search: search || undefined, page: 0 }));
  };

  const handlePageChange = (_event: unknown, page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  const handleRowsPerPageChange = (payload: { target: { value: string | number } }) => {
    const pageSize = Number.parseInt(String(payload.target.value), 10);
    setQuery((prev) => ({ ...prev, pageSize, page: 0 }));
  };

  const handleExportCsv = () => {
    const visibleFields = config.fields.filter((f) => f.visibleInTable !== false);
    const headers = visibleFields.map((f) => f.label).join(',');
    const rows = data.map((row) =>
      visibleFields
        .map((f) => `"${String(row[f.name] ?? '').replaceAll('"', '""')}"`)
        .join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.resource}-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Block access if no view permission
  if (!canView) {
    return (
      <PageContainer>
        <PageHeader title="Access Denied" breadcrumbs={[{ label: 'Access Denied' }]} />
        <Box sx={{ mt: 2, textAlign: 'center', color: '#999' }}>
          You do not have permission to access this page.
        </Box>
      </PageContainer>
    );
  }

  const showToolbar = features.search || features.export;

  return (
    <PageContainer>
      <PageHeader
        title={config.title}
        breadcrumbs={[{ label: config.title }]}
        actions={
          canCreate ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/${config.resource}/add`)}
            >
              Add New
            </Button>
          ) : undefined
        }
      />

      {/* Toolbar: global search + CSV export. TopTable has no built-in
          search/export, so these are rendered here to preserve behavior. */}
      {showToolbar && (
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          {features.search ? (
            <TextField
              size="small"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ width: 250 }}
            />
          ) : (
            <span />
          )}
          {features.export && (
            <Button size="small" startIcon={<ExportIcon />} onClick={handleExportCsv} variant="outlined">
              CSV
            </Button>
          )}
        </Box>
      )}

      <Box sx={{ mt: 2, position: 'relative' }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 10,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        )}
        <TopTable<CrudRow>
          headerCell={columns}
          rows={data}
          primaryKey="id"
          orderBy={query.sort?.field ?? ''}
          orderDir={query.sort?.order ?? ''}
          page={query.page}
          rowsPerPage={query.pageSize}
          editRowIndex={{}}
          totalCount={totalCount}
          isServerPagination
          isClientSort={false}
          isClientFilter={false}
          hidePagination={features.pagination === false}
          bordered
          handleSort={handleSortChange}
          handleChangePage={handlePageChange}
          handleChangeRowsPerPage={handleRowsPerPageChange}
          onFilterChange={() => {}}
        />
      </Box>

      <ConfirmDialog
        open={!!deleteId}
        title="DELETE RECORD"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="DELETE"
        cancelText="NO"
        variant="danger"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </PageContainer>
  );
};

export default CrudListPage;
