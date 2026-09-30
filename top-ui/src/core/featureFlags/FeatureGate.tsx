/**
 * FeatureGate Component
 *
 * Conditionally renders children based on a feature flag.
 *
 * Usage:
 *   <FeatureGate flag="feature.bulk-actions">
 *     <BulkActionToolbar />
 *   </FeatureGate>
 *
 *   <FeatureGate flag="module.call-center" fallback={<ComingSoon />}>
 *     <CallCenterModule />
 *   </FeatureGate>
 */

import React from 'react';
import { useFeatureFlag } from './FeatureFlagContext';

interface FeatureGateProps {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ flag, children, fallback = null }) => {
  const isEnabled = useFeatureFlag(flag);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
