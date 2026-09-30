import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { CloseIcon, SaveIcon, CancelIcon, PreviewIcon } from '../Icon';
import { colors } from '@core/theme';
import MessagePreviewDialog from '../MessagePreviewDialog';

interface ChannelMessage {
  channel: string;
  enabled: boolean;
  message: string;
  subject?: string;
  maxLength: number;
}

interface ParameterItem {
  label: string;
  value: string;
}

interface SetTemplateDialogProps {
  open: boolean;
  title?: string;
  activityId?: string;
  activityName?: string;
  contactProcessOptions?: { value: string; label: string }[];
  channels?: ChannelMessage[];
  parameters?: ParameterItem[];
  messageLengthNote?: string;
  onSave?: (data: { contactProcess: string; channels: ChannelMessage[] }) => void;
  onCancel: () => void;
}

const SetTemplateDialog: React.FC<SetTemplateDialogProps> = ({
  open,
  title = 'Reminder Message Setup',
  activityId = '',
  activityName = '',
  contactProcessOptions = [],
  channels: initialChannels,
  parameters = [],
  messageLengthNote = 'Note : Thai message max length = 70, English message max length = 160',
  onSave,
  onCancel,
}) => {
  const defaultChannels: ChannelMessage[] = initialChannels || [
    { channel: 'SMS', enabled: true, message: 'Toyota XXXXXXX invites you to bring your vehicle in for its 100,000 km service. Please call XXXXXXXXX.', maxLength: 160 },
    { channel: 'Email', enabled: true, message: 'Toyota XXXXXXX invites you to bring your vehicle in for its 100,000 km service. Please call XXXXXXXXX.', subject: 'xxxxxxxx', maxLength: 900 },
    { channel: 'Line OA', enabled: true, message: 'Hello! This is a message from the LINE Messaging API.\nYour Toyota is due for its 100,000 km service.\nBook your service now to ensure optimal performance and safety.\nToyota XXXXXXX is ready to assist you.\nCall XXXXXXXXX to schedule your appointment.', maxLength: 2000 },
  ];

  const [contactProcess, setContactProcess] = useState('');
  const [channelData, setChannelData] = useState<ChannelMessage[]>(defaultChannels);
  const [previewChannel, setPreviewChannel] = useState<ChannelMessage | null>(null);

  const handleChannelToggle = (index: number) => {
    setChannelData((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, enabled: !ch.enabled } : ch))
    );
  };

  const handleMessageChange = (index: number, value: string) => {
    setChannelData((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, message: value } : ch))
    );
  };

  const handleSubjectChange = (index: number, value: string) => {
    setChannelData((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, subject: value } : ch))
    );
  };

  const handleSave = () => {
    onSave?.({ contactProcess, channels: channelData });
    onCancel();
  };

  const sectionTitle = (text: string) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Box sx={{ width: 4, height: 18, backgroundColor: '#EB0A1E', borderRadius: '2px' }} />
      <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>{text}</Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="lg"
      fullWidth
      disableScrollLock
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
          paddingTop: '5vh',
        },
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
            maxHeight: '90vh',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <Typography
          sx={{
            color: '#EB0A1E',
            fontWeight: 700,
            fontSize: '1.125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={onCancel}
          size="small"
          sx={{
            color: '#666666',
            backgroundColor: '#E0E0E0',
            width: 32,
            height: 32,
            borderRadius: '6px',
            '&:hover': { backgroundColor: '#BDBDBD' },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <DialogContent sx={{ px: 3, py: 3, backgroundColor: '#F5F5F5' }}>
        {/* Reminder Setup Section */}
        <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: `1px solid ${colors.border.light}`, p: 3, mb: 3 }}>
          {sectionTitle('Reminder Setup')}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text.secondary, mb: 0.5 }}>Activity ID</Typography>
              <TextField size="small" fullWidth value={activityId} disabled sx={{ '& .MuiInputBase-root': { height: '40px', backgroundColor: '#F5F5F5' } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#EB0A1E', mb: 0.5 }} >
                Activity Name <span>*</span>
              </Typography>
              <TextField size="small" fullWidth value={activityName} disabled sx={{ '& .MuiInputBase-root': { height: '40px', backgroundColor: '#F5F5F5' } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text.secondary, mb: 0.5 }}>Contact Process</Typography>
              <Select
                size="small"
                fullWidth
                value={contactProcess}
                onChange={(e) => setContactProcess(e.target.value)}
                displayEmpty
                sx={{ height: '40px', fontSize: '0.875rem' }}
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                {contactProcessOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Box>

        {/* Contact Channel Details Section */}
        <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: `1px solid ${colors.border.light}`, p: 3, mb: 3 }}>
          {sectionTitle('Contact Channel Details')}

          {/* SMS and Email side by side */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {channelData.filter((ch) => ch.channel !== 'Line OA').map((channel, idx) => {
              const originalIndex = channelData.findIndex((c) => c.channel === channel.channel);
              return (
                <Grid size={{ xs: 12, md: 6 }} key={channel.channel}>
                  <Box sx={{ border: `1px solid ${colors.border.light}`, borderRadius: '8px', p: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={channel.enabled}
                          onChange={() => handleChannelToggle(originalIndex)}
                          sx={{ color: '#EB0A1E', '&.Mui-checked': { color: '#EB0A1E' } }}
                        />
                      }
                      label={<Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{channel.channel}</Typography>}
                    />

                    {channel.subject !== undefined && (
                      <Box sx={{ mt: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>Subject</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>{channel.subject?.length || 0} / {channel.maxLength}</Typography>
                        </Box>
                        <TextField
                          size="small"
                          fullWidth
                          value={channel.subject}
                          onChange={(e) => handleSubjectChange(originalIndex, e.target.value)}
                          sx={{ '& .MuiInputBase-root': { height: '36px' } }}
                        />
                      </Box>
                    )}

                    <Box sx={{ mt: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>Message</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>{channel.message.length} / {channel.maxLength}</Typography>
                      </Box>
                      <TextField
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        value={channel.message}
                        onChange={(e) => handleMessageChange(originalIndex, e.target.value)}
                      />
                    </Box>

                    {channel.channel === 'SMS' && (
                      <Box sx={{ mt: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, mb: 0.5 }}>Message Length</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{messageLengthNote}</Typography>
                      </Box>
                    )}

                    <Button
                      size="small"
                      startIcon={<PreviewIcon sx={{ fontSize: '14px !important' }} />}
                      onClick={() => setPreviewChannel(channel)}
                      sx={{ mt: 1.5, color: '#333', textTransform: 'none', fontSize: '0.8125rem', border: '1px solid #E0E0E0', borderRadius: '8px', px: 1.5 }}
                    >
                      Preview
                    </Button>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Line OA full width */}
          {channelData.filter((ch) => ch.channel === 'Line OA').map((channel) => {
            const originalIndex = channelData.findIndex((c) => c.channel === channel.channel);
            return (
              <Box key={channel.channel} sx={{ border: `1px solid ${colors.border.light}`, borderRadius: '8px', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={channel.enabled}
                        onChange={() => handleChannelToggle(originalIndex)}
                        sx={{ color: '#EB0A1E', '&.Mui-checked': { color: '#EB0A1E' } }}
                      />
                    }
                    label={<Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{channel.channel}</Typography>}
                  />
                  <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>{channel.message.length} / {channel.maxLength}</Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, mb: 0.5 }}>Message</Typography>
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    rows={5}
                    value={channel.message}
                    onChange={(e) => handleMessageChange(originalIndex, e.target.value)}
                  />
                </Box>
                <Button
                  size="small"
                  startIcon={<PreviewIcon sx={{ fontSize: '14px !important' }} />}
                  onClick={() => setPreviewChannel(channel)}
                  sx={{ mt: 1.5, color: '#333', textTransform: 'none', fontSize: '0.8125rem', border: '1px solid #E0E0E0', borderRadius: '8px', px: 1.5 }}
                >
                  Preview
                </Button>
              </Box>
            );
          })}
        </Box>

        {/* Parameters Section */}
        {parameters.length > 0 && (
          <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: `1px solid ${colors.border.light}`, p: 3 }}>
            {sectionTitle('Parameters')}
            <Typography sx={{ fontSize: '0.8125rem', color: '#666', mb: 2 }}>
              Click a variable to insert into the message content.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {parameters.map((param) => (
                <Box
                  key={param.label}
                  sx={{
                    border: `1px solid ${colors.border.light}`,
                    borderRadius: '8px',
                    px: 3,
                    py: 1.5,
                    cursor: 'pointer',
                    textAlign: 'center',
                    minWidth: 140,
                    '&:hover': { borderColor: '#EB0A1E', backgroundColor: '#FFF5F5' },
                  }}
                >
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{param.label}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#666', mt: 0.5 }}>{param.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #E0E0E0', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          startIcon={<CancelIcon sx={{ fontSize: '16px !important' }} />}
          sx={{
            borderColor: '#EB0A1E',
            color: '#EB0A1E',
            fontWeight: 700,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            minWidth: 110,
            minHeight: 42,
            borderRadius: '8px',
            px: 3,
            '&:hover': { borderColor: '#C50818', backgroundColor: 'rgba(235, 10, 30, 0.04)' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="error"
          startIcon={<SaveIcon sx={{ fontSize: '16px !important' }} />}
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            minWidth: 110,
            minHeight: 42,
            borderRadius: '8px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#C50818', boxShadow: 'none' },
          }}
        >
          Save
        </Button>
      </DialogActions>

      {/* Message Preview Dialog */}
      <MessagePreviewDialog
        open={!!previewChannel}
        title={previewChannel?.channel || ''}
        channelLabel={previewChannel?.channel || ''}
        message={previewChannel?.message || ''}
        maxLength={previewChannel?.channel === 'SMS' ? 70 : previewChannel?.maxLength}
        onClose={() => setPreviewChannel(null)}
      />
    </Dialog>
  );
};

export default SetTemplateDialog;
