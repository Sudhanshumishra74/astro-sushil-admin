/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { FileText, RefreshCw, Search, Download, Loader2 } from "lucide-react";
import AdminTable, {
  Avatar,
  Badge,
  formatDate,
} from "../../components/common/Admintable";
import { useReportStore } from "../../store/useReportStore";
import DateFilter from "../../components/common/DateFilter";
import { downloadCsv } from "../../utils/exportCsv";

const REPORT_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "basic_horoscope_pdf", label: "Basic Horoscope" },
  { value: "mini_horoscope_pdf", label: "Mini Horoscope" },
  { value: "pro_horoscope_pdf", label: "Pro Horoscope" },
  { value: "match_making_pdf", label: "Match Making" },
];

const STATUS_VARIANT = {
  pending: "warning",
  processing: "info",
  completed: "success",
};

const PAYMENT_VARIANT = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

const buildColumns = () => [
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
    key: "report",
    label: "Report",
    render: (row) => (
      <div className="min-w-0">
        <p className="text-sm font-semibold text-black capitalize">
          {row.reportId?.name ?? row.reportType?.replace(/_/g, " ") ?? "—"}
        </p>
        <p className="text-xs text-[#9a9abf] truncate max-w-40">
          {row.reportId?.reportType || row.reportType || "—"}
        </p>
      </div>
    ),
  },
  {
    key: "customer",
    label: "Customer",
    render: (row) => {
      const name =
        row.customerDetails?.fullName ||
        row.matchMakingDetails?.bride?.fullName ||
        row.matchMakingDetails?.groom?.fullName ||
        row.userId?.email ||
        "—";
      const email = row.customerDetails?.email || row.userId?.email || "—";
      const phone =
        row.customerDetails?.phone || row.userId?.phoneNumber || "—";

      return (
        <div className="flex items-center gap-3">
          <Avatar name={name} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-black capitalize truncate">
              {name}
            </p>
            <p className="text-xs text-[#9a9abf] truncate max-w-40">{email}</p>
            <p className="text-xs text-[#9a9abf] truncate max-w-40">{phone}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: "paymentAmount",
    label: "Payment",
    sortable: true,
    render: (row) => {
      const value = Number(row.amount ?? 0);
      const symbol = row.currency === "USD" ? "$" : "₹";
      return (
        <span className="font-semibold text-black">
          {symbol}
          {value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    key: "paymentStatus",
    label: "Payment Status",
    render: (row) => (
      <div className="flex flex-col items-center gap-1">
        <Badge
          label={row.paymentStatus ?? "—"}
          variant={PAYMENT_VARIANT[row.paymentStatus] ?? "default"}
        />
        <span className="text-xs text-[#9a9abf] uppercase">
          {row.currency ?? "INR"}
        </span>
      </div>
    ),
  },
  {
    key: "reportStatus",
    label: "Status",
    render: (row) => (
      <Badge
        label={row.reportStatus ?? "—"}
        variant={STATUS_VARIANT[row.reportStatus] ?? "default"}
      />
    ),
  },
  {
    key: "reportUrl",
    label: "Report URL",
    render: (row) => (
      <a
        href={row.reportUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 py-2 text-primary text-xs font-body font-medium rounded-lg hover:underline transition-colors duration-700"
      >
        <FileText className="w-5 h-5" /> View Report
      </a>
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

const PAGE_LIMIT = 10;

export default function ReportOrders() {
  const { reportOrders, reportOrdersTotal, reportOrdersLoading, fetchReportOrders, exportReportOrders } =
    useReportStore();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [reportType, setReportType] = useState("");
  const [exporting, setExporting] = useState(false);
  const debounceRef = useRef(null);

  const fetch = (overrides = {}) => {
    fetchReportOrders({
      fromDate: dateFrom,
      toDate: dateTo,
      page,
      limit: PAGE_LIMIT,
      search,
      reportType,
      ...overrides,
    });
  };

  useEffect(() => {
    fetch({ page: 1 });
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetch({ page: newPage });
  };

  const handleDateChange = ({ from, to }) => {
    setDateFrom(from);
    setDateTo(to);
    setPage(1);
    fetch({ fromDate: from, toDate: to, page: 1 });
  };

  const handleDateClear = () => {
    setDateFrom("");
    setDateTo("");
    setPage(1);
    fetch({ fromDate: "", toDate: "", page: 1 });
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetch({ search: val, page: 1 });
    }, 400);
  };

  const handleReportTypeChange = (val) => {
    setReportType(val);
    setPage(1);
    fetch({ reportType: val, page: 1 });
  };

  // Respects whatever report-type/date/search filters are currently
  // applied, paging through the full matching set (not just the visible
  // page) via exportReportOrders.
  const handleExport = async () => {
    setExporting(true);
    try {
      const allOrders = await exportReportOrders({ fromDate: dateFrom, toDate: dateTo, search, reportType });

      const headers = [
        "Order ID",
        "Report Name",
        "Report Type",
        "Customer Name",
        "Email",
        "Phone",
        "Amount",
        "Currency",
        "Payment Status",
        "Report Status",
        "Date",
      ];

      const rows = allOrders.map((row) => {
        const name =
          row.customerDetails?.fullName ||
          row.matchMakingDetails?.bride?.fullName ||
          row.matchMakingDetails?.groom?.fullName ||
          row.userId?.email ||
          "";
        const email = row.customerDetails?.email || row.userId?.email || "";
        const phone = row.customerDetails?.phone || row.userId?.phoneNumber || "";

        return [
          `#${(row._id ?? "").slice(-8).toUpperCase()}`,
          row.reportId?.name ?? row.reportType?.replace(/_/g, " ") ?? "",
          row.reportId?.reportType || row.reportType || "",
          name,
          email,
          phone,
          row.amount ?? "",
          row.currency ?? "",
          row.paymentStatus ?? "",
          row.reportStatus ?? "",
          formatDate(row.createdAt),
        ];
      });

      downloadCsv("report_orders_by_type.csv", headers, rows);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-black">
            Report Orders
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            All report order requests from customers
          </p>
        </div>
        <button
          onClick={() => { setPage(1); fetch({ page: 1 }); }}
          className="inline-flex items-center gap-2 rounded-xl border border-[#e0d9f5] bg-white px-3 py-2 text-xs font-medium text-primary transition hover:bg-secondary"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <AdminTable
        title=""
        columns={buildColumns()}
        rows={reportOrders || []}
        total={reportOrdersTotal}
        page={page}
        limit={PAGE_LIMIT}
        onPageChange={handlePageChange}
        loading={reportOrdersLoading}
        emptyIcon={<FileText size={32} />}
        emptyText="No report orders found."
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
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a8c8]" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <select
              value={reportType}
              onChange={(e) => handleReportTypeChange(e.target.value)}
              className="py-2.5 px-3 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            >
              {REPORT_TYPE_OPTIONS.map((opt) => (
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
    </div>
  );
}
