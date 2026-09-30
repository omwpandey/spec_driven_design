/**
 * Feature Flags Service
 *
 * Centralized feature flag management for gradual rollouts,
 * A/B testing, and module-level enablement.
 *
 * Supports:
 * - Static flags (env-based)
 * - Remote flags (API-driven)
 * - Module-level flags
 * - Component-level conditional rendering
 */

export { FeatureFlagProvider, useFeatureFlags, useFeatureFlag } from './FeatureFlagContext';
export { FeatureGate } from './FeatureGate';
export type { FeatureFlags, FeatureFlagConfig } from './types';
