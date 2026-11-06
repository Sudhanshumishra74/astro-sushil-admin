import { menuItems } from "../config/menuItems";

// Mirrors usePermission's hasPermission logic as a plain function over a
// `user` object, rather than the hook — this runs once, right after login,
// before any component holding the hook has re-rendered with the fresh
// permissions, so it can't rely on the hook's own memoized snapshot.
function hasPermission(user, permission) {
  if (!permission) return true;

  const isSuperAdmin = Boolean(user?.isSuperAdmin || user?.role?.isSuperAdmin);
  if (isSuperAdmin) return true;

  const permissions = user?.permissions ?? [];
  return Array.isArray(permission)
    ? permission.some((p) => permissions.includes(p))
    : permissions.includes(permission);
}

/**
 * Picks the first sidebar destination a given admin can actually reach, in
 * the same order Sidebar.jsx renders them — used right after login so a
 * role without "dashboard.view" (e.g. a shipments-only role) lands on their
 * own page instead of hitting /403 immediately. Falls back to "/profile",
 * which every authenticated admin can always reach regardless of role.
 */
export function getFirstAccessibleRoute(user) {
  for (const group of menuItems) {
    for (const item of group.items) {
      if (item.hasChildren) {
        const child = item.children?.find((c) => hasPermission(user, c.permission));
        if (child) return child.route;
      } else if (item.route && hasPermission(user, item.permission)) {
        return item.route;
      }
    }
  }

  return "/profile";
}
