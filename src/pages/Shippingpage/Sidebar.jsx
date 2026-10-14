// const navItems = [
//   {
//     group: "Main",
//     items: [
//       { id: "dashboard", label: "Dashboard", icon: "📊" },
//       { id: "orders",    label: "Orders",    icon: "📦", badge: true },
//       { id: "assign",    label: "Courier Assign", icon: "🚚" },
//       { id: "tracking",  label: "Live Tracking", icon: "📍" },
//     ],
//   },
//   {
//     group: "Documents",
//     items: [
//       { id: "labels",    label: "Label Print",  icon: "🏷️" },
//       { id: "invoices",  label: "Invoices",     icon: "🧾" },
//       { id: "manifests", label: "Manifests",    icon: "📋" },
//     ],
//   },
//   {
//     group: "Manage",
//     items: [
//       { id: "returns",  label: "Returns / RTO", icon: "🔄" },
//       { id: "ndr",      label: "NDR",           icon: "⚠️" },
//       { id: "settings", label: "Settings",      icon: "⚙️" },
//     ],
//   },
// ];

// export default function Sidebar({ activePage, onNavigate, pendingCount }) {
//   return (
//     <aside className="w-55 bg-primary text-white flex flex-col shrink-0 overflow-y-auto">
//       {/* Logo */}
//       <div className="px-4 py-5 border-b border-white/10">
//         <h1 className="font-[Philosopher] text-lg text-gold font-normal leading-tight">
//           ShipMate
//         </h1>
//         <p className="text-[11px] text-white/40 mt-0.5">Powered by ShipRocket</p>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 py-2">
//         {navItems.map((group) => (
//           <div key={group.group} className="mb-1">
//             <p className="text-[10px] text-white/30 uppercase tracking-widest px-4 py-2 font-semibold">
//               {group.group}
//             </p>
//             {group.items.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => onNavigate(item.id)}
//                 className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-all duration-150 border-l-[3px] cursor-pointer text-left ${
//                   activePage === item.id
//                     ? "bg-white/10 text-white border-l-gold"
//                     : "text-white/60 border-l-transparent hover:bg-white/5 hover:text-white"
//                 }`}
//               >
//                 <span className="text-base w-5 text-center">{item.icon}</span>
//                 <span className="flex-1">{item.label}</span>
//                 {item.badge && pendingCount > 0 && (
//                   <span className="bg-gold text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
//                     {pendingCount}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="px-4 py-3 border-t border-white/10 text-[11px] text-white/30">
//         v1.0.0 · ShipRocket API v2
//       </div>
//     </aside>
//   );
// }