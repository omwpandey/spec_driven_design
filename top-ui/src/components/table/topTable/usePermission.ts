/**
 * usePermission (iCROP table)
 * ------------------------------------------------------------------
 * Permission helper for the iCROP table, adapted to the top-ui framework.
 *
 * The framework stores permissions as a flat string[] on
 * `state.auth.user.permissions` (see src/store/slices/authSlice.ts and
 * src/hooks/usePermission.ts). The DDMS table, however, asks questions like
 * `isWrite('customerName')` / `isReadOnly('field')` / `isHidden('field')`.
 *
 * We bridge the two by encoding the permission strings as
 * `"<action>.<field>"` (e.g. "write.customername", "hide.status"). A field is
 * writable by default unless an explicit `read.<field>` / `hide.<field>` says
 * otherwise, matching the DDMS expectation while staying compatible with the
 * framework's plain string list.
 */
import { useMemo } from 'react';
import { useAppSelector } from '@store';

export type PermissionAction = 'write' | 'read' | 'hide' | 'mask';

const norm = (field = '') => field.toLowerCase();

export const usePermission = () => {
  const user = useAppSelector((state) => state.auth.user);
  const permissions = useMemo<string[]>(() => user?.permissions ?? [], [user?.permissions]);

  const permSet = useMemo(() => new Set(permissions.map((p) => p.toLowerCase())), [permissions]);

  const has = (action: PermissionAction, field = ''): boolean =>
    permSet.has(`${action}.${norm(field)}`);

  return useMemo(() => {
    /** Field is explicitly hidden. */
    const isHidden = (field = '') => has('hide', field);
    /** Field is explicitly read-only. */
    const isReadOnly = (field = '') => has('read', field);
    /** Field is explicitly masked. */
    const isMask = (field = '') => has('mask', field);
    /**
     * Field is writable. When no permission list is supplied at all we default
     * to writable (so the table is usable out of the box); when a list IS
     * present we honour an explicit `write.<field>` or fall back to
     * "writable unless read-only/hidden".
     */
    const isWrite = (field = '') => {
      if (permSet.size === 0) return true;
      if (has('write', field)) return true;
      // If any explicit write.* perms exist, be strict; otherwise permissive.
      const hasAnyWrite = permissions.some((p) => p.toLowerCase().startsWith('write.'));
      if (hasAnyWrite) return false;
      return !isReadOnly(field) && !isHidden(field);
    };

    /** Raw framework-style check kept for convenience. */
    const hasPermission = (permission: string | string[]): boolean =>
      Array.isArray(permission)
        ? permission.some((p) => permSet.has(p.toLowerCase()))
        : permSet.has(permission.toLowerCase());

    return { isHidden, isReadOnly, isMask, isWrite, hasPermission, permissions };
  }, [permSet, permissions]);
};

export default usePermission;
