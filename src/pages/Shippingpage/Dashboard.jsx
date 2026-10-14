// import { useShipping } from "./useShipping";
// import { StatCard, StatusBadge, Button, TableCard, Table, Tr, Td } from "./UI";
// import { useNavigate } from "react-router-dom";
// export default function Dashboardshipping() {
//   const navigate = useNavigate();
//   const { state } = useShipping();
//   const { orders, couriers } = state;

//   const stats = {
//     total:     orders.length,
//     pending:   orders.filter((o) => o.status === "pending").length,
//     intransit: orders.filter((o) => o.status === "intransit").length,
//     delivered: orders.filter((o) => o.status === "delivered").length,
//     rto:       orders.filter((o) => ["rto", "ndr"].includes(o.status)).length,
//   };

//   const recent = orders.slice(0, 6);

//   return (
//     <div>
//       {/* Stats */}
//       <div className="grid grid-cols-5 gap-3 mb-5">
//         <StatCard label="Total Orders"  value={stats.total}     sub="+3 aaj"         icon="📦" />
//         <StatCard label="Pending"       value={stats.pending}   sub="Assign karna hai" icon="⏳" color="text-yellow-600" />
//         <StatCard label="In Transit"    value={stats.intransit} sub="On the way"      icon="🚛" color="text-purple-600" />
//         <StatCard label="Delivered"     value={stats.delivered} sub="This week"       icon="✅" color="text-green-600" />
//         <StatCard label="RTO / NDR"     value={stats.rto}       sub="Action chahiye"  icon="⚠️" color="text-red-500" />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         {/* Recent Orders */}
//         <TableCard
//           title="Recent Orders"
//           actions={
//             <Button variant="outline" size="sm" onClick={() => navigate("/orders")}>
//               Sab dekho →
//             </Button>
//           }
//         >
//           <Table headers={["Order", "Customer", "Amount", "Status", ""]}>
//             {recent.map((o) => (
//               <Tr key={o.id}>
//                 <Td>
//                   <span className="font-semibold text-primary">{o.id}</span>
//                 </Td>
//                 <Td>
//                   <div className="font-medium text-gray-800">{o.customer}</div>
//                   <div className="text-[11px] text-gray-400">{o.city}</div>
//                 </Td>
//                 <Td>
//                   <span className="font-semibold">₹{o.amount}</span>
//                 </Td>
//                 <Td>
//                   <StatusBadge status={o.status} />
//                 </Td>
//                 <Td>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => navigate(`/orders/${o.id}`)}
//                   >
//                     👁
//                   </Button>
//                 </Td>
//               </Tr>
//             ))}
//           </Table>
//         </TableCard>

//         {/* Courier Performance */}
//         <div className="bg-white rounded-xl border border-purple-100 p-4">
//           <h3 className="text-sm font-semibold text-primary mb-4">
//             Courier Performance
//           </h3>
//           <div className="space-y-4">
//             {couriers.map((c) => (
//               <div key={c.id}>
//                 <div className="flex justify-between text-sm mb-1.5">
//                   <span className="font-medium text-gray-700">{c.shortName}</span>
//                   <span className="text-gray-400 text-xs">
//                     {c.totalDeliveries} orders · {c.deliveryRate}
//                   </span>
//                 </div>
//                 <div className="bg-purple-50 rounded-full h-1.5">
//                   <div
//                     className="bg-primary h-1.5 rounded-full transition-all duration-700"
//                     style={{ width: c.deliveryRate }}
//                   />
//                 </div>
//                 <div className="flex justify-between text-[10px] text-gray-400 mt-1">
//                   <span>RTO: {c.rtoRate}</span>
//                   <span>₹{c.price}/shipment</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Quick Actions */}
//           <div className="mt-5 pt-4 border-t border-purple-50">
//             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
//               Quick Actions
//             </p>
//             <div className="grid grid-cols-2 gap-2">
//               <Button variant="outline" size="sm" onClick={() => navigate("/shipping/assign")} className="justify-center">
//                 🚚 Courier Assign
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => navigate("/shipping/labels")} className="justify-center">
//                 🏷️ Print Labels
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => navigate("/shipping/ndr")} className="justify-center">
//                 ⚠️ NDR Action
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => navigate("/shipping/manifests")} className="justify-center">
//                 📋 Manifest
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }