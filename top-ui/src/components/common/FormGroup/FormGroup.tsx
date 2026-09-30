import React from 'react';
import { FormGroup as MuiFormGroup, FormGroupProps as MuiFormGroupProps } from '@mui/material';

export interface FormGroupProps extends MuiFormGroupProps {
  children?: React.ReactNode;
}

const FormGroup: React.FC<FormGroupProps> = ({ children, ...props }) => {
  return <MuiFormGroup {...props}>{children}</MuiFormGroup>;
};

export default FormGroup;
