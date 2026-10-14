/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCog, Eye, EyeOff } from "lucide-react";

const initialForm = {
  fullName: "",
  email: "",
  username: "",
  password: "",
  phoneNumber: "",
  designation: "",
  roleId: "",
  isActive: true,
};

export default function StaffModal({ open, onClose, onSubmit, editData, loading, roleOptions }) {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        fullName: editData.fullName || "",
        email: editData.email || "",
        username: editData.username || "",
        password: "",
        phoneNumber: editData.phoneNumber || "",
        designation: editData.designation || "",
        roleId: editData.role?._id || "",
        isActive: editData.status !== "SUSPENDED",
      });
    } else {
      setForm({ ...initialForm, roleId: roleOptions?.[0]?._id || "" });
    }
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editData) {
      onSubmit({
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        designation: form.designation,
      });
      return;
    }

    onSubmit({
      fullName: form.fullName,
      email: form.email,
      username: form.username,
      password: form.password,
      phoneNumber: form.phoneNumber || undefined,
      designation: form.designation || undefined,
      roleId: form.roleId,
      status: form.isActive ? "ACTIVE" : "SUSPENDED",
    });
  };

  const inputClass =
    "w-full bg-white border border-primary/20 rounded-lg px-3 py-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-sans disabled:opacity-50 disabled:bg-black/5";
  const selectClass =
    "w-full bg-white border border-primary/20 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer font-sans";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="relative w-full max-w-lg bg-secondary rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <UserCog size={15} className="text-secondary" />
                </div>
                <h2 className="font-heading text-lg text-primary">{editData ? "Edit Staff" : "New Staff"}</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-black/40 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <X size={16} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto max-h-[76vh]">
              <div className="flex flex-col gap-4">
                <Field label="Full Name" required>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    required
                    className={inputClass}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email" required>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      required
                      disabled={Boolean(editData)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Username" required>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="e.g. priya.sharma"
                      required
                      disabled={Boolean(editData)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Phone">
                    <input
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Designation">
                    <input
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      placeholder="e.g. Sales Manager"
                      className={inputClass}
                    />
                  </Field>
                </div>

                {!editData && (
                  <>
                    <Field label="Role" required>
                      <select
                        name="roleId"
                        value={form.roleId}
                        onChange={handleChange}
                        required
                        className={selectClass}
                      >
                        <option value="" disabled>
                          Select a role…
                        </option>
                        {roleOptions?.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Password" required>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Minimum 8 characters"
                          required
                          minLength={8}
                          className={`${inputClass} pr-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/50"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </Field>

                    <Toggle
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      label="Active"
                    />
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-primary/10">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm text-black/50 hover:bg-primary/10 hover:text-primary transition-colors font-sans"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-primary text-secondary text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-sans"
                >
                  {loading ? "Saving…" : editData ? "Update Staff" : "Create Staff"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="flex items-center gap-1.5 text-xs font-medium text-primary/70 uppercase tracking-wider font-sans">
          {label}
          {required && <span className="text-gold">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

function Toggle({ name, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <div
        className="relative"
        onClick={() => onChange({ target: { name, type: "checkbox", checked: !checked } })}
      >
        <div
          className={`w-9 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-primary" : "bg-black/15"}`}
        />
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm ${checked ? "left-5" : "left-0.5"}`}
        />
      </div>
      <span className="text-sm text-black/60 group-hover:text-black/80 transition-colors font-sans">{label}</span>
    </label>
  );
}
