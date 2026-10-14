/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const AuthLoader = ({ children }) => {
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!isInitialized) return <div>Loading...</div>;

  return children;
};

export default AuthLoader;