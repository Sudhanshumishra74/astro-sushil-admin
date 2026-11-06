/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Truck,
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  Package,
  Download,
  CalendarClock,
  Hash,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Badge, formatDate } from "../../components/common/Admintable";
import { Modal } from "../../components/common/Modal";
import { useShipmentStore } from "../../store/useShipmentStore";
import Can from "../../components/common/Can";

function shipmentStatusVariant(status) {
  if (!status) return "default";
  if (["delivered", "fulfilled", "self_fulfilled"].includes(status)) return "success";
  if (
    status.startsWith("rto") ||
    ["cancelled", "lost", "damaged", "destroyed", "qc_failed", "undelivered", "untraceable", "failed"].includes(
      status,
    )
  ) {
    return "danger";
  }
  if (["pending", "awaiting_manual_fulfillment"].includes(status)) return "warning";
  return "info";
}

const TERMINAL_STATUSES = new Set(["delivered", "fulfilled", "self_fulfilled", "cancelled", "lost", "destroyed"]);

// Same style/metal/design/weight/ring-size/lab-cert selection shown on the
// Order Overview card — it's snapshotted onto every shipment item
// (toShipmentItems in fulfillment.service.js), so a self-fulfilled item
// that happens to carry a variant/customization selection deserves the
// same tags.
function itemTags(item) {
  return [
    item.variantName ? `${item.variantName}: ${item.variantValue}` : null,
    item.subVariantName ? `${item.subVariantName}: ${item.subVariantValue}` : null,
    item.selectedCustomizationName,
    item.selectedMetalName,
    item.selectedDesignName,
    // selectedWeightUnit is only present on shipments created after this
    // field was added — older ones fall back to "g", the assumption this
    // display previously made regardless of the product's real unit.
    item.selectedWeight != null ? `${item.selectedWeight} ${item.selectedWeightUnit || "g"}` : null,
    item.selectedRingSize ? `Size ${item.selectedRingSize}` : null,
    item.labCertificateRequested ? "Lab Certificate" : null,
    item.selectedRatti ? `${item.selectedRatti} ratti` : null,
  ].filter(Boolean);
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCurrencySymbol(order) {
  return order?.payment?.currency?.toUpperCase() === "USD" ? "$" : "₹";
}

// Retrying re-derives the shipment from scratch (fulfillment.service.js's
// createSelfShipment, called fresh) rather than resuming the failed step —
// it books a brand-new Shiprocket order/AWB and does NOT cancel whatever it
// is replacing. What that actually costs the admin depends on how far the
// existing attempt already got, so the confirmation has to be specific to
// this shipment's current state rather than a generic "are you sure?".
function retryConsequences(shipment, currencySymbol) {
  const notes = [];

  if (shipment.shiprocketOrderId) {
    notes.push(
      `A Shiprocket order (#${shipment.shiprocketOrderId}) already exists for this shipment. Retrying creates a brand-new order and AWB on Shiprocket — the existing one is not cancelled automatically.`,
    );
  }

  if (shipment.awb) {
    notes.push(
      `The current AWB (${shipment.awb}), tracking link, and label will be replaced. Any pickup already scheduled for it stays booked separately from the new one.`,
    );
  }

  if (shipment.courierCharge != null) {
    notes.push(
      `Shiprocket has already billed ${currencySymbol}${shipment.courierCharge.toLocaleString("en-IN")} for the current courier booking. A second booking can mean a second charge unless the original is cancelled on the Shiprocket dashboard.`,
    );
  }

  notes.push("This can't be undone from here.");

  return notes;
}

// Shipment items only ever carry a customization image (selectedDesignImage)
// when the item has a customization selection — the regular product
// thumbnail lives on the parent Order's own item snapshot
// (order.items[].image), never copied onto the shipment doc, so a plain
// item with no customization had nothing to show but the placeholder.
// Matched by product id against the already-loaded order rather than a
// backend change, so it works for shipments created before this fix too.
function findOrderItemImage(item, order) {
  const match = order?.items?.find(
    (oi) => String(oi.product?._id || oi.product) === String(item.product),
  );
  return match?.image || null;
}

function ShipmentItemRow({ item, order }) {
  const tags = itemTags(item);
  const image = item.selectedDesignImage || findOrderItemImage(item, order);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#f5f2fc] bg-[#faf8ff]">
      {image ? (
        <img
          src={image}
          alt={item.name}
          className="w-12 h-12 rounded-lg object-cover border border-[#e0d9f5] shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-white border border-[#e0d9f5] flex items-center justify-center shrink-0">
          <Package size={16} className="text-[#c0b8d8]" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-black line-clamp-2">{item.name}</p>
        <p className="text-xs text-[#9a9abf] mt-0.5 flex items-center gap-2 flex-wrap">
          <span>Qty: {item.quantity}</span>
          {item.sku && (
            <span className="flex items-center gap-1">
              <Hash size={10} /> {item.sku}
            </span>
          )}
        </p>
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusHistoryTimeline({ history }) {
  const events = [...history].reverse();

  return (
    <div className="flex flex-col">
      {events.map((h, i) => (
        <div key={i} className="flex items-start gap-3 relative">
          {i !== events.length - 1 && (
            <div className="absolute left-3 top-7 w-0.5 h-full -translate-x-1/2 bg-[#ede8f8]" />
          )}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${
              i === 0 ? "bg-primary border-primary" : "bg-white border-[#ede8f8]"
            }`}
          >
            {i === 0 ? (
              <CheckCircle2 size={12} className="text-white" />
            ) : (
              <Circle size={10} className="text-[#c0b8d8]" />
            )}
          </div>
          <div className="pt-0.5 pb-4">
            <p className={`text-xs font-medium capitalize ${i === 0 ? "text-black" : "text-[#9a9abf]"}`}>
              {h.status?.replace(/_/g, " ")}
            </p>
            <p className="text-[11px] text-[#9a9abf] mt-0.5">{formatDateTime(h.at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrderShipmentsTab({ orderId, order }) {
  const { shipments, loading, retryingId, fetchShipments, retryShipment, generateLabel } = useShipmentStore();
  const [retryTarget, setRetryTarget] = useState(null); // shipment pending retry confirmation

  useEffect(() => {
    if (orderId) fetchShipments(orderId);
  }, [orderId]);

  const confirmRetry = async () => {
    if (!retryTarget) return;
    const ok = await retryShipment(retryTarget._id);
    if (ok) setRetryTarget(null);
  };

  // This tab is Shiprocket/self-fulfilled only.
  const selfShipments = shipments.filter((s) => s.fulfillmentType === "self");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!selfShipments.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-400">
        <Truck size={32} className="text-[#c0b8d8]" />
        <p className="text-sm">No Shiprocket shipment for this order yet.</p>
      </div>
    );
  }

  return (
    <>
    <div className="flex flex-col gap-4">
      {selfShipments.map((shipment) => (
        <div key={shipment._id} className="bg-white rounded-2xl border border-[#ede8f8] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Truck size={16} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge label="Self-fulfilled" variant="info" />
                  <Badge label={shipment.status} variant={shipmentStatusVariant(shipment.status)} />
                  {shipment.needsManualFulfillment && <Badge label="Needs manual fulfillment" variant="warning" />}
                </div>
                <p className="text-[11px] text-[#9a9abf] mt-1">Created {formatDateTime(shipment.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!TERMINAL_STATUSES.has(shipment.status) && (
                <Can permission="shipments.edit">
                  <button
                    onClick={() => setRetryTarget(shipment)}
                    disabled={retryingId === shipment._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 disabled:opacity-50 transition-colors"
                  >
                    <RotateCcw size={12} className={retryingId === shipment._id ? "animate-spin" : ""} />
                    {retryingId === shipment._id ? "Retrying…" : "Retry"}
                  </button>
                </Can>
              )}
              {shipment.awb && (
                <Can permission="shipments.edit">
                  <button
                    onClick={() => generateLabel(shipment._id)}
                    disabled={retryingId === shipment._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 disabled:opacity-50 transition-colors"
                  >
                    <Download size={12} />
                    {shipment.labelUrl ? "Regenerate Label" : "Generate Label"}
                  </button>
                </Can>
              )}
            </div>
          </div>

          {shipment.error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
              <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-600">{shipment.error}</p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs text-[#9a9abf] mb-2">
              Items {shipment.items?.length > 0 && `(${shipment.items.length})`}
            </p>
            <div className="flex flex-col gap-2">
              {shipment.items?.map((item, i) => (
                <ShipmentItemRow key={i} item={item} order={order} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl border border-[#f5f2fc] bg-[#faf8ff] flex flex-col gap-1">
              <p className="text-xs text-[#9a9abf] mb-1">Courier &amp; tracking</p>
              {shipment.courier && (
                <p className="text-xs text-black">
                  <span className="text-[#9a9abf]">Courier: </span>
                  {shipment.courier}
                </p>
              )}
              {shipment.awb && (
                <p className="text-xs text-black">
                  <span className="text-[#9a9abf]">AWB: </span>
                  {shipment.awb}
                </p>
              )}
              {shipment.edd && (
                <p className="text-xs text-black flex items-center gap-1">
                  <CalendarClock size={11} className="text-[#9a9abf]" />
                  <span className="text-[#9a9abf]">Expected delivery: </span>
                  {shipment.edd}
                </p>
              )}
              {!shipment.courier && !shipment.awb && (
                <p className="text-xs text-[#9a9abf] flex items-center gap-1.5">
                  <Package size={12} /> No courier assigned yet
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl border border-[#f5f2fc] bg-[#faf8ff] flex flex-col gap-1">
              <p className="text-xs text-[#9a9abf] mb-1">Reference</p>
              {shipment.shiprocketOrderId && (
                <p className="text-xs text-black flex items-center gap-1">
                  <Hash size={10} className="text-[#9a9abf] shrink-0" />
                  <span className="text-[#9a9abf]">Shiprocket order: </span>
                  <span className="font-mono">{shipment.shiprocketOrderId}</span>
                </p>
              )}
              {shipment.shiprocketShipmentId && (
                <p className="text-xs text-black flex items-center gap-1">
                  <Hash size={10} className="text-[#9a9abf] shrink-0" />
                  <span className="text-[#9a9abf]">Shiprocket shipment: </span>
                  <span className="font-mono">{shipment.shiprocketShipmentId}</span>
                </p>
              )}
              <p className="text-xs text-black">
                <span className="text-[#9a9abf]">Created: </span>
                {formatDate(shipment.createdAt)}
              </p>
              <p className="text-xs text-black">
                <span className="text-[#9a9abf]">Last updated: </span>
                {formatDate(shipment.updatedAt)}
              </p>
            </div>
          </div>

          {(shipment.trackingUrl || shipment.labelUrl) && (
            <div className="flex items-center gap-3 flex-wrap mb-4">
              {shipment.trackingUrl && (
                <a
                  href={shipment.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20 transition-colors"
                >
                  <ExternalLink size={15} /> Track shipment
                </a>
              )}
              {shipment.labelUrl && (
                <a
                  href={shipment.labelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <Download size={15} /> Download label
                </a>
              )}
            </div>
          )}

          {shipment.statusHistory?.length > 0 && (
            <div className="pt-3 border-t border-[#f5f2fc]">
              <p className="text-xs text-[#9a9abf] mb-2">History</p>
              <StatusHistoryTimeline history={shipment.statusHistory} />
            </div>
          )}
        </div>
      ))}
    </div>

    {retryTarget && (
      <Modal title="Retry this shipment?" onClose={() => setRetryTarget(null)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {retryConsequences(retryTarget, getCurrencySymbol(order)).map((note, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">{note}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRetryTarget(null)}
              className="flex-1 py-2.5 rounded-xl border border-[#e0d9f5] text-sm font-medium text-black hover:bg-[#faf8ff] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmRetry}
              disabled={retryingId === retryTarget._id}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {retryingId === retryTarget._id ? "Retrying…" : "Yes, retry"}
            </button>
          </div>
        </div>
      </Modal>
    )}
    </>
  );
}
