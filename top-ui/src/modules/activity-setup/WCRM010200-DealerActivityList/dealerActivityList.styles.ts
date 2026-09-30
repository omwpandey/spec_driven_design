/**
 * Styles for the [wcrm010200] Dealer Activity List screen.
 */
import { colors } from '@core/theme';

export const dealerActivityListStyles = {
  page: {
    columnGap: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    } as const,

    // ----- Search section -----
    searchGrid: {
      alignItems: 'flex-end',
    } as const,
    fieldLabel: {
      fontSize: '0.8125rem',
      fontWeight: 500,
      color: colors.nonMandatory,
      mb: 0.5,
      display: 'block',
    } as const,
    input: {
      '& .MuiOutlinedInput-root': { height: 40, backgroundColor: colors.background.paper },
    } as const,
    searchActions: {
      display: 'flex',
      gap: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexWrap: 'wrap',
      mt: { xs: 1, md: 0 },
    } as const,
    resetButton: {
      textTransform: 'none',
      height: 38,
      borderColor: colors.primary.main,
      color: colors.primary.main,
      '&:hover': { borderColor: colors.primary.dark, backgroundColor: colors.table.rowHover },
    } as const,
    searchButton: {
      textTransform: 'none',
      height: 38,
      backgroundColor: colors.primary.main,
      color: colors.primary.contrastText,
      '&:hover': { backgroundColor: colors.primary.dark },
    } as const,

    // ----- Add button (above the grid) -----
    addButton: {
      textTransform: 'none',
      height: 32,
      color: colors.primary.main,
      fontWeight: 500,
      '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
    } as const,

    // ----- Activity Name hyperlink in the grid -----
    activityNameLink: {
      color: colors.chart.blue,
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: '0.85rem',
      '&:hover': { color: colors.primary.main },
    } as const,

    loadingWrap: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '40vh',
    } as const,
  },
};

export default dealerActivityListStyles;
