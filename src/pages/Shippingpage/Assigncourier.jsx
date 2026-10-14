// import { useState } from "react";
// import { useShipping } from "./useShipping";
// import { Button, TableCard, Table, Tr, Td } from "./UI";

// export default function AssignCourier() {
//   const { state, dispatch, showToast } = useShipping();
//   const { orders, couriers } = state;

//   const [selectedCourierId, setSelectedCourier] = useState(couriers[0]?.id);
//   const [selectedOrderIds, setSelectedOrders]   = useState([]);

//   const pending = orders.filter((o) => o.status === "pending");

//   const toggleOrder = (id) =>
//     setSelectedOrders((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );

//   const toggleAll = (e) =>
//     setSelectedOrders(e.target.checked ? pending.map((o) => o.id) : []);

//   const handleAssign = () => {
//     if (!selectedOrderIds.length) { showToast("Koi order select nahi kiya!", "danger"); return; }
//     const courier = couriers.find((c) => c.id === selectedCourierId);
//     dispatch({
//       type: "ASSIGN_COURIER",
//       payload: { orderIds: selectedOrderIds, courierName: courier.shortName },
//     });
//     showToast(`${selectedOrderIds.length} orders ko ${courier.name} assign kar diya! ✅`, "success");
//     setSelectedOrders([]);
//   };

//   const selectedCourier = couriers.find((c) => c.id === selectedCourierId);

//   return (
//     <div className="grid grid-cols-2 gap-4">
//       {/* Left: Unassigned Orders */}
//       <div>
//         <TableCard
//           title={`Unassigned Orders (${pending.length})`}
//           actions={
//             selectedOrderIds.length > 0 && (
//               <span className="text-xs text-primary font-semibold">
//                 {selectedOrderIds.length} selected
//               </span>
//             )
//           }
//         >
//           {pending.length === 0 ? (
//             <div className="text-center py-10 text-gray-400">
//               <div className="text-3xl mb-2">🎉</div>
//               <div>Sab orders assign ho gaye!</div>
//             </div>
//           ) : (
//             <Table headers={["", "Order ID", "Customer", "City", "Weight", "COD"]}>
//               <Tr>
//                 <Td>
//                   <input
//                     type="checkbox"
//                     className="accent-primary cursor-pointer"
//                     checked={selectedOrderIds.length === pending.length && pending.length > 0}
//                     onChange={toggleAll}
//                   />
//                 </Td>
//                 <Td colSpan={5} className="text-xs text-gray-400 italic">
//                   Sab select/deselect karo
//                 </Td>
//               </Tr>
//               {pending.map((o) => (
//                 <Tr key={o.id}>
//                   <Td>
//                     <input
//                       type="checkbox"
//                       className="accent-primary cursor-pointer"
//                       checked={selectedOrderIds.includes(o.id)}
//                       onChange={() => toggleOrder(o.id)}
//                     />
//                   </Td>
//                   <Td>
//                     <span className="font-semibold text-primary text-xs">{o.id}</span>
//                   </Td>
//                   <Td>
//                     <div className="font-medium text-sm">{o.customer}</div>
//                   </Td>
//                   <Td><span className="text-xs text-gray-500">{o.city}</span></Td>
//                   <Td><span className="text-xs text-gray-500">{o.weight} kg</span></Td>
//                   <Td>
//                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${o.cod === "COD" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
//                       {o.cod}
//                     </span>
//                   </Td>
//                 </Tr>
//               ))}
//             </Table>
//           )}
//         </TableCard>
//       </div>

//       {/* Right: Courier Selection */}
//       <div className="space-y-4">
//         <div className="bg-white rounded-xl border border-purple-100 p-4">
//           <div className="flex items-center justify-between mb-1">
//             <h3 className="text-sm font-semibold text-primary">Available Couriers</h3>
//             <span className="text-[10px] text-gray-400 bg-secondary px-2 py-0.5 rounded-full">
//               Live Rates
//             </span>
//           </div>
//           <p className="text-xs text-gray-400 mb-4">ShipRocket se fetch kiye gaye rates</p>

//           <div className="space-y-3">
//             {couriers.map((c) => (
//               <button
//                 key={c.id}
//                 onClick={() => setSelectedCourier(c.id)}
//                 className={`w-full text-left border-[1.5px] rounded-xl p-3.5 cursor-pointer transition-all duration-150 ${
//                   selectedCourierId === c.id
//                     ? "border-primary bg-secondary"
//                     : "border-purple-100 bg-white hover:border-primary/40"
//                 }`}
//               >
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <div className="font-semibold text-sm text-gray-800">{c.name}</div>
//                     <div className="text-xs text-gray-400 mt-0.5">
//                       ⭐ {c.rating} &nbsp;·&nbsp; Delivery: {c.deliveryRate} &nbsp;·&nbsp; RTO: {c.rtoRate}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="font-bold text-base text-primary">₹{c.price}</div>
//                     <div className="text-[11px] text-green-600 font-semibold">{c.eta}</div>
//                   </div>
//                 </div>
//                 {selectedCourierId === c.id && (
//                   <div className="mt-2 pt-2 border-t border-purple-200 text-[11px] text-primary font-semibold">
//                     ✓ Selected
//                   </div>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Summary + Assign Button */}
//         {selectedOrderIds.length > 0 && selectedCourier && (
//           <div className="bg-secondary rounded-xl border border-purple-200 p-4">
//             <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Assignment Summary</p>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Orders</span>
//                 <span className="font-semibold">{selectedOrderIds.length}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Courier</span>
//                 <span className="font-semibold">{selectedCourier.name}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Rate/shipment</span>
//                 <span className="font-semibold">₹{selectedCourier.price}</span>
//               </div>
//               <div className="flex justify-between border-t border-purple-200 pt-2">
//                 <span className="text-gray-500 font-semibold">Total Estimated</span>
//                 <span className="font-bold text-primary">
//                   ₹{selectedCourier.price * selectedOrderIds.length}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         <Button
//           variant="primary"
//           className="w-full justify-center py-3"
//           onClick={handleAssign}
//           disabled={selectedOrderIds.length === 0}
//         >
//           ✅ {selectedOrderIds.length} Orders ko Assign Karo
//         </Button>

//         <Button
//           variant="outline"
//           className="w-full justify-center"
//           onClick={() => showToast("Pickup schedule ho gaya!", "success")}
//           disabled={selectedOrderIds.length === 0}
//         >
//           📅 Pickup Schedule Karo
//         </Button>
//       </div>
//     </div>
//   );
// }