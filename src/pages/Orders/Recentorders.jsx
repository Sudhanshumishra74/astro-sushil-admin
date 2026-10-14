/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../../store/usePaymentStore";
import { Badge } from "../../components/common/Admintable";

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

const getCurrencySymbol = (currency) => {
  return currency?.toUpperCase() === "USD" ? "$" : "₹";
};

const TABLE_HEADERS = [
  "Order",
  "Customer",
  "Items",
  "Amount",
  "Payment",
  "Status",
  "Date",
];

export default function RecentOrders() {
  const navigate = useNavigate();
  const { orders, loading, fetchOrders } = usePaymentStore();

  useEffect(() => {
    fetchOrders({ page: 1, limit: 5 });
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 border border-primary/8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-primary text-base flex items-center gap-1.5">
          <ShoppingBag size={15} color="#424874" strokeWidth={2} />
          Recent Orders
        </h2>
        <span
          onClick={() => navigate("/orders")}
          className="text-xs text-gold cursor-pointer font-medium flex items-center gap-1"
        >
          <ArrowRight size={11} strokeWidth={2} /> See all orders
        </span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-[#9a9abf]">
          <ShoppingBag size={28} className="text-[#c0b8d8]" />
          <p className="text-xs">No orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="text-[10px] tracking-[1.5px] uppercase text-primary/40 pb-2.5 text-left font-medium border-b border-primary/8 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o._id}
                  onClick={() => navigate(`/orders/${o._id}`)}
                  className="border-b border-primary/5 last:border-none hover:bg-[#faf8ff] transition-colors cursor-pointer"
                >
                  {/* Order ID */}
                  <td className="py-2.5 pr-3">
                    <span className="font-mono text-xs text-primary font-semibold">
                      #{(o._id ?? "").slice(-6).toUpperCase()}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-2.5 pr-3">
                    <p className="text-sm font-medium text-black capitalize whitespace-nowrap">
                      {o.shippingAddress?.fullName ?? o.user?.email ?? "—"}
                    </p>
                    <p className="text-[10.5px] text-primary/40 truncate max-w-28">
                      {o.user?.email ?? "—"}
                    </p>
                  </td>

                  {/* Items */}
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-1.5">
                      {o.items
                        ?.slice(0, 2)
                        .map((item, i) =>
                          item.image ? (
                            <img
                              key={i}
                              src={item.image}
                              alt={item.name}
                              className="w-6 h-6 rounded-md object-cover border border-[#e0d9f5] shrink-0"
                            />
                          ) : null,
                        )}
                      {o.items?.length > 0 && (
                        <span className="text-xs text-[#9a9abf]">
                          {o.items.length} item{o.items.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-2.5 pr-3 text-sm font-semibold text-black whitespace-nowrap">
                    {getCurrencySymbol(o.payment?.currency)}
                    {(o.totalAmount ?? 0).toLocaleString("en-IN")}
                  </td>

                  {/* Payment */}
                  <td className="py-2.5 pr-3">
                    <Badge
                      label={o.payment?.status ?? "—"}
                      variant={PAYMENT_VARIANT[o.payment?.status] ?? "default"}
                    />
                    <p className="text-[10px] text-primary/40 uppercase mt-0.5">
                      {o.payment?.currency ?? ""}
                    </p>
                  </td>

                  {/* Order Status */}
                  <td className="py-2.5 pr-3">
                    <Badge
                      label={o.orderStatus ?? "—"}
                      variant={STATUS_VARIANT[o.orderStatus] ?? "default"}
                    />
                  </td>

                  {/* Date */}
                  <td className="py-2.5 text-[10.5px] text-primary/40 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
