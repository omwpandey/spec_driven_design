import React from 'react';
import { useAppSelector } from '@store';

interface PermissionWrapperProps {
  permission: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const user = useAppSelector((state) => state.auth.user);
  const userPermissions = user?.permissions ?? [];

  const hasPermission = Array.isArray(permission)
    ? permission.some((p) => userPermissions.includes(p))
    : userPermissions.includes(permission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionWrapper;
