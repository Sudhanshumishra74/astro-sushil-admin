/* eslint-disable react-hooks/exhaustive-deps */
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { isAuth, isInitialized, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      fetchProfile();
    }
  }, [isInitialized]);

  if (!isInitialized) return null;

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;