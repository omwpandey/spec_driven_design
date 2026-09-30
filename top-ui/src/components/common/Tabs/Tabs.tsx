import React, { useState } from 'react';
import { Box, Tab as MuiTab, Tabs as MuiTabs } from '@mui/material';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactElement;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'standard',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    onChange?.(newValue);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <Box>
      <MuiTabs
        value={activeTab}
        onChange={handleChange}
        variant={variant}
        sx={{
          borderBottom: '1px solid #E0E0E0',
          minHeight: 36,
          '& .MuiTab-root': {
            minHeight: 36,
            fontSize: '0.8125rem',
            textTransform: 'none',
            fontWeight: 500,
          },
          '& .Mui-selected': { color: '#CC0000' },
          '& .MuiTabs-indicator': { backgroundColor: '#CC0000' },
        }}
      >
        {tabs.map((tab) => (
          <MuiTab
            key={tab.id}
            value={tab.id}
            label={tab.label}
            disabled={tab.disabled}
            icon={tab.icon}
            iconPosition="start"
          />
        ))}
      </MuiTabs>
      <Box sx={{ pt: 2 }}>{activeContent}</Box>
    </Box>
  );
};

export default Tabs;
