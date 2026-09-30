import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { colors } from '@core/theme';

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  iconBgColor?: string;
}

/**
 * SummaryCard
 *
 * Uses fluid (viewport-relative) sizing via clamp(min, vw, max) so the card,
 * its font sizes, icon, spacing and padding all scale DOWN proportionally as
 * the screen gets smaller — keeping the same horizontal design at every screen
 * size instead of wrapping or reflowing. The clamp maxes are kept compact so
 * the titles/values stay small and the cards don't hog space.
 */
const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  iconBgColor = colors.background.default,
}) => {
  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        // Gap and padding scale with the viewport.
        gap: 'clamp(4px, 0.5vw, 8px)',
        padding: 'clamp(5px, 0.7vw, 8px) clamp(6px, 0.8vw, 12px)',
        border: `1px solid ${colors.border.light}`,
        boxShadow: 'none',
        borderRadius: '8px',
        minHeight: 'clamp(44px, 4.2vw, 56px)',
        // In a row: equal-width cards that share space. In a column (mobile):
        // full width, one per row. width:100% + flex-basis 0 covers both.
        flex: '1 1 0',
        width: '100%',
        minWidth: 0,
        // Do NOT clip content — the value must always stay fully visible.
        overflow: 'visible',
      }}
    >
      {/* Icon box — scales with the viewport */}
      <Box
        sx={{
          width: 'clamp(22px, 2.2vw, 32px)',
          height: 'clamp(22px, 2.2vw, 32px)',
          borderRadius: '8px',
          backgroundColor: iconBgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          // Scale the icon glyph inside too.
          '& svg': { fontSize: 'clamp(0.85rem, 1.3vw, 1.25rem)' },
        }}
      >
        {icon}
      </Box>

      {/* Title — compact fluid font size. Always shows in full (wraps between
          words if needed); never truncated with an ellipsis or tooltip. */}
      <Typography
        sx={{
          fontSize: 'clamp(0.5rem, 0.7vw, 0.6875rem)',
          color: colors.text.secondary,
          lineHeight: 1.2,
          whiteSpace: 'normal',
          overflowWrap: 'break-word',
          wordBreak: 'normal',
          minWidth: 0,
          flex: '1 1 auto',
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>

      {/* Vertical divider */}
      <Divider orientation="vertical" flexItem sx={{ borderColor: colors.border.light, alignSelf: 'stretch' }} />

      {/* Value — compact fluid font size, never wraps/clips */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
        <Typography
          sx={{
            fontSize: 'clamp(0.6rem, 0.8vw, 0.75rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: colors.text.primary,
            whiteSpace: 'nowrap',
          }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 'clamp(0.45rem, 0.6vw, 0.5625rem)', color: colors.text.secondary, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default SummaryCard;
