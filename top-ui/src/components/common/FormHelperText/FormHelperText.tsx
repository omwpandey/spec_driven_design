import React from 'react';
import { FormHelperText as MuiFormHelperText, FormHelperTextProps as MuiFormHelperTextProps } from '@mui/material';

export interface FormHelperTextProps extends MuiFormHelperTextProps {
  children?: React.ReactNode;
}

const FormHelperText: React.FC<FormHelperTextProps> = ({ children, ...props }) => {
  return <MuiFormHelperText {...props}>{children}</MuiFormHelperText>;
};

export default FormHelperText;
