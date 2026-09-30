import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderFormComponent } from '@/tests/test-utils';
import FormTextArea from '../FormTextArea';

describe('FormTextArea', () => {
  it('renders with label', () => {
    renderFormComponent(<FormTextArea name="bio" label="Bio" />, { bio: '' });
    expect(screen.getByText('Bio')).toBeInTheDocument();
  });

  it('renders multiline textarea', () => {
    renderFormComponent(<FormTextArea name="bio" label="Bio" rows={4} />, { bio: 'Hello' });
    const textarea = screen.getByDisplayValue('Hello');
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
  });

  it('shows asterisk for required', () => {
    renderFormComponent(<FormTextArea name="bio" label="Bio" required />, { bio: '' });
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    renderFormComponent(<FormTextArea name="bio" label="Bio" />, { bio: 'My bio text' });
    expect(screen.getByDisplayValue('My bio text')).toBeInTheDocument();
  });
});
