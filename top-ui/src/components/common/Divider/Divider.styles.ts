import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from '@core/theme';

type Sx = SxProps<Theme>;

export const dividerStyles = {
  labelWrap: { display: 'flex', alignItems: 'center' } as Sx,
  labelLine: { flex: 1 } as Sx,
  labelText: {
    px: 1.5,
    fontSize: '0.75rem',
    color: colors.text.disabled,
    whiteSpace: 'nowrap',
  } as Sx,
};
