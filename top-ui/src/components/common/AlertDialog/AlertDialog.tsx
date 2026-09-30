import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { CloseIcon } from '../Icon';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertDialogProps {
  open: boolean;
  type?: AlertType;
  title: string;
  message: string | React.ReactNode;
  buttonText?: string;
  onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  message,
  buttonText = 'OK',
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      disableScrollLock
      PaperProps={{
        sx: {
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* Header - white background, red title text, black X button, bottom border */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          px: 2.5,
          py: 1.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <Typography
          sx={{
            color: '#EB0A1E',
            fontWeight: 700,
            fontSize: '1.125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#FFFFFF',
            backgroundColor: '#000000',
            width: 28,
            height: 28,
            '&:hover': {
              backgroundColor: '#333333',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <DialogContent sx={{ px: 2.5, py: 3 }}>
        {typeof message === 'string' ? (
          <Typography sx={{ fontSize: '0.875rem', color: '#333333', lineHeight: 1.7 }}>
            {message}
          </Typography>
        ) : (
          message
        )}
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 0, justifyContent: 'flex-end' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#EB0A1E',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            minWidth: 70,
            minHeight: 38,
            borderRadius: '8px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#C50818',
              boxShadow: 'none',
            },
          }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
