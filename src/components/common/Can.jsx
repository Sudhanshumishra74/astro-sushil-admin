import { usePermission } from "../../hooks/usePermission";

/**
 * Gates a piece of UI behind a permission — e.g. wrap a "New Role" button
 * in <Can permission="roles.create">...</Can>. `mode="all"` requires every
 * permission in an array instead of any one of them (default).
 */
export default function Can({ permission, mode = "any", fallback = null, children }) {
  const { hasPermission, hasAll } = usePermission();
  const allowed = mode === "all" ? hasAll(permission) : hasPermission(permission);

  return allowed ? children : fallback;
}
