export const spacing = 8; // Base spacing unit (8px grid)

/**
 * Semantic padding / margin scale (in MUI spacing units — multiply by 8px).
 * Use these instead of hardcoding numbers in `sx` (e.g. `p: space.md`).
 */
export const space = {
  none: 0,
  xxs: 0.25, // 2px
  xs: 0.5,   // 4px
  sm: 0.75,  // 6px
  md: 1,     // 8px
  lg: 1.5,   // 12px
  xl: 2,     // 16px
  xxl: 2.5,  // 20px
  xxxl: 3,   // 24px
} as const;

/** Border-radius tokens (px strings for use in `sx`/`style`). */
export const radius = {
  xs: '2px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '10px',
  xxl: '12px',
  pill: '9999px',
} as const;

export const layoutSpacing = {
  sidebarWidth: 80,
  sidebarCollapsedWidth:{ xs: '4rem', sm: '10.5rem', md: '17.5rem' },
  sidebarExpandedWidthMenu:{ xs: '4rem', sm: '10.5rem', md: '17.5rem' },
  sidebarExpandedWidth: '17.5rem',
  headerHeight: 48,
  topBarHeight: 32,
  // Vertical offset for toasts so they sit directly below the top bar + header
  // (topBarHeight 32 + headerHeight 48 = 80)
  toastTopOffset: 84,
  contentPadding: 24,
  sectionGap: 16,
  cardPadding: 20,
  formGap: 16,
};
