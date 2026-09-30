import React from 'react';
import { FormControlLabel as MuiFormControlLabel, FormControlLabelProps as MuiFormControlLabelProps } from '@mui/material';

export type FormControlLabelProps = MuiFormControlLabelProps;

const FormControlLabel: React.FC<FormControlLabelProps> = (props) => {
  return <MuiFormControlLabel {...props} />;
};

export default FormControlLabel;
