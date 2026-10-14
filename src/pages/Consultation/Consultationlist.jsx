/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  Clock,
  IndianRupee,
  Mic,
  Video,
  MapPin,
  X,
  Loader2,
  Layers,
  CheckCircle2,
  Search,
  RefreshCw,
} from "lucide-react";

import AddConsultation from "./Addconsultation";
import EditConsultation from "./Editconsultation";
import { useConsultationStore } from "../../store/useConsultationStore";

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

const modeIcon  = { audio: Mic, video: Video, in_person: MapPin };
const modeLabel = { audio: "Audio", video: "Video", in_person: "In-Person" };

// ─── Confirm Delete Modal ──────────────────────────────────────────────────────
const ConfirmModal = ({ open, title, message, onConfirm, onCancel, loading }) => (
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
          animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
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
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              Delete
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ─── Expanded Row ──────────────────────────────────────────────────────────────
const ExpandedRow = ({ consultation }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
  >
    <td colSpan={7} className="px-0 py-0">
      <div className="mx-4 mb-3 px-5 py-4 bg-[#faf8ff] rounded-xl border border-[#ede8f8] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">

        {/* Mode Pricing breakdown */}
        {consultation.modes?.length > 0 && (
          <div>
            <p className="font-semibold text-black uppercase tracking-wider mb-1.5">
              Pricing
            </p>
            <div className="flex flex-col gap-1.5">
              {consultation.modes.map((m) => {
                const Icon = modeIcon[m.mode];
                const charged = m.priceWithGst || m.price?.inr;
                const differs = charged != null && charged !== m.price?.inr;
                return (
                  <span key={m._id} className="flex items-center gap-1.5 text-black">
                    <Icon size={10} className="text-primary shrink-0" />
                    {modeLabel[m.mode]}:
                    <span className="font-semibold flex items-center gap-0.5">
                      <IndianRupee size={10} />
                      {charged?.toLocaleString?.() ?? charged}
                    </span>
                    {differs && (
                      <span className="text-black/40">
                        (₹{m.price?.inr?.toLocaleString?.() ?? m.price?.inr} + GST)
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Includes */}
        {consultation.includes?.length > 0 && (
          <div>
            <p className="font-semibold text-black uppercase tracking-wider mb-1.5">
              Includes
            </p>
            <div className="flex flex-col gap-1">
              {consultation.includes.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 text-black">
                  <CheckCircle2 size={10} className="text-green-500 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Schedule */}
        <div>
          <p className="font-semibold text-black uppercase tracking-wider mb-1.5">
            Schedule
          </p>
          <p className="text-black">
            Response:{" "}
            <span className="font-medium">
              {consultation.responseDays ?? "—"} day(s)
            </span>
          </p>
        </div>

        {/* Note */}
        {consultation.note && (
          <div>
            <p className="font-semibold text-black uppercase tracking-wider mb-1.5">
              Note
            </p>
            <p className="text-black italic">{consultation.note}</p>
          </div>
        )}

        {/* Price Label */}
        {consultation.priceLabel && (
          <div>
            <p className="font-semibold text-black uppercase tracking-wider mb-1.5">
              Price Label
            </p>
            <p className="text-black">{consultation.priceLabel}</p>
          </div>
        )}
      </div>
    </td>
  </motion.tr>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ConsultationList() {
  const {
    consultations,
    loading,
    fetchConsultations,
    createConsultation,
    updateConsultation,
    deleteConsultation,
  } = useConsultationStore();

  const [addOpen, setAddOpen]       = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId, setDeleteId]     = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch]         = useState("");

  useEffect(() => {
    fetchConsultations();
  }, []);

  const filtered = consultations.filter(
    (c) => !search || c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await deleteConsultation(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  // Helper: get price range string from modes array — shows what the
  // customer is actually charged (priceWithGst), not the pre-GST price.
  const getPriceDisplay = (modes) => {
    if (!modes?.length) return null;
    if (modes.length === 1) {
      const charged = modes[0].priceWithGst || modes[0].price?.inr;
      return charged ? charged.toLocaleString?.() ?? charged : null;
    }
    const prices = modes.map((m) => m.priceWithGst || m.price?.inr).filter(Boolean);
    if (!prices.length) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max
      ? min.toLocaleString?.() ?? min
      : `${min.toLocaleString?.() ?? min} – ${max.toLocaleString?.() ?? max}`;
  };

  return (
    <div className="min-h-screen">
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Layers size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-black text-black">
                Consultations
              </h1>
              <p className="text-xs text-black mt-0.5">
                {consultations.length} service{consultations.length !== 1 ? "s" : ""} configured
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchConsultations}
              className="w-9 h-9 rounded-xl border border-[#d8d0ee] bg-secondary hover:bg-primary/10 flex items-center justify-center text-black hover:text-primary transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-[#363b62] cursor-pointer text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20"
            >
              <Plus size={16} /> New Consultation
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-5 max-w-sm">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0a8c8]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search consultations..."
            className="w-full bg-white border border-[#d8d0ee] rounded-xl pl-9 pr-4 py-2.5 text-sm text-black placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>

        {/* Table */}
        {loading && !consultations.length ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-[#e0d9f5] flex items-center justify-center mb-4">
              <Layers size={28} className="text-[#c0b8d8]" />
            </div>
            <p className="text-sm font-semibold text-black">No consultations found</p>
            <p className="text-xs text-black mt-1">
              {search ? "Try a different search term" : "Create your first consultation above"}
            </p>
          </motion.div>
        ) : (
          <div className="bg-white border border-[#e0d9f5] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#ede8f8] bg-[#faf8ff]">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                      Modes
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-black uppercase tracking-wider">
                      Price
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
                    {filtered.map((c, i) => (
                      <React.Fragment key={c._id}>
                        <motion.tr
                          custom={i}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`border-b border-[#f3f0fb] hover:bg-[#faf8ff] transition-colors ${
                            expandedId === c._id ? "bg-[#faf8ff]" : ""
                          }`}
                        >
                          {/* Title */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  c.type === "special" ? "bg-gold" : "bg-primary"
                                }`}
                              />
                              <div>
                                <p className="font-semibold text-black text-sm leading-tight">
                                  {c.title}
                                </p>
                                {c.description && (
                                  <p className="text-xs text-black/50 mt-0.5 max-w-45 truncate">
                                    {c.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Type */}
                          <td className="px-4 py-4">
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                                c.type === "special"
                                  ? "bg-gold/10 text-gold border-gold/30"
                                  : "bg-primary/10 text-primary border-primary/30"
                              }`}
                            >
                              {c.type.charAt(0).toUpperCase() + c.type.slice(1)}
                            </span>
                          </td>

                          {/* Modes — multiple badges */}
                          <td className="px-4 py-4">
                            {c.modes?.length ? (
                              <div className="flex flex-wrap gap-1">
                                {c.modes.map((m) => {
                                  const Icon = modeIcon[m.mode];
                                  return (
                                    <span
                                      key={m._id}
                                      className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border bg-green-50 text-green-700 border-green-200"
                                    >
                                      <Icon size={10} />
                                      {modeLabel[m.mode]}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-xs text-black/30">No modes</span>
                            )}
                          </td>

                          {/* Duration */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-xs text-black">
                              <Clock size={12} className="text-primary" />
                              {c.duration} min
                            </div>
                          </td>

                          {/* Price — range if multiple modes */}
                          <td className="px-4 py-4">
                            {getPriceDisplay(c.modes) ? (
                              <div className="flex items-center gap-0.5 text-sm font-semibold text-black">
                                <IndianRupee size={13} className="text-[#b0a8c8]" />
                                {getPriceDisplay(c.modes)}
                              </div>
                            ) : (
                              <span className="text-xs text-black/30">—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                                c.isActive !== false
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-gray-100 text-gray-500 border-gray-200"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${c.isActive !== false ? "bg-green-500" : "bg-gray-400"}`} />
                              {c.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <motion.button
                                whileTap={{ scale: 0.93 }}
                                onClick={() => setEditTarget(c)}
                                title="Edit"
                                className="w-8 h-8 cursor-pointer rounded-lg flex items-center justify-center bg-secondary hover:bg-primary/10 border border-[#d8d0ee] hover:border-primary/30 text-black hover:text-primary transition-all"
                              >
                                <Edit3 size={13} />
                              </motion.button>

                              <motion.button
                                whileTap={{ scale: 0.93 }}
                                onClick={() => setDeleteId(c._id)}
                                title="Delete"
                                className="w-8 h-8 cursor-pointer rounded-lg flex items-center justify-center bg-secondary hover:bg-red-50 border border-[#d8d0ee] hover:border-red-200 text-[#b0a8c8] hover:text-red-500 transition-all"
                              >
                                <Trash2 size={13} />
                              </motion.button>

                              <motion.button
                                whileTap={{ scale: 0.93 }}
                                onClick={() =>
                                  setExpandedId(expandedId === c._id ? null : c._id)
                                }
                                title="Details"
                                className="w-8 h-8 cursor-pointer rounded-lg flex items-center justify-center bg-secondary hover:bg-primary/10 border border-[#d8d0ee] text-[#b0a8c8] hover:text-primary transition-all"
                              >
                                <motion.div
                                  animate={{ rotate: expandedId === c._id ? 180 : 0 }}
                                  transition={{ duration: 0.25 }}
                                >
                                  <ChevronDown size={13} />
                                </motion.div>
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>

                        {/* Expanded Details Row */}
                        <AnimatePresence>
                          {expandedId === c._id && (
                            <ExpandedRow key={`exp-${c._id}`} consultation={c} />
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-5 py-3 border-t border-[#ede8f8] bg-[#faf8ff] flex items-center justify-between">
              <p className="text-xs text-black">
                Showing{" "}
                <span className="font-semibold text-black">{filtered.length}</span>{" "}
                of{" "}
                <span className="font-semibold text-black">{consultations.length}</span>{" "}
                consultations
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add Drawer */}
      <AddConsultation
        open={addOpen}
        onClose={() => setAddOpen(false)}
        createConsultation={createConsultation}
      />

      {/* Edit Drawer */}
      <EditConsultation
        open={!!editTarget}
        consultation={editTarget}
        onClose={() => setEditTarget(null)}
        updateConsultation={updateConsultation}
      />

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteId}
        title="Delete Consultation"
        message="This consultation will be permanently removed. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}