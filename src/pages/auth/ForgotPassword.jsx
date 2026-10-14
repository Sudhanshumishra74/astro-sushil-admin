import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const steps = ["Email", "Verify OTP", "New Password"];

const StepBar = ({ current }) => (
  <div className="flex items-center gap-2 mb-8">
    {steps.map((label, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i < current ? "bg-green-500 text-white" : i === current ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}
          >
            {i < current ? (
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          <span className={`text-[10px] font-medium whitespace-nowrap ${i === current ? "text-primary" : "text-gray-400"}`}>
            {label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`h-0.5 w-10 mb-4 rounded-full transition-all ${i < current ? "bg-green-500" : "bg-gray-100"}`} />
        )}
      </div>
    ))}
  </div>
);

const OtpInput = ({ value, onChange }) => {
  const digits = value.padEnd(6, "").split("");

  const handleKey = (e, idx) => {
    const key = e.key;
    if (key === "Backspace") {
      const arr = value.split("");
      arr[idx] = "";
      const next = arr.join("").replace(/\s/g, "");
      onChange(next);
      if (idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus();
      return;
    }
    if (!/^\d$/.test(key)) return;
    const arr = value.padEnd(6, " ").split("");
    arr[idx] = key;
    const next = arr.join("").replace(/\s/g, "");
    onChange(next.slice(0, 6));
    if (idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={() => {}}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          className={`w-11 h-12 text-center text-lg font-bold border rounded-xl outline-none transition-all
            ${digits[i]?.trim() ? "border-primary bg-primary/5 text-primary" : "border-gray-200 bg-gray-50 text-gray-800"}
            focus:border-primary focus:ring-2 focus:ring-primary/10`}
        />
      ))}
    </div>
  );
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword, loading } = useAuthStore();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

 
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }
    setErrors({});
    const success = await forgotPassword({ identifier: email, channel: "EMAIL" ,type: "RESET"});
    if (success) setStep(1);
  };

  
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP." });
      return;
    }
    setErrors({});
    setStep(2);
  };


  const handleReset = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!newPassword || newPassword.length < 6)
      errs.newPassword = "Password must be at least 6 characters.";
    if (newPassword !== confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const success = await resetPassword({
      identifier: email,
      otp,
      newPassword,
      type: "VERIFY"
    });
    if (success) setDone(true);
  };

  const eyeIcon = (show) =>
    show ? (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      <div className="bg-white flex flex-col px-8 py-10 lg:px-16">
        <button
          type="button"
          onClick={() => (step > 0 && !done ? setStep(step - 1) : navigate("/login"))}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors w-fit mb-10"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          {step > 0 && !done ? "Back" : "Back to login"}
        </button>

        <div className="flex flex-col justify-center flex-1 max-w-md w-full mx-auto">

    
          {done ? (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
                <svg width="32" height="32" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                Your password has been updated successfully. You can now log in with your new password.
              </p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <StepBar current={step} />

              {/* ── Step 0: Email ── */}
              {step === 0 && (
                <form onSubmit={handleSendOtp} noValidate>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <svg width="22" height="22" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                  <p className="text-sm text-gray-500 leading-relaxed mb-7">
                    Enter your registered email. We'll send you a 6-digit OTP to reset your password.
                  </p>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-800 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                      placeholder="astro@gmail.com"
                      className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm outline-none transition-all
                        ${errors.email ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-[#c8bfdf] focus:border-primary focus:ring-2 focus:ring-primary/10"}`}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed mb-5"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Sending OTP...
                      </span>
                    ) : "Send OTP"}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    Remember your password?{" "}
                    <button type="button" onClick={() => navigate("/login")} className="text-primary font-medium hover:underline">
                      Sign in
                    </button>
                  </p>
                </form>
              )}

              {/* ── Step 1: OTP ── */}
              {step === 1 && (
                <form onSubmit={handleVerifyOtp} noValidate>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <svg width="22" height="22" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h1>
                  <p className="text-sm text-gray-500 leading-relaxed mb-1">
                    We've sent a 6-digit code to
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mb-7">{email}</p>

                  <div className="mb-5">
                    <OtpInput value={otp} onChange={setOtp} />
                    {errors.otp && <p className="mt-3 text-xs text-red-500 text-center">{errors.otp}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={otp.length < 6}
                    className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed mb-5"
                  >
                    Verify OTP
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    Didn't receive code?{" "}
                    <button
                      type="button"
                      onClick={() => forgotPassword({ identifier: email, channel: "email" })}
                      className="text-primary font-medium hover:underline"
                    >
                      Resend OTP
                    </button>
                  </p>
                </form>
              )}

              {/* ── Step 2: New Password ── */}
              {step === 2 && (
                <form onSubmit={handleReset} noValidate>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <svg width="22" height="22" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">New Password</h1>
                  <p className="text-sm text-gray-500 leading-relaxed mb-7">
                    Set a strong new password for your account.
                  </p>

                  {/* New Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-800 mb-1.5">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: "" })); }}
                        placeholder="Min. 6 characters"
                        className={`w-full px-4 py-2.5 pr-10 bg-white border rounded-xl text-sm outline-none transition-all
                          ${errors.newPassword ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-[#c8bfdf] focus:border-primary focus:ring-2 focus:ring-primary/10"}`}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {eyeIcon(showPass)}
                      </button>
                    </div>
                    {errors.newPassword && <p className="mt-1.5 text-xs text-red-500">{errors.newPassword}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-800 mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                        placeholder="Re-enter password"
                        className={`w-full px-4 py-2.5 pr-10 bg-white border rounded-xl text-sm outline-none transition-all
                          ${errors.confirmPassword ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-[#c8bfdf] focus:border-primary focus:ring-2 focus:ring-primary/10"}`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {eyeIcon(showConfirm)}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Resetting...
                      </span>
                    ) : "Reset Password"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* ───── RIGHT PANEL ───── */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-primary px-12 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute bottom-8 right-8 grid grid-cols-3 gap-2 opacity-20">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-lg border border-white/30 bg-white/10" />
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="rounded-2xl flex items-center justify-center mb-5">
            <img src="/Images/Logo.png" alt="Logo" className="w-32 h-32 object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Admin</h2>
          <p className="text-[#c5c9e8] text-sm leading-relaxed max-w-xs">
            Login to access the admin dashboard and manage your application effectively.
          </p>
        </div>
      </div>
    </div>
  );
}