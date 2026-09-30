import React from 'react';
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from '@mui/material';

interface TooltipProps {
  title: string;
  children: React.ReactElement;
  placement?: MuiTooltipProps['placement'];
  arrow?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  placement = 'top',
  arrow = true,
}) => {
  return (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow={arrow}
      slotProps={{
        tooltip: {
          sx: {
            fontSize: '0.75rem',
            backgroundColor: '#333333',
            borderRadius: '8px',
            px: 1.5,
            py: 0.75,
          },
        },
        arrow: {
          sx: { color: '#333333' },
        },
      }}
    >
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
