/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  User,
  Clock,
  CheckCircle2,
  Circle,
  Truck,
  ShoppingBag,
  FileText,
  ChevronDown,
} from "lucide-react";
import { Badge, formatDate } from "../../components/common/Admintable";
import { usePaymentStore } from "../../store/usePaymentStore";

const ORDER_STATUSES = [
  { key: "placed", label: "Order Placed", icon: ShoppingBag },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const DIGITAL_STATUSES = [
  { key: "placed", label: "Order Placed", icon: ShoppingBag },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const STATUS_VARIANT = {
  confirmed: "success",
  placed: "info",
  processing: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
};

const PAYMENT_VARIANT = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

const ALL_STATUS_OPTIONS = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function InfoCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ede8f8] p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={14} className="text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-black">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-[#f5f2fc] last:border-0">
      <span className="text-xs text-[#9a9abf] shrink-0">{label}</span>
      <span className="text-xs text-black font-medium text-right break-all">
        {value ?? "—"}
      </span>
    </div>
  );
}

function TrackingStep({ step, isActive, isCompleted, isLast }) {
  const Icon = step.icon;
  return (
    <div className="flex items-start gap-3 relative">
      {!isLast && (
        <div
          className={`absolute left-4 top-8 w-0.5 h-full -translate-x-1/2 ${
            isCompleted ? "bg-primary" : "bg-[#ede8f8]"
          }`}
        />
      )}

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
          isCompleted
            ? "bg-primary border-primary"
            : isActive
              ? "bg-white border-primary"
              : "bg-white border-[#ede8f8]"
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 size={14} className="text-white" />
        ) : isActive ? (
          <Icon size={14} className="text-primary" />
        ) : (
          <Circle size={14} className="text-[#c0b8d8]" />
        )}
      </div>

      <div className="pt-1 pb-6">
        <p
          className={`text-sm font-medium ${
            isActive || isCompleted ? "text-black" : "text-[#9a9abf]"
          }`}
        >
          {step.label}
        </p>
        {isActive && (
          <p className="text-xs text-primary mt-0.5 font-medium">
            Current status
          </p>
        )}
      </div>
    </div>
  );
}

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const {
    order,
    detailsLoading,
    updateLoading,
    fetchOrderDetails,
    updateOrderStatus,
    clearOrderDetails,
  } = usePaymentStore();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchOrderDetails(orderId);
    return () => clearOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (order) setSelectedStatus(order.orderStatus);
  }, [order]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order?.orderStatus) return;
    await updateOrderStatus(orderId, selectedStatus);
  };

  if (detailsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
        <Package size={40} className="text-[#c0b8d8]" />
        <p className="text-sm">Order not found</p>
      </div>
    );
  }

  const steps =
    order.orderType === "digital" ? DIGITAL_STATUSES : ORDER_STATUSES;

  const currentStepIdx = steps.findIndex((s) => s.key === order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e0d9f5] text-primary hover:bg-secondary transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="font-heading text-lg font-semibold text-black">
              Order
              <span className="font-mono text-primary">
                #{order._id.slice(-8).toUpperCase()}
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            label={order.orderStatus}
            variant={STATUS_VARIANT[order.orderStatus] ?? "default"}
          />
          <Badge
            label={order.orderType === "digital" ? "Digital" : "Physical"}
            variant={order.orderType === "digital" ? "info" : "default"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <InfoCard title="Order Items" icon={Package}>
            <div className="flex flex-col gap-3">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#f5f2fc] bg-[#faf8ff]"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#e0d9f5] shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#9a9abf] mt-0.5">
                      Qty: {item.quantity} · MRP{" "}
                      <span className="line-through">
                        ₹{item.mrp?.toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-black">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      ₹{(item.mrp - item.price).toLocaleString("en-IN")} off
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 border-t border-[#ede8f8]">
                <span className="text-sm font-semibold text-black">
                  Total Amount
                </span>
                <span className="text-base font-bold text-primary">
                  {order.payment?.currency?.toUpperCase() === "USD" ? "$" : "₹"}
                  {order.totalAmount?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </InfoCard>

          {order.orderType === "physical" && order.shippingAddress && (
            <InfoCard title="Shipping Address" icon={MapPin}>
              <div className="p-3 rounded-xl border border-[#f5f2fc] bg-[#faf8ff] flex flex-col gap-1">
                <p className="text-sm font-semibold text-black">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-xs text-[#9a9abf]">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2
                    ? `, ${order.shippingAddress.addressLine2}`
                    : ""}
                </p>
                <p className="text-xs text-[#9a9abf]">
                  {order.shippingAddress.city}, {order.shippingAddress.state} –{" "}
                  {order.shippingAddress.pincode}
                </p>
                <p className="text-xs text-[#9a9abf] mt-1">
                  📞 {order.shippingAddress.phone}
                </p>
              </div>
            </InfoCard>
          )}

          <InfoCard title="Payment Details" icon={CreditCard}>
            <Row
              label="Currency"
              value={order.payment?.currency?.toUpperCase()}
            />
            <Row
              label="Payment Status"
              value={
                <Badge
                  label={order.payment?.status}
                  variant={PAYMENT_VARIANT[order.payment?.status] ?? "default"}
                />
              }
            />
            {order.payment?.razorpayOrderId && (
              <Row
                label="Razorpay Order ID"
                value={order.payment.razorpayOrderId}
              />
            )}
            {order.payment?.transactionId && (
              <Row label="Transaction ID" value={order.payment.transactionId} />
            )}
            <Row
              label="Total Paid"
              value={`${order.payment?.currency?.toUpperCase() === "USD" ? "$" : "₹"}${order.totalAmount?.toLocaleString("en-IN")}`}
            />
          </InfoCard>
        </div>

        <div className="flex flex-col gap-5">
          <InfoCard title="Customer" icon={User}>
            <Row label="Email" value={order.user?.email} />
            <Row
              label="User ID"
              value={order.user?._id?.slice(-8).toUpperCase()}
            />
            {order.shippingAddress && (
              <Row label="Name" value={order.shippingAddress.fullName} />
            )}
          </InfoCard>

          <InfoCard title="Order Info" icon={FileText}>
            <Row
              label="Order ID"
              value={`#${order._id.slice(-8).toUpperCase()}`}
            />
            <Row label="Type" value={order.orderType} />
            <Row label="Created" value={formatDate(order.createdAt)} />
            <Row label="Updated" value={formatDate(order.updatedAt)} />
          </InfoCard>

          <InfoCard title="Update Status" icon={Clock}>
            {isCancelled ? (
              <p className="text-xs text-red-500 font-medium">
                This order has been cancelled and cannot be updated.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((p) => !p)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-[#e0d9f5] bg-white text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  >
                    <span className="capitalize">
                      {selectedStatus || "Select status"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-[#9a9abf] transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[#ede8f8] rounded-xl shadow-lg overflow-hidden">
                      {ALL_STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSelectedStatus(s);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm capitalize transition-colors hover:bg-[#faf8ff] ${
                            s === selectedStatus
                              ? "text-primary font-semibold bg-primary/5"
                              : "text-black"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={
                    updateLoading || selectedStatus === order.orderStatus
                  }
                  className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {updateLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating…
                    </span>
                  ) : (
                    "Update Status"
                  )}
                </button>

                {selectedStatus !== order.orderStatus && (
                  <p className="text-xs text-[#9a9abf] text-center">
                    Change:{" "}
                    <span className="text-black font-medium capitalize">
                      {order.orderStatus}
                    </span>{" "}
                    →{" "}
                    <span className="text-primary font-medium capitalize">
                      {selectedStatus}
                    </span>
                  </p>
                )}
              </div>
            )}
          </InfoCard>

          {!isCancelled && (
            <InfoCard title="Order Tracking" icon={Truck}>
              <div className="flex flex-col pt-1">
                {steps.map((step, i) => (
                  <TrackingStep
                    key={step.key}
                    step={step}
                    isCompleted={i < currentStepIdx}
                    isActive={i === currentStepIdx}
                    isLast={i === steps.length - 1}
                  />
                ))}
              </div>
            </InfoCard>
          )}

          {isCancelled && (
            <InfoCard title="Order Tracking" icon={Truck}>
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Package size={18} className="text-red-400" />
                </div>
                <p className="text-sm font-medium text-red-500">
                  Order Cancelled
                </p>
                <p className="text-xs text-[#9a9abf]">
                  This order was cancelled and will not be processed further.
                </p>
              </div>
            </InfoCard>
          )}
        </div>
      </div>
    </motion.div>
  );
}
