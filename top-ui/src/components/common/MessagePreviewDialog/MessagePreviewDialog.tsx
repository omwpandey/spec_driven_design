import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
} from '@mui/material';
import { CloseIcon } from '../Icon';

interface MessagePreviewDialogProps {
  open: boolean;
  title: string;
  channelLabel?: string;
  message: string;
  maxLength?: number;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const MessagePreviewDialog: React.FC<MessagePreviewDialogProps> = ({
  open,
  title,
  channelLabel,
  message,
  maxLength,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'CANCEL',
}) => {
  const displayLabel = channelLabel || title;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableScrollLock
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
          paddingTop: '20vh',
        },
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
            minWidth: '480px',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          px: 2.5,
          py: 2,
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
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#666666',
            backgroundColor: '#E0E0E0',
            width: 32,
            height: 32,
            borderRadius: '6px',
            '&:hover': { backgroundColor: '#BDBDBD' },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <DialogContent sx={{ px: 2.5, py: 3 }}>
        {/* Channel label with char count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#333' }}>
            {displayLabel}
          </Typography>
          {maxLength && (
            <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>
              {message.length} / {maxLength}
            </Typography>
          )}
        </Box>

        {/* Message content */}
        <TextField
          fullWidth
          multiline
          rows={5}
          value={message}
          slotProps={{ input: { readOnly: true } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '0.875rem',
              lineHeight: 1.6,
              backgroundColor: '#FFFFFF',
            },
          }}
        />
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 0, justifyContent: 'flex-end', gap: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: '#E0E0E0',
            color: '#333333',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            minWidth: 100,
            minHeight: 40,
            borderRadius: '8px',
            px: 3,
            '&:hover': { borderColor: '#BDBDBD', backgroundColor: '#F5F5F5' },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm || onClose}
          variant="contained"
          sx={{
            backgroundColor: '#EB0A1E',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            minWidth: 100,
            minHeight: 40,
            borderRadius: '8px',
            px: 3,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#C50818', boxShadow: 'none' },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessagePreviewDialog;
