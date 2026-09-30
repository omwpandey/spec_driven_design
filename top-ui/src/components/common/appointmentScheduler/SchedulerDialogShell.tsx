import React from 'react';
import { Dialog, DialogContent } from '../Dialog';
import Box from '../Box';
import Typography from '../Typography';
import IconButton from '../IconButton';
import { CloseIcon } from '../Icon';
import { colors } from '@core/theme';

interface SchedulerDialogShellProps {
  open: boolean;
  title: string;
  onClose: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * SchedulerDialogShell
 *
 * Shared modal chrome for the Branch Holiday Master dialogs: a white header
 * with an uppercase red title and a grey close button, matching the design.
 * The body/actions are provided as children.
 */
const SchedulerDialogShell: React.FC<SchedulerDialogShellProps> = ({
  open,
  title,
  onClose,
  maxWidth = 'sm',
  children,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth={maxWidth}
    fullWidth
    disableScrollLock
    slotProps={{
      paper: {
        sx: {
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
        },
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 1.75,
        borderBottom: `1px solid ${colors.border.light}`,
      }}
    >
      <Typography
        sx={{
          color: colors.primary.main,
          fontWeight: 700,
          fontSize: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2px',
        }}
      >
        {title}
      </Typography>
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="Close"
        sx={{
          color: colors.text.secondary,
          width: 26,
          height: 26,
          borderRadius: '6px',
          '&:hover': { backgroundColor: colors.background.default },
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
    <DialogContent sx={{ px: 3, pb: 3, pt: 2.5 }}>{children}</DialogContent>
  </Dialog>
);

export default SchedulerDialogShell;
