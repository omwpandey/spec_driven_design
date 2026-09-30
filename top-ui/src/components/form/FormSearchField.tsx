import React from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton, SearchIcon, ClearIcon } from '@components/common';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface FormSearchFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  onSearch?: (value: string) => void;
  showClear?: boolean;
}

const FormSearchField: React.FC<FormSearchFieldProps> = ({
  name,
  label,
  placeholder = 'Search...',
  disabled = false,
  size = 'small',
  fullWidth = true,
  onSearch,
  showClear = true,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {label && (
            <Typography variant="body2" color="text.primary" sx={formLabelStyle}>
              {label}
            </Typography>
          )}
          <TextField
            {...field}
            size={size}
            fullWidth={fullWidth}
            placeholder={placeholder}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch?.(field.value || '');
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: '#999999' }} />
                  </InputAdornment>
                ),
                endAdornment: showClear && field.value ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        field.onChange('');
                        onSearch?.('');
                      }}
                    >
                      <ClearIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />
        </Box>
      )}
    />
  );
};

export default FormSearchField;
