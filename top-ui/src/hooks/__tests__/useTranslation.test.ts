import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import configReducer from '@store/slices/configSlice';
import appReducer from '@store/slices/appSlice';
import authReducer from '@store/slices/authSlice';
import { useTranslation } from '../useTranslation';

function createWrapper(language: 'en' | 'th' = 'en') {
  const store = configureStore({
    reducer: { config: configReducer, app: appReducer, auth: authReducer },
    preloadedState: {
      config: {
        dealer: { code: 'T', name: 'Test' },
        branch: { code: 'B', name: 'Branch' },
        user: { id: '1', name: 'U', initials: 'U', email: 'u@t.com', role: 'A', position: 'P' },
        language,
        loading: false,
        error: null,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store, children });
}

describe('useTranslation', () => {
  it('returns t function and language', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: createWrapper('en') });
    expect(result.current.t).toBeInstanceOf(Function);
    expect(result.current.language).toBe('en');
  });

  it('translates a key in English', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: createWrapper('en') });
    expect(result.current.t('save_btn')).toBe('Save');
  });

  it('translates a key in Thai', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: createWrapper('th') });
    expect(result.current.t('save_btn')).toBe('บันทึก');
  });

  it('returns key when translation not found', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: createWrapper('en') });
    expect(result.current.t('nonexistent_key')).toBe('nonexistent_key');
  });

  it('handles params interpolation', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: createWrapper('en') });
    const translated = result.current.t('validation_required', { field: 'Name' });
    expect(translated).toBe('Name is required');
  });
});
