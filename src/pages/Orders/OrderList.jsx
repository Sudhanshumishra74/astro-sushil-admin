/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { ShoppingBag, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminTable, {
  Avatar,
  Badge,
  formatDate,
} from "../../components/common/Admintable";
import { usePaymentStore } from "../../store/usePaymentStore";
import DateFilter from "../../components/common/DateFilter";
import { downloadCsv } from "../../utils/exportCsv";
import api from "../../services/axios";

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "placed", label: "Placed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
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

const getCurrencySymbol = (currency) => {
  return currency?.toUpperCase() === "USD" ? "$" : "₹";
};

const buildColumns = () => [
  {
    key: "orderId",
    label: "Order ID",
    sortable: true,
    render: (row) => (
      <span className="font-mono text-xs text-primary font-semibold">
        #{(row._id ?? "").slice(-8).toUpperCase()}
      </span>
    ),
  },
  {
    key: "customer",
    label: "Customer",
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.shippingAddress?.fullName ?? row.user?.email} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-black capitalize">
            {row.shippingAddress?.fullName ?? row.user?.firstName ?? "—"}
          </p>
          <p className="text-xs text-[#9a9abf] truncate max-w-40">
            {row.user?.email ?? "—"}
          </p>
          <p className="text-xs text-[#9a9abf] truncate max-w-40">
            {row.shippingAddress?.phone ?? row.user?.phoneNumber ?? "—"}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "items",
    label: "Items",
    render: (row) => (
      <div className="flex flex-col gap-1">
        {row.items?.slice(0, 2).map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-7 h-7 rounded-lg object-cover border border-[#e0d9f5] shrink-0"
              />
            )}
            <span className="text-xs text-[#9a9abf] truncate max-w-36">
              {item.name}
            </span>
          </div>
        ))}
        {row.items?.length > 2 && (
          <span className="text-xs text-primary font-medium">
            +{row.items.length - 2} more
          </span>
        )}
      </div>
    ),
  },
  {
    key: "orderType",
    label: "Type",
    render: (row) => (
      <Badge
        label={row.orderType === "digital" ? "Digital" : "Physical"}
        variant={row.orderType === "digital" ? "info" : "default"}
      />
    ),
  },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    render: (row) => {
      const symbol = getCurrencySymbol(row.payment?.currency);
      return (
        <span className="font-semibold text-black">
          {symbol}
          {(row.totalAmount ?? 0).toLocaleString("en-IN")}
        </span>
      );
    },
  },
  {
    key: "payment",
    label: "Payment",
    render: (row) => (
      <div className="flex flex-col gap-1">
        <Badge
          label={row.payment?.status ?? "—"}
          variant={PAYMENT_VARIANT[row.payment?.status] ?? "default"}
        />
        <span className="text-xs text-[#9a9abf] uppercase">
          {row.payment?.currency ?? "—"}
        </span>
      </div>
    ),
  },
  {
    key: "orderStatus",
    label: "Status",
    render: (row) => (
      <Badge
        label={row.orderStatus}
        variant={STATUS_VARIANT[row.orderStatus] ?? "default"}
      />
    ),
  },
  {
    key: "createdAt",
    label: "Date",
    sortable: true,
    render: (row) => (
      <span className="text-[#9a9abf]">{formatDate(row.createdAt)}</span>
    ),
  },
];

const LIMIT = 10;

export default function OrderList() {
  const navigate = useNavigate();
  const { orders, loading, totalOrders, currentPage, fetchOrders, exportOrders } =
    usePaymentStore();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [productId, setProductId] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [exporting, setExporting] = useState(false);
  const debounceRef = useRef(null);

  const fetch = (overrides = {}) => {
    fetchOrders({
      page: 1,
      limit: LIMIT,
      search,
      status,
      fromDate: dateFrom,
      toDate: dateTo,
      productId,
      ...overrides,
    });
  };

  useEffect(() => {
    fetch();
    // Lightweight product list for the filter dropdown — a plain fetch (not
    // useProductStore) so it doesn't disturb that store's own paginated
    // state used by the Products admin page.
    api
      .get("/products", { params: { page: 1, limit: 1000 } })
      .then((res) => setProductOptions(res.data.data || []))
      .catch(() => setProductOptions([]));
  }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch({ search: val, page: 1 });
    }, 400);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    fetch({ status: val, page: 1 });
  };

  const handleProductChange = (val) => {
    setProductId(val);
    fetch({ productId: val, page: 1 });
  };

  const handlePageChange = (p) => {
    fetch({ page: p });
  };

  const handleDateChange = ({ from, to }) => {
    setDateFrom(from);
    setDateTo(to);
    fetch({ fromDate: from, toDate: to, page: 1 });
  };

  const handleDateClear = () => {
    setDateFrom("");
    setDateTo("");
    fetch({ fromDate: "", toDate: "", page: 1 });
  };

  const handleView = (row) => {
    navigate(`/orders/${row._id}`);
  };

  // One CSV row per product line item (not per order) — respects whatever
  // status/date/product/search filters are currently applied, fetching every
  // matching order (not just the visible page) via exportOrders. When a
  // specific product is selected, only that product's line(s) within each
  // order are exported — not every other item that happened to ride along
  // in the same cart.
  const handleExport = async () => {
    setExporting(true);
    try {
      const allOrders = await exportOrders({ search, status, fromDate: dateFrom, toDate: dateTo, productId });

      const headers = [
        "Order ID",
        "Customer Name",
        "Email",
        "Phone",
        "Product",
        "Quantity",
        "Item Price",
        "Order Type",
        "Order Status",
        "Payment Status",
        "Currency",
        "Order Total",
        "Date",
      ];

      const rows = [];
      allOrders.forEach((order) => {
        let items = order.items?.length ? order.items : [{ name: "—", quantity: "", price: "" }];
        if (productId) {
          items = items.filter((item) => String(item.product) === productId);
        }
        items.forEach((item) => {
          rows.push([
            `#${(order._id ?? "").slice(-8).toUpperCase()}`,
            order.shippingAddress?.fullName ?? order.user?.firstName ?? "",
            order.user?.email ?? "",
            order.shippingAddress?.phone ?? order.user?.phoneNumber ?? "",
            item.name ?? "",
            item.quantity ?? "",
            item.price ?? "",
            order.orderType ?? "",
            order.orderStatus ?? "",
            order.payment?.status ?? "",
            order.payment?.currency ?? "",
            order.totalAmount ?? "",
            formatDate(order.createdAt),
          ]);
        });
      });

      const productSuffix = productId
        ? `_${productOptions.find((p) => p._id === productId)?.name || "product"}`
        : "";
      downloadCsv(`orders_by_product${productSuffix}.csv`, headers, rows);
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminTable
      title="Orders"
      columns={buildColumns()}
      rows={orders}
      total={totalOrders}
      page={currentPage}
      limit={LIMIT}
      loading={loading}
      onPageChange={handlePageChange}
      onSearch={handleSearchChange}
      onView={handleView}
      emptyIcon={<ShoppingBag size={32} />}
      emptyText="No orders found."
      headerActions={
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e0d9f5] bg-white hover:bg-secondary text-primary text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Export CSV
        </button>
      }
      filterSlot={
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="py-2.5 px-3 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          >
            {ORDER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={productId}
            onChange={(e) => handleProductChange(e.target.value)}
            className="py-2.5 px-3 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all max-w-55"
          >
            <option value="">All Products</option>
            {productOptions.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <DateFilter
            from={dateFrom}
            to={dateTo}
            onChange={handleDateChange}
            onClear={handleDateClear}
          />
        </div>
      }
    />
  );
}
