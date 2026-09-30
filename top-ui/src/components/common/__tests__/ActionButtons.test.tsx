import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@core/theme';
import {
  PrimaryButton,
  SecondaryButton,
  DeleteButton,
  SaveButton,
  AddButton,
  BackButton,
  CancelButton,
  DownloadButton,
  ResetButton,
  SearchButton,
  ActionIconButton,
  ButtonGroup,
  ScreenActionBar,
} from '../ActionButtons';

const wrap = (ui: React.ReactElement) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ActionButtons', () => {
  describe('PrimaryButton', () => {
    it('renders label', () => {
      wrap(<PrimaryButton label="Submit" />);
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('fires onClick', () => {
      const onClick = vi.fn();
      wrap(<PrimaryButton label="Go" onClick={onClick} />);
      fireEvent.click(screen.getByText('Go'));
      expect(onClick).toHaveBeenCalled();
    });

    it('can be disabled', () => {
      wrap(<PrimaryButton label="Submit" disabled />);
      expect(screen.getByText('Submit').closest('button')).toBeDisabled();
    });
  });

  describe('SecondaryButton', () => {
    it('renders label', () => {
      wrap(<SecondaryButton label="Cancel" />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('fires onClick', () => {
      const onClick = vi.fn();
      wrap(<SecondaryButton label="Cancel" onClick={onClick} />);
      fireEvent.click(screen.getByText('Cancel'));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('DeleteButton', () => {
    it('renders default label', () => {
      wrap(<DeleteButton />);
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('renders custom label', () => {
      wrap(<DeleteButton label="Remove" />);
      expect(screen.getByText('Remove')).toBeInTheDocument();
    });

    it('fires onClick', () => {
      const onClick = vi.fn();
      wrap(<DeleteButton onClick={onClick} />);
      fireEvent.click(screen.getByText('Delete'));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('SaveButton', () => {
    it('renders default label', () => {
      wrap(<SaveButton />);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('renders custom label', () => {
      wrap(<SaveButton label="Save Changes" />);
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });

  describe('AddButton', () => {
    it('renders default label', () => {
      wrap(<AddButton />);
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('renders custom label', () => {
      wrap(<AddButton label="Add New" />);
      expect(screen.getByText('Add New')).toBeInTheDocument();
    });
  });

  describe('BackButton', () => {
    it('renders default label', () => {
      wrap(<BackButton />);
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('fires onClick', () => {
      const onClick = vi.fn();
      wrap(<BackButton onClick={onClick} />);
      fireEvent.click(screen.getByText('Back'));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('CancelButton', () => {
    it('renders default label', () => {
      wrap(<CancelButton />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('renders custom label', () => {
      wrap(<CancelButton label="Discard" />);
      expect(screen.getByText('Discard')).toBeInTheDocument();
    });

    it('fires onClick', () => {
      const onClick = vi.fn();
      wrap(<CancelButton onClick={onClick} />);
      fireEvent.click(screen.getByText('Cancel'));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('DownloadButton', () => {
    it('renders default label', () => {
      wrap(<DownloadButton />);
      expect(screen.getByText('Download')).toBeInTheDocument();
    });

    it('renders custom label', () => {
      wrap(<DownloadButton label="Export" />);
      expect(screen.getByText('Export')).toBeInTheDocument();
    });
  });

  describe('ResetButton', () => {
    it('renders default label', () => {
      wrap(<ResetButton />);
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('renders custom label', () => {
      wrap(<ResetButton label="Clear" />);
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });
  });

  describe('SearchButton', () => {
    it('renders default label', () => {
      wrap(<SearchButton />);
      expect(screen.getByText('Search')).toBeInTheDocument();
    });

    it('renders custom label', () => {
      wrap(<SearchButton label="Find" />);
      expect(screen.getByText('Find')).toBeInTheDocument();
    });
  });

  describe('ActionIconButton', () => {
    it('renders edit icon button', () => {
      const onClick = vi.fn();
      const { container } = wrap(<ActionIconButton icon="edit" onClick={onClick} />);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      fireEvent.click(button!);
      expect(onClick).toHaveBeenCalled();
    });

    it('renders delete icon button', () => {
      const { container } = wrap(<ActionIconButton icon="delete" />);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('renders add icon button', () => {
      const { container } = wrap(<ActionIconButton icon="add" />);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('renders download icon button', () => {
      const { container } = wrap(<ActionIconButton icon="download" />);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('renders upload icon button', () => {
      const { container } = wrap(<ActionIconButton icon="upload" />);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('renders refresh icon button', () => {
      const { container } = wrap(<ActionIconButton icon="refresh" />);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('renders filter icon button', () => {
      const { container } = wrap(<ActionIconButton icon="filter" />);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('renders cancel icon button', () => {
      const { container } = wrap(<ActionIconButton icon="cancel" />);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('can be disabled', () => {
      const { container } = wrap(<ActionIconButton icon="edit" disabled />);
      expect(container.querySelector('button')).toBeDisabled();
    });

    it('supports medium size', () => {
      const { container } = wrap(<ActionIconButton icon="edit" size="medium" />);
      expect(container.querySelector('button')).toBeInTheDocument();
    });
  });

  describe('ButtonGroup', () => {
    it('renders children', () => {
      wrap(
        <ButtonGroup>
          <PrimaryButton label="A" />
          <SecondaryButton label="B" />
        </ButtonGroup>
      );
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
    });

    it('supports left alignment', () => {
      const { container } = wrap(
        <ButtonGroup align="left">
          <PrimaryButton label="X" />
        </ButtonGroup>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('supports center alignment', () => {
      const { container } = wrap(
        <ButtonGroup align="center">
          <PrimaryButton label="X" />
        </ButtonGroup>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('supports space-between alignment', () => {
      const { container } = wrap(
        <ButtonGroup align="space-between">
          <PrimaryButton label="A" />
          <PrimaryButton label="B" />
        </ButtonGroup>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('ScreenActionBar', () => {
    it('renders left and right actions', () => {
      wrap(
        <ScreenActionBar
          leftActions={<PrimaryButton label="Browse" />}
          rightActions={<SaveButton />}
        />
      );
      expect(screen.getByText('Browse')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('renders with only right actions', () => {
      wrap(<ScreenActionBar rightActions={<DeleteButton />} />);
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('renders with only left actions', () => {
      wrap(<ScreenActionBar leftActions={<AddButton />} />);
      expect(screen.getByText('Add')).toBeInTheDocument();
    });
  });
});
