import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "../hooks/usePermission";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Nested layout-route guard, used inside AdminLayout's route tree — e.g.
 * <Route element={<RequirePermission permission="products.view" />}>
 *   <Route path="products" element={<ProductsPage />} />
 * </Route>
 *
 * Kept separate from the existing top-level ProtectedRoute (the all-or-
 * nothing auth gate wrapping the whole tree) rather than retrofitting it —
 * that would mean rewriting every existing route's auth semantics for no
 * benefit. `permission` accepts a string or an array (any-of).
 */
export default function RequirePermission({ permission }) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const { hasPermission } = usePermission();

  if (!isInitialized) return null;

  return hasPermission(permission) ? <Outlet /> : <Navigate to="/403" replace />;
}
