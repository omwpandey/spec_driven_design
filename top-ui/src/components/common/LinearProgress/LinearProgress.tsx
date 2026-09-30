import React from 'react';
import { LinearProgress as MuiLinearProgress, LinearProgressProps as MuiLinearProgressProps } from '@mui/material';

export interface LinearProgressProps extends MuiLinearProgressProps {}

const LinearProgress: React.FC<LinearProgressProps> = (props) => {
  return <MuiLinearProgress {...props} />;
};

export default LinearProgress;
