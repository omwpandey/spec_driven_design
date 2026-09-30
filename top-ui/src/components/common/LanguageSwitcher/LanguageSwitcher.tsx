import React, { useState } from 'react';
import { Box, Typography, Popover, IconButton } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@store';
import { setLanguage } from '@store/slices/configSlice';

/**
 * Language Switcher
 * 
 * Flag icon in header → click → popover with EN/TH toggle
 */
const LanguageSwitcher: React.FC = () => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.config);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (lang: 'en' | 'th') => {
    dispatch(setLanguage(lang));
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {/* Flag Button */}
      <IconButton
        onClick={handleOpen}
        size="small"
        sx={{
          width: 32,
          height: 32,
          p: 0,
          border: '2px solid rgba(255,255,255,0.7)',
          borderRadius: '50%',
          overflow: 'hidden',
          '&:hover': { border: '2px solid #FFFFFF' },
        }}
      >
        {language === 'en' ? (
          <svg width="28" height="28" viewBox="0 0 28 28">
            <rect width="28" height="28" fill="#003078"/>
            <rect x="0" y="11" width="28" height="6" fill="#FFFFFF"/>
            <rect x="11" y="0" width="6" height="28" fill="#FFFFFF"/>
            <rect x="0" y="12" width="28" height="4" fill="#CF142B"/>
            <rect x="12" y="0" width="4" height="28" fill="#CF142B"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 28 28">
            <rect y="0" width="28" height="5.6" fill="#ED1C24"/>
            <rect y="5.6" width="28" height="5.6" fill="#FFFFFF"/>
            <rect y="11.2" width="28" height="5.6" fill="#241D4F"/>
            <rect y="16.8" width="28" height="5.6" fill="#FFFFFF"/>
            <rect y="22.4" width="28" height="5.6" fill="#ED1C24"/>
          </svg>
        )}
      </IconButton>

      {/* Popover with EN / TH toggle */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              mt: 2,
              borderRadius: '16px',
              border: '1px solid #E0E0E0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              overflow: 'visible',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '8px solid #FFFFFF',
              },
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', gap: '4px', p: '10px', backgroundColor: '#F8F8F8', borderRadius: '16px' }}>
          {/* EN */}
          <Box
            onClick={() => handleSelect('en')}
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: '10px',
              cursor: 'pointer',
              backgroundColor: language === 'en' ? '#FFFFFF' : 'transparent',
              boxShadow: language === 'en' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              '&:hover': { backgroundColor: language === 'en' ? '#FFFFFF' : '#EEEEEE' },
            }}
          >
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: language === 'en' ? '#EB0A1E' : '#58595B' }}>
              EN
            </Typography>
          </Box>
          {/* TH */}
          <Box
            onClick={() => handleSelect('th')}
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: '10px',
              cursor: 'pointer',
              backgroundColor: language === 'th' ? '#FFFFFF' : 'transparent',
              boxShadow: language === 'th' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              '&:hover': { backgroundColor: language === 'th' ? '#FFFFFF' : '#EEEEEE' },
            }}
          >
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: language === 'th' ? '#EB0A1E' : '#58595B' }}>
              TH
            </Typography>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default LanguageSwitcher;
