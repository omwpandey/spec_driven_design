import React from 'react';
import { Box, Typography, Button, BackIcon } from '@components/common';
import { useNavigate } from 'react-router-dom';
import { colors } from '@core/theme';
import { Breadcrumb } from '@components/common';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs = [],
  showBack = false,
  onBack,
  actions,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Box sx={{ mb: 0.5, mt:'-1rem' }}>
          <Breadcrumb
            items={breadcrumbs}
            onNavigate={(path) => navigate(path)}
          />
        </Box>
      )}

      {/* Title & Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5" sx={{ fontFamily: "'Prompt', sans-serif", fontWeight: 500, fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' }, lineHeight: 1.3, color: '#1D1B20', minWidth: 0, overflowWrap: 'anywhere' }}>
          {title}
        </Typography>
        {actions && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>{actions}</Box>}
      </Box>

      {/* Back Button */}
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
            backgroundColor:'#fff',
            px: 2,
            minWidth: 'auto',
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
          }}
        >
          Back
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
