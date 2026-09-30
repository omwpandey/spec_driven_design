import React from 'react';
import { CrudListPage } from '@core/crud';
import { customerConfig } from '../customerConfig';

/**
 * Customer List Page
 * 
 * Full CRUD list with search, pagination, sort, export, edit, delete
 * Generated entirely from configuration - zero custom UI code needed.
 */
const CustomerListPage: React.FC = () => {
  return <CrudListPage config={customerConfig} />;
};

export default CustomerListPage;
