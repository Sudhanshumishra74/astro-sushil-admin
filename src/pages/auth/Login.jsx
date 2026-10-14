import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ---------------- LOGIN HANDLER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const success = await login(form);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT */}
      <form
        onSubmit={handleSubmit}
        className="bg-secondary flex flex-col justify-center px-6 py-16 lg:px-16"
      >
        <h1 className="font-heading text-3xl font-bold text-black mb-1.5">
          LogIn
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Enter your email and password to Log in!
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="astro@gmail.com"
            className="w-full px-4 py-2.5 bg-white border border-[#c8bfdf] rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-black mb-1.5">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 pr-10 bg-white border border-[#c8bfdf] rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* OPTIONS */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            Keep me logged in
          </label>

          <button
            onClick={() => navigate("/forgot-password")}
            type="button"
            className="text-sm text-primary font-medium hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="hidden lg:flex flex-col items-center justify-center bg-primary px-12 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="  rounded-2xl flex items-center justify-center mb-5">
            <img
              src="/Images/Logo.png"
              alt="Logo"
              className="w-32 h-32 object-contain"
            />
          </div>

          <h2 className="font-heading text-3xl font-bold text-white mb-3">
            Admin
          </h2>

          <p className="text-[#c5c9e8] text-sm leading-relaxed max-w-xs">
            login to access the admin dashboard and manage your application
            effectively.
          </p>
        </div>
      </div>
    </div>
  );
}
