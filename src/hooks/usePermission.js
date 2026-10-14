import { useCallback, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Reads the logged-in admin's permissions from the auth store via a
 * selector (not a full-store destructure) — this hook runs once per
 * sidebar item, and a non-selector subscription would re-render all of
 * them on any unrelated auth-store change.
 *
 * hasPermission(undefined) deliberately returns true (fail-open): a
 * forgotten `permission` annotation on a menu item or route must not hide
 * working UI. The backend's authorize() middleware is the real gate; this
 * hook only controls what's shown, not what's allowed.
 */
export const usePermission = () => {
  const user = useAuthStore((s) => s.user);

  const isSuperAdmin = Boolean(user?.isSuperAdmin || user?.role?.isSuperAdmin);
  const permissionSet = useMemo(() => new Set(user?.permissions ?? []), [user?.permissions]);

  const hasPermission = useCallback(
    (permission) => {
      if (!permission) return true;
      if (isSuperAdmin) return true;
      return Array.isArray(permission)
        ? permission.some((p) => permissionSet.has(p))
        : permissionSet.has(permission);
    },
    [permissionSet, isSuperAdmin],
  );

  const hasAll = useCallback(
    (permissions) => {
      if (isSuperAdmin) return true;
      return (Array.isArray(permissions) ? permissions : [permissions]).every((p) =>
        permissionSet.has(p),
      );
    },
    [permissionSet, isSuperAdmin],
  );

  return {
    hasPermission,
    hasAll,
    isSuperAdmin,
    role: user?.role ?? null,
    permissions: user?.permissions ?? [],
  };
};
