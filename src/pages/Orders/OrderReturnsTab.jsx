/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  RotateCcw as Undo2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  IndianRupee,
  FileText,
  Package,
  Hash,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { Badge, formatDate } from "../../components/common/Admintable";
import { Modal } from "../../components/common/Modal";
import FormTextarea from "../../components/common/FormTextarea";
import { useReturnStore } from "../../store/useReturnStore";
import Can from "../../components/common/Can";

const RETURN_STATUS_VARIANT = {
  requested: "warning",
  approved: "info",
  pickup_scheduled: "info",
  picked_up: "info",
  in_transit: "info",
  received: "warning",
  inspection_pending: "warning",
  approved_for_refund: "info",
  rejected: "danger",
  refunded: "success",
};

// Mirrors the backend's cancelReturnPickupHandler allow-list exactly — past
// this point the item is already back and/or inspected, so "cancelling the
// pickup" doesn't undo anything real; reject/refund are the only valid next
// steps. Keeping this a positive allow-list (not an exclude-list) so it
// can't drift out of sync with the backend as new statuses get added.
const PICKUP_CANCELLABLE_STATUSES = new Set(["approved", "pickup_scheduled", "picked_up", "in_transit"]);

// Mirrors rejectReturn's own allow-list in fulfillment.service.js — it can
// fire from any pre-terminal status except "refunded"/"rejected" (already
// terminal) and "approved_for_refund" (inspection already restocked the
// items, so rejecting from there would release returnedQuantity without
// reversing that restock). "received" is deliberately excluded here even
// though the backend would technically allow it — Inspect (Fail) is the
// intended path once the item is physically back, and offering both would
// just be two buttons doing overlapping things.
const STUCK_REJECTABLE_STATUSES = new Set(["approved", "pickup_scheduled", "picked_up", "in_transit"]);

function getCurrencySymbol(order) {
  return order?.payment?.currency?.toUpperCase() === "USD" ? "$" : "₹";
}

function findOrderItem(order, productId) {
  return order?.items?.find((oi) => String(oi.product?._id || oi.product) === String(productId));
}

// Mirrors processReturnRefund's exact formula in fulfillment.service.js —
// (price + per-unit tax) per returned unit, plus the order's shipping once
// (and only once) this refund would complete every self-fulfilled unit on
// the order. Client-side estimate only, so the admin knows roughly what
// they're about to authorize before confirming; the backend recomputes
// authoritatively at execution time and is the source of truth for what
// actually gets refunded.
function estimateRefund(returnEntry, order) {
  if (!order) return null;

  let amount = 0;
  for (const item of returnEntry.items) {
    const orderItem = findOrderItem(order, item.product);
    if (!orderItem) continue;
    const unitTax = orderItem.quantity ? (orderItem.taxAmount || 0) / orderItem.quantity : 0;
    amount += (orderItem.price + unitTax) * item.quantity;
  }

  const shippingAlreadyRefunded = (order.returns || []).some((r) => r.refundIncludesShipping);
  const selfShipment = (order.shipments || []).find((s) => s.fulfillmentType === "self");
  const allSelfUnitsReturned =
    !shippingAlreadyRefunded &&
    selfShipment?.items?.every((si) => {
      const orderItem = findOrderItem(order, si.product);
      return orderItem && orderItem.returnedQuantity >= orderItem.quantity;
    });

  let refundIncludesShipping = false;
  if (allSelfUnitsReturned) {
    amount += order.shipping || 0;
    refundIncludesShipping = true;
  }

  return { amount: Math.round(amount * 100) / 100, refundIncludesShipping };
}

function ReturnItemRow({ item, order }) {
  const orderItem = findOrderItem(order, item.product);
  const currencySymbol = getCurrencySymbol(order);
  const lineTotal = orderItem ? orderItem.price * item.quantity : null;

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-[#f5f2fc]">
      {orderItem?.image ? (
        <img
          src={orderItem.image}
          alt={item.name}
          className="w-10 h-10 rounded-lg object-cover border border-[#e0d9f5] shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-[#faf8ff] border border-[#e0d9f5] flex items-center justify-center shrink-0">
          <Package size={14} className="text-[#c0b8d8]" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-black truncate">{item.name}</p>
        <p className="text-xs text-[#9a9abf]">
          Qty {item.quantity}
          {orderItem && ` · ${currencySymbol}${orderItem.price?.toLocaleString("en-IN")} each`}
        </p>
      </div>
      {lineTotal != null && (
        <p className="text-sm font-semibold text-black shrink-0">
          {currencySymbol}{lineTotal.toLocaleString("en-IN")}
        </p>
      )}
    </div>
  );
}

// Quick order-context strip shown inside every action modal — an admin
// deciding whether to approve/reject/refund shouldn't have to flip back to
// the Overview tab to check whose order this is or how it was paid for.
function OrderContextStrip({ order }) {
  if (!order) return null;
  const currencySymbol = getCurrencySymbol(order);

  return (
    <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 p-3 rounded-xl border border-[#f5f2fc] bg-[#faf8ff] text-xs">
      <div className="flex items-center gap-1.5 text-black">
        <Hash size={11} className="text-[#9a9abf]" />
        <span className="text-[#9a9abf]">Order</span>
        <span className="font-mono font-medium">#{order._id?.slice(-8).toUpperCase()}</span>
      </div>
      <div className="flex items-center gap-1.5 text-black justify-end">
        <CreditCard size={11} className="text-[#9a9abf]" />
        <span className="text-[#9a9abf]">Paid via</span>
        <span className="font-medium uppercase">{order.payment?.method || "—"}</span>
      </div>
      <div className="col-span-2 text-black truncate">
        <span className="text-[#9a9abf]">Customer </span>
        <span className="font-medium">{order.user?.email || "—"}</span>
      </div>
      <div className="col-span-2 text-black">
        <span className="text-[#9a9abf]">Order total </span>
        <span className="font-medium">{currencySymbol}{order.totalAmount?.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

const MODAL_META = {
  approve: {
    title: "Approve return",
    confirmLabel: "Approve return",
    confirmClass: "bg-primary hover:bg-primary/90",
  },
  reject: {
    title: "Reject return",
    confirmLabel: "Reject return",
    confirmClass: "bg-red-500 hover:bg-red-600",
  },
  inspect: {
    title: "Record inspection",
    confirmLabel: "Save inspection",
    confirmClass: "bg-primary hover:bg-primary/90",
  },
  refund: {
    title: "Process refund",
    confirmLabel: "Confirm refund",
    confirmClass: "bg-primary hover:bg-primary/90",
  },
};

export default function OrderReturnsTab({ orderId, order }) {
  const {
    returns,
    loading,
    actionLoadingId,
    creditNoteLoadingId,
    fetchReturns,
    approveReturn,
    rejectReturn,
    retryReturn,
    inspectReturn,
    refundReturn,
    cancelReturnPickup,
    downloadCreditNote,
  } = useReturnStore();

  const [modal, setModal] = useState(null); // { type: "approve" | "reject" | "inspect" | "refund", returnId }
  const [notes, setNotes] = useState("");
  const [inspectionPassed, setInspectionPassed] = useState(true);

  useEffect(() => {
    if (orderId) fetchReturns(orderId);
  }, [orderId]);

  const closeModal = () => {
    setModal(null);
    setNotes("");
    setInspectionPassed(true);
  };

  const activeReturn = modal ? returns.find((r) => r._id === modal.returnId) : null;

  const submitModal = async () => {
    if (!modal) return;

    let ok = false;
    if (modal.type === "approve") ok = await approveReturn(modal.returnId);
    if (modal.type === "reject") ok = await rejectReturn(modal.returnId, notes);
    if (modal.type === "inspect") ok = await inspectReturn(modal.returnId, { passed: inspectionPassed, notes });
    if (modal.type === "refund") ok = await refundReturn(modal.returnId, notes);

    if (ok) closeModal();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!returns.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-400">
        <Undo2 size={32} className="text-[#c0b8d8]" />
        <p className="text-sm">No return requests for this order.</p>
      </div>
    );
  }

  const refundPreview = activeReturn && modal?.type === "refund" ? estimateRefund(activeReturn, order) : null;
  const currencySymbol = getCurrencySymbol(order);

  return (
    <>
      <div className="flex flex-col gap-4">
        {returns.map((ret) => {
          const isBusy = actionLoadingId === ret._id;

          return (
            <div key={ret._id} className="bg-white rounded-2xl border border-[#ede8f8] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge label="Self-fulfilled" variant="info" />
                  <Badge label={ret.status} variant={RETURN_STATUS_VARIANT[ret.status] ?? "default"} />
                  {ret.reason && <Badge label={ret.reason} variant="default" />}
                </div>

                <Can permission="returns.edit">
                  <div className="flex items-center gap-2 flex-wrap">
                    {ret.status === "requested" && (
                      <>
                        <button
                          onClick={() => setModal({ type: "approve", returnId: ret._id })}
                          disabled={isBusy}
                          className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-white border border-primary/25 bg-primary hover:bg-gold disabled:opacity-50 transition-colors"
                        >
                          <CheckCircle2 size={12} /> Approve
                        </button>
                        <button
                          onClick={() => setModal({ type: "reject", returnId: ret._id })}
                          disabled={isBusy}
                          className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-red-500 border border-red-200 bg-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    )}

                    {/* A return that's moved past "requested" but isn't progressing
                        (a self/Shiprocket return whose pickup never resolves) has
                        no other way to be closed out. Skipped when "Cancel pickup"
                        already covers the same case — that button also cancels the
                        live Shiprocket reverse order first, which this generic
                        reject does not. */}
                    {STUCK_REJECTABLE_STATUSES.has(ret.status) &&
                      !(ret.shiprocketReturnOrderId && PICKUP_CANCELLABLE_STATUSES.has(ret.status)) && (
                        <button
                          onClick={() => setModal({ type: "reject", returnId: ret._id })}
                          disabled={isBusy}
                          className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-red-500 border border-red-200 bg-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                          <XCircle size={12} /> Cancel return
                        </button>
                      )}

                    {ret.fulfillmentType === "self" &&
                      ["approved", "pickup_scheduled"].includes(ret.status) &&
                      ret.error && (
                        <button
                          onClick={() => retryReturn(ret._id)}
                          disabled={isBusy}
                          className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 disabled:opacity-50 transition-colors"
                        >
                          <Undo2 size={12} className={isBusy ? "animate-spin" : ""} /> Retry
                        </button>
                      )}

                    {ret.status === "received" && (
                      <button
                        onClick={() => setModal({ type: "inspect", returnId: ret._id })}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-white border border-primary/25 bg-primary hover:bg-gold disabled:opacity-50 transition-colors"
                      >
                        Inspect
                      </button>
                    )}

                    {ret.status === "approved_for_refund" && (
                      <button
                        onClick={() => setModal({ type: "refund", returnId: ret._id })}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-white border border-primary/25 bg-primary hover:bg-gold disabled:opacity-50 transition-colors"
                      >
                        <IndianRupee size={12} /> Refund
                      </button>
                    )}

                    {ret.shiprocketReturnOrderId && PICKUP_CANCELLABLE_STATUSES.has(ret.status) && (
                      <button
                        onClick={() => cancelReturnPickup(ret._id)}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-red-500 border border-red-200 bg-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
                      >
                        Cancel pickup
                      </button>
                    )}
                  </div>
                </Can>
              </div>

              {ret.error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-3">
                  <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{ret.error}</p>
                </div>
              )}

              <div className="mb-3">
                <p className="text-xs text-[#9a9abf] mb-2">
                  Items requested for return {ret.items?.length > 0 && `(${ret.items.length})`}
                </p>
                <div className="flex flex-col gap-2">
                  {ret.items?.map((item, i) => (
                    <ReturnItemRow key={i} item={item} order={order} />
                  ))}
                </div>
                {ret.customerComment && (
                  <p className="text-xs text-[#9a9abf] mt-2 italic">"{ret.customerComment}"</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="p-3 rounded-xl border border-[#f5f2fc] bg-[#faf8ff] flex flex-col gap-1">
                  <p className="text-xs text-[#9a9abf] mb-1">Return shipping</p>
                  {ret.courier && (
                    <p className="text-xs text-black">
                      <span className="text-[#9a9abf]">Courier: </span>
                      {ret.courier}
                    </p>
                  )}
                  {ret.awb && (
                    <p className="text-xs text-black">
                      <span className="text-[#9a9abf]">AWB: </span>
                      {ret.awb}
                    </p>
                  )}
                  {ret.trackingUrl && (
                    <a
                      href={ret.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary font-medium flex items-center gap-1"
                    >
                      Track return <ExternalLink size={11} />
                    </a>
                  )}
                  {!ret.courier && !ret.awb && !ret.trackingUrl && (
                    <p className="text-xs text-[#9a9abf]">No courier assigned yet.</p>
                  )}
                </div>

                <div className="p-3 rounded-xl border border-[#f5f2fc] bg-[#faf8ff] flex flex-col gap-1">
                  <p className="text-xs text-[#9a9abf] mb-1">Timeline</p>
                  <p className="text-xs text-black">
                    <span className="text-[#9a9abf]">Requested: </span>
                    {formatDate(ret.requestedAt)}
                  </p>
                  {ret.receivedAt && (
                    <p className="text-xs text-black">
                      <span className="text-[#9a9abf]">Received: </span>
                      {formatDate(ret.receivedAt)}
                    </p>
                  )}
                </div>
              </div>

              {ret.inspection?.inspectedAt && (
                <div className="p-3 rounded-xl border border-[#f5f2fc] bg-[#faf8ff] mb-3">
                  <p className="text-xs text-[#9a9abf] mb-1">Inspection</p>
                  <p className="text-sm text-black">
                    {ret.inspection.passed ? (
                      <span className="text-green-600 font-medium">Passed</span>
                    ) : (
                      <span className="text-red-500 font-medium">Failed</span>
                    )}{" "}
                    on {formatDate(ret.inspection.inspectedAt)}
                  </p>
                  {ret.inspection.notes && <p className="text-xs text-[#9a9abf] mt-1">{ret.inspection.notes}</p>}
                </div>
              )}

              {ret.refundAmount != null && (
                <div className="p-3 rounded-xl border border-green-200 bg-green-50 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-xs text-green-700">
                      Refunded <span className="font-semibold">{currencySymbol}{ret.refundAmount.toLocaleString("en-IN")}</span>
                      {ret.refundIncludesShipping ? " (incl. shipping)" : ""}
                    </p>
                    {ret.status === "refunded" && (
                      <button
                        onClick={() => downloadCreditNote(ret._id)}
                        disabled={creditNoteLoadingId === ret._id}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-medium text-green-700 border border-green-300 bg-white hover:bg-green-100 disabled:opacity-50 transition-colors"
                      >
                        <FileText size={12} />
                        {creditNoteLoadingId === ret._id ? "Downloading…" : "Download Credit Note"}
                      </button>
                    )}
                  </div>
                  {(ret.razorpayRefundId || ret.refundMethod) && (
                    <div className="flex items-center gap-3 flex-wrap text-[11px] text-green-600 pt-2 border-t border-green-200">
                      {ret.refundMethod && (
                        <span>
                          Via <span className="font-medium">{ret.refundMethod === "razorpay" ? "Razorpay" : "Manual (COD)"}</span>
                        </span>
                      )}
                      {ret.razorpayRefundId && (
                        <span className="flex items-center gap-1">
                          Refund ID <span className="font-mono font-medium">{ret.razorpayRefundId}</span>
                        </span>
                      )}
                      {ret.refundedAt && <span>{formatDate(ret.refundedAt)}</span>}
                    </div>
                  )}
                </div>
              )}

              {ret.adminNote && <p className="text-xs text-[#9a9abf] mt-3">Admin note: {ret.adminNote}</p>}
            </div>
          );
        })}
      </div>

      {modal && activeReturn && (
        <Modal
          title={
            modal.type === "reject" && activeReturn.status !== "requested"
              ? "Cancel return"
              : MODAL_META[modal.type].title
          }
          onClose={closeModal}
        >
          <div className="flex flex-col gap-4">
            <OrderContextStrip order={order} />

            <div>
              <p className="text-xs font-semibold text-[#9a9abf] uppercase tracking-wide mb-2">
                Items in this return
              </p>
              <div className="flex flex-col gap-2">
                {activeReturn.items?.map((item, i) => (
                  <ReturnItemRow key={i} item={item} order={order} />
                ))}
              </div>
              {activeReturn.reason && (
                <p className="text-xs text-[#9a9abf] mt-2">
                  Reason given: <span className="text-black font-medium">{activeReturn.reason}</span>
                </p>
              )}
              {activeReturn.customerComment && (
                <p className="text-xs text-[#9a9abf] mt-1 italic">"{activeReturn.customerComment}"</p>
              )}
            </div>

            {modal.type === "approve" && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200">
                <AlertTriangle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  This locks the returned units and starts a Shiprocket reverse pickup for this shipment.
                </p>
              </div>
            )}

            {modal.type === "reject" && activeReturn.status !== "requested" && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  This return is stuck in "{activeReturn.status.replace(/_/g, " ")}" — cancelling it now closes it
                  out and releases the locked units back to returnable. Use this when the item isn't coming back
                  (lost, damaged in transit, or the supplier confirms it's a dead end).
                </p>
              </div>
            )}

            {modal.type === "inspect" && (
              <div className="flex gap-2">
                <button
                  onClick={() => setInspectionPassed(true)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    inspectionPassed
                      ? "bg-green-50 border-green-300 text-green-700"
                      : "border-[#e0d9f5] text-[#9a9abf]"
                  }`}
                >
                  Passed
                </button>
                <button
                  onClick={() => setInspectionPassed(false)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    !inspectionPassed ? "bg-red-50 border-red-300 text-red-600" : "border-[#e0d9f5] text-[#9a9abf]"
                  }`}
                >
                  Failed
                </button>
              </div>
            )}

            {modal.type === "refund" && refundPreview && (
              <div className="p-3 rounded-xl border border-green-200 bg-green-50">
                <p className="text-xs text-green-700 mb-1">Estimated refund</p>
                <p className="text-xl font-semibold text-green-800">
                  {currencySymbol}{refundPreview.amount.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  {refundPreview.refundIncludesShipping
                    ? "Includes shipping — every self-fulfilled unit on this order will have been returned."
                    : "Item price + tax only — shipping isn't refunded until every self-fulfilled unit on this order is returned."}
                </p>
                <p className="text-[11px] text-green-600 mt-2">
                  Estimate only — the server recomputes and executes the actual refund on confirm.{" "}
                  {order.payment?.method === "razorpay"
                    ? "Issued back to the original Razorpay payment."
                    : "This was paid COD — confirming just records that you've refunded the customer manually (bank transfer/cash), it doesn't move any money itself."}
                </p>
              </div>
            )}

            {(modal.type === "reject" || modal.type === "inspect" || modal.type === "refund") && (
              <FormTextarea
                label={
                  modal.type === "reject"
                    ? activeReturn.status === "requested"
                      ? "Reason for rejection"
                      : "Reason for cancelling"
                    : modal.type === "inspect"
                      ? "Inspection notes"
                      : "Refund notes (optional)"
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={modal.type === "reject" ? "Why is this return being rejected?" : "Optional notes"}
              />
            )}

            <button
              onClick={submitModal}
              disabled={actionLoadingId === modal.returnId}
              className={`w-full py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50 transition-colors ${MODAL_META[modal.type].confirmClass}`}
            >
              {actionLoadingId === modal.returnId
                ? "Submitting…"
                : modal.type === "reject" && activeReturn.status !== "requested"
                  ? "Cancel return"
                  : MODAL_META[modal.type].confirmLabel}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
