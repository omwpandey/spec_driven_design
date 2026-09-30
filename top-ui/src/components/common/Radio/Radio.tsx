import React from 'react';
import { Radio as MuiRadio, RadioProps as MuiRadioProps } from '@mui/material';

export interface RadioProps extends MuiRadioProps {}

const Radio: React.FC<RadioProps> = (props) => {
  return <MuiRadio {...props} />;
};

export default Radio;
