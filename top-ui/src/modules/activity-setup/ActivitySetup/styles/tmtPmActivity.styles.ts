import type { CSSProperties } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { colors } from '@core/theme';

/**
 * TMT PM Activity Maintenance — style file for TmtPmActivityPage and its
 * two editable tables (Service & Repair Inspection Item, Contact Channel
 * Details). Mirrors the visual language of activitySetup.styles.ts.
 */

type Sx = SxProps<Theme>;

export const tmtPmActivityStyles = {
  page: {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2.5,
      mt: -1.4,
    } as Sx,

    footerButton: {
      color: colors.text.primary,
      backgroundColor: '#FFFFFF',
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      px: 3,
      py: 1,
      borderRadius: '6px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      '&:hover': { backgroundColor: '#F5F5F5', borderColor: '#9E9E9E' },
    } as Sx,

    footerButtonIcon: {
      fontSize: '18px !important',
      color: colors.text.primary,
    } as Sx,
  },

  // Shared table look shared by both editable tables on this page.
  table: {
    mandatoryAsterisk: {
      color: colors.mandatory,
      marginLeft: '2px',
    } as CSSProperties,

    outerBox: {
      border: '1px solid #E6E6E6',
      borderRadius: '5px',
      overflow: 'hidden',
    } as Sx,

    addBar: {
      display: 'flex',
      justifyContent: 'flex-end',
      px: 1.5,
      pt: 1,
      pb: 0.5,
      backgroundColor: '#FEF3F4',
    } as Sx,

    addButtonIcon: {
      fontSize: '14px !important',
    } as Sx,

    addButton: {
      fontSize: '0.875rem',
      px: 1.5,
      py: 0.5,
      mt: 1,
      mb: 1,
      color: colors.text.primary,
      fontWeight: 500,
      textTransform: 'none',
      backgroundColor: '#fff',
    } as Sx,

    tableContainer: {
      overflowX: 'auto',
    } as Sx,

    table: {
      tableLayout: 'fixed',
      width: '100%',
    } as Sx,

    headerCellBase: {
      backgroundColor: '#FEF3F4',
      fontFamily: 'Prompt, sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(0.625rem, 0.6vw + 0.35rem, 0.875rem)',
      lineHeight: 1.2,
      textTransform: 'uppercase',
      letterSpacing: '0%',
      whiteSpace: 'nowrap',
      borderTop: '1px solid #E6E6E6',
      borderBottom: '1px solid #E6E6E6',
      borderRight: '1px solid #E6E6E6',
      py: '16px',
      px: '16px',
    } as Sx,

    bodyRow: {
      backgroundColor: '#FFFFFF',
      '&:hover': { backgroundColor: '#FFFAFA' },
    } as Sx,

    cellNo: {
      fontSize: '0.875rem',
      borderBottom: '1px solid #E6E6E6',
      borderRight: '1px solid #E6E6E6',
      py: 1.5,
    } as Sx,

    cellStandard: {
      borderBottom: '1px solid #E6E6E6',
      borderRight: '1px solid #E6E6E6',
      py: 1.5,
    } as Sx,

    cellCenter: {
      borderBottom: '1px solid #E6E6E6',
      borderRight: '1px solid #E6E6E6',
      py: 1.5,
      textAlign: 'center',
    } as Sx,

    cellActionLast: {
      borderBottom: '1px solid #E6E6E6',
      py: 1.5,
      textAlign: 'center',
    } as Sx,

    statusText: {
      fontSize: '0.875rem',
      fontWeight: 500,
    } as Sx,

    fieldWrapBase: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #E0E0E0',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      px: 1,
      py: 0.25,
    } as Sx,

    fieldSelect: {
      fontSize: '0.875rem',
    } as Sx,

    descriptionText: {
      fontSize: '0.875rem',
      color: colors.text.primary,
    } as Sx,

    numberField: {
      flex: 1,
      '& input': { fontSize: '0.875rem', textAlign: 'right', py: '4px' },
    } as Sx,

    deleteIconButton: {
      color: colors.text.primary,
    } as Sx,

    deleteIcon: {
      fontSize: 18,
    } as Sx,
  },
};

/** Status text color: ADD is green, everything else uses the muted secondary color. */
export const getPmStatusColor = (status: string): string =>
  status === 'ADD' ? '#4CAF50' : colors.text.secondary;
