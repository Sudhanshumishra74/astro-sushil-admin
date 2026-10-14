// /* eslint-disable no-unused-vars */
// import { useState } from "react";
// import { useShipping } from "../hooks/useShipping";
// import {
//   StatusBadge, Button, Modal, TableCard, Table, Tr, Td,
//   FormField, Input, Select, Textarea,
// } from "../components/UI";

// // ─── CREATE ORDER MODAL ───────────────────────────────────────────────────────
// function CreateOrderModal({ open, onClose }) {
//   const { dispatch, showToast } = useShipping();
//   const [form, setForm] = useState({
//     customer: "", phone: "", address: "", city: "",
//     pincode: "", state: "", item: "", sku: "",
//     weight: "", amount: "", cod: "Prepaid",
//   });

//   const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   const handleSubmit = () => {
//     if (!form.customer || !form.city || !form.item) {
//       showToast("Sabhi required fields bharein!", "danger");
//       return;
//     }
//     const newOrder = {
//       id: "#ORD-" + String(Date.now()).slice(-4),
//       ...form,
//       weight: parseFloat(form.weight) || 0.5,
//       amount: parseInt(form.amount) || 0,
//       courier: "-",
//       awb: "-",
//       status: "pending",
//       date: new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
//       attempts: 0,
//     };
//     dispatch({ type: "ADD_ORDER", payload: newOrder });
//     showToast("Naya order create ho gaya! 🎉", "success");
//     onClose();
//     setForm({ customer:"", phone:"", address:"", city:"", pincode:"", state:"", item:"", sku:"", weight:"", amount:"", cod:"Prepaid" });
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       title="Naya Order Banao"
//       size="lg"
//       footer={
//         <>
//           <Button variant="outline" onClick={onClose}>Cancel</Button>
//           <Button variant="primary" onClick={handleSubmit}>Order Banao</Button>
//         </>
//       }
//     >
//       <div className="space-y-4">
//         <p className="text-xs font-bold text-primary uppercase tracking-wider">Customer Details</p>
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="Customer Naam *">
//             <Input placeholder="Rahul Sharma" value={form.customer} onChange={set("customer")} />
//           </FormField>
//           <FormField label="Phone *">
//             <Input placeholder="9876543210" value={form.phone} onChange={set("phone")} />
//           </FormField>
//           <FormField label="Address *" className="col-span-2">
//             <Textarea placeholder="Ghar ka pura address..." value={form.address} onChange={set("address")} />
//           </FormField>
//           <FormField label="City *">
//             <Input placeholder="Delhi" value={form.city} onChange={set("city")} />
//           </FormField>
//           <FormField label="Pincode">
//             <Input placeholder="110001" value={form.pincode} onChange={set("pincode")} />
//           </FormField>
//           <FormField label="State">
//             <Input placeholder="Delhi" value={form.state} onChange={set("state")} />
//           </FormField>
//         </div>

//         <p className="text-xs font-bold text-primary uppercase tracking-wider pt-2">Product & Shipping</p>
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="Product Naam *">
//             <Input placeholder="Cotton Kurta" value={form.item} onChange={set("item")} />
//           </FormField>
//           <FormField label="SKU">
//             <Input placeholder="KRT-001" value={form.sku} onChange={set("sku")} />
//           </FormField>
//           <FormField label="Weight (kg)">
//             <Input type="number" placeholder="0.5" step="0.1" value={form.weight} onChange={set("weight")} />
//           </FormField>
//           <FormField label="Order Value (₹) *">
//             <Input type="number" placeholder="999" value={form.amount} onChange={set("amount")} />
//           </FormField>
//           <FormField label="Payment Mode">
//             <Select value={form.cod} onChange={set("cod")}>
//               <option>Prepaid</option>
//               <option>COD</option>
//             </Select>
//           </FormField>
//         </div>
//       </div>
//     </Modal>
//   );
// }

// // ─── CANCEL ORDER MODAL ───────────────────────────────────────────────────────
// function CancelOrderModal({ orderId, open, onClose }) {
//   const { dispatch, showToast } = useShipping();
//   const [reason, setReason] = useState("Customer ne request ki");

//   const handleCancel = () => {
//     dispatch({ type: "CANCEL_ORDER", payload: [orderId] });
//     showToast(`${orderId} cancel ho gaya!`, "danger");
//     onClose();
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       title="Order Cancel Karo"
//       size="sm"
//       footer={
//         <>
//           <Button variant="outline" onClick={onClose}>Nahi</Button>
//           <Button variant="danger" onClick={handleCancel}>Haan, Cancel Karo</Button>
//         </>
//       }
//     >
//       <div className="space-y-4">
//         <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700">
//           Order <strong>{orderId}</strong> cancel karna chahte ho?
//         </div>
//         <FormField label="Cancellation Reason">
//           <Select value={reason} onChange={(e) => setReason(e.target.value)}>
//             <option>Customer ne request ki</option>
//             <option>Wrong address</option>
//             <option>Duplicate order</option>
//             <option>Out of stock</option>
//             <option>Payment failed</option>
//           </Select>
//         </FormField>
//       </div>
//     </Modal>
//   );
// }

// // ─── ORDER DETAIL MODAL ───────────────────────────────────────────────────────
// function OrderDetailModal({ order, open, onClose }) {
//   if (!order) return null;
//   return (
//     <Modal open={open} onClose={onClose} title={`Order ${order.id}`} size="lg"
//       footer={<Button variant="outline" onClick={onClose}>Bandh Karo</Button>}
//     >
//       <div className="grid grid-cols-2 gap-4">
//         <div className="bg-secondary rounded-lg p-4">
//           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Customer Info</p>
//           {[
//             ["Naam", order.customer], ["Phone", order.phone],
//             ["Address", order.address], ["City", order.city],
//             ["Pincode", order.pincode], ["State", order.state],
//           ].map(([k, v]) => (
//             <div key={k} className="flex justify-between py-1.5 text-sm border-b border-purple-100 last:border-0">
//               <span className="text-gray-500">{k}</span>
//               <span className="font-medium text-right max-w-[60%]">{v || "—"}</span>
//             </div>
//           ))}
//         </div>
//         <div className="bg-secondary rounded-lg p-4">
//           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Shipment Info</p>
//           {[
//             ["Product", order.item], ["SKU", order.sku],
//             ["Weight", order.weight + " kg"], ["Amount", "₹" + order.amount],
//             ["Payment", order.cod], ["Courier", order.courier],
//             ["AWB", order.awb], ["Date", order.date],
//           ].map(([k, v]) => (
//             <div key={k} className="flex justify-between py-1.5 text-sm border-b border-purple-100 last:border-0">
//               <span className="text-gray-500">{k}</span>
//               <span className="font-medium font-mono text-xs">{v || "—"}</span>
//             </div>
//           ))}
//           <div className="mt-3">
//             <StatusBadge status={order.status} />
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// }

// // ─── MAIN ORDERS PAGE ─────────────────────────────────────────────────────────
// export default function Orders({ onNavigate }) {
//   const { state, dispatch, showToast } = useShipping();
//   const { orders, selectedOrderIds } = state;

//   const [search, setSearch]         = useState("");
//   const [statusFilter, setStatus]   = useState("");
//   const [courierFilter, setCourier] = useState("");
//   const [createOpen, setCreateOpen] = useState(false);
//   const [cancelId, setCancelId]     = useState(null);
//   const [detailOrder, setDetail]    = useState(null);

//   const filtered = orders.filter((o) => {
//     const q = search.toLowerCase();
//     const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.city.toLowerCase().includes(q);
//     const matchStatus = !statusFilter || o.status === statusFilter;
//     const matchCourier = !courierFilter || o.courier === courierFilter;
//     return matchSearch && matchStatus && matchCourier;
//   });

//   const toggleSelect = (id) => dispatch({ type: "TOGGLE_SELECT", payload: id });
//   const toggleAll = (e) =>
//     dispatch({
//       type: e.target.checked ? "SELECT_ALL" : "CLEAR_SELECTION",
//       payload: filtered.map((o) => o.id),
//     });

//   const bulkCancel = () => {
//     if (!selectedOrderIds.length) { showToast("Koi order select nahi kiya!", "danger"); return; }
//     dispatch({ type: "CANCEL_ORDER", payload: selectedOrderIds });
//     dispatch({ type: "CLEAR_SELECTION" });
//     showToast(`${selectedOrderIds.length} orders cancel ho gaye!`, "danger");
//   };

//   const bulkAssign = () => {
//     if (!selectedOrderIds.length) { showToast("Pehle orders select karo!", "danger"); return; }
//     onNavigate("assign");
//   };

//   return (
//     <div>
//       {/* Filters */}
//       <div className="bg-white rounded-xl border border-purple-100 p-3 mb-4 flex flex-wrap items-center gap-2">
//         <input
//           className="flex-1 min-w-45 px-3 py-2 border-[1.5px] border-purple-100 rounded-lg text-sm outline-none focus:border-primary font-[Outfit] bg-secondary"
//           placeholder="🔍  Order ID, naam, ya city..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <Select className="w-40" value={statusFilter} onChange={(e) => setStatus(e.target.value)}>
//           <option value="">Sabhi Status</option>
//           <option value="pending">Pending</option>
//           <option value="assigned">Assigned</option>
//           <option value="pickup">Pickup Scheduled</option>
//           <option value="intransit">In Transit</option>
//           <option value="delivered">Delivered</option>
//           <option value="cancelled">Cancelled</option>
//           <option value="rto">RTO</option>
//           <option value="ndr">NDR</option>
//         </Select>
//         <Select className="w-36" value={courierFilter} onChange={(e) => setCourier(e.target.value)}>
//           <option value="">Sabhi Courier</option>
//           <option>BlueDart</option>
//           <option>DTDC</option>
//           <option>Delhivery</option>
//           <option>Ekart</option>
//         </Select>
//         <div className="flex gap-2 ml-auto">
//           {selectedOrderIds.length > 0 && (
//             <>
//               <Button variant="success" size="sm" onClick={bulkAssign}>📦 Bulk Assign ({selectedOrderIds.length})</Button>
//               <Button variant="danger"  size="sm" onClick={bulkCancel}>✕ Bulk Cancel</Button>
//             </>
//           )}
//           <Button variant="gold"    size="sm" onClick={() => onNavigate("assign")}>🚚 Assign Courier</Button>
//           <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>+ Naya Order</Button>
//         </div>
//       </div>

//       <TableCard
//         title={`Sabhi Orders (${filtered.length})`}
//         actions={
//           <span className="text-xs text-gray-400">
//             {selectedOrderIds.length} selected
//           </span>
//         }
//       >
//         <Table
//           headers={["", "Order ID", "Customer", "Item", "Wt.", "Payment", "Courier", "AWB", "Status", "Actions"]}
//         >
//           {filtered.length === 0 ? (
//             <tr>
//               <td colSpan={10} className="text-center py-12 text-gray-400">
//                 <div className="text-3xl mb-2">📭</div>
//                 <div>Koi orders nahi mili</div>
//               </td>
//             </tr>
//           ) : (
//             filtered.map((o) => (
//               <Tr key={o.id}>
//                 <Td>
//                   <input
//                     type="checkbox"
//                     className="accent-primary cursor-pointer"
//                     checked={selectedOrderIds.includes(o.id)}
//                     onChange={() => toggleSelect(o.id)}
//                   />
//                 </Td>
//                 <Td>
//                   <span className="font-semibold text-primary text-xs">{o.id}</span>
//                 </Td>
//                 <Td>
//                   <div className="font-medium text-gray-800">{o.customer}</div>
//                   <div className="text-[11px] text-gray-400">{o.city}</div>
//                 </Td>
//                 <Td>
//                   <div className="text-xs">{o.item}</div>
//                 </Td>
//                 <Td>
//                   <span className="text-xs text-gray-500">{o.weight}kg</span>
//                 </Td>
//                 <Td>
//                   <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${o.cod === "COD" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
//                     {o.cod}
//                   </span>
//                 </Td>
//                 <Td>
//                   <span className="text-xs">{o.courier === "-" ? <span className="text-gray-300">—</span> : o.courier}</span>
//                 </Td>
//                 <Td>
//                   <span className="font-mono text-[10px] text-gray-500">{o.awb === "-" ? "—" : o.awb}</span>
//                 </Td>
//                 <Td>
//                   <StatusBadge status={o.status} />
//                 </Td>
//                 <Td>
//                   <div className="flex gap-1.5 flex-wrap">
//                     <Button variant="ghost" size="sm" onClick={() => setDetail(o)}>👁</Button>
//                     {o.status === "pending" && (
//                       <Button variant="success" size="sm" onClick={() => onNavigate("assign")}>Assign</Button>
//                     )}
//                     {!["cancelled", "delivered", "rto"].includes(o.status) && (
//                       <Button variant="danger" size="sm" onClick={() => setCancelId(o.id)}>Cancel</Button>
//                     )}
//                   </div>
//                 </Td>
//               </Tr>
//             ))
//           )}
//         </Table>
//       </TableCard>

//       <CreateOrderModal open={createOpen} onClose={() => setCreateOpen(false)} />
//       <CancelOrderModal orderId={cancelId} open={!!cancelId} onClose={() => setCancelId(null)} />
//       <OrderDetailModal order={detailOrder} open={!!detailOrder} onClose={() => setDetail(null)} />
//     </div>
//   );
// }