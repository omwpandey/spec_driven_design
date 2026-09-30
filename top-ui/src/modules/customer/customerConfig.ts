import { CrudConfig } from '@core/crud';

/**
 * Customer CRUD Configuration
 * 
 * This demonstrates how to create a full CRUD screen with
 * less than 50 lines of business code using the framework.
 */
export const customerConfig: CrudConfig = {
  resource: 'customers',
  endpoint: '/customers',
  title: 'Customer Management',
  pageSize: 10,
  defaultSort: { field: 'customerName', order: 'asc' },
  permissions: {
    create: 'CUSTOMER_ADD',
    read: 'CUSTOMER_VIEW',
    update: 'CUSTOMER_EDIT',
    delete: 'CUSTOMER_DELETE',
  },
  features: {
    create: true,
    edit: true,
    delete: true,
    export: true,
    search: true,
    filter: true,
    pagination: true,
  },
  fields: [
    {
      name: 'customerName',
      label: 'Customer Name',
      type: 'text',
      required: true,
      maxLength: 200,
      searchable: true,
      sortable: true,
      gridSize: { xs: 12, sm: 6, md: 4 },
    },
    {
      name: 'mobile',
      label: 'Mobile',
      type: 'text',
      required: true,
      maxLength: 20,
      searchable: true,
      gridSize: { xs: 12, sm: 6, md: 4 },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      maxLength: 100,
      gridSize: { xs: 12, sm: 6, md: 4 },
    },
    {
      name: 'type',
      label: 'Customer Type',
      type: 'select',
      required: true,
      options: [
        { value: 'individual', label: 'Individual' },
        { value: 'corporate', label: 'Corporate' },
      ],
      gridSize: { xs: 12, sm: 6, md: 4 },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      gridSize: { xs: 12, sm: 6, md: 4 },
    },
  ],
};
