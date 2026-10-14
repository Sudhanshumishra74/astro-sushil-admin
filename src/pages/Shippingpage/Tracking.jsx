// import { useState } from "react";
// import { useShipping } from "../hooks/useShipping";
// import { StatusBadge, Button, TableCard, Table, Tr, Td } from "../components/UI";
// import { trackingTimeline } from "../data/mockData";

// function TrackingTimeline({ steps }) {
//   return (
//     <div className="space-y-0">
//       {steps.map((step, i) => (
//         <div key={i} className="flex gap-3 relative pb-5 last:pb-0">
//           {/* Connector line */}
//           {i < steps.length - 1 && (
//             <div
//               className={`absolute left-2.5 top-6 bottom-0 w-px ${
//                 step.done ? "bg-[#1D9E75]" : "bg-purple-100"
//               }`}
//             />
//           )}
//           {/* Dot */}
//           <div
//             className={`w-5.5 h-5.5 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold mt-0.5 z-10 ${
//               step.done
//                 ? "bg-[#1D9E75] text-white"
//                 : step.active
//                 ? "bg-primary text-white ring-4 ring-primary/20"
//                 : "bg-purple-50 text-gray-400 border-2 border-purple-100"
//             }`}
//           >
//             {step.done ? "✓" : step.active ? "→" : "○"}
//           </div>
//           {/* Content */}
//           <div className="pt-0.5">
//             <p className={`text-sm font-semibold ${step.done || step.active ? "text-gray-800" : "text-gray-400"}`}>
//               {step.title}
//             </p>
//             <p className="text-[11px] text-gray-400 mt-0.5">{step.time}</p>
//             {step.location && (
//               <p className="text-[11px] text-primary font-medium mt-0.5">📍 {step.location}</p>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default function Tracking() {
//   const { state } = useShipping();
//   const { orders } = state;

//   const [awb, setAwb]           = useState("");
//   const [tracked, setTracked]   = useState(null);
//   const [loading, setLoading]   = useState(false);

//   const active = orders.filter((o) =>
//     ["assigned", "pickup", "intransit"].includes(o.status)
//   );

//   const handleTrack = () => {
//     if (!awb.trim()) return;
//     setLoading(true);
//     setTimeout(() => {
//       const order = orders.find((o) => o.awb === awb.trim());
//       setTracked({
//         awb: awb.trim(),
//         order: order || null,
//         steps: trackingTimeline[awb.trim()] || [
//           { title: "Order Placed",    time: "04 May 2026, 10:30 AM", location: "Origin",      done: true,  active: false },
//           { title: "Pickup Done",     time: "05 May 2026, 2:00 PM",  location: "Warehouse",   done: true,  active: false },
//           { title: "In Transit",      time: "06 May 2026, 6:00 AM",  location: "Hub",         done: false, active: true },
//           { title: "Out for Delivery",time: "Scheduled",              location: "",            done: false, active: false },
//           { title: "Delivered",       time: "Expected soon",          location: "",            done: false, active: false },
//         ],
//       });
//       setLoading(false);
//     }, 800);
//   };

//   return (
//     <div className="space-y-4">
//       {/* AWB Search */}
//       <div className="bg-white rounded-xl border border-purple-100 p-4">
//         <h3 className="text-sm font-semibold text-primary mb-3">AWB se Track Karo</h3>
//         <div className="flex gap-3">
//           <input
//             className="flex-1 max-w-sm px-3 py-2.5 border-[1.5px] border-purple-100 rounded-lg text-sm font-[Outfit] outline-none focus:border-primary"
//             placeholder="AWB Number daalo... (e.g. SR123456789)"
//             value={awb}
//             onChange={(e) => setAwb(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleTrack()}
//           />
//           <Button variant="primary" onClick={handleTrack} disabled={loading}>
//             {loading ? "Tracking..." : "Track Karo"}
//           </Button>
//           {tracked && (
//             <Button variant="outline" onClick={() => { setTracked(null); setAwb(""); }}>
//               Clear
//             </Button>
//           )}
//         </div>

//         {/* Quick links */}
//         <div className="flex gap-2 mt-3 flex-wrap">
//           {active.slice(0, 4).map((o) => (
//             <button
//               key={o.awb}
//               onClick={() => { setAwb(o.awb); }}
//               className="text-[11px] bg-secondary text-primary px-2.5 py-1 rounded-full cursor-pointer hover:bg-purple-200 transition-colors font-medium"
//             >
//               {o.id} ({o.awb})
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Tracking Result */}
//       {tracked && (
//         <div className="bg-white rounded-xl border border-purple-100 overflow-hidden">
//           <div className="flex items-center justify-between px-4 py-3 border-b border-purple-50 bg-secondary">
//             <div>
//               <h3 className="font-semibold text-primary">AWB: {tracked.awb}</h3>
//               {tracked.order && (
//                 <p className="text-xs text-gray-400 mt-0.5">
//                   {tracked.order.id} · {tracked.order.customer} · {tracked.order.courier}
//                 </p>
//               )}
//             </div>
//             <StatusBadge status={tracked.order?.status || "intransit"} />
//           </div>

//           <div className="grid grid-cols-2 gap-6 p-5">
//             {/* Shipment Info */}
//             {tracked.order && (
//               <div>
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Shipment Details</p>
//                 <div className="bg-secondary rounded-lg p-3 space-y-2">
//                   {[
//                     ["Order ID", tracked.order.id],
//                     ["Customer", tracked.order.customer],
//                     ["Courier", tracked.order.courier],
//                     ["Weight", tracked.order.weight + " kg"],
//                     ["Amount", "₹" + tracked.order.amount],
//                     ["Payment", tracked.order.cod],
//                   ].map(([k, v]) => (
//                     <div key={k} className="flex justify-between text-sm">
//                       <span className="text-gray-500">{k}</span>
//                       <span className="font-medium">{v}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Timeline */}
//             <div>
//               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Tracking Timeline</p>
//               <TrackingTimeline steps={tracked.steps} />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Active Shipments Table */}
//       <TableCard title={`Active Shipments (${active.length})`}>
//         <Table headers={["Order ID", "AWB", "Customer", "Courier", "Date", "Status", "Action"]}>
//           {active.map((o) => (
//             <Tr key={o.id}>
//               <Td><span className="font-semibold text-primary text-xs">{o.id}</span></Td>
//               <Td><span className="font-mono text-xs text-gray-500">{o.awb}</span></Td>
//               <Td><div className="font-medium text-sm">{o.customer}</div><div className="text-[11px] text-gray-400">{o.city}</div></Td>
//               <Td><span className="text-xs">{o.courier}</span></Td>
//               <Td><span className="text-xs text-gray-400">{o.date}</span></Td>
//               <Td><StatusBadge status={o.status} /></Td>
//               <Td>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => { setAwb(o.awb); handleTrack(); }}
//                 >
//                   Track
//                 </Button>
//               </Td>
//             </Tr>
//           ))}
//         </Table>
//       </TableCard>
//     </div>
//   );
// }