import { useAppSelector } from '@store';

export const usePermission = () => {
  const user = useAppSelector((state) => state.auth.user);
  const permissions = user?.permissions ?? [];

  const hasPermission = (permission: string | string[]): boolean => {
    if (Array.isArray(permission)) {
      return permission.some((p) => permissions.includes(p));
    }
    return permissions.includes(permission);
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every((p) => permissions.includes(p));
  };

  return { hasPermission, hasAllPermissions, permissions };
};
