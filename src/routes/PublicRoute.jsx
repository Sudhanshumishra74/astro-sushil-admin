/* eslint-disable react-hooks/exhaustive-deps */
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

const Loader = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
    
    <div className="relative flex items-center justify-center">
     
      <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
     
      <div className="absolute w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg">
        <img
          src="/Images/Logo.png"
          alt="Logo"
          className="w-5 h-5 object-contain"
          onError={(e) => {
        
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = `
              <svg width="16" height="16" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>`;
          }}
        />
      </div>
    </div>

   
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          style={{
            animation: "dotBounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>

    <style>{`
      @keyframes dotBounce {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40%            { transform: scale(1);   opacity: 1;   }
      }
    `}</style>
  </div>
);

const PublicRoute = () => {
  const { isAuth, isInitialized, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      const token = localStorage.getItem("adminAccessToken");
      if (token) {
        fetchProfile();
      } else {
        useAuthStore.setState({ isInitialized: true, isAuth: false });
      }
    }
  }, []);

  if (!isInitialized) return <Loader />;

  return !isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;