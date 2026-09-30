import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@core/theme';
import SummaryCard from '../SummaryCard';

describe('SummaryCard', () => {
  it('renders title', () => {
    render(
      <ThemeProvider theme={theme}>
        <SummaryCard icon={<span>🚗</span>} title="Total Vehicles" value={60000} />
      </ThemeProvider>
    );
    expect(screen.getByText('Total Vehicles')).toBeInTheDocument();
  });

  it('renders formatted number value', () => {
    render(
      <ThemeProvider theme={theme}>
        <SummaryCard icon={<span>🚗</span>} title="Cars" value={60000} />
      </ThemeProvider>
    );
    expect(screen.getByText('60,000')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(
      <ThemeProvider theme={theme}>
        <SummaryCard icon={<span>👤</span>} title="Users" value="55,231" />
      </ThemeProvider>
    );
    expect(screen.getByText('55,231')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <ThemeProvider theme={theme}>
        <SummaryCard icon={<span>👤</span>} title="Users" value={100} subtitle="(85%)" />
      </ThemeProvider>
    );
    expect(screen.getByText('(85%)')).toBeInTheDocument();
  });
});
