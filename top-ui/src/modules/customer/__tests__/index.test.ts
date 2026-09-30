import { describe, it, expect, vi } from 'vitest';

vi.mock('@core/crud', () => ({
  CrudListPage: () => null,
  CrudFormPage: () => null,
}));

vi.mock('@store/index', () => ({
  useAppSelector: () => 'en',
  useAppDispatch: () => vi.fn(),
}));

describe('customer module index', () => {
  it('exports CustomerListPage', async () => {
    const mod = await import('../index');
    expect(mod.CustomerListPage).toBeDefined();
  });

  it('exports CustomerFormPage', async () => {
    const mod = await import('../index');
    expect(mod.CustomerFormPage).toBeDefined();
  });

  it('exports customerConfig', async () => {
    const mod = await import('../index');
    expect(mod.customerConfig).toBeDefined();
    expect(mod.customerConfig.resource).toBe('customers');
  });
});
