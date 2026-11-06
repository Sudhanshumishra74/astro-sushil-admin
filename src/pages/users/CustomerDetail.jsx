/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  AtSign,
  Calendar,
  MapPin,
  Clock,
  FileText,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useCustomerStore } from "../../store/useCustomerStore";
import { usePaymentStore } from "../../store/usePaymentStore";
import AdminTable, { Badge, formatDate } from "../../components/common/Admintable";

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

const getCurrencySymbol = (currency) =>
  currency?.toUpperCase() === "USD" ? "$" : "₹";

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#ede8f8] bg-white p-6 flex flex-col gap-5 shadow-sm">
      {title && (
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b0a8c8] border-b border-[#f0f0f8] pb-3">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

function InfoRow({ icon: IconComp, label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary/40">
        {IconComp && <IconComp size={13} className="text-primary" />}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#b0a8c8]">
          {label}
        </span>
        <span className="text-sm font-medium text-black wrap-break-word">{value}</span>
      </div>
    </div>
  );
}

const buildOrderColumns = () => [
  {
    key: "orderId",
    label: "Order ID",
    render: (row) => (
      <span className="font-mono text-xs text-primary font-semibold">
        #{(row._id ?? "").slice(-8).toUpperCase()}
      </span>
    ),
  },
  {
    key: "items",
    label: "Items",
    render: (row) => (
      <span className="text-xs text-[#9a9abf]">
        {row.items?.length || 0} item{(row.items?.length || 0) === 1 ? "" : "s"}
      </span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
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
      <Badge
        label={row.payment?.status ?? "—"}
        variant={PAYMENT_VARIANT[row.payment?.status] ?? "default"}
      />
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
    render: (row) => (
      <span className="text-[#9a9abf]">{formatDate(row.createdAt)}</span>
    ),
  },
];

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { customer, customerLoading, fetchCustomerById, clearCustomer } =
    useCustomerStore();

  const {
    orders,
    totalOrders,
    currentPage,
    loading: ordersLoading,
    fetchOrders,
  } = usePaymentStore();

  useEffect(() => {
    if (id) {
      fetchCustomerById(id);
      fetchOrders({ userId: id, page: 1, limit: 10 });
    }

    return () => clearCustomer();
  }, [id]);

  const handleOrdersPageChange = (page) => {
    fetchOrders({ userId: id, page, limit: 10 });
  };

  if (customerLoading && !customer) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-medium text-gray-500">Customer not found.</p>
        <button
          onClick={() => navigate("/customers")}
          className="text-xs text-primary hover:underline"
        >
          Back to customers
        </button>
      </div>
    );
  }

  const isActive = customer.status === "ACTIVE";

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/customers")}
            className="rounded-xl p-2 text-[#9a9abf] hover:bg-white hover:text-primary border border-transparent hover:border-[#e0d9f5] transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-black capitalize">
              {customer.firstName} {customer.lastName || ""}
            </h1>
            <nav className="flex items-center gap-2 text-xs text-[#9a9abf] mt-0.5">
              <Link to="/customers" className="hover:text-primary transition-colors">
                Customers
              </Link>
              <span>›</span>
              <span className="text-primary font-medium">Details</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — profile */}
        <div className="flex flex-col gap-5">
          <Card>
            <div className="flex flex-col items-center gap-3 text-center">
              {customer.profilePhoto ? (
                <img
                  src={customer.profilePhoto}
                  alt={customer.firstName}
                  className="w-20 h-20 rounded-2xl object-cover border border-[#e0d9f5]"
                />
              ) : (
                // Avatar (Admintable.jsx) is hardcoded to a small w-9 h-9 —
                // wrapping it in a bigger box doesn't stretch it, so the
                // profile header gets its own larger initials tile instead.
                <div className="w-20 h-20 rounded-2xl bg-secondary border border-[#e0d9f5] flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {customer.firstName ? customer.firstName.slice(0, 2).toUpperCase() : "??"}
                  </span>
                </div>
              )}
              <div>
                <p className="text-base font-bold text-black capitalize">
                  {customer.firstName} {customer.lastName || ""}
                </p>
                {customer.username && (
                  <p className="text-xs text-[#9a9abf]">@{customer.username}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  label={isActive ? "Active" : "Blocked"}
                  variant={isActive ? "success" : "danger"}
                />
                <Badge
                  label={customer.isVerified ? "Verified" : "Unverified"}
                  variant={customer.isVerified ? "info" : "default"}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#f0f0f8] pt-4">
              <InfoRow icon={Mail} label="Email" value={customer.email} />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={
                  customer.phoneNumber
                    ? customer.phoneNumber.startsWith("+")
                      ? customer.phoneNumber
                      : `+${customer.phoneNumber}`
                    : null
                }
              />
              <InfoRow icon={AtSign} label="Username" value={customer.username} />
              <InfoRow icon={Calendar} label="Joined" value={formatDate(customer.createdAt)} />
            </div>
          </Card>

          <Card title="Personal Details">
            <InfoRow icon={Calendar} label="Date of Birth" value={customer.dob} />
            <InfoRow icon={FileText} label="Gender" value={customer.gender} />
            <InfoRow icon={MapPin} label="Birth Place" value={customer.birthPlace} />
            <InfoRow icon={Clock} label="Birth Time" value={customer.birthTime} />
            <InfoRow icon={FileText} label="Bio" value={customer.bio} />
          </Card>
        </div>

        {/* Right column — order history */}
        <div className="lg:col-span-2">
          <AdminTable
            title="Order History"
            subtitle={`${totalOrders} order${totalOrders === 1 ? "" : "s"} placed`}
            columns={buildOrderColumns()}
            rows={orders}
            total={totalOrders}
            page={currentPage}
            limit={10}
            loading={ordersLoading}
            onPageChange={handleOrdersPageChange}
            onView={(row) => navigate(`/orders/${row._id}`)}
            emptyIcon={<ShoppingBag size={32} />}
            emptyText="No orders placed yet."
          />
        </div>
      </div>
    </div>
  );
}
