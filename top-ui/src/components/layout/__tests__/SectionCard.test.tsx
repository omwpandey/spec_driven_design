import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SectionCard from '../SectionCard';
import { ThemeProvider } from '@components/common';
import { theme } from '@core/theme';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('SectionCard', () => {
  it('renders title', () => {
    renderWithTheme(<SectionCard title="Test Section"><p>Content</p></SectionCard>);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithTheme(<SectionCard title="Section"><p>Hello World</p></SectionCard>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('is expanded by default', () => {
    renderWithTheme(<SectionCard title="Section"><p>Visible</p></SectionCard>);
    expect(screen.getByText('Visible')).toBeVisible();
  });

  it('renders non-collapsible variant', () => {
    renderWithTheme(<SectionCard title="Static Section" collapsible={false}><p>Always visible</p></SectionCard>);
    expect(screen.getByText('Always visible')).toBeVisible();
  });
});
