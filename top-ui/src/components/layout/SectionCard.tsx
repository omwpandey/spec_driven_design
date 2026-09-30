import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ExpandMoreIcon,
} from '@components/common';
import { colors } from '@core/theme';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  accentColor?: string;
  actions?: React.ReactNode;
  sx?: Record<string, unknown>;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  collapsible = true,
  defaultExpanded = true,
  accentColor = colors.primary.main,
  actions,
  sx: sxProp,
}) => {
  if (!collapsible) {
    return (
      <Box
        sx={{
          backgroundColor: colors.background.paper,
          borderRadius: '6px',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          ...sxProp,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            padding: { xs: '12px 14px', sm: '14px 20px' },
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <Box
              sx={{
                width: '4px',
                height: '20px',
                backgroundColor: accentColor,
                borderRadius: '9999px',
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' }, lineHeight: 1.3, color: '#1A1A1A', overflowWrap: 'anywhere' }}>
              {title}
            </Typography>
          </Box>
          {actions}
        </Box>
        <Box sx={{ padding: { xs: '16px 14px', sm: '21px 20px 20px' } }}>{children}</Box>
      </Box>
    );
  }

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      sx={{
        '&.MuiAccordion-root': {
          borderRadius: '6px !important',
          overflow: 'hidden',
          margin: '0 !important',
          boxShadow: 'none',
          border: '1px solid #E5E7EB',
          backgroundColor: colors.background.paper,
          ...sxProp,
        },
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: '16px', color: '#6B7280' }} />}
        sx={{
          minHeight: '48px !important',
          padding: '0 20px',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: colors.background.paper,
          '&.Mui-expanded': { backgroundColor: colors.background.paper },
          '& .MuiAccordionSummary-content': {
            margin: '14px 0 !important',
            alignItems: 'center',
            gap: '8px',
          },
        }}
      >
        <Box
          sx={{
            width: '4px',
            height: '20px',
            backgroundColor: accentColor,
            borderRadius: '9999px',
            flexShrink: 0,
          }}
        />
        <Typography sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' }, lineHeight: 1.3, color: '#1A1A1A', overflowWrap: 'anywhere' }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: { xs: '16px 14px', sm: '21px 20px 20px' } }}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default SectionCard;
