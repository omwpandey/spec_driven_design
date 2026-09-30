/**
 * Feature Flag Context & Provider
 *
 * Provides feature flags to the entire app via React Context.
 * Supports static defaults + optional remote override fetching.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { FeatureFlags, FeatureFlagConfig, DEFAULT_FLAGS } from './types';

interface FeatureFlagContextValue {
  flags: FeatureFlags;
  isEnabled: (flag: string) => boolean;
  loading: boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue>({
  flags: DEFAULT_FLAGS,
  isEnabled: () => false,
  loading: false,
});

interface FeatureFlagProviderProps {
  children: React.ReactNode;
  config?: Partial<FeatureFlagConfig>;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
  children,
  config,
}) => {
  const [flags, setFlags] = useState<FeatureFlags>({
    ...DEFAULT_FLAGS,
    ...config?.defaults,
  });
  const [loading, setLoading] = useState(false);

  // Fetch remote flags if endpoint configured
  const fetchRemoteFlags = useCallback(async () => {
    if (!config?.remoteEndpoint) return;

    try {
      setLoading(true);
      const response = await fetch(config.remoteEndpoint);
      if (response.ok) {
        const remoteFlags = await response.json();
        setFlags((prev) => ({ ...prev, ...remoteFlags }));
      }
    } catch {
      // Silent fail — use defaults if remote unavailable
    } finally {
      setLoading(false);
    }
  }, [config?.remoteEndpoint]);

  useEffect(() => {
    fetchRemoteFlags();

    // Optional polling
    if (config?.pollInterval && config?.remoteEndpoint) {
      const interval = setInterval(fetchRemoteFlags, config.pollInterval);
      return () => clearInterval(interval);
    }
  }, [fetchRemoteFlags, config?.pollInterval, config?.remoteEndpoint]);

  // Also read env-based flags
  useEffect(() => {
    const envFlags: FeatureFlags = {};
    Object.keys(import.meta.env).forEach((key) => {
      if (key.startsWith('TOPS_FF_')) {
        const flagName = key.replace('TOPS_FF_', '').toLowerCase().split('_').join('.');
        envFlags[flagName] = import.meta.env[key] === 'true';
      }
    });
    if (Object.keys(envFlags).length > 0) {
      setFlags((prev) => ({ ...prev, ...envFlags }));
    }
  }, []);

  const isEnabled = useCallback(
    (flag: string): boolean => {
      return flags[flag] === true;
    },
    [flags]
  );

  const value = useMemo(() => ({ flags, isEnabled, loading }), [flags, isEnabled, loading]);

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

/**
 * Hook to access all feature flags
 */
export function useFeatureFlags(): FeatureFlagContextValue {
  return useContext(FeatureFlagContext);
}

/**
 * Hook to check a single feature flag
 *
 * Usage: const isEnabled = useFeatureFlag('module.call-center');
 */
export function useFeatureFlag(flag: string): boolean {
  const { isEnabled } = useContext(FeatureFlagContext);
  return isEnabled(flag);
}
