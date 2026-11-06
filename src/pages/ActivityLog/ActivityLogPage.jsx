/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { History } from "lucide-react";
import { useAuditLogStore } from "../../store/useAuditLogStore";
import { useStaffStore } from "../../store/useStaffStore";
import AdminTable, { Badge, formatDate } from "../../components/common/Admintable";
import DateFilter from "../../components/common/DateFilter";

function formatActionLabel(action) {
  const verb = action?.split(".")[1] || action || "";
  return verb
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function actionVariant(action) {
  const verb = (action?.split(".")[1] || "").toLowerCase();
  if (verb.includes("delete")) return "danger";
  if (verb.includes("create")) return "success";
  if (verb.includes("toggle") || verb.includes("status")) return "warning";
  if (verb.includes("update") || verb.includes("edit")) return "info";
  return "default";
}

const TARGET_TYPE_OPTIONS = [
  { value: "", label: "All Targets" },
  { value: "Product", label: "Product" },
  { value: "Category", label: "Category" },
  { value: "Coupon", label: "Coupon" },
  { value: "Banner", label: "Banner" },
  { value: "Course", label: "Course" },
  { value: "Blog", label: "Blog" },
  { value: "FAQ", label: "FAQ" },
  { value: "Testimonial", label: "Testimonial" },
  { value: "Media", label: "Media" },
  { value: "Seo", label: "SEO" },
  { value: "Order", label: "Order" },
  { value: "Return", label: "Return" },
  { value: "Shipment", label: "Shipment" },
  { value: "Customer", label: "Customer" },
  { value: "Staff", label: "Staff" },
  { value: "Role", label: "Role" },
  { value: "Setting", label: "Setting" },
  { value: "Contact", label: "Contact" },
  { value: "Availability", label: "Availability" },
  { value: "Schedule", label: "Schedule" },
  { value: "Booking", label: "Booking" },
  { value: "Consultation", label: "Consultation" },
  { value: "Report", label: "PDF Report" },
];

// null/undefined read as "—" instead of the literal word so a cleared field
// (e.g. bio removed) doesn't look identical to "not tracked".
function formatValue(v) {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  // The backend recurses into nested plain objects before this ever renders
  // (diffFields, auditLog.service.js), so this only ever catches a leaf
  // that's still an array/object (e.g. an array of objects) — JSON.stringify
  // it rather than falling through to String(), which for a plain object
  // is just the literal text "[object Object]".
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}

const buildColumns = () => [
  {
    key: "adminName",
    label: "Staff",
    render: (row) => (
      <div>
        <p className="text-sm font-semibold text-black">{row.adminName}</p>
        {row.adminEmail && <p className="text-[11px] text-[#9a9abf]">{row.adminEmail}</p>}
      </div>
    ),
  },
  {
    key: "action",
    label: "Action",
    render: (row) => (
      <Badge label={formatActionLabel(row.action)} variant={actionVariant(row.action)} />
    ),
  },
  {
    key: "target",
    label: "Target",
    render: (row) => (
      <div>
        <p className="text-xs font-medium text-black">{row.targetLabel || "—"}</p>
        <p className="text-[11px] text-[#9a9abf]">{row.targetType}</p>
      </div>
    ),
  },
  {
    key: "changes",
    label: "Changes",
    render: (row) => (
      <div className="flex flex-col gap-1 max-w-xs">
        {(row.changes || []).map((c, i) => (
          <p key={i} className="text-xs text-[#9a9abf]">
            <span className="font-medium text-black">{c.field}</span>:{" "}
            {formatValue(c.from)} <span className="text-[#c0b8d8]">→</span>{" "}
            <span className="text-black">{formatValue(c.to)}</span>
          </p>
        ))}
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Date",
    sortable: true,
    render: (row) => (
      <span className="text-[#9a9abf] whitespace-nowrap">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
];

export default function ActivityLogPage() {
  const { logs, total, page, limit, loading, fetchAuditLogs } = useAuditLogStore();
  const { staff, fetchStaff } = useStaffStore();

  const [search, setSearch] = useState("");
  const [targetType, setTargetType] = useState("");
  const [staffId, setStaffId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const debounceRef = useRef(null);

  const fetch = (overrides = {}) => {
    fetchAuditLogs({
      page: 1,
      search,
      targetType,
      admin: staffId,
      fromDate: dateFrom,
      toDate: dateTo,
      ...overrides,
    });
  };

  useEffect(() => {
    fetch();
    // High limit so the filter dropdown lists every staff member, not just
    // the first page of the (paginated) staff list.
    fetchStaff({ limit: 999 });
  }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch({ search: val, page: 1 });
    }, 400);
  };

  const handleTargetTypeChange = (val) => {
    setTargetType(val);
    fetch({ targetType: val, page: 1 });
  };

  const handleStaffChange = (val) => {
    setStaffId(val);
    fetch({ admin: val, page: 1 });
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

  const handlePageChange = (p) => {
    fetch({ page: p });
  };

  return (
    <AdminTable
      title="Activity Log"
      subtitle={`${total} action${total === 1 ? "" : "s"} recorded`}
      columns={buildColumns()}
      rows={logs}
      total={total}
      page={page}
      limit={limit}
      loading={loading}
      onPageChange={handlePageChange}
      onSearch={handleSearchChange}
      emptyIcon={<History size={32} />}
      emptyText="No staff activity recorded yet."
      filterSlot={
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={staffId}
            onChange={(e) => handleStaffChange(e.target.value)}
            className="py-2.5 px-3 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          >
            <option value="">All Staff</option>
            {staff.map((s) => (
              <option key={s._id} value={s._id}>
                {s.fullName}{s.email ? ` (${s.email})` : ""}
              </option>
            ))}
          </select>
          <select
            value={targetType}
            onChange={(e) => handleTargetTypeChange(e.target.value)}
            className="py-2.5 px-3 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          >
            {TARGET_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
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
