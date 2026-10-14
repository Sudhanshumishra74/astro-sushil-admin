// import { useEffect } from "react";
// import { useShipping } from "./useShipping";

// // ─── STATUS BADGE ─────────────────────────────────────────────────────────────
// const badgeStyles = {
//   pending:   "bg-yellow-100 text-yellow-800",
//   assigned:  "bg-blue-100 text-blue-800",
//   pickup:    "bg-cyan-100 text-cyan-800",
//   intransit: "bg-purple-100 text-purple-800",
//   delivered: "bg-green-100 text-green-800",
//   cancelled: "bg-red-100 text-red-800",
//   rto:       "bg-orange-100 text-orange-800",
//   ndr:       "bg-rose-100 text-rose-800",
// };

// const badgeIcons = {
//   pending:   "⏳",
//   assigned:  "✅",
//   pickup:    "📦",
//   intransit: "🚛",
//   delivered: "🎉",
//   cancelled: "✕",
//   rto:       "↩",
//   ndr:       "⚠️",
// };

// const badgeLabels = {
//   pending:   "Pending",
//   assigned:  "Assigned",
//   pickup:    "Pickup Scheduled",
//   intransit: "In Transit",
//   delivered: "Delivered",
//   cancelled: "Cancelled",
//   rto:       "RTO",
//   ndr:       "NDR",
// };

// export function StatusBadge({ status }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
//         badgeStyles[status] || "bg-gray-100 text-gray-700"
//       }`}
//     >
//       <span>{badgeIcons[status]}</span>
//       {badgeLabels[status] || status}
//     </span>
//   );
// }

// // ─── BUTTON ───────────────────────────────────────────────────────────────────
// const btnVariants = {
//   primary:  "bg-[#424874] text-white hover:bg-[#363b61]",
//   outline:  "bg-white text-[#424874] border border-[#424874] hover:bg-[#f4eeff]",
//   gold:     "bg-[#D4AF37] text-white hover:bg-[#b8962e]",
//   danger:   "bg-red-500 text-white hover:bg-red-600",
//   success:  "bg-[#1D9E75] text-white hover:bg-[#166f52]",
//   ghost:    "bg-transparent text-[#424874] hover:bg-[#f4eeff]",
// };

// const btnSizes = {
//   sm: "px-3 py-1.5 text-xs",
//   md: "px-4 py-2 text-sm",
//   lg: "px-5 py-2.5 text-sm",
// };

// export function Button({
//   children,
//   variant = "primary",
//   size = "md",
//   className = "",
//   disabled = false,
//   onClick,
//   type = "button",
// }) {
//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled}
//       className={`inline-flex items-center gap-1.5 font-medium rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-[Outfit] ${btnVariants[variant]} ${btnSizes[size]} ${className}`}
//     >
//       {children}
//     </button>
//   );
// }

// // ─── MODAL ────────────────────────────────────────────────────────────────────
// export function Modal({ open, onClose, title, children, footer, size = "md" }) {
//   useEffect(() => {
//     const handler = (e) => e.key === "Escape" && onClose?.();
//     document.addEventListener("keydown", handler);
//     return () => document.removeEventListener("keydown", handler);
//   }, [onClose]);

//   if (!open) return null;

//   const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

//   return (
//     <div
//       className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
//       onClick={(e) => e.target === e.currentTarget && onClose?.()}
//     >
//       <div
//         className={`bg-white rounded-xl w-full ${sizes[size]} max-h-[85vh] flex flex-col shadow-2xl`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-purple-50 shrink-0">
//           <h3 className="font-[Philosopher] text-lg font-normal text-[#424874]">
//             {title}
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer bg-none border-none"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Body */}
//         <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>

//         {/* Footer */}
//         {footer && (
//           <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-purple-50 shrink-0">
//             {footer}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── TOAST ────────────────────────────────────────────────────────────────────
// export function Toast() {
//   const { state } = useShipping();
//   const { toast } = state;

//   const colors = {
//     success: "bg-[#1D9E75]",
//     danger:  "bg-red-500",
//     default: "bg-[#424874]",
//   };

//   return (
//     <div
//       className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium shadow-lg transition-all duration-300 ${
//         toast ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
//       } ${colors[toast?.type] || colors.default}`}
//     >
//       {toast?.type === "success" && <span>✅</span>}
//       {toast?.type === "danger"  && <span>❌</span>}
//       {toast?.message}
//     </div>
//   );
// }

// // ─── STAT CARD ────────────────────────────────────────────────────────────────
// export function StatCard({ label, value, sub, color = "text-[#424874]", icon }) {
//   return (
//     <div className="bg-white rounded-xl p-4 border border-purple-100">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">
//             {label}
//           </p>
//           <p className={`text-2xl font-bold ${color}`}>{value}</p>
//           {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
//         </div>
//         {icon && <span className="text-2xl opacity-60">{icon}</span>}
//       </div>
//     </div>
//   );
// }

// // ─── FORM FIELD ───────────────────────────────────────────────────────────────
// export function FormField({ label, children, className = "" }) {
//   return (
//     <div className={`flex flex-col gap-1.5 ${className}`}>
//       <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//         {label}
//       </label>
//       {children}
//     </div>
//   );
// }

// export function Input({ className = "", ...props }) {
//   return (
//     <input
//       className={`w-full px-3 py-2 border-[1.5px] border-purple-100 rounded-lg text-sm font-[Outfit] outline-none focus:border-[#424874] transition-colors bg-white ${className}`}
//       {...props}
//     />
//   );
// }

// export function Select({ children, className = "", ...props }) {
//   return (
//     <select
//       className={`w-full px-3 py-2 border-[1.5px] border-purple-100 rounded-lg text-sm font-[Outfit] outline-none focus:border-[#424874] transition-colors bg-white cursor-pointer ${className}`}
//       {...props}
//     >
//       {children}
//     </select>
//   );
// }

// export function Textarea({ className = "", ...props }) {
//   return (
//     <textarea
//       className={`w-full px-3 py-2 border-[1.5px] border-purple-100 rounded-lg text-sm font-[Outfit] outline-none focus:border-[#424874] transition-colors bg-white resize-y min-h-[80px] ${className}`}
//       {...props}
//     />
//   );
// }

// // ─── TABLE CARD ───────────────────────────────────────────────────────────────
// export function TableCard({ title, actions, children }) {
//   return (
//     <div className="bg-white rounded-xl border border-purple-100 overflow-hidden">
//       {(title || actions) && (
//         <div className="flex items-center justify-between px-4 py-3 border-b border-purple-50">
//           {title && (
//             <h3 className="text-sm font-semibold text-[#424874]">{title}</h3>
//           )}
//           {actions && <div className="flex items-center gap-2">{actions}</div>}
//         </div>
//       )}
//       <div className="overflow-x-auto">{children}</div>
//     </div>
//   );
// }

// // ─── TABLE BASE ───────────────────────────────────────────────────────────────
// export function Table({ headers, children, emptyMessage = "Koi data nahi mila" }) {
//   return (
//     <table className="w-full border-collapse">
//       <thead>
//         <tr className="bg-[#f4eeff]">
//           {headers.map((h, i) => (
//             <th
//               key={i}
//               className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider border-b border-purple-100 first:pl-4"
//             >
//               {h}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>{children}</tbody>
//     </table>
//   );
// }

// export function Tr({ children, className = "" }) {
//   return (
//     <tr
//       className={`border-b border-purple-50 last:border-0 hover:bg-purple-50/30 transition-colors ${className}`}
//     >
//       {children}
//     </tr>
//   );
// }

// export function Td({ children, className = "" }) {
//   return (
//     <td className={`px-4 py-3 text-sm align-middle first:pl-4 ${className}`}>
//       {children}
//     </td>
//   );
// }