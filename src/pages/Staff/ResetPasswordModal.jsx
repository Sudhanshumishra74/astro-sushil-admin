/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, KeyRound } from "lucide-react";
import { useStaffStore } from "../../store/useStaffStore";

export default function ResetPasswordModal({ target, onClose }) {
  const { resetStaffPassword } = useStaffStore();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const close = () => {
    setPassword("");
    setConfirm("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const ok = await resetStaffPassword(target._id, password);
    setLoading(false);
    if (ok) close();
  };

  const inputClass =
    "w-full bg-white border border-primary/20 rounded-lg px-3 py-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-sans";

  return (
    <AnimatePresence>
      {target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <KeyRound size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-base text-black">Reset Password</h3>
                <p className="text-xs text-black/40">{target.fullName || target.username}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min 8 characters)"
                minLength={8}
                required
                className={inputClass}
              />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                required
                className={inputClass}
              />

              {error && <p className="text-xs text-red-500">{error}</p>}

              <p className="text-[11px] text-black/40">
                This will also sign the account out of all active sessions.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 py-2 rounded-xl border border-primary/20 text-sm text-black/60 hover:bg-secondary transition-colors font-sans"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl bg-primary text-secondary text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors font-sans"
                >
                  {loading ? "Saving…" : "Reset Password"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
