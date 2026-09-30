import React from 'react';
import { Button, IconButton, ButtonProps, Box } from '@mui/material';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  SaveIcon,
  BackIcon,
  DownloadIcon,
  UploadIcon,
  RefreshIcon,
  CancelIcon,
  FilterIcon,
} from '../Icon';
import { colors } from '@core/theme';

/**
 * TOPSCRM Button Positioning Standard:
 * 
 * LEFT SIDE = Contextual Actions (Browse, Upload)
 * RIGHT SIDE = Global Actions in order:
 *   Delete → Utility (Download/Edit/Filter) → Cancel → Add → Save (rightmost)
 * 
 * Spacing: 10px between buttons
 * Primary action (Save): rightmost position
 * Font: 14px SemiBold
 */

// Primary Button (Save - rightmost in right group)
export const PrimaryButton: React.FC<ButtonProps & { label: string }> = ({ label, ...props }) => (
  <Button
    variant="contained"
    size="small"
    sx={{
      backgroundColor: colors.primary.main,
      '&:hover': { backgroundColor: colors.primary.dark },
      textTransform: 'none',
      fontSize: '0.875rem',
      fontWeight: 600,
      minHeight: 36,
      px: 2,
    }}
    {...props}
  >
    {label}
  </Button>
);

// Secondary Button
export const SecondaryButton: React.FC<ButtonProps & { label: string }> = ({ label, ...props }) => (
  <Button
    variant="outlined"
    size="small"
    sx={{
      borderColor: colors.border.main,
      color: colors.text.primary,
      textTransform: 'none',
      fontSize: '0.875rem',
      fontWeight: 600,
      minHeight: 36,
      px: 2,
      '&:hover': { borderColor: colors.border.dark },
    }}
    {...props}
  >
    {label}
  </Button>
);

// Delete Button (first in right group - destructive)
export const DeleteButton: React.FC<ButtonProps & { label?: string }> = ({ label = 'Delete', ...props }) => (
  <Button
    variant="outlined"
    size="small"
    color="error"
    startIcon={<DeleteIcon sx={{ fontSize: '16px !important' }} />}
    sx={{
      textTransform: 'none',
      fontSize: '0.875rem',
      fontWeight: 600,
      minHeight: 36,
      px: 2,
      borderColor: colors.status.error,
      color: colors.status.error,
    }}
    {...props}
  >
    {label}
  </Button>
);

// Save Button (Primary - rightmost)
export const SaveButton: React.FC<ButtonProps & { label?: string }> = ({ label = 'Save', ...props }) => (
  <Button
    variant="contained"
    size="small"
    startIcon={<SaveIcon sx={{ fontSize: '16px !important' }} />}
    sx={{
      backgroundColor: colors.primary.main,
      '&:hover': { backgroundColor: colors.primary.dark },
      textTransform: 'none',
      fontSize: '0.875rem',
      fontWeight: 600,
      minHeight: 36,
      px: 2,
    }}
    {...props}
  >
    {label}
  </Button>
);

// Cancel Button
export const CancelButton: React.FC<ButtonProps & { label?: string }> = ({ label = 'Cancel', ...props }) => (
  <Button
    variant="outlined"
    size="small"
    sx={{
      borderColor: colors.border.main,
      color: colors.text.secondary,
      textTransform: 'none',
      fontSize: '0.875rem',
      fontWeight: 500,
      minHeight: 36,
      px: 2,
    }}
    {...props}
  >
    {label}
  </Button>
);

// Back Button
export const BackButton: React.FC<ButtonProps & { label?: string }> = ({ label = 'Back', ...props }) => (
  <Button
    variant="text"
    size="small"
    startIcon={<BackIcon sx={{ fontSize: '16px !important' }} />}
    sx={{ color: colors.text.secondary, textTransform: 'none', fontSize: '0.875rem', fontWeight: 500 }}
    {...props}
  >
    {label}
  </Button>
);

// Add Button (before Save in right group)
export const AddButton: React.FC<ButtonProps & { label?: string }> = ({ label = 'Add', ...props }) => (
  <Button
    variant="outlined"
    size="small"
    startIcon={<AddIcon sx={{ fontSize: '16px !important' }} />}
    sx={{
      borderColor: colors.primary.main,
      color: colors.primary.main,
      textTransform: 'none',
      fontSize: '0.875rem',
      fontWeight: 600,
      minHeight: 36,
      px: 2,
      '&:hover': { borderColor: colors.primary.dark, backgroundColor: '#FFF5F5' },
    }}
    {...props}
  >
    {label}
  </Button>
);

// Download Button
export const DownloadButton: React.FC<ButtonProps & { label?: string }> = ({ label = 'Download', ...props }) => (
  <Button
    variant="outlined"
    size="small"
    startIcon={<DownloadIcon sx={{ fontSize: '16px !important' }} />}
    sx={{
      borderColor: colors.border.main,
      color: colors.text.primary,
      textTransform: 'none',
      fontSize: '0.875rem',
      fontWeight: 500,
      minHeight: 36,
      px: 2,
    }}
    {...props}
  >
    {label}
  </Button>
);

// Reset Button (for inquiry section)
export const ResetButton: React.FC<ButtonProps & { label?: string }> = ({ label = 'Reset', ...props }) => (
  <Button
    variant="outlined"
    size="small"
    sx={{
      borderColor: colors.border.main,
      color: colors.text.secondary,
      textTransform: 'none',
      fontSize: '0.875rem',
      fontWeight: 500,
      minHeight: 36,
      px: 2,
    }}
    {...props}
  >
    {label}
  </Button>
);

// Search Button (for inquiry section)
export const SearchButton: React.FC<ButtonProps & { label?: string }> = ({ label = 'Search', ...props }) => (
  <Button
    variant="contained"
    size="small"
    sx={{
      backgroundColor: colors.primary.main,
      '&:hover': { backgroundColor: colors.primary.dark },
      textTransform: 'none',
      fontSize: '0.875rem',
      fontWeight: 600,
      minHeight: 36,
      px: 2,
    }}
    {...props}
  >
    {label}
  </Button>
);

// Icon Button wrapper
interface ActionIconButtonProps {
  icon: 'edit' | 'delete' | 'add' | 'download' | 'upload' | 'refresh' | 'filter' | 'cancel';
  onClick?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
  color?: string;
}

const iconMap = {
  edit: EditIcon,
  delete: DeleteIcon,
  add: AddIcon,
  download: DownloadIcon,
  upload: UploadIcon,
  refresh: RefreshIcon,
  filter: FilterIcon,
  cancel: CancelIcon,
};

export const ActionIconButton: React.FC<ActionIconButtonProps> = ({
  icon,
  onClick,
  disabled = false,
  size = 'small',
  color = colors.text.secondary,
}) => {
  const Icon = iconMap[icon];
  return (
    <IconButton size={size} onClick={onClick} disabled={disabled} sx={{ color, p: '6px' }}>
      <Icon sx={{ fontSize: size === 'small' ? 18 : 22 }} />
    </IconButton>
  );
};

/**
 * Button Group - follows TOPSCRM CTA positioning standard
 * 
 * Left group: Contextual actions (Browse, Upload)
 * Right group: Global actions (Delete → Download/Edit/Filter → Cancel → Add → Save)
 * Spacing: 10px between buttons
 */
interface ButtonGroupProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'space-between';
  spacing?: number;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  align = 'right',
  spacing = 1.25, // 10px (1.25 * 8px spacing unit)
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent:
        align === 'left' ? 'flex-start' :
        align === 'center' ? 'center' :
        align === 'space-between' ? 'space-between' :
        'flex-end',
      gap: `${spacing * 8}px`, // 10px default
      flexWrap: 'wrap',
      alignItems: 'center',
    }}
  >
    {children}
  </Box>
);

/**
 * Screen Action Bar - implements full TOPSCRM CTA layout
 * Left side: contextual actions, Right side: global actions
 */
interface ScreenActionBarProps {
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
}

export const ScreenActionBar: React.FC<ScreenActionBarProps> = ({
  leftActions,
  rightActions,
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
    }}
  >
    {/* Left: Contextual actions */}
    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {leftActions}
    </Box>
    {/* Right: Global actions (Delete → Utility → Cancel → Add → Save) */}
    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {rightActions}
    </Box>
  </Box>
);
