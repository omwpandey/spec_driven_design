import React from 'react';
import { OutlinedInput as MuiOutlinedInput, OutlinedInputProps as MuiOutlinedInputProps } from '@mui/material';

export type OutlinedInputProps = MuiOutlinedInputProps;

const OutlinedInput = React.forwardRef<HTMLDivElement, OutlinedInputProps>((props, ref) => {
  return <MuiOutlinedInput ref={ref} {...props} />;
});

OutlinedInput.displayName = 'OutlinedInput';

export default OutlinedInput;
