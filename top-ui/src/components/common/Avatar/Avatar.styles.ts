import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from '@core/theme';

type Sx = SxProps<Theme>;

export const avatarSizeMap = {
  small: { avatar: 28, font: '0.625rem' },
  medium: { avatar: 36, font: '0.75rem' },
  large: { avatar: 48, font: '1rem' },
} as const;

/** Deterministic background color palette for initials avatars. */
export const avatarPalette = [
  colors.primary.main,
  colors.status.info,
  colors.status.success,
  '#6A1B9A',
  '#E65100',
  '#00695C',
];

export const avatarStyles = {
  wrap: { display: 'inline-flex', alignItems: 'center', gap: 1 } as Sx,
  name: { fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.3 } as Sx,
  subtitle: { fontSize: '0.6875rem', color: colors.text.disabled, lineHeight: 1.2 } as Sx,
  avatar: (bg: string, size: number, font: string): Sx => ({
    width: size,
    height: size,
    fontSize: font,
    fontWeight: 600,
    backgroundColor: bg,
  }),
};
