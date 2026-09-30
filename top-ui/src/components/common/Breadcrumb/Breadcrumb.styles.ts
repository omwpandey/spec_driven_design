import type { SxProps, Theme } from '@mui/material/styles';

type Sx = SxProps<Theme>;

const fluidLabel = 'clamp(0.35rem, 0.55vw + 0.55rem, 1rem)';

export const breadcrumbStyles = {
  root: { '& .MuiBreadcrumbs-separator': { mx: 0.5 } } as Sx,
  current: {
    fontFamily: "'Prompt', sans-serif",
    fontSize: fluidLabel,
    fontWeight: 400,
    lineHeight: 1.4,
    color: '#000000',
  } as Sx,
  link: {
    fontFamily: "'Prompt', sans-serif",
    fontSize: fluidLabel,
    color: '#000000',
    fontWeight: 400,
    lineHeight: 1.4,
    cursor: 'pointer',
  } as Sx,
};
