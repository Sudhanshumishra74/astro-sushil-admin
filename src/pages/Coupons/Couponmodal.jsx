/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomerStore } from "../../store/useCustomerStore";
import {
  X,
  Tag,
  Percent,
  DollarSign,
  Users,
  User,
  Calendar,
  Hash,
  ShoppingBag,
  RefreshCw,
  ChevronDown,
  Search,
} from "lucide-react";

const initialForm = {
  code: "",
  description: "",
  type: "PERCENTAGE",
  discount: "",
  maxDiscount: "",
  minOrderAmount: "",
  usageLimit: "",
  validTill: "",
  couponType: "PUBLIC",
  assignedUsers: [],
  oneTimePerUser: false,
  isActive: true,
};

export default function CouponModal({
  open,
  onClose,
  onSubmit,
  editData,
  loading,
}) {
  const { customers, fetchCustomers } = useCustomerStore();

  useEffect(() => {
    if (open) {
      fetchCustomers({ page: 1, limit: 100 });
    }
  }, [open]);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editData) {
      setForm({
        code: editData.code || "",
        description: editData.description || "",
        type: editData.type || "PERCENTAGE",
        discount: editData.discount ?? "",
        maxDiscount: editData.maxDiscount ?? "",
        minOrderAmount: editData.minOrderAmount ?? "",
        usageLimit: editData.usageLimit ?? "",
        validTill: editData.validTill ? editData.validTill.slice(0, 10) : "",
        couponType: editData.couponType || "PUBLIC",
        assignedUsers: editData.assignedUsers?.map((u) => u._id || u) || [],
        oneTimePerUser: editData.oneTimePerUser || false,
        isActive: editData.isActive ?? true,
      });
    } else {
      setForm(initialForm);
    }
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      discount: Number(form.discount),
      maxDiscount: form.maxDiscount !== "" ? Number(form.maxDiscount) : null,
      minOrderAmount:
        form.minOrderAmount !== "" ? Number(form.minOrderAmount) : 0,
      usageLimit: form.usageLimit !== "" ? Number(form.usageLimit) : null,
      assignedUsers: form.couponType === "INDIVIDUAL" ? form.assignedUsers : [],
    };
    onSubmit(payload);
  };

  const inputClass =
    "w-full bg-white border border-[#424874]/20 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-[#424874] focus:ring-2 focus:ring-[#424874]/10 transition-all font-sans";

  const selectClass =
    "w-full bg-white border border-[#424874]/20 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#424874] focus:ring-2 focus:ring-[#424874]/10 transition-all appearance-none cursor-pointer font-sans";

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
            className="relative w-full max-w-2xl bg-secondary rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Tag size={15} className="text-secondary" />
                </div>
                <h2 className="font-heading text-lg text-primary">
                  {editData ? "Edit Coupon" : "New Coupon"}
                </h2>
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

            <form
              onSubmit={handleSubmit}
              className="px-6 py-5 overflow-y-auto max-h-[76vh]"
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Coupon Code" icon={<Hash size={13} />} required>
                    <input
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      placeholder="e.g. SAVE200"
                      required
                      className={`${inputClass} uppercase tracking-widest font-mono`}
                    />
                  </Field>
                  <Field label="Discount Type" icon={<Percent size={13} />}>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FLAT">Flat (₹)</option>
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label={
                      form.type === "PERCENTAGE"
                        ? "Discount (%)"
                        : "Discount (₹)"
                    }
                    icon={<DollarSign size={13} />}
                    required
                  >
                    <input
                      name="discount"
                      type="number"
                      value={form.discount}
                      onChange={handleChange}
                      placeholder="e.g. 20"
                      required
                      min={1}
                      className={inputClass}
                    />
                  </Field>

                  <AnimatePresence mode="popLayout">
                    {form.type === "PERCENTAGE" && (
                      <motion.div
                        key="maxDiscount"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Field
                          label="Max Discount (₹)"
                          icon={<DollarSign size={13} />}
                        >
                          <input
                            name="maxDiscount"
                            type="number"
                            value={form.maxDiscount}
                            onChange={handleChange}
                            placeholder="Optional cap"
                            min={0}
                            className={inputClass}
                          />
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Min Order (₹)" icon={<ShoppingBag size={13} />}>
                    <input
                      name="minOrderAmount"
                      type="number"
                      value={form.minOrderAmount}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      min={0}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Usage Limit" icon={<RefreshCw size={13} />}>
                    <input
                      name="usageLimit"
                      type="number"
                      value={form.usageLimit}
                      onChange={handleChange}
                      placeholder="Blank = unlimited"
                      min={1}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Valid Till"
                    icon={<Calendar size={13} />}
                    required
                  >
                    <input
                      name="validTill"
                      type="date"
                      value={form.validTill}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Visibility" icon={<Users size={13} />}>
                    <select
                      name="couponType"
                      value={form.couponType}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="GLOBAL">GLOBAL</option>
                      <option value="INDIVIDUAL">Individual</option>
                    </select>
                  </Field>
                </div>

                <AnimatePresence>
                  {form.couponType === "INDIVIDUAL" && (
                    <motion.div
                      key="assignedUsers"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-visible pb-1"
                    >
                      <Field label="Select Users" icon={<User size={13} />}>
                        <UserChipSelect
                          customers={customers}
                          selected={form.assignedUsers}
                          onChange={(ids) =>
                            setForm((prev) => ({ ...prev, assignedUsers: ids }))
                          }
                        />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field label="Description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Short note about this coupon…"
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </Field>

                <div className="flex items-center gap-6 pt-1">
                  <Toggle
                    name="oneTimePerUser"
                    checked={form.oneTimePerUser}
                    onChange={handleChange}
                    label="One-time per user"
                  />
                  <Toggle
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    label="Active"
                  />
                </div>
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
                  {loading
                    ? "Saving…"
                    : editData
                      ? "Update Coupon"
                      : "Create Coupon"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Chip-based multi-select ──────────────────────────────────────────────────
function UserChipSelect({ customers, selected, onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openDropdown = () => {
    if (containerRef.current) {
      setRect(containerRef.current.getBoundingClientRect());
    }
    setOpen(true);
  };

  // Update rect on scroll/resize while open
  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (containerRef.current)
        setRect(containerRef.current.getBoundingClientRect());
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const selectedSet = new Set(selected);

  const filtered = customers.filter((u) => {
    if (selectedSet.has(u._id)) return false;
    const q = query.toLowerCase();
    return (
      u.firstName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const selectedCustomers = customers.filter((u) => selectedSet.has(u._id));

  const add = (id) => {
    onChange([...selected, id]);
    setQuery("");
  };

  const remove = (id) => {
    onChange(selected.filter((s) => s !== id));
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      {/* Chips + input box */}
      <div
        className="min-h-10.5 w-full bg-white border border-primary/20 rounded-lg px-3 py-2 flex flex-wrap gap-1.5 cursor-text focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all"
        onClick={openDropdown}
      >
        <AnimatePresence>
          {selectedCustomers.map((u) => (
            <motion.span
              key={u._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full border border-primary/20"
            >
              {u.firstName}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(u._id);
                }}
                className="ml-0.5 text-primary/50 hover:text-primary transition-colors"
              >
                <X size={11} strokeWidth={2.5} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            openDropdown();
          }}
          onFocus={openDropdown}
          placeholder={selected.length === 0 ? "Search by name or email…" : ""}
          className="flex-1 min-w-30 text-sm text-black placeholder:text-black/30 bg-transparent outline-none font-sans"
        />
      </div>

      {/* Dropdown — rendered via portal so overflow-hidden/overflow-y-auto can't clip it */}
      {open &&
        rect &&
        createPortal(
          <AnimatePresence>
            <motion.ul
              key="user-dropdown"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "fixed",
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
                zIndex: 9999,
              }}
              className="bg-white border border-primary/15 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-2.5 text-xs text-black/40 font-sans">
                  {query ? "No users found" : "All users selected"}
                </li>
              ) : (
                filtered.map((u) => (
                  <li
                    key={u._id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      add(u._id);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-primary/8 cursor-pointer transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-semibold shrink-0">
                      {u.firstName?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-black truncate">
                        {u.firstName}
                      </span>
                      <span className="text-[10px] text-black/40 truncate">
                        {u.email}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </motion.ul>
          </AnimatePresence>,
          document.body,
        )}

      {selected.length > 0 && (
        <p className="text-[10px] text-black/40 font-sans">
          {selected.length} user{selected.length > 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}

// ── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, icon, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="flex items-center gap-1.5 text-xs font-medium text-primary/70 uppercase tracking-wider font-sans">
          {icon && <span className="text-primary">{icon}</span>}
          {label}
          {required && <span className="text-gold">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

// ── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ name, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <div
        className="relative"
        onClick={() =>
          onChange({ target: { name, type: "checkbox", checked: !checked } })
        }
      >
        <div
          className={`w-9 h-5 rounded-full transition-colors duration-200 ${
            checked ? "bg-primary" : "bg-black/15"
          }`}
        />
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </div>
      <span className="text-sm text-black/60 group-hover:text-black/80 transition-colors font-sans">
        {label}
      </span>
    </label>
  );
}
