import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from '@core/theme';

type Sx = SxProps<Theme>;

type Align = 'left' | 'center' | 'right';

export const confirmDialogStyles = {
  dialog: {
    '& .MuiDialog-container': { alignItems: 'flex-start', paddingTop: '15vh' },
  } as Sx,
  paper: {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    minWidth: '480px',
  } as Sx,
  header: (isDanger: boolean): Sx => ({
    backgroundColor: isDanger ? colors.primary.main : colors.background.paper,
    px: 2.5,
    py: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${colors.border.light}`,
  }),
  title: (isDanger: boolean): Sx => ({
    color: isDanger ? colors.text.white : colors.primary.main,
    fontWeight: 700,
    fontSize: '1.125rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }),
  closeBtn: (isDanger: boolean): Sx => ({
    color: isDanger ? colors.text.white : colors.grey.muted,
    backgroundColor: isDanger ? 'rgba(255, 255, 255, 0.25)' : colors.border.light,
    width: 32,
    height: 32,
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: isDanger ? 'rgba(255, 255, 255, 0.4)' : colors.neutral[400],
    },
  }),
  content: { px: 2.5, py: 3.5 } as Sx,
  message: { fontSize: '0.9375rem', color: colors.text.primary, lineHeight: 1.7 } as Sx,
  actions: (align: Align): Sx => ({
    px: 2.5,
    pb: 2.5,
    pt: 0,
    justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
    gap: 1.5,
  }),
  cancelBtn: {
    borderColor: colors.primary.main,
    color: colors.primary.main,
    fontWeight: 700,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    minWidth: 110,
    minHeight: 42,
    borderRadius: '8px',
    px: 3,
    '&:hover': {
      borderColor: colors.primary.dark,
      backgroundColor: 'rgba(235, 10, 30, 0.04)',
    },
  } as Sx,
  confirmBtn: {
    backgroundColor: colors.primary.main,
    color: colors.text.white,
    fontWeight: 700,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    minWidth: 110,
    minHeight: 42,
    borderRadius: '8px',
    px: 3,
    boxShadow: 'none',
    '&:hover': { backgroundColor: colors.primary.dark, boxShadow: 'none' },
  } as Sx,
};
