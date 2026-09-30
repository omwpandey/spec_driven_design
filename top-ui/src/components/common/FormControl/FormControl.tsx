import React from 'react';
import { FormControl as MuiFormControl, FormControlProps as MuiFormControlProps } from '@mui/material';

export interface FormControlProps extends MuiFormControlProps {
  children?: React.ReactNode;
}

const FormControl: React.FC<FormControlProps> = ({ children, ...props }) => {
  return <MuiFormControl {...props}>{children}</MuiFormControl>;
};

export default FormControl;
