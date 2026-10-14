// import DashboardStats from "../../layouts/DashboardStats";

// export default function Dashboard() {
//   return (
//     <>
//       <div className="flex flex-col gap-6  bg-secondary min-h-screen font-sans">
//         <div className="grid grid-cols-4 gap-4">
//           {[
//             {
//               icon: "💫",
//               label: "Total Revenue",
//               value: "₹4,82,350",
//               change: "▲ 18.4%",
//               note: "vs last month",
//               up: true,
//               accent: "border-b-gold",
//               bg: "♃",
//             },
//             {
//               icon: "📦",
//               label: "Orders This Month",
//               value: "2,847",
//               change: "▲ 9.2%",
//               note: "vs last month",
//               up: true,
//               accent: "border-b-primary",
//               bg: "☽",
//             },
//             {
//               icon: "🔮",
//               label: "Readings Booked",
//               value: "638",
//               change: "▲ 31%",
//               note: "since new moon",
//               up: true,
//               accent: "border-b-green-400",
//               bg: "♀",
//             },
//             {
//               icon: "👥",
//               label: "New Customers",
//               value: "1,204",
//               change: "▼ 3.1%",
//               note: "vs last month",
//               up: false,
//               accent: "border-b-rose-400",
//               bg: "♄",
//             },
//           ].map((s) => (
//             <div
//               key={s.label}
//               className="bg-white rounded-2xl p-5 border border-primary/8 relative overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-transform"
//               style={{
//                 borderBottom: `3px solid ${s.up ? (s.label === "Total Revenue" ? "#D4AF37" : s.label === "Readings Booked" ? "#5cb87a" : "#424874") : "#e07b6b"}`,
//               }}
//             >
//               <span className="absolute -right-2.5 -top-2.5 text-7xl opacity-[0.04] font-serif select-none">
//                 {s.bg}
//               </span>
//               <span className="text-2xl mb-3 block">{s.icon}</span>
//               <div className="text-[10px] tracking-[1.5px] uppercase text-primary/50 font-medium">
//                 {s.label}
//               </div>
//               <div className="font-heading text-3xl text-primary mt-1 leading-none">
//                 {s.value}
//               </div>
//               <div
//                 className={`text-xs flex items-center gap-1 mt-1.5 ${s.up ? "text-green-600" : "text-rose-500"}`}
//               >
//                 {s.change}&nbsp;
//                 <span className="text-primary/40">{s.note}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div
//           className="grid gap-4"
//           style={{ gridTemplateColumns: "1.4fr 1fr" }}
//         >
        
//           <div className="bg-white rounded-2xl p-5 border border-primary/8">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-heading text-primary text-base">
//                 Revenue Overview
//               </h2>
//               <span className="text-xs text-gold cursor-pointer font-medium">
//                 Monthly ▾
//               </span>
//             </div>
//             <div className="flex items-end gap-2 h-36 pt-2">
//               {[
//                 { label: "Jan", prod: 55, svc: 40 },
//                 { label: "Feb", prod: 70, svc: 50 },
//                 { label: "Mar", prod: 60, svc: 65 },
//                 { label: "Apr", prod: 88, svc: 75, active: true },
//                 { label: "May", prod: 65, svc: 55 },
//                 { label: "Jun", prod: 80, svc: 60 },
//                 { label: "Jul", prod: 75, svc: 70 },
//               ].map((b) => (
//                 <div
//                   key={b.label}
//                   className="flex-1 flex flex-col items-center gap-1"
//                 >
//                   <div className="flex-1 flex items-end w-full gap-0.5">
//                     <div
//                       className="flex-1 rounded-t-sm transition-opacity hover:opacity-80 cursor-pointer"
//                       style={{
//                         height: `${b.prod}%`,
//                         background: b.active
//                           ? "#424874"
//                           : "rgba(66,72,116,0.18)",
//                       }}
//                     />
//                     <div
//                       className="flex-1 rounded-t-sm transition-opacity hover:opacity-80 cursor-pointer"
//                       style={{
//                         height: `${b.svc}%`,
//                         background: b.active
//                           ? "#D4AF37"
//                           : "rgba(212,175,55,0.55)",
//                       }}
//                     />
//                   </div>
//                   <span className="text-[9px] text-primary/40 tracking-[0.5px]">
//                     {b.label}
//                   </span>
//                 </div>
//               ))}
//             </div>
//             <div className="flex gap-4 mt-3">
//               <div className="flex items-center gap-1.5 text-[10.5px] text-primary/55">
//                 <span className="w-2 h-2 rounded-full bg-primary inline-block" />{" "}
//                 Products
//               </div>
//               <div className="flex items-center gap-1.5 text-[10.5px] text-primary/55">
//                 <span
//                   className="w-2 h-2 rounded-full inline-block"
//                   style={{ background: "#D4AF37" }}
//                 />{" "}
//                 Readings & Services
//               </div>
//             </div>
//           </div>

//           {/* Top Products */}
//           <div className="bg-white rounded-2xl p-5 border border-primary/8">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-heading text-primary text-base">
//                 Top Products
//               </h2>
//               <span className="text-xs text-gold cursor-pointer font-medium">
//                 View all
//               </span>
//             </div>
//             {[
//               {
//                 rank: 1,
//                 emoji: "🔮",
//                 name: "Crystal Ball — Amethyst",
//                 meta: "Divination · 89 sold",
//                 rev: "₹62,400",
//                 chg: "+28%",
//                 bg: "#f0eaff",
//               },
//               {
//                 rank: 2,
//                 emoji: "🌙",
//                 name: "Moon Phase Jewelry Set",
//                 meta: "Accessories · 241 sold",
//                 rev: "₹48,200",
//                 chg: "+14%",
//                 bg: "#fff8e6",
//               },
//               {
//                 rank: 3,
//                 emoji: "🕯️",
//                 name: "Ritual Candle Bundle",
//                 meta: "Ceremony · 374 sold",
//                 rev: "₹37,840",
//                 chg: "+22%",
//                 bg: "#e8f8f0",
//               },
//               {
//                 rank: 4,
//                 emoji: "📜",
//                 name: "Birth Chart Reading",
//                 meta: "Services · 162 sold",
//                 rev: "₹32,400",
//                 chg: "+37%",
//                 bg: "#f4eeff",
//               },
//             ].map((p) => (
//               <div
//                 key={p.rank}
//                 className="flex items-center gap-3 py-2.5 border-b border-primary/5 last:border-none last:pb-0"
//               >
//                 <span className="font-heading text-lg text-primary/15 w-6 text-center shrink-0">
//                   {p.rank}
//                 </span>
//                 <div
//                   className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
//                   style={{ background: p.bg }}
//                 >
//                   {p.emoji}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="text-sm font-medium text-black truncate">
//                     {p.name}
//                   </div>
//                   <div className="text-[10.5px] text-primary/40 mt-0.5">
//                     {p.meta}
//                   </div>
//                 </div>
//                 <div className="text-right shrink-0">
//                   <div className="font-heading text-[15px] text-primary">
//                     {p.rev}
//                   </div>
//                   <div className="text-[10px] text-green-600">{p.chg}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

       
//         <div
//           className="grid gap-4"
//           style={{ gridTemplateColumns: "1.4fr 1fr" }}
//         >
//           {/* Orders Table */}
//           <div className="bg-white rounded-2xl p-5 border border-primary/8">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-heading text-primary text-base">
//                 Recent Orders
//               </h2>
//               <span className="text-xs text-gold cursor-pointer font-medium">
//                 See all orders
//               </span>
//             </div>
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr>
//                   {["Product", "Customer", "Sign", "Amount", "Status"].map(
//                     (h) => (
//                       <th
//                         key={h}
//                         className="text-[10px] tracking-[1.5px] uppercase text-primary/40 pb-2.5 text-left font-medium border-b border-primary/8"
//                       >
//                         {h}
//                       </th>
//                     ),
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   {
//                     thumb: "🔮",
//                     bg: "#f0eaff",
//                     name: "Crystal Ball",
//                     cat: "Divination",
//                     cust: "Priya Sharma",
//                     sign: "♏",
//                     amt: "₹7,200",
//                     status: "Delivered",
//                     sc: "bg-green-50 text-green-700",
//                   },
//                   {
//                     thumb: "🌙",
//                     bg: "#fff8e6",
//                     name: "Moon Set",
//                     cat: "Accessories",
//                     cust: "Arjun Mehra",
//                     sign: "♈",
//                     amt: "₹3,400",
//                     status: "In Transit",
//                     sc: "bg-primary/8 text-primary",
//                   },
//                   {
//                     thumb: "🕯️",
//                     bg: "#e8f8f0",
//                     name: "Ritual Bundle",
//                     cat: "Ceremony",
//                     cust: "Meera Joshi",
//                     sign: "♓",
//                     amt: "₹1,850",
//                     status: "Pending",
//                     sc: "bg-yellow-50 text-yellow-700",
//                   },
//                   {
//                     thumb: "📜",
//                     bg: "#f4eeff",
//                     name: "Birth Chart",
//                     cat: "Services",
//                     cust: "Rohit Kapoor",
//                     sign: "♌",
//                     amt: "₹2,000",
//                     status: "Delivered",
//                     sc: "bg-green-50 text-green-700",
//                   },
//                   {
//                     thumb: "🌿",
//                     bg: "#fff0ed",
//                     name: "Sage Kit",
//                     cat: "Cleansing",
//                     cust: "Ananya Singh",
//                     sign: "♊",
//                     amt: "₹950",
//                     status: "Cancelled",
//                     sc: "bg-rose-50 text-rose-600",
//                   },
//                 ].map((o) => (
//                   <tr
//                     key={o.cust}
//                     className="border-b border-primary/5 last:border-none"
//                   >
//                     <td className="py-2.5">
//                       <div className="flex items-center gap-2.5">
//                         <div
//                           className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
//                           style={{ background: o.bg }}
//                         >
//                           {o.thumb}
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-black">
//                             {o.name}
//                           </div>
//                           <div className="text-[10.5px] text-primary/40">
//                             {o.cat}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="text-sm py-2.5">{o.cust}</td>
//                     <td className="text-base py-2.5">{o.sign}</td>
//                     <td className="text-sm font-medium text-primary py-2.5">
//                       {o.amt}
//                     </td>
//                     <td className="py-2.5">
//                       <span
//                         className={`text-[10px] px-2 py-1 rounded-full font-medium ${o.sc}`}
//                       >
//                         {o.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="bg-white rounded-2xl p-5 border border-primary/8">
//             <div className="flex items-center justify-between mb-3">
//               <h2 className="font-heading text-primary text-base">
//                 Sales by Sun Sign
//               </h2>
//               <span className="text-xs text-gold cursor-pointer font-medium">
//                 This month
//               </span>
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               {[
//                 { sym: "♈", name: "Aries", pct: 12, w: 72 },
//                 { sym: "♉", name: "Taurus", pct: 9, w: 54 },
//                 { sym: "♊", name: "Gemini", pct: 7, w: 42 },
//                 { sym: "♋", name: "Cancer", pct: 11, w: 66 },
//                 { sym: "♌", name: "Leo", pct: 15, w: 90 },
//                 { sym: "♍", name: "Virgo", pct: 8, w: 48 },
//                 { sym: "♎", name: "Libra", pct: 6, w: 36 },
//                 { sym: "♏", name: "Scorpio", pct: 13, w: 78 },
//               ].map((z) => (
//                 <div
//                   key={z.name}
//                   className="flex items-center gap-2 bg-secondary rounded-xl px-2.5 py-2 border border-transparent hover:border-primary/15 hover:bg-[#ede8fa] cursor-pointer transition-all"
//                 >
//                   <span className="text-lg w-7 text-center">{z.sym}</span>
//                   <div className="min-w-0">
//                     <div className="text-xs font-medium text-primary">
//                       {z.name}
//                     </div>
//                     <div className="text-[10px] text-primary/45">{z.pct}%</div>
//                   </div>
//                   <div className="flex-1 bg-primary/8 rounded h-1 overflow-hidden">
//                     <div
//                       className="h-full bg-primary rounded"
//                       style={{ width: `${z.w}%` }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Planetary Transits */}
//             <div className="mt-4 pt-4 border-t border-primary/7">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="font-heading text-primary text-sm">
//                   Planetary Transits
//                 </h3>
//                 <span className="text-[10px] text-gold cursor-pointer font-medium">
//                   Impact on sales
//                 </span>
//               </div>
//               {[
//                 {
//                   planet: "♃",
//                   name: "Jupiter in Gemini",
//                   desc: "Boosts communication products",
//                   level: "High",
//                   cls: "bg-yellow-50 text-yellow-700",
//                 },
//                 {
//                   planet: "♀",
//                   name: "Venus in Pisces",
//                   desc: "Spiritual & love readings up",
//                   level: "High",
//                   cls: "bg-yellow-50 text-yellow-700",
//                 },
//                 {
//                   planet: "♄",
//                   name: "Saturn retrograde",
//                   desc: "Slowdown in impulse buys",
//                   level: "Med",
//                   cls: "bg-primary/8 text-primary",
//                 },
//               ].map((t) => (
//                 <div
//                   key={t.name}
//                   className="flex items-center gap-2.5 py-2 border-b border-primary/5 last:border-none"
//                 >
//                   <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm shrink-0">
//                     {t.planet}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-[13px] font-medium text-black">
//                       {t.name}
//                     </div>
//                     <div className="text-[10.5px] text-primary/40 mt-0.5">
//                       {t.desc}
//                     </div>
//                   </div>
//                   <span
//                     className={`text-[10px] px-2 py-1 rounded-full font-medium shrink-0 ${t.cls}`}
//                   >
//                     {t.level}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
