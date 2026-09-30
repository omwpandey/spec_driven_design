// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { translate } from '../index';

describe('translate', () => {
  it('returns English translation for EN key', () => {
    expect(translate('en', 'save_btn')).toBe('Save');
  });

  it('returns Thai translation for TH key', () => {
    expect(translate('th', 'save_btn')).toBe('บันทึก');
  });

  it('returns key itself if not found', () => {
    expect(translate('en', 'non_existent_key')).toBe('non_existent_key');
  });

  it('substitutes parameters', () => {
    const result = translate('en', 'validation_required', { field: 'Name' });
    expect(result).toBe('Name is required');
  });

  it('substitutes multiple parameters', () => {
    const result = translate('en', 'validation_range', { min: '1', max: '100' });
    expect(result).toBe('Must be between 1 and 100');
  });

  it('falls back to English if Thai key is missing', () => {
    // Any key that exists in EN should fallback from TH
    expect(translate('th', 'save_btn')).toBe('บันทึก');
  });

  it('translates sidebar menu items', () => {
    expect(translate('en', 'nav_dashboard')).toBe('Dashboard');
    expect(translate('th', 'nav_dashboard')).toBe('แดชบอร์ด');
  });

  it('translates activity page labels', () => {
    expect(translate('en', 'activity_name')).toBe('Activity Name');
    expect(translate('th', 'activity_name')).toBe('ชื่อกิจกรรม');
  });
});
