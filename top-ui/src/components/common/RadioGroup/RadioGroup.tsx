import React from 'react';
import { RadioGroup as MuiRadioGroup, RadioGroupProps as MuiRadioGroupProps } from '@mui/material';

export interface RadioGroupProps extends MuiRadioGroupProps {
  children?: React.ReactNode;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ children, ...props }) => {
  return <MuiRadioGroup {...props}>{children}</MuiRadioGroup>;
};

export default RadioGroup;
