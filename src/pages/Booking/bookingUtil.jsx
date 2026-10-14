/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { Check } from "lucide-react";

export const drawerVariants = {
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
export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};
export const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.22 } },
};
export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};
export const stagger = { visible: { transition: { staggerChildren: 0.05 } } };
export const cardItem = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
};

export const STEPS = ["Customer", "Consultation & Time", "Confirm"];
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const formatDateStr = (date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

export const TInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && (
      <Icon
        size={14}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0a8c8] pointer-events-none"
      />
    )}
    <input
      className={`w-full bg-secondary border border-[#d8d0ee] rounded-xl py-2.5 text-sm text-black
        placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2
        focus:ring-primary/10 transition-all duration-200 ${Icon ? "pl-9 pr-4" : "px-4"}`}
      {...props}
    />
  </div>
);

export const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 pb-1">
    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
      <Icon size={15} className="text-primary" />
    </div>
    <div>
      <h3 className="text-sm font-bold text-black">{title}</h3>
      <p className="text-xs text-black">{subtitle}</p>
    </div>
  </div>
);

export const ConfirmRow = ({ icon: Icon, label, value, sub }) => (
  <div className="flex items-center gap-3 p-3.5 bg-[#faf8ff] border border-[#e0d9f5] rounded-xl">
    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <Icon size={14} className="text-primary" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold text-[#b0a8c8] uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-bold text-black truncate">{value}</p>
      {sub && <p className="text-xs text-black">{sub}</p>}
    </div>
  </div>
);

export const LegendDot = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-[10px] text-black">{label}</span>
  </div>
);

export const Stepper = ({ step }) => (
  <div className="flex items-center gap-0 px-6 py-4 border-b border-[#ede8f8] shrink-0">
    {STEPS.map((s, i) => (
      <div
        key={s}
        className="flex items-center"
        style={{ flex: i < STEPS.length - 1 ? "1" : "none" }}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300 ${
              i < step
                ? "bg-primary border-primary text-white"
                : i === step
                  ? "bg-white border-primary text-primary"
                  : "bg-white border-[#d8d0ee] text-[#b0a8c8]"
            }`}
          >
            {i < step ? <Check size={12} /> : i + 1}
          </div>
          <span
            className={`text-xs font-semibold hidden sm:block transition-colors duration-200 ${
              i === step
                ? "text-primary"
                : i < step
                  ? "text-black"
                  : "text-[#b0a8c8]"
            }`}
          >
            {s}
          </span>
        </div>

        {i < STEPS.length - 1 && (
          <div
            className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${i < step ? "bg-primary" : "bg-[#e0d9f5]"}`}
          />
        )}
      </div>
    ))}
  </div>
);
