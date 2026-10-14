/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// components/settings/SettingsUI.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const slideIn = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, x: 16,  transition: { duration: 0.2 } },
};

export const Field = ({ label, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-[#9a9abf] uppercase tracking-wider">{label}</label>
    {children}
    {hint && <p className="text-xs text-[#b0a8c8]">{hint}</p>}
  </div>
);

export const Input = ({ icon: Icon, type = "text", placeholder, value, onChange, secret, className = "" }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center">
      {Icon && (
        <span className="absolute left-3.5 text-[#b0a8c8] pointer-events-none">
          <Icon size={14} />
        </span>
      )}
      <input
        type={secret && !show ? "password" : type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        className={[
          "w-full bg-secondary border border-[#d8d0ee] rounded-xl py-2.5 text-sm text-black",
          "placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2",
          "focus:ring-primary/10 transition-all",
          Icon ? "pl-9 pr-4" : "px-4",
          secret ? "pr-10" : "",
          className,
        ].join(" ")}
      />
      {secret && (
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-3 text-[#b0a8c8] hover:text-primary transition-colors">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
};

export const ColorInput = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="color"
      value={/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) ? value : "#000000"}
      onChange={(e) => onChange(e.target.value)}
      className="w-10 h-10 rounded-lg border border-[#d8d0ee] cursor-pointer shrink-0 bg-secondary"
    />
    <input
      type="text"
      placeholder="#ffffff"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-secondary border border-[#d8d0ee] rounded-xl px-4 py-2.5 text-sm text-black placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
    />
  </div>
);

export const Textarea = ({ placeholder, value, onChange, rows = 4 }) => (
  <textarea
    rows={rows}
    placeholder={placeholder}
    value={value ?? ""}
    onChange={onChange}
    className="w-full bg-secondary border border-[#d8d0ee] rounded-xl px-4 py-3 text-sm text-black placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
  />
);

export const Select = ({ value, onChange, children }) => (
  <select value={value} onChange={onChange}
    className="w-full bg-secondary border border-[#d8d0ee] rounded-xl px-4 py-2.5 text-sm text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
    {children}
  </select>
);

export const NumberInput = ({ icon: Icon, placeholder, value, onChange, prefix }) => (
  <div className="relative flex items-center">
    {prefix && (
      <span className="absolute left-3.5 text-xs font-bold text-[#9a9abf] pointer-events-none select-none">{prefix}</span>
    )}
    {Icon && !prefix && (
      <span className="absolute left-3.5 text-[#b0a8c8] pointer-events-none"><Icon size={14} /></span>
    )}
    <input
      type="number"
      placeholder={placeholder}
      value={value ?? ""}
      onChange={onChange}
      className={[
        "w-full bg-secondary border border-[#d8d0ee] rounded-xl py-2.5 text-sm text-black",
        "placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all",
        prefix ? "pl-7 pr-4" : Icon ? "pl-9 pr-4" : "px-4",
      ].join(" ")}
    />
  </div>
);

export const Toggle = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-[#ede8f8] last:border-0">
    <div>
      <p className="text-sm font-medium text-black">{label}</p>
      {description && <p className="text-xs text-[#9a9abf] mt-0.5">{description}</p>}
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <button type="button" onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 ${value ? "bg-primary" : "bg-[#d8d0ee]"}`}>
        <motion.span layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          animate={{ x: value ? 20 : 0 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
        />
      </button>
      <span className={`text-xs font-medium ${value ? "text-primary" : "text-[#9a9abf]"}`}>
        {value ? "On" : "Off"}
      </span>
    </div>
  </div>
);

export const SectionCard = ({ title, description, icon: Icon, children, index = 0 }) => (
  <motion.div custom={index} variants={fadeUp} initial="hidden" animate="visible"
    className="bg-white rounded-2xl border border-[#e0d9f5] shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-[#ede8f8] bg-[#faf8ff]">
      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon size={15} className="text-primary" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-black">{title}</h3>
        {description && <p className="text-xs text-[#9a9abf] mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </motion.div>
);

export const Grid = ({ cols = 2, children }) => (
  <div className={`grid gap-4 grid-cols-1 ${cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
    {children}
  </div>
);

export const SaveBar = ({ onSave, loading, saved }) => (
  <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#ede8f8]">
    <AnimatePresence>
      {saved && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
          className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
          <CheckCircle size={13} /> Saved!
        </motion.div>
      )}
    </AnimatePresence>
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onSave} disabled={loading}
      className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-[#363b62] text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-primary/20 disabled:opacity-60">
      {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
      {loading ? "Saving…" : "Save Changes"}
    </motion.button>
  </div>
);