import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@components/common';
import { useAppSelector } from '@store';
import { APP_DEFAULTS } from '@constants/appDefaults';
import { useTranslation } from '@hooks';

/**
 * TopBar - Dealer/Branch info bar
 * 
 * Pattern: t('key') for labels, API value ?? fallback for data
 */
const TopBar: React.FC = () => {
  const { dealer, branch } = useAppSelector((state) => state.config);
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <Box
      sx={{
        height: { xs: 24, md: 28 },
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 1, sm: 1.5, md: 2 },
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', gap: { xs: 1, md: 3 }, alignItems: 'center' }}>
        <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '0.5625rem', md: '0.6875rem' }, fontWeight: 700, fontFamily: "Prompt" }}>
          {t('topbar_dealer')} : {dealer?.name ?? APP_DEFAULTS.dealer.name}
        </Typography>
        {!isSmall && (
          <Typography sx={{ color: '#FFFFFF', fontSize: '0.644rem' , fontWeight: 400, fontFamily: "Prompt"}}>
            {t('topbar_branch')}: {branch?.name ?? APP_DEFAULTS.branch.name} · {branch?.code ?? APP_DEFAULTS.branch.code}
          </Typography>
        )}
      </Box>
      <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '0.5625rem', md: '0.644rem' , fontWeight: 400, fontFamily: "Prompt" } }}>
        {dateStr} {timeStr}
      </Typography>
    </Box>
  );
};

export default TopBar;
