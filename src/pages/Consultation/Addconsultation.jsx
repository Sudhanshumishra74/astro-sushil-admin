/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  IndianRupee,
  Mic,
  Video,
  MapPin,
} from "lucide-react";

const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const MODE_OPTIONS = [
  { key: "audio", label: "Audio", Icon: Mic },
  { key: "video", label: "Video", Icon: Video },
  { key: "in_person", label: "In-Person", Icon: MapPin },
];

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
  title: "",
  type: "normal",
  description: "",
  modes: [], // [{ mode: "audio", price: { inr: "" }, gst: {...} }, ...]
  responseDays: "",
  includes: [],
  priceLabel: "",
  note: "",
  duration: 30,
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
      ${
        hasError
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
      ${
        hasError
          ? "border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/40"
          : "border-[#d8d0ee] focus:border-primary focus:ring-primary/10"
      } ${className}`}
    {...props}
  />
);

export default function AddConsultation({ open, onClose, createConsultation }) {
  const [form, setForm] = useState(defaultForm);
  const [includeInput, setIncludeInput] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(defaultForm);
      setErrors({});
      setIncludeInput("");
    }
  }, [open]);

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key])
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
  };

  // Toggle a mode on/off; when toggled on, add with empty price
  const toggleMode = (modeKey) => {
    const exists = form.modes.find((m) => m.mode === modeKey);
    if (exists) {
      set(
        "modes",
        form.modes.filter((m) => m.mode !== modeKey),
      );
    } else {
      set("modes", [
        ...form.modes,
        { mode: modeKey, price: { inr: "" }, gst: { ...DEFAULT_MODE_GST } },
      ]);
    }
    // Clear mode-related errors
    setErrors((e) => {
      const next = { ...e };
      delete next.modes;
      delete next[`price_${modeKey}`];
      return next;
    });
  };

  // Update price for a specific mode
  const setModePrice = (modeKey, inrValue) => {
    set(
      "modes",
      form.modes.map((m) =>
        m.mode === modeKey ? { ...m, price: { inr: inrValue } } : m,
      ),
    );
    setErrors((e) => {
      const next = { ...e };
      delete next[`price_${modeKey}`];
      return next;
    });
  };

  // Update GST config for a specific mode
  const setModeGst = (modeKey, key, val) => {
    set(
      "modes",
      form.modes.map((m) =>
        m.mode === modeKey
          ? { ...m, gst: { ...(m.gst || DEFAULT_MODE_GST), [key]: val } }
          : m,
      ),
    );
  };

  const validate = () => {
    const e = {};
    if (!form.title || form.title.trim().length < 2)
      e.title = "Min 2 characters required";
    if (!form.modes.length) e.modes = "Select at least one consultation mode";
    form.modes.forEach(({ mode, price }) => {
      if (!price.inr || Number(price.inr) < 1)
        e[`price_${mode}`] =
          `Enter a valid price for ${mode.replace("_", " ")} (min ₹1)`;
    });
    if (!form.duration || Number(form.duration) < 5)
      e.duration = "Min 5 minutes required";
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
    };
    const result = await createConsultation(payload);
    setSaving(false);
    if (result) onClose();
  };

  const addInclude = () => {
    if (includeInput.trim()) {
      set("includes", [...(form.includes || []), includeInput.trim()]);
      setIncludeInput("");
    }
  };

  const allErrors = Object.entries(errors);
  const hasErrors = allErrors.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white border-l border-[#e0d9f5] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#ede8f8]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plus size={16} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-black">
                    New Consultation
                  </h2>
                  <p className="text-xs text-black/50">
                    Fill in consultation details
                  </p>
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
                  <AlertCircle
                    size={14}
                    className="text-red-500 mt-0.5 shrink-0"
                  />
                  <div className="text-xs text-red-600">
                    <span className="font-semibold">
                      Please fix the following:
                    </span>
                    <ul className="mt-1 list-disc list-inside space-y-0.5">
                      {allErrors.map(([key, err]) => (
                        <li key={key}>{err}</li>
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

              {/* Description */}
              <Field label="Description">
                <TextArea
                  placeholder="Brief description..."
                  value={form.description || ""}
                  onChange={(e) => set("description", e.target.value)}
                />
              </Field>

              {/* Modes — multi-select, each with its own price */}
              <Field
                label="Consultation Modes & Pricing"
                error={errors.modes}
                required
              >
                <div className="space-y-2">
                  {MODE_OPTIONS.map(({ key, label, Icon }) => {
                    const active = form.modes.find((m) => m.mode === key);
                    const priceError = errors[`price_${key}`];
                    return (
                      <div key={key}>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleMode(key)}
                          className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl border text-sm font-semibold transition-all duration-200 ${
                            active
                              ? "bg-green-50 text-green-700 border-green-300"
                              : errors.modes
                                ? "border-red-200 text-black hover:text-primary"
                                : "border-[#d8d0ee] text-black hover:text-primary hover:border-primary/40"
                          }`}
                        >
                          <Icon size={15} />
                          <span className="flex-1 text-left">{label}</span>
                          {active ? (
                            <CheckCircle2
                              size={15}
                              className="text-green-500"
                            />
                          ) : (
                            <Plus size={14} className="opacity-40" />
                          )}
                        </motion.button>

                        {/* Price input slides in when mode is selected */}
                        <AnimatePresence>
                          {active && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                                marginTop: 8,
                              }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pl-2">
                                <div className="relative">
                                  <IndianRupee
                                    size={13}
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                                      priceError
                                        ? "text-red-400"
                                        : "text-black/50"
                                    }`}
                                  />
                                  <Input
                                    type="number"
                                    min={1}
                                    placeholder={`Price for ${label}...`}
                                    value={active.price.inr}
                                    hasError={!!priceError}
                                    onChange={(e) =>
                                      setModePrice(key, e.target.value)
                                    }
                                    className="pl-8"
                                  />
                                </div>
                                {priceError && (
                                  <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle size={11} /> {priceError}
                                  </span>
                                )}

                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <select
                                    value={active.gst?.rate ?? 0}
                                    onChange={(e) =>
                                      setModeGst(key, "rate", Number(e.target.value))
                                    }
                                    className="w-full bg-secondary border border-[#d8d0ee] rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:ring-2 focus:ring-primary/10"
                                  >
                                    {GST_RATE_OPTIONS.map((rate) => (
                                      <option key={rate} value={rate}>
                                        GST {rate}%
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    value={active.gst?.type ?? "inclusive"}
                                    onChange={(e) =>
                                      setModeGst(key, "type", e.target.value)
                                    }
                                    className="w-full bg-secondary border border-[#d8d0ee] rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:ring-2 focus:ring-primary/10"
                                  >
                                    <option value="inclusive">Inclusive (in price)</option>
                                    <option value="exclusive">Exclusive (added on top)</option>
                                  </select>
                                </div>

                                <p className="text-xs text-black/50 mt-1.5">
                                  Customer pays{" "}
                                  <span className="font-semibold text-primary">
                                    ₹{previewPriceWithGst(active.price.inr, active.gst).toLocaleString("en-IN")}
                                  </span>
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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
                  placeholder="e.g. Per session"
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
                            set(
                              "includes",
                              form.includes.filter((_, j) => j !== i),
                            )
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
                className="flex-1 py--3 rounded-xl bg-primary hover:bg-[#363b62] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                {saving ? "Creating..." : "Create"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
