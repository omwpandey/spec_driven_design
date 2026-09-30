import React from 'react';
import { InputBase as MuiInputBase, InputBaseProps as MuiInputBaseProps } from '@mui/material';

export interface InputBaseProps extends MuiInputBaseProps {}

const InputBase = React.forwardRef<HTMLDivElement, InputBaseProps>((props, ref) => {
  return <MuiInputBase ref={ref} {...props} />;
});

InputBase.displayName = 'InputBase';

export default InputBase;
