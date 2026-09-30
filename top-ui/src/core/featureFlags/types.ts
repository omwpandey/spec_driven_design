/**
 * Feature Flag Types
 */

export interface FeatureFlagConfig {
  /** Default flags baked into the build */
  defaults: FeatureFlags;
  /** Remote endpoint to fetch flag overrides */
  remoteEndpoint?: string;
  /** Polling interval for remote flags (ms) */
  pollInterval?: number;
}

export interface FeatureFlags {
  [key: string]: boolean;
}

// Well-known flags for the framework
export const DEFAULT_FLAGS: FeatureFlags = {
  // Module enablement
  'module.activity-setup': true,
  'module.customer': true,
  'module.dashboard': true,
  'module.call-center': false,
  'module.appointments': false,
  'module.service-followup': false,

  // Feature toggles
  'feature.pwa-offline': false,
  'feature.dark-mode': false,
  'feature.export-csv': true,
  'feature.bulk-actions': false,
  'feature.advanced-search': true,
  'feature.notifications-panel': true,

  // Performance experiments
  'perf.virtualized-tables': true,
  'perf.prefetch-routes': false,
};
