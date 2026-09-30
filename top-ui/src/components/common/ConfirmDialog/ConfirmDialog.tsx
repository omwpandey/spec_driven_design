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
import { confirmDialogStyles as s } from './ConfirmDialog.styles';
import { useTranslation } from '@/hooks/useTranslation';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'error' | 'warning';
  variant?: 'default' | 'danger';
  buttonAlign?: 'left' | 'center' | 'right';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'YES',
  cancelText = 'NO',
  variant = 'default',
  buttonAlign = 'right',
  onConfirm,
  onCancel,
}) => {
  const isDanger = variant === 'danger';
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      disableScrollLock
      sx={s.dialog}
      slotProps={{ paper: { sx: s.paper } }}
    >
      {/* Header */}
      <Box sx={s.header(isDanger)}>
        <Typography sx={s.title(isDanger)}>{title}</Typography>
        <IconButton onClick={onCancel} size="small" sx={s.closeBtn(isDanger)}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <DialogContent sx={s.content}>
        {typeof message === 'string' ? (
          <Typography sx={s.message}>{message}</Typography>
        ) : (
          message
        )}
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={s.actions(buttonAlign)}>
        <Button onClick={onCancel} variant="outlined" sx={s.cancelBtn}>
          {cancelText ?? t('no_btn')}
        </Button>
        <Button onClick={onConfirm} variant="contained" sx={s.confirmBtn}>
          {confirmText ?? t('yes_btn')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
