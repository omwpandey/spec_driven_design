import React from 'react';
import { InputAdornment as MuiInputAdornment, InputAdornmentProps as MuiInputAdornmentProps } from '@mui/material';

export interface InputAdornmentProps extends MuiInputAdornmentProps {
  children?: React.ReactNode;
}

const InputAdornment: React.FC<InputAdornmentProps> = ({ children, ...props }) => {
  return <MuiInputAdornment {...props}>{children}</MuiInputAdornment>;
};

export default InputAdornment;
