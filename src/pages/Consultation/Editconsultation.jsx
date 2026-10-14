/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit3, X, AlertCircle, Loader2, CheckCircle2,
  IndianRupee, Mic, Video, MapPin,
} from "lucide-react";

const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const modeIcon  = { audio: Mic, video: Video, in_person: MapPin };
const modeLabel = { audio: "Audio", video: "Video", in_person: "In-Person" };

const GST_RATE_OPTIONS = [0, 5, 12, 18, 28];

const DEFAULT_MODE_GST = { enabled: true, rate: 0, type: "inclusive" };

// Client-side preview only — the server recomputes and stores the
// authoritative priceWithGst on save.
const previewPriceWithGst = (price, gst) => {
  const p = Number(price) || 0;
  const rate = gst?.enabled ? Number(gst.rate) || 0 : 0;
  if (!rate || gst?.type === "inclusive") return p;
  return Math.round((p + (p * rate) / 100) * 100) / 100;
};

const defaultForm = {
  title: "", type: "normal", description: "",
  responseDays: "",
  modes: [], // [{ mode: "audio", price: { inr: "" }, gst: {...} }]
  priceLabel: "", note: "", includes: [], duration: 30,
  isActive: true,
};

const Field = ({ label, children, error, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-black flex items-center gap-0.5">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <span className="text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={11} /> {error}
      </span>
    )}
  </div>
);

const Input = ({ hasError, className = "", ...props }) => (
  <input
    className={`w-full bg-secondary border rounded-xl px-4 py-2.5 text-sm text-black placeholder-[#b0a8c8] focus:outline-none focus:ring-2 transition-all duration-200
      ${hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/40"
        : "border-[#d8d0ee] focus:border-primary focus:ring-primary/10"
      } ${className}`}
    {...props}
  />
);

const TextArea = ({ hasError, className = "", ...props }) => (
  <textarea
    rows={3}
    className={`w-full bg-secondary border rounded-xl px-4 py-2.5 text-sm text-black placeholder-[#b0a8c8] focus:outline-none focus:ring-2 transition-all duration-200 resize-none
      ${hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/40"
        : "border-[#d8d0ee] focus:border-primary focus:ring-primary/10"
      } ${className}`}
    {...props}
  />
);

export default function EditConsultation({ open, consultation, onClose, updateConsultation }) {
  const [form, setForm] = useState(defaultForm);
  const [includeInput, setIncludeInput] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (open && consultation) {
      setForm({
        ...defaultForm,
        ...consultation,
        modes: consultation.modes?.map((m) => ({
          mode: m.mode,
          price: { inr: m.price?.inr ?? "" },
          gst: {
            enabled: m.gst?.enabled ?? true,
            rate: m.gst?.rate ?? 0,
            type: m.gst?.type ?? "inclusive",
          },
        })) ?? [],
        isActive: consultation.isActive ?? true,
      });
      setErrors({});
      setIncludeInput("");
    }
  }, [open, consultation]);

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((e) => { const next = { ...e }; delete next[key]; return next; });
  };

  const toggleMode = (m) => {
    const exists = form.modes.find((x) => x.mode === m);
    if (exists) {
      set("modes", form.modes.filter((x) => x.mode !== m));
    } else {
      set("modes", [...form.modes, { mode: m, price: { inr: "" }, gst: { ...DEFAULT_MODE_GST } }]);
    }
    if (errors.modes) setErrors((e) => { const next = { ...e }; delete next.modes; return next; });
  };

  const setModePrice = (m, val) => {
    set(
      "modes",
      form.modes.map((x) => (x.mode === m ? { ...x, price: { inr: val } } : x))
    );
    if (errors.modes) setErrors((e) => { const next = { ...e }; delete next.modes; return next; });
  };

  const setModeGst = (m, key, val) => {
    set(
      "modes",
      form.modes.map((x) =>
        x.mode === m ? { ...x, gst: { ...(x.gst || DEFAULT_MODE_GST), [key]: val } } : x
      )
    );
  };

  const validate = () => {
    const e = {};
    if (!form.title || form.title.trim().length < 2) e.title = "Min 2 characters required";
    if (!form.modes.length) {
      e.modes = "Select at least one mode";
    } else if (form.modes.some((m) => !m.price.inr || Number(m.price.inr) < 1)) {
      e.modes = "Enter a valid price (min ₹1) for each selected mode";
    }
    if (!form.duration || Number(form.duration) < 5) e.duration = "Min 5 minutes required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      type: form.type,
      description: form.description || undefined,
      modes: form.modes.map((m) => ({
        mode: m.mode,
        price: { inr: Number(m.price.inr) },
        gst: {
          enabled: m.gst?.enabled ?? true,
          rate: Number(m.gst?.rate) || 0,
          type: m.gst?.type ?? "inclusive",
        },
      })),
      responseDays: form.responseDays ? Number(form.responseDays) : undefined,
      includes: form.includes.length ? form.includes : undefined,
      priceLabel: form.priceLabel || undefined,
      note: form.note || undefined,
      duration: Number(form.duration),
      isActive: form.isActive,
    };
    const result = await updateConsultation(consultation._id, payload);
    setSaving(false);
    if (result) onClose();
  };

  const addInclude = () => {
    if (includeInput.trim()) {
      set("includes", [...(form.includes || []), includeInput.trim()]);
      setIncludeInput("");
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            variants={drawerVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white border-l border-[#e0d9f5] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#ede8f8]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Edit3 size={16} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-black">Edit Consultation</h2>
                  <p className="text-xs text-black/50 truncate max-w-50">{consultation?.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg cursor-pointer hover:bg-secondary flex items-center justify-center text-black transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {hasErrors && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-6 mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                >
                  <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                  <div className="text-xs text-red-600">
                    <span className="font-semibold">Please fix the following:</span>
                    <ul className="mt-1 list-disc list-inside space-y-0.5">
                      {Object.values(errors).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Title + Type */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title" error={errors.title} required>
                  <Input
                    placeholder="e.g. General Consultation"
                    value={form.title}
                    hasError={!!errors.title}
                    onChange={(e) => set("title", e.target.value)}
                  />
                </Field>
                <Field label="Type">
                  <div className="flex gap-2">
                    {["normal", "special"].map((t) => (
                      <button
                        key={t}
                        onClick={() => set("type", t)}
                        className={`flex-1 py-2.5 cursor-pointer rounded-xl text-xs font-semibold border transition-all duration-200 ${
                          form.type === t
                            ? "bg-primary border-primary text-gold"
                            : "bg-secondary border-[#d8d0ee] text-black hover:text-black"
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              {/* Active Status */}
              <Field label="Status">
                <div
                  onClick={() => set("isActive", !form.isActive)}
                  className={`flex items-center justify-between px-5 py-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    form.isActive ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <span className={`text-sm font-semibold ${form.isActive ? "text-green-700" : "text-gray-500"}`}>
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
                  <div className={`relative w-14 h-7 rounded-full transition-all duration-300 ${form.isActive ? "bg-green-500" : "bg-gray-300"}`}>
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${form.isActive ? "left-8" : "left-1"}`} />
                  </div>
                </div>
              </Field>

              {/* Description */}
              <Field label="Description">
                <TextArea
                  placeholder="Brief description..."
                  value={form.description || ""}
                  onChange={(e) => set("description", e.target.value)}
                />
              </Field>

              {/* Modes with per-mode pricing */}
              <Field label="Consultation Modes & Pricing" error={errors.modes} required>
                <div
                  className={`space-y-2.5 rounded-xl transition-all duration-200 ${
                    errors.modes ? "ring-2 ring-red-200 bg-red-50/30 p-3" : ""
                  }`}
                >
                  {["audio", "video", "in_person"].map((m) => {
                    const Icon = modeIcon[m];
                    const selected = form.modes.find((x) => x.mode === m);
                    return (
                      <div key={m} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {/* Mode Toggle Button */}
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={() => toggleMode(m)}
                          className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer rounded-xl border text-xs font-semibold transition-all duration-200 shrink-0 w-32 justify-center ${
                            selected
                              ? "bg-green-100 text-green-700 border-green-200"
                              : errors.modes
                              ? "border-red-200 text-black/60 hover:text-primary bg-secondary"
                              : "border-[#d8d0ee] text-black/60 hover:text-primary bg-secondary"
                          }`}
                        >
                          <Icon size={14} />
                          {modeLabel[m]}
                        </motion.button>

                        {/* Per-mode Price Input — animates in when mode is selected */}
                        <AnimatePresence>
                          {selected && (
                            <motion.div
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.2 }}
                              className="relative flex-1"
                            >
                              <IndianRupee
                                size={13}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 pointer-events-none"
                              />
                              <Input
                                type="number"
                                min={1}
                                placeholder="Price (INR)"
                                value={selected.price.inr}
                                hasError={
                                  !!errors.modes &&
                                  (!selected.price.inr || Number(selected.price.inr) < 1)
                                }
                                onChange={(e) => setModePrice(m, e.target.value)}
                                className="pl-8"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Placeholder text when not selected */}
                        {!selected && (
                          <span className="text-xs text-black/30 pl-1">
                            Click to enable
                          </span>
                        )}
                      </div>

                      {selected && (
                        <div className="pl-34 flex flex-col gap-1.5">
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={selected.gst?.rate ?? 0}
                              onChange={(e) => setModeGst(m, "rate", Number(e.target.value))}
                              className="w-full bg-secondary border border-[#d8d0ee] rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:ring-2 focus:ring-primary/10"
                            >
                              {GST_RATE_OPTIONS.map((rate) => (
                                <option key={rate} value={rate}>GST {rate}%</option>
                              ))}
                            </select>
                            <select
                              value={selected.gst?.type ?? "inclusive"}
                              onChange={(e) => setModeGst(m, "type", e.target.value)}
                              className="w-full bg-secondary border border-[#d8d0ee] rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:ring-2 focus:ring-primary/10"
                            >
                              <option value="inclusive">Inclusive (in price)</option>
                              <option value="exclusive">Exclusive (added on top)</option>
                            </select>
                          </div>
                          <p className="text-xs text-black/50">
                            Customer pays{" "}
                            <span className="font-semibold text-primary">
                              ₹{previewPriceWithGst(selected.price.inr, selected.gst).toLocaleString("en-IN")}
                            </span>
                          </p>
                        </div>
                      )}
                      </div>
                    );
                  })}
                </div>
              </Field>

              {/* Duration + Response Days */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Duration (min)" error={errors.duration} required>
                  <Input
                    type="number"
                    min={5}
                    placeholder="30"
                    value={form.duration}
                    hasError={!!errors.duration}
                    onChange={(e) => set("duration", e.target.value)}
                  />
                </Field>
                <Field label="Response Days">
                  <Input
                    type="number"
                    min={0}
                    placeholder="2"
                    value={form.responseDays ?? ""}
                    onChange={(e) => set("responseDays", e.target.value)}
                  />
                </Field>
              </div>

              {/* Price Label */}
              <Field label="Price Label">
                <Input
                  placeholder="e.g. Per session, Per person"
                  value={form.priceLabel || ""}
                  onChange={(e) => set("priceLabel", e.target.value)}
                />
              </Field>

              {/* Includes */}
              <Field label="Includes">
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="e.g. 30 min session"
                    value={includeInput}
                    onChange={(e) => setIncludeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addInclude()}
                  />
                  <button
                    onClick={addInclude}
                    className="px-3 rounded-xl bg-secondary border border-[#d8d0ee] hover:bg-primary/10 text-black hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <AnimatePresence>
                    {(form.includes || []).map((item, i) => (
                      <motion.span
                        key={item + i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5 bg-secondary border border-[#ede8f8] rounded-lg px-2.5 py-1 text-xs text-black"
                      >
                        <CheckCircle2 size={11} className="text-green-500" />
                        {item}
                        <button
                          onClick={() =>
                            set("includes", form.includes.filter((_, j) => j !== i))
                          }
                          className="hover:text-red-500 transition-colors ml-0.5"
                        >
                          <X size={11} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </Field>

              {/* Note */}
              <Field label="Note">
                <Input
                  placeholder="Any special instructions..."
                  value={form.note || ""}
                  onChange={(e) => set("note", e.target.value)}
                />
              </Field>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#ede8f8] flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#d8d0ee] text-black text-sm font-semibold hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-[#363b62] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Edit3 size={16} />}
                {saving ? "Updating..." : "Update"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}