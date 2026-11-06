// Single reusable payment breakdown block — Subtotal → Discount → Shipping
// → Tax → Total — for any detail view showing a payment total (Order
// detail, Transaction detail, ...). Centralizes currency-symbol formatting
// in one place instead of the several slightly-different hand-rolled
// versions scattered across OrderList.jsx/Recentorders.jsx/ReportOrders.jsx/
// GstReportPage.jsx.
function getCurrencySymbol(currency) {
  return currency?.toUpperCase() === "USD" ? "$" : "₹";
}

function formatMoney(amount, currency) {
  return `${getCurrencySymbol(currency)}${Number(amount || 0).toLocaleString("en-IN")}`;
}

export default function PriceBreakdown({
  subTotal,
  discount = 0,
  couponCode,
  shipping = 0,
  tax = 0,
  totalAmount,
  currency,
}) {
  const fmt = (amount) => formatMoney(amount, currency);

  const rows = [
    subTotal != null && { label: "Subtotal", value: fmt(subTotal) },
    discount > 0 && {
      label: `Discount${couponCode ? ` (${couponCode})` : ""}`,
      value: `− ${fmt(discount)}`,
      green: true,
    },
    shipping > 0 && { label: "Shipping", value: fmt(shipping) },
    tax > 0 && { label: "Tax", value: fmt(tax) },
  ].filter(Boolean);

  return (
    <div>
      {rows.map(({ label, value, green }) => (
        <div
          key={label}
          className="flex items-start justify-between gap-4 py-2 border-b border-[#f5f2fc]"
        >
          <span className="text-xs text-[#9a9abf] shrink-0">{label}</span>
          <span
            className={`text-xs font-medium text-right ${green ? "text-emerald-600" : "text-black"}`}
          >
            {value}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between pt-3 border-t border-[#ede8f8] mt-1">
        <span className="text-sm font-semibold text-black">Total</span>
        <span className="text-base font-bold text-primary">{fmt(totalAmount)}</span>
      </div>
    </div>
  );
}
