/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  ChevronDown,
  Clock,
  IndianRupee,
  X,
  Loader2,
  CalendarDays,
  Layers,
  UserCircle,
  CheckCircle2,
  Search,
  RefreshCw,
  AlertCircle,
  Calendar,
  MapPin,
  Check,
  CalendarClock,
  History,
  DollarSign,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Download,
  Sparkles,
  Package,
} from "lucide-react";

import { useConsultationStore } from "../../store/useConsultationStore";
import { useBookingStore } from "../../store/useBookingStore";
import BookingDrawer from "./BookingDrawers";
import DateFilter from "../../components/common/DateFilter";
import { downloadCsv } from "../../utils/exportCsv";

const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};
const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
};

const STATUS = {
  booked: { label: "Booked", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  confirmed: {
    label: "Confirmed",
    cls: "bg-green-50 text-green-700 border-green-200",
  },
  pending: { label: "Pending", cls: "bg-gold/10  text-gold border-gold/30" },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50   text-red-500 border-red-200",
  },
  completed: {
    label: "Completed",
    cls: "bg-primary/10 text-primary border-primary/30",
  },
};

const isUpcoming = (booking) => {
  if (!booking.date) return false;
  if (booking.status === "cancelled" || booking.status === "completed")
    return false;

  const parts = booking.date.split("-");
  const bookingDate =
    parts.length === 3 && parts[0].length === 2
      ? new Date(parts[2], parts[1] - 1, parts[0])
      : new Date(booking.date);

  if (booking.slot) {
    const startStr = booking.slot.split("-")[0];
    const [h, m] = startStr.split(":").map(Number);
    bookingDate.setHours(h, m, 0, 0);
    return bookingDate.getTime() > Date.now();
  }

  // No slot — fall back to date-only comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookingDate >= today;
};

const ConfirmModal = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          onClick={onCancel}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white border border-[#e0d9f5] rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-black">{title}</h3>
          </div>
          <p className="text-sm text-black mb-6 leading-relaxed">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-[#d8d0ee] text-black text-sm font-medium hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Delete
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// Reschedule Modal
const RescheduleModal = ({ open, booking, onClose, onReschedule }) => {
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!newDate || !newSlot) return;
    setSaving(true);

    const [year, month, day] = newDate.split("-");
    const formattedDate = `${day}-${month}-${year}`;

    const [hours, minutes] = newSlot.split(":").map(Number);
    const duration = booking.consultation?.duration ?? 30; // minutes
    const endTotal = hours * 60 + minutes + duration;
    const endH = String(Math.floor(endTotal / 60)).padStart(2, "0");
    const endM = String(endTotal % 60).padStart(2, "0");
    const formattedSlot = `${newSlot}-${endH}:${endM}`;

    await onReschedule(booking._id, {
      date: formattedDate,
      slot: formattedSlot,
      adminNote: adminNote.trim() || undefined,
    });
    setSaving(false);
    setAdminNote("");
    onClose();
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white border border-[#e0d9f5] rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarClock size={18} className="text-primary" />
                </div>
                <h3 className="text-base font-bold text-black">
                  Reschedule Booking
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-secondary text-[#b0a8c8] hover:text-black transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {booking && (
              <p className="text-xs text-black mb-4 bg-[#faf8ff] border border-[#ede8f8] rounded-xl px-3 py-2.5">
                <span className="font-semibold">
                  {booking.customer?.firstName}
                </span>{" "}
                — {booking.consultation?.title}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-black uppercase tracking-wider block mb-1.5">
                  New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-white border border-[#d8d0ee] rounded-xl px-4 py-2.5 text-sm text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-black uppercase tracking-wider block mb-1.5">
                  Start Time
                  {booking?.consultation?.duration && (
                    <span className="ml-1 font-normal normal-case text-[#b0a8c8]">
                      ({booking.consultation.duration} min session)
                    </span>
                  )}
                </label>
                <input
                  type="time"
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full bg-white border border-[#d8d0ee] rounded-xl px-4 py-2.5 text-sm text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-black uppercase tracking-wider block mb-1.5">
                  Internal Note{" "}
                  <span className="font-normal normal-case text-[#b0a8c8]">
                    (optional, admin only — never shown to the customer)
                  </span>
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={2}
                  placeholder="Why is this being rescheduled? Any context for later reference…"
                  className="w-full bg-white border border-[#d8d0ee] rounded-xl px-4 py-2.5 text-sm text-black placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#d8d0ee] text-black text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || !newDate || !newSlot}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-[#363b62] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Reschedule
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Change Plan Modal
const ChangePlanModal = ({ open, booking, consultations, onClose, onSave }) => {
  const [selectedConsultationId, setSelectedConsultationId] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedConsultation = consultations.find(
    (c) => c._id === selectedConsultationId,
  );
  const availableModes = selectedConsultation?.modes || [];

  const newPrice = (() => {
    if (!selectedMode || !selectedConsultation) return null;
    const m = availableModes.find((m) => m.mode === selectedMode);
    if (!m) return null;
    const currKey = booking?.currency?.toLowerCase();
    return m.price?.[currKey] ?? m.price?.inr ?? null;
  })();

  useEffect(() => {
    if (open && booking) {
      setSelectedConsultationId(booking.consultation?._id || "");
      setSelectedMode(booking.mode || "");
    }
  }, [open, booking]);

  const handleSave = async () => {
    if (!selectedConsultationId || !selectedMode) return;
    setSaving(true);
    await onSave(booking._id, {
      consultationId: selectedConsultationId,
      mode: selectedMode,
      adminNote: adminNote.trim() || undefined,
    });
    setSaving(false);
    setAdminNote("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white border border-[#e0d9f5] rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Layers size={18} className="text-primary" />
                </div>
                <h3 className="text-base font-bold text-black">Change Plan</h3>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-secondary text-[#b0a8c8] hover:text-black transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {booking && (
              <p className="text-xs text-black mb-4 bg-[#faf8ff] border border-[#ede8f8] rounded-xl px-3 py-2.5">
                <span className="font-semibold">
                  {booking.customer?.firstName}
                </span>{" "}
                — Current:{" "}
                <span className="text-primary font-semibold">
                  {booking.consultation?.title} ({booking.mode})
                </span>
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-black uppercase tracking-wider block mb-1.5">
                  Consultation Plan
                </label>
                <select
                  value={selectedConsultationId}
                  onChange={(e) => {
                    setSelectedConsultationId(e.target.value);
                    setSelectedMode("");
                  }}
                  className="w-full bg-white border border-[#d8d0ee] rounded-xl px-4 py-2.5 text-sm text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                >
                  <option value="">Select plan…</option>
                  {consultations.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-black uppercase tracking-wider block mb-1.5">
                  Mode
                </label>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  disabled={!selectedConsultationId}
                  className="w-full bg-white border border-[#d8d0ee] rounded-xl px-4 py-2.5 text-sm text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                >
                  <option value="">Select mode…</option>
                  {availableModes.map((m) => (
                    <option key={m.mode} value={m.mode}>
                      {m.mode.charAt(0).toUpperCase() +
                        m.mode.slice(1).replace("_", " ")}{" "}
                      — ₹{m.price?.inr ?? "—"}
                    </option>
                  ))}
                </select>
              </div>

              {newPrice !== null && (
                <div className="bg-[#faf8ff] border border-[#ede8f8] rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-black uppercase tracking-wider">
                    New Amount
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {booking?.currency === "USD" ? "$" : "₹"}
                    {newPrice}
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-black uppercase tracking-wider block mb-1.5">
                  Internal Note{" "}
                  <span className="font-normal normal-case text-[#b0a8c8]">
                    (optional, admin only — never shown to the customer)
                  </span>
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={2}
                  placeholder="Why is this plan being changed? Any context for later reference…"
                  className="w-full bg-white border border-[#d8d0ee] rounded-xl px-4 py-2.5 text-sm text-black placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#d8d0ee] text-black text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !selectedConsultationId || !selectedMode}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-[#363b62] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Save
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Recommend Products Modal — search is scoped to this store's own
// productResults (not the shared useProductStore the Products page uses),
// so opening this never disturbs that page's list/filters if it's mounted
// elsewhere. Each submit appends a fresh batch (never replaces), and the
// customer gets one email per batch, not per booking.
// Small uppercase pill for a product's externalMeta facet (quality/origin/
// shape) — same three-letter-abbreviation-free plain-text style as the rest
// of the admin, just compact enough to sit inline in a search result row.
const MetaPill = ({ label }) => (
  <span className="px-1.5 py-0.5 rounded-md bg-[#f3f0fb] text-[#6b6b8a] text-[10px] font-semibold uppercase tracking-wide">
    {label}
  </span>
);

const ProductThumb = ({ src, alt, size = 40 }) => (
  <div
    className="rounded-lg overflow-hidden shrink-0 bg-[#f3f0fb] flex items-center justify-center"
    style={{ width: size, height: size }}
  >
    {src ? (
      <img src={src} alt={alt || ""} className="w-full h-full object-cover" />
    ) : (
      <Package size={size * 0.45} className="text-[#c0b8d8]" />
    )}
  </div>
);

const StockBadge = ({ stock }) => {
  if (stock == null) return null;
  if (stock <= 0) {
    return (
      <span className="px-1.5 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-semibold uppercase tracking-wide">
        Out of stock
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[10px] font-semibold uppercase tracking-wide">
        Low stock · {stock}
      </span>
    );
  }
  return (
    <span className="px-1.5 py-0.5 rounded-md bg-green-50 text-green-700 text-[10px] font-semibold uppercase tracking-wide">
      In stock
    </span>
  );
};

const RecommendProductsModal = ({ open, booking, onClose }) => {
  const {
    productResults,
    searchingProducts,
    searchProducts,
    recommendProducts,
    recommending,
  } = useBookingStore();

  const [query, setQuery] = useState("");
  const [pending, setPending] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setPending([]);
    }
  }, [open]);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchProducts(val), 350);
  };

  const addPending = (product) => {
    if (pending.some((p) => p.productId === product._id)) return;
    setPending((prev) => [
      ...prev,
      {
        productId: product._id,
        name: product.name,
        thumbnail: product.thumbnail,
        categoryName: product.category?.name,
        externalMeta: product.externalMeta,
        note: "",
      },
    ]);
    setQuery("");
    searchProducts("");
  };

  const updateNote = (productId, note) => {
    setPending((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, note } : p)),
    );
  };

  const removePending = (productId) => {
    setPending((prev) => prev.filter((p) => p.productId !== productId));
  };

  const handleSubmit = async () => {
    if (!pending.length) return;
    const ok = await recommendProducts(
      booking._id,
      pending.map(({ productId, note }) => ({ productId, note })),
    );
    if (ok) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white border border-[#e0d9f5] rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Sparkles size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-black leading-tight">Recommend Products</h3>
                  <p className="text-[11px] text-[#9a9abf] mt-0.5">
                    Sent to the customer by email once you submit
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-secondary text-[#b0a8c8] hover:text-black transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {booking && (
              <div className="flex items-center gap-2.5 mb-4 bg-[#faf8ff] border border-[#ede8f8] rounded-xl px-3.5 py-3">
                <div className="w-8 h-8 rounded-lg bg-secondary text-primary flex items-center justify-center text-xs font-black shrink-0">
                  {booking.customer?.firstName?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-black leading-tight">
                    {booking.customer?.firstName ?? "Customer"}
                  </p>
                  <p className="text-[11px] text-[#9a9abf] mt-0.5 truncate">
                    {booking.consultation?.title ?? "Consultation"}
                    {booking.mode ? ` · ${booking.mode.charAt(0).toUpperCase()}${booking.mode.slice(1)}` : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="mb-3">
              {/* `relative` scoped to just this row — the icon's `top-1/2`
                  centers against this wrapper's own height, not the taller
                  box below once results render, which is why the dropdown
                  is a sibling after this div rather than nested inside it. */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0a8c8]"
                />
                <input
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full bg-white border border-[#d8d0ee] rounded-xl pl-9 pr-4 py-2.5 text-sm text-black placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {query && (
                // Deliberately in normal flow, not `absolute` — this modal's
                // own panel is `overflow-y-auto` with a bounded max-height,
                // and an absolutely-positioned child can't escape past an
                // ancestor's overflow clipping, so a floating dropdown here
                // got cut off after the first result no matter how many
                // matches there were. In-flow lets the modal's own scroll
                // reach every result instead.
                <div className="mt-1.5 bg-white border border-[#e0d9f5] rounded-xl shadow-sm max-h-72 overflow-y-auto">
                  {searchingProducts && (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 size={16} className="animate-spin text-primary" />
                    </div>
                  )}
                  {!searchingProducts && productResults.length === 0 && (
                    <p className="text-xs text-black py-6 text-center">No products found</p>
                  )}
                  {!searchingProducts &&
                    productResults.map((p) => {
                      const meta = p.externalMeta || {};
                      const alreadyAdded = pending.some((item) => item.productId === p._id);
                      return (
                        <button
                          key={p._id}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => addPending(p)}
                          className="w-full flex items-center gap-3 px-3 py-3 hover:bg-[#faf8ff] transition-colors text-left border-b border-[#f3f0fb] last:border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ProductThumb src={p.thumbnail} alt={p.name} size={44} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-black truncate">{p.name}</p>
                            {p.category?.name && (
                              <p className="text-[11px] text-[#9a9abf] mt-0.5 truncate">
                                {p.category.name}
                              </p>
                            )}
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                              {meta.quality && <MetaPill label={meta.quality} />}
                              {meta.origin && <MetaPill label={meta.origin} />}
                              {meta.shape && <MetaPill label={meta.shape} />}
                              <StockBadge stock={p.stock} />
                            </div>
                          </div>
                          {alreadyAdded && (
                            <span className="text-[10px] text-primary font-semibold shrink-0">Added</span>
                          )}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            {pending.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-black uppercase tracking-wider mb-2">
                  To Recommend ({pending.length})
                </p>
                <div className="space-y-2.5">
                  {pending.map((item) => {
                    const meta = item.externalMeta || {};
                    return (
                      <div
                        key={item.productId}
                        className="border border-[#ede8f8] bg-[#faf8ff] rounded-xl p-3"
                      >
                        <div className="flex items-start gap-2.5 mb-2">
                          <ProductThumb src={item.thumbnail} alt={item.name} size={36} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-black truncate">{item.name}</p>
                            {item.categoryName && (
                              <p className="text-[11px] text-[#9a9abf] mt-0.5">{item.categoryName}</p>
                            )}
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                              {meta.quality && <MetaPill label={meta.quality} />}
                              {meta.origin && <MetaPill label={meta.origin} />}
                              {meta.shape && <MetaPill label={meta.shape} />}
                            </div>
                          </div>
                          <button
                            onClick={() => removePending(item.productId)}
                            className="text-[#b0a8c8] hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <textarea
                          value={item.note}
                          onChange={(e) => updateNote(item.productId, e.target.value)}
                          placeholder="Optional note for the customer..."
                          rows={2}
                          className="w-full bg-white border border-[#d8d0ee] rounded-lg px-2.5 py-2 text-xs text-black placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#d8d0ee] text-black text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!pending.length || recommending}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-[#363b62] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {recommending && <Loader2 size={14} className="animate-spin" />}
                Send Recommendation{pending.length > 1 ? "s" : ""}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ExpandedRow = ({ booking, onRecommend }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
  >
    <td colSpan={7} className="px-0 py-0">
      <div className="mx-4 mb-3 px-5 py-4 bg-[#faf8ff] rounded-b-xl border border-[#ede8f8] grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
        <div>
          <p className="font-semibold text-black uppercase tracking-wider mb-1.5">
            Customer Info
          </p>
          {booking.customer?.email && (
            <p className="text-black">{booking.customer.email}</p>
          )}
          {booking.customer?.city && (
            <p className="text-black mt-0.5">{booking.customer.city}</p>
          )}
        </div>
        <div>
          <p className="font-semibold text-black uppercase tracking-wider mb-1.5">
            Service Details
          </p>
          <p className="text-black">
            {booking.consultation?.duration ?? "—"} min session
          </p>
          {booking.consultation?.priceLabel && (
            <p className="text-black mt-0.5">
              {booking.consultation.priceLabel}
            </p>
          )}
        </div>
        {booking.note && (
          <div>
            <p className="font-semibold text-black uppercase tracking-wider mb-1.5">
              Note
            </p>
            <p className="text-black italic">{booking.note}</p>
          </div>
        )}

        <div className="col-span-2 md:col-span-3 pt-3 border-t border-[#ede8f8]">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-gold" /> Recommended Products
            </p>
            <button
              onClick={() => onRecommend(booking)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-xs font-semibold transition-all"
            >
              <Plus size={11} /> Recommend
            </button>
          </div>

          {booking.recommendedProducts?.length > 0 ? (
            // No remove action here — the customer's already been emailed
            // this recommendation by the time it shows up in this list, so
            // deleting it would only edit the admin's own record without
            // un-sending anything, leaving the booking silently
            // inconsistent with what the customer was actually told.
            // Removal is only offered pre-send, in the modal's staged list.
            <div className="flex flex-wrap gap-2">
              {booking.recommendedProducts.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center gap-2 bg-white border border-[#e0d9f5] rounded-lg pl-1.5 pr-2.5 py-1.5"
                  title={r.note || ""}
                >
                  <ProductThumb src={r.product?.thumbnail} alt={r.product?.name} size={22} />
                  <span className="text-black font-medium truncate max-w-32">
                    {r.product?.name || "Product"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black">No products recommended yet.</p>
          )}
        </div>
      </div>

      {/* Staff-only history — never shown to the customer (unlike `note`
          above, which the customer wrote and can see). One entry per
          reschedule/plan-change that had a note attached, most recent
          first, so a later change never erases why an earlier one happened. */}
      {booking.adminNotes?.length > 0 && (
        <div className="mx-4 mb-3 px-5 py-4 bg-amber-50 rounded-xl border border-amber-100 text-xs">
          <p className="font-semibold text-black uppercase tracking-wider mb-2">
            Internal Notes (Admin Only)
          </p>
          <div className="flex flex-col gap-2.5">
            {[...booking.adminNotes]
              .reverse()
              .map((entry, i) => (
                <div key={i} className="border-l-2 border-amber-300 pl-3">
                  <p className="text-black">{entry.note}</p>
                  <p className="text-black/40 mt-0.5">
                    {entry.action === "reschedule" ? "Reschedule" : "Plan Change"}
                    {entry.addedBy ? ` — ${entry.addedBy}` : ""}
                    {entry.createdAt
                      ? ` · ${new Date(entry.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}`
                      : ""}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </td>
  </motion.tr>
);

// Tab config
const TABS = [
  { key: "upcoming", label: "Upcoming", icon: CalendarClock },
  { key: "past", label: "Past", icon: History },
];

// Reusable booking table
const BookingTable = ({
  bookings: list,
  expandedId,
  setExpandedId,
  setDeleteId,
  onReschedule,
  onChangePlan,
  onRecommend,
  showReschedule = true,
  sortOrder,
  setSortOrder,
}) => {
  if (list.length === 0) {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-[#e0d9f5] flex items-center justify-center mb-4">
          <CalendarDays size={28} className="text-[#c0b8d8]" />
        </div>
        <p className="text-sm font-semibold text-black">No bookings found</p>
        <p className="text-xs text-black mt-1">Nothing to show here</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-[#e0d9f5] rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#ede8f8] bg-[#faf8ff]">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                Service
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                <button
                  onClick={() =>
                    setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
                  }
                  className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                  title={
                    sortOrder === "asc" ? "Sort descending" : "Sort ascending"
                  }
                >
                  Date & Time
                  {sortOrder === "asc" ? (
                    <ArrowUp size={12} />
                  ) : (
                    <ArrowDown size={12} />
                  )}
                </button>
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                Duration
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {list.map((b, i) => {
                const status = STATUS[b.status] ?? STATUS.confirmed;
                return (
                  <React.Fragment key={b._id}>
                    <motion.tr
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`border-b border-[#f3f0fb] hover:bg-[#faf8ff] transition-colors ${
                        expandedId === b._id ? "bg-[#faf8ff]" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-secondary text-primary flex items-center justify-center text-sm font-black shrink-0">
                            {b.customer?.firstName?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-black text-sm leading-tight">
                              {b.customer?.firstName ?? "—"}
                            </p>
                            <p className="text-xs text-black mt-0.5">
                              {b.customer?.email ?? "—"}
                            </p>
                            <p className="text-xs text-black mt-0.5">
                              {b.customer?.phoneNumber ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${b.consultation?.type === "special" ? "bg-gold" : "bg-primary"}`}
                          />
                          <div>
                            <p className="font-semibold text-black text-sm leading-tight">
                              {b.consultation?.title ?? "—"}{" "}
                              <span className="text-xs text-gray-500 font-medium">
                                (
                                {b.mode?.charAt(0).toUpperCase() +
                                  b.mode?.slice(1)}
                                )
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-black whitespace-nowrap">
                          <Calendar size={12} className="text-[#b0a8c8]" />
                          {b.date}
                        </div>
                        {b.slot && (
                          <div className="flex items-center gap-1 text-xs text-black mt-0.5">
                            <Clock size={10} className="text-[#b0a8c8]" />{" "}
                            {b.slot}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-black">
                          <Clock size={12} className="text-[#b0a8c8]" />
                          {b.consultation?.duration ?? "—"} min
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm font-semibold text-black">
                          {b.currency.toLowerCase() === "usd" ? (
                            <DollarSign size={13} className="text-gray-800" />
                          ) : (
                            <IndianRupee size={13} className="text-gray-800" />
                          )}
                          {b.amount ?? "—"}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${status.cls}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Reschedule button — only for upcoming */}
                          {showReschedule && (
                            <motion.button
                              whileTap={{ scale: 0.93 }}
                              onClick={() => onReschedule(b)}
                              title="Reschedule"
                              className="h-8 px-2.5 cursor-pointer rounded-lg flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-xs font-semibold transition-all"
                            >
                              <CalendarClock size={12} />
                              Reschedule
                            </motion.button>
                          )}

                          {showReschedule && (
                            <motion.button
                              whileTap={{ scale: 0.93 }}
                              onClick={() => onChangePlan(b)}
                              title="Change Plan"
                              className="h-8 px-2.5 cursor-pointer rounded-lg flex items-center gap-1.5 bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-xs font-semibold transition-all"
                            >
                              <Layers size={12} />
                              Change Plan
                            </motion.button>
                          )}

                          <motion.button
                            whileTap={{ scale: 0.93 }}
                            onClick={() => setDeleteId(b._id)}
                            title="Delete"
                            className="w-8 h-8 cursor-pointer rounded-lg flex items-center justify-center bg-secondary hover:bg-red-50 border border-[#d8d0ee] hover:border-red-200 text-[#b0a8c8] hover:text-red-500 transition-all"
                          >
                            <Trash2 size={13} />
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.93 }}
                            onClick={() =>
                              setExpandedId(expandedId === b._id ? null : b._id)
                            }
                            title="Details"
                            className="w-8 h-8 cursor-pointer rounded-lg flex items-center justify-center bg-secondary hover:bg-primary/10 border border-[#d8d0ee] text-[#b0a8c8] hover:text-primary transition-all"
                          >
                            <motion.div
                              animate={{
                                rotate: expandedId === b._id ? 180 : 0,
                              }}
                              transition={{ duration: 0.25 }}
                            >
                              <ChevronDown size={13} />
                            </motion.div>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>

                    <AnimatePresence>
                      {expandedId === b._id && (
                        <ExpandedRow
                          key={`exp-${b._id}`}
                          booking={b}
                          onRecommend={onRecommend}
                        />
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function BookingList() {
  const {
    bookings,
    loading,
    fetchBookings,
    createBooking,
    deleteBooking,
    rescheduleBooking,
    changeBookingPlan,
  } = useBookingStore();

  const { consultations, fetchConsultations } = useConsultationStore();
  const handleDrawerClose = () => setDrawerOpen(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sortOrder, setSortOrder] = useState("asc");
  const [planFilter, setPlanFilter] = useState("");
  const [recommendBooking, setRecommendBooking] = useState(null);

  const [rescheduleBooking_, setRescheduleBooking] = useState(null);
  const [changePlanBooking, setChangePlanBooking] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchBookings();
    fetchConsultations?.();
  }, []);

  const handleDateChange = ({ from, to }) => {
    setDateFrom(from);
    setDateTo(to);
    fetchBookings({ fromDate: from, toDate: to, search });
  };

  const handleDateClear = () => {
    setDateFrom("");
    setDateTo("");
    fetchBookings({ search });
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchBookings({ fromDate: dateFrom, toDate: dateTo, search: val });
    }, 400);
  };

  const filtered = planFilter
    ? bookings.filter((b) => b.consultation?._id === planFilter)
    : bookings;

  const parseBookingTimestamp = (b) => {
    const parts = b.date?.split("-") || [];
    let d =
      parts.length === 3 && parts[0].length === 2
        ? new Date(parts[2], parts[1] - 1, parts[0])
        : new Date(b.date);
    if (b.slot) {
      const startStr = b.slot.split("-")[0];
      const [h, m] = startStr.split(":").map(Number);
      d.setHours(h, m, 0, 0);
    }
    return d.getTime();
  };

  const sortFn = (a, b) => {
    const diff = parseBookingTimestamp(a) - parseBookingTimestamp(b);
    return sortOrder === "asc" ? diff : -diff;
  };

  const upcomingBookings = filtered.filter(isUpcoming).sort(sortFn);
  const pastBookings = filtered.filter((b) => !isUpcoming(b)).sort(sortFn);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await deleteBooking(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  const handleCreate = async (payload) => {
    const result = await createBooking(payload);
    return result !== false;
  };

  const handleReschedule = async (bookingId, payload) => {
    if (rescheduleBooking) {
      await rescheduleBooking(bookingId, payload);
    }
  };

  const handleChangePlan = async (bookingId, payload) => {
    await changeBookingPlan(bookingId, payload);
  };

  const displayedBookings =
    activeTab === "upcoming" ? upcomingBookings : pastBookings;

  // Exports every booking matching the plan filter — both upcoming and past
  // together, independent of whichever tab happens to be active — since the
  // "type" being filtered/exported here is the consultation plan, not the tab.
  const handleExport = () => {
    const headers = [
      "Customer Name",
      "Email",
      "Phone",
      "Consultation Plan",
      "Mode",
      "Date",
      "Slot",
      "Duration (min)",
      "Amount",
      "Currency",
      "Status",
      "Timing",
      "Note",
    ];

    const rows = filtered.map((b) => [
      b.customer?.firstName ?? "",
      b.customer?.email ?? "",
      b.customer?.phoneNumber ?? "",
      b.consultation?.title ?? "",
      b.mode ?? "",
      b.date ?? "",
      b.slot ?? "",
      b.consultation?.duration ?? "",
      b.amount ?? "",
      b.currency ?? "",
      b.status ?? "",
      isUpcoming(b) ? "Upcoming" : "Past",
      b.note ?? "",
    ]);

    const planSuffix = planFilter
      ? `_${consultations.find((c) => c._id === planFilter)?.title || "plan"}`
      : "";
    downloadCsv(`bookings${planSuffix}.csv`, headers, rows);
  };

  return (
    <div className="min-h-screen">
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <CalendarDays size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-black text-black">
                Bookings
              </h1>
              <p className="text-xs text-black mt-0.5">
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""}{" "}
                total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchBookings}
              className="w-9 h-9 rounded-xl border border-[#d8d0ee] bg-secondary hover:bg-primary/10 flex items-center justify-center text-black hover:text-primary transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleExport}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#d8d0ee] bg-secondary hover:bg-primary/10 text-black hover:text-primary text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={14} /> Export CSV
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-[#363b62] cursor-pointer text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20"
            >
              <Plus size={16} /> New Booking
            </motion.button>
          </div>
        </div>

        {/* Search + Date Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative max-w-sm w-full sm:w-auto">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0a8c8]"
            />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by customer name or phone..."
              className="w-full bg-white border border-[#d8d0ee] rounded-xl pl-9 pr-4 py-2.5 text-sm text-black placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <DateFilter
            from={dateFrom}
            to={dateTo}
            onChange={handleDateChange}
            onClear={handleDateClear}
          />
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-white border border-[#d8d0ee] rounded-xl px-3 py-2.5 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
          >
            <option value="">All Consultation Plans</option>
            {consultations.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5 bg-[#faf8ff] border border-[#e0d9f5] rounded-xl p-1 w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.key === "upcoming"
                ? upcomingBookings.length
                : pastBookings.length;
            const isActive = activeTab === tab.key;
            return (
              <motion.button
                key={tab.key}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                    : "text-black hover:bg-white"
                }`}
              >
                <Icon size={14} />
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#e0d9f5] text-primary"
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        {loading && !bookings.length ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <BookingTable
                bookings={displayedBookings}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                setDeleteId={setDeleteId}
                onReschedule={(b) => setRescheduleBooking(b)}
                onChangePlan={(b) => setChangePlanBooking(b)}
                onRecommend={(b) => setRecommendBooking(b)}
                showReschedule={true}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />

              {/* Footer count */}
              {displayedBookings.length > 0 && (
                <div className="mt-3 px-2 flex items-center justify-between">
                  <p className="text-xs text-black">
                    Showing{" "}
                    <span className="font-semibold text-black">
                      {displayedBookings.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-black">
                      {bookings.length}
                    </span>{" "}
                    bookings
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      <BookingDrawer open={drawerOpen} onClose={handleDrawerClose} />

      <ConfirmModal
        open={!!deleteId}
        title="Delete Booking"
        message="This booking will be permanently removed. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />

      <RescheduleModal
        open={!!rescheduleBooking_}
        booking={rescheduleBooking_}
        onClose={() => setRescheduleBooking(null)}
        onReschedule={handleReschedule}
      />

      <ChangePlanModal
        open={!!changePlanBooking}
        booking={changePlanBooking}
        consultations={consultations}
        onClose={() => setChangePlanBooking(null)}
        onSave={handleChangePlan}
      />

      <RecommendProductsModal
        open={!!recommendBooking}
        booking={recommendBooking}
        onClose={() => setRecommendBooking(null)}
      />
    </div>
  );
}
