/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, Info, LogOut, ChevronDown, Link } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const dropdownItems = [
  { icon: User, label: "Edit profile" },
  // { icon: Info, label: "Support" },
];

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

 
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

 
  const name = user?.fullName || user?.username || "Admin";
  const email = user?.email || "";
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
     
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 cursor-pointer py-1 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {initials}
        </div>

        <span className="hidden sm:block text-sm font-medium text-gray-800">
          {name}
        </span>

        <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
      </button>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50"
          >
           
            <div className="px-4 pb-3 pt-1">
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{email}</p>
              {user?.role?.name && (
                <span className="inline-block mt-1.5 text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  {user.role.name}
                </span>
              )}
            </div>

            <hr className="border-gray-100 mb-1" />

          
            <div className="px-1.5">
              {dropdownItems.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => {
                    setOpen(false);navigate("/profile");
                    
                  }}
                  className="w-full flex cursor-pointer items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-700 hover:bg-secondary hover:text-primary transition-colors"
                >
                  <Icon size={15} className="text-gray-400 shrink-0" />
                  {label}
                </button>
              ))}
            </div>

            <hr className="border-gray-100 my-1" />

         
            <div className="px-1.5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut size={15} className="shrink-0" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
