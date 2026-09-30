import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, BackIcon, Breadcrumb } from '@components/common';
import { colors } from '@core/theme';
import { useAppSelector } from '@store';

/**
 * PageHeaderBar
 * -------------
 * A single, self-contained page header that combines three things in one place:
 *   1. Breadcrumb          (top)
 *   2. Page title          (just below the breadcrumb)
 *   3. Back button         (conditional — only for a dealer login)
 *
 * The back button is intentionally NOT controlled by a plain boolean here.
 * It is rendered only when the logged-in user is a dealer. This keeps the
 * "dealer-only back button" rule in one place so pages don't have to repeat it.
 *
 * The component is built to be extended:
 *   - `actions`            slot for buttons/controls beside the title
 *   - `titleAdornment`     slot for chips/badges after the title
 *   - `children`           slot for anything rendered under the header block
 *   - `forceShowBack`      escape hatch to show the back button regardless of role
 *   - `hideBack`           escape hatch to hide it even for a dealer
 *   - `isDealer`           override the auto dealer-detection when needed
 *   - `dealerRoles`        customise which role strings count as a dealer
 */

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface PageHeaderBarProps {
  /** Page title rendered just below the breadcrumb. */
  title: string;
  /** Breadcrumb trail. Rendered only when at least one item is provided. */
  breadcrumbs?: BreadcrumbItem[];
  /** Optional node rendered next to the title (right side). */
  actions?: React.ReactNode;
  /** Optional node rendered immediately after the title text (e.g. a status chip). */
  titleAdornment?: React.ReactNode;
  /** Optional content rendered underneath the header block. */
  children?: React.ReactNode;

  /** Label for the back button. Defaults to "Back". */
  backLabel?: string;
  /** Custom back handler. Defaults to `navigate(-1)`. */
  onBack?: () => void;

  /**
   * Role strings that should be treated as a dealer login.
   * Matched case-insensitively against `state.auth.user.role`.
   * Defaults to `['dealer']`.
   */
  dealerRoles?: string[];
  /** Override the automatic dealer detection (skips the Redux lookup). */
  isDealer?: boolean;
  /** Force the back button to show regardless of the dealer check. */
  forceShowBack?: boolean;
  /** Force the back button to hide even for a dealer. */
  hideBack?: boolean;
}

const PageHeaderBar: React.FC<PageHeaderBarProps> = ({
  title,
  breadcrumbs = [],
  actions,
  titleAdornment,
  children,
  backLabel = 'Back',
  onBack,
  dealerRoles = ['dealer'],
  isDealer,
  forceShowBack = false,
  hideBack = false,
}) => {
  const navigate = useNavigate();
  const userRole = useAppSelector((state) => state.auth.user?.role);

  // Auto-detect a dealer login unless the caller overrides it.
  const roleIsDealer =
    isDealer ??
    (!!userRole &&
      dealerRoles.some((r) => r.toLowerCase() === userRole.toLowerCase()));

  const showBack = !hideBack && (forceShowBack || roleIsDealer);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <Box>
      {/* 1. Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <Box sx={{ mb: 0.5, mt: '-1rem' }}>
          <Breadcrumb items={breadcrumbs} onNavigate={(path) => navigate(path)} />
        </Box>
      )}

      {/* 2. Title (+ optional adornment / actions) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Prompt', sans-serif",
              fontWeight: 500,
              fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
              lineHeight: 1.3,
              color: '#1D1B20',
              minWidth: 0,
              overflowWrap: 'anywhere',
            }}
          >
            {title}
          </Typography>
          {titleAdornment}
        </Box>
        {actions && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {actions}
          </Box>
        )}
      </Box>

      {/* 3. Back button — dealer login only */}
      {showBack && (
        <Button
          startIcon={<BackIcon sx={{ fontSize: '14px !important' }} />}
          size="small"
          onClick={handleBack}
          sx={{
            mt: 3,
            color: colors.text.primary,
            textTransform: 'none',
            fontSize: '0.8125rem',
            fontWeight: 400,
            backgroundColor: '#fff',
            px: 2,
            minWidth: 'auto',
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
          }}
        >
          {backLabel}
        </Button>
      )}

      {/* Extension slot */}
      {children}
    </Box>
  );
};

export default PageHeaderBar;
