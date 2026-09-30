// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import configReducer, {
  setDealer,
  setBranch,
  setUser,
  setLanguage,
  fetchAppConfig,
} from '../slices/configSlice';
import { APP_DEFAULTS } from '@constants/appDefaults';

describe('configSlice', () => {
  const initialState = {
    dealer: { ...APP_DEFAULTS.dealer },
    branch: { ...APP_DEFAULTS.branch },
    user: { ...APP_DEFAULTS.user },
    language: 'en' as const,
    loading: false,
    error: null,
  };

  it('should set dealer', () => {
    const state = configReducer(initialState, setDealer({ code: 'NEW', name: 'New Dealer' }));
    expect(state.dealer.name).toBe('New Dealer');
    expect(state.dealer.code).toBe('NEW');
  });

  it('should set branch', () => {
    const state = configReducer(initialState, setBranch({ code: 'BR01', name: 'Branch 01' }));
    expect(state.branch.name).toBe('Branch 01');
    expect(state.branch.code).toBe('BR01');
  });

  it('should set user', () => {
    const state = configReducer(initialState, setUser({
      id: 'U2',
      name: 'New User',
      initials: 'NU',
      email: 'new@test.com',
      role: 'Manager',
      position: 'Agent',
    }));
    expect(state.user.name).toBe('New User');
    expect(state.user.role).toBe('Manager');
  });

  it('should set language to TH', () => {
    const state = configReducer(initialState, setLanguage('th'));
    expect(state.language).toBe('th');
  });

  it('should set language to EN', () => {
    const stateInTh = { ...initialState, language: 'th' as const };
    const state = configReducer(stateInTh, setLanguage('en'));
    expect(state.language).toBe('en');
  });

  it('has correct default values', () => {
    expect(initialState.dealer.name).toBe('T.BANGKOK CENTRAL');
    expect(initialState.branch.code).toBe('BKK-001');
    expect(initialState.user.name).toBe('Somchai Michai');
  });

  describe('fetchAppConfig async thunk', () => {
    const createTestStore = () =>
      configureStore({
        reducer: { config: configReducer },
      });

    it('sets loading to true on pending', () => {
      const state = configReducer(initialState, { type: fetchAppConfig.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('sets loading to false and updates state on fulfilled', () => {
      const payload = {
        dealer: { code: 'API-D', name: 'API Dealer' },
        branch: { code: 'API-B', name: 'API Branch' },
        user: {
          id: 'API-U1',
          name: 'API User',
          initials: 'AU',
          email: 'api@test.com',
          role: 'Supervisor',
          position: 'Lead',
        },
        language: 'th' as const,
      };
      const state = configReducer(
        { ...initialState, loading: true },
        { type: fetchAppConfig.fulfilled.type, payload }
      );
      expect(state.loading).toBe(false);
      expect(state.dealer.name).toBe('API Dealer');
      expect(state.branch.name).toBe('API Branch');
      expect(state.user.name).toBe('API User');
      expect(state.language).toBe('th');
    });

    it('uses defaults when payload fields are null/undefined', () => {
      const payload = {
        dealer: null,
        branch: null,
        user: null,
        language: null,
      };
      const state = configReducer(
        { ...initialState, loading: true },
        { type: fetchAppConfig.fulfilled.type, payload }
      );
      expect(state.loading).toBe(false);
      expect(state.dealer.name).toBe(APP_DEFAULTS.dealer.name);
      expect(state.branch.name).toBe(APP_DEFAULTS.branch.name);
      expect(state.user.name).toBe(APP_DEFAULTS.user.name);
      expect(state.language).toBe(APP_DEFAULTS.system.language);
    });

    it('sets error on rejected', () => {
      const state = configReducer(
        { ...initialState, loading: true },
        { type: fetchAppConfig.rejected.type, payload: 'Failed to load configuration' }
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to load configuration');
      // Should keep existing/fallback values
      expect(state.dealer.name).toBe(APP_DEFAULTS.dealer.name);
    });

    it('dispatches and resolves full async flow', async () => {
      const store = createTestStore();
      await store.dispatch(fetchAppConfig());
      const state = store.getState().config;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.dealer.name).toBe(APP_DEFAULTS.dealer.name);
    });
  });
});
