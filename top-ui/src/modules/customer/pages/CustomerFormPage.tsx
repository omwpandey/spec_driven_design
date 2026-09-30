import React from 'react';
import { CrudFormPage } from '@core/crud';
import { customerConfig } from '../customerConfig';

/**
 * Customer Add/Edit/View Page
 * 
 * Form with validation, API integration, routing - all from config.
 */
interface CustomerFormPageProps {
  mode?: 'create' | 'edit' | 'view';
}

const CustomerFormPage: React.FC<CustomerFormPageProps> = ({ mode = 'create' }) => {
  return <CrudFormPage config={customerConfig} mode={mode} />;
};

export default CustomerFormPage;
