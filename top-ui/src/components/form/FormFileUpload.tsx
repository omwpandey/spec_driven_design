import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  UploadIcon,
  DeleteIcon,
  FileIcon,
} from '@components/common';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@components/common';
import { Controller, useFormContext } from 'react-hook-form';
import { formLabelStyle } from '@core/theme';

interface FormFileUploadProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  helperText?: string;
}

const FormFileUpload: React.FC<FormFileUploadProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  accept = '*/*',
  multiple = false,
  maxFileSize = 10,
  maxFiles = 5,
  helperText,
}) => {
  const { control, setError, clearErrors } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const files: File[] = field.value || [];

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFiles = Array.from(e.target.files || []);
          clearErrors(name);

          // Validate file size
          const oversized = selectedFiles.filter((f) => f.size > maxFileSize * 1024 * 1024);
          if (oversized.length > 0) {
            setError(name, { message: `File(s) exceed max size of ${maxFileSize}MB` });
            return;
          }

          // Validate file count
          const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;
          if (multiple && newFiles.length > maxFiles) {
            setError(name, { message: `Maximum ${maxFiles} files allowed` });
            return;
          }

          field.onChange(newFiles);
          if (fileInputRef.current) fileInputRef.current.value = '';
        };

        const handleRemoveFile = (index: number) => {
          const newFiles = files.filter((_, i) => i !== index);
          field.onChange(newFiles);
        };

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              variant="body2"
              color={error ? 'error' : 'text.primary'}
              sx={formLabelStyle}
            >
              {label}
              {required && (
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Typography>

            <Box
              sx={{
                border: `2px dashed ${error ? '#D32F2F' : '#E0E0E0'}`,
                borderRadius: 1,
                p: 2,
                textAlign: 'center',
                cursor: disabled ? 'default' : 'pointer',
                backgroundColor: '#FAFAFA',
                '&:hover': disabled ? {} : { borderColor: '#BDBDBD', backgroundColor: '#F5F5F5' },
              }}
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              <UploadIcon sx={{ fontSize: 32, color: '#999999', mb: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Click to upload or drag files here
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Max {maxFileSize}MB per file{multiple ? `, up to ${maxFiles} files` : ''}
              </Typography>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* File list */}
            {files.length > 0 && (
              <List dense sx={{ mt: 0.5 }}>
                {files.map((file, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      border: '1px solid #E0E0E0',
                      borderRadius: 1,
                      mb: 0.5,
                      px: 1,
                    }}
                  >
                    <FileIcon sx={{ fontSize: 18, mr: 1, color: '#666666' }} />
                    <ListItemText
                      primary={file.name}
                      secondary={formatFileSize(file.size)}
                      sx={{
                        '& .MuiListItemText-primary': { fontSize: '0.8125rem' },
                        '& .MuiListItemText-secondary': { fontSize: '0.6875rem' },
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton size="small" onClick={() => handleRemoveFile(index)}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}

            {error && (
              <Typography variant="caption" color="error">
                {error.message}
              </Typography>
            )}
            {helperText && !error && (
              <Typography variant="caption" color="text.secondary">
                {helperText}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
};

export default FormFileUpload;
