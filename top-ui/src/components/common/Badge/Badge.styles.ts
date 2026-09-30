import { colors } from '@core/theme';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'default' | 'primary';

/** Variant color map (background + text), driven by theme tokens. */
export const badgeColorMap: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: '#E8F5E9', color: colors.status.success },
  error: { bg: colors.table.headerBg, color: '#C62828' },
  warning: { bg: '#FFF3E0', color: '#E65100' },
  info: { bg: '#E3F2FD', color: colors.status.info },
  default: { bg: colors.neutral[100], color: '#616161' },
  primary: { bg: colors.table.headerBg, color: colors.primary.main },
};

export const badgeSize = (size: 'small' | 'medium', bg: string, color: string) => ({
  backgroundColor: bg,
  color,
  fontWeight: 500,
  fontSize: size === 'small' ? '0.6875rem' : '0.75rem',
  height: size === 'small' ? 22 : 28,
  borderRadius: '8px',
  '& .MuiChip-deleteIcon': { color, fontSize: 14 },
});
