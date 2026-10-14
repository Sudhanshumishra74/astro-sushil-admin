/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Download, FileText, ArrowUp, ArrowDown } from "lucide-react";
import Toppage from "../../components/common/Toppage";
import { Badge } from "../../components/common/Admintable";
import DateFilter from "../../components/common/DateFilter";
import { usePaymentStore } from "../../store/usePaymentStore";

const TYPE_LABELS = {
  order: "Product Order",
  consultation: "Consultation",
  report: "Astrology Report",
};

const STATUS_VARIANTS = {
  success: "success",
  failed: "danger",
  pending: "warning",
};

const fmtAmount = (amount, currency = "INR") =>
  `${currency?.toUpperCase() === "INR" ? "₹" : currency + " "}${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const csvEscape = (value) => {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const downloadCsv = (rows, fromDate, toDate) => {
  const headers = [
    "Date",
    "Invoice No",
    "Type",
    "Customer Name",
    "Email",
    "Phone",
    "Place of Supply",
    "Taxable Value",
    "GST Rate",
    "GST Type",
    "GST Amount",
    "Total Value",
    "Currency",
    "Payment Method",
    "Payment Status",
    "Razorpay Txn ID",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        fmtDate(r.date),
        r.invoiceNo,
        TYPE_LABELS[r.type] || r.type,
        r.customerName,
        r.customerEmail,
        r.customerPhone,
        r.placeOfSupply,
        r.taxableAmount,
        r.gstRateLabel,
        r.gstType,
        r.gstAmount,
        r.totalAmount,
        r.currency,
        r.paymentMethod,
        r.paymentStatus,
        r.razorpayTransactionId,
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const suffix = fromDate || toDate ? `${fromDate || "start"}_to_${toDate || "end"}` : "all";
  link.href = url;
  link.download = `gst-report_${suffix}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function GstReportPage() {
  const { gstReportRows, gstReportSummary, gstReportLoading, fetchGstReport } =
    usePaymentStore();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [status, setStatus] = useState("success");
  const [dateSortOrder, setDateSortOrder] = useState("asc");

  const sortedRows = useMemo(() => {
    const rows = [...gstReportRows];
    rows.sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      return dateSortOrder === "asc" ? diff : -diff;
    });
    return rows;
  }, [gstReportRows, dateSortOrder]);

  const toggleDateSort = () =>
    setDateSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const fetch = (overrides = {}) => {
    fetchGstReport({
      fromDate: dateFrom,
      toDate: dateTo,
      transactionType,
      status,
      ...overrides,
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDateChange = ({ from, to }) => {
    setDateFrom(from);
    setDateTo(to);
    fetch({ fromDate: from, toDate: to });
  };

  const handleDateClear = () => {
    setDateFrom("");
    setDateTo("");
    fetch({ fromDate: "", toDate: "" });
  };

  const handleTypeChange = (val) => {
    setTransactionType(val);
    fetch({ transactionType: val });
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    fetch({ status: val });
  };

  return (
    <div className="space-y-5">
      <Toppage Title="GST Report" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Invoices", value: gstReportSummary.count, format: false },
          { label: "Taxable Value", value: gstReportSummary.taxableTotal, format: true },
          { label: "GST Collected", value: gstReportSummary.gstTotal, format: true },
          { label: "Grand Total", value: gstReportSummary.grandTotal, format: true },
        ].map(({ label, value, format }) => (
          <div
            key={label}
            className="bg-white border border-[#e0d9f5] rounded-2xl px-5 py-4"
          >
            <p className="text-xs text-[#9a9abf]">{label}</p>
            <p className="text-xl font-bold mt-1 text-black">
              {format ? fmtAmount(value) : value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e0d9f5] rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
          <div>
            <p className="font-heading text-base font-bold text-black">
              GST Sales Register
            </p>
            <p className="text-xs text-[#9a9abf] mt-0.5">
              Invoice-wise tax breakdown across orders, consultations and reports.
            </p>
          </div>
          <button
            onClick={() => downloadCsv(gstReportRows, dateFrom, dateTo)}
            disabled={gstReportRows.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-[#ede8f8]">
          <DateFilter
            from={dateFrom}
            to={dateTo}
            onChange={handleDateChange}
            onClear={handleDateClear}
          />

          <select
            value={transactionType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="px-3 py-2.5 text-xs border border-[#d8d0ee] rounded-xl bg-white text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="order">Product Orders</option>
            <option value="consultation">Consultations</option>
            <option value="report">Astrology Reports</option>
          </select>

          {/* <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-2.5 text-xs border border-[#d8d0ee] rounded-xl bg-white text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
          >
            <option value="success">Paid Only</option>
            <option value="pending">Pending Only</option>
            <option value="failed">Failed Only</option>
            <option value="">All Statuses</option>
          </select>  */}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#ede8f8] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#ede8f8] bg-white">
                  <th className="px-4 py-3 text-xs font-medium text-[#9a9abf] whitespace-nowrap">
                    <button
                      onClick={toggleDateSort}
                      className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                    >
                      Date
                      {dateSortOrder === "asc" ? (
                        <ArrowUp size={12} />
                      ) : (
                        <ArrowDown size={12} />
                      )}
                    </button>
                  </th>
                  {[
                    "Invoice No",
                    "Type",
                    "Customer",
                    "Place of Supply",
                    "Taxable Value",
                    "GST Rate",
                    "GST Type",
                    "GST Amount",
                    "Total",
                    "Status",
                  ].map((label) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-xs font-medium text-[#9a9abf] whitespace-nowrap"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gstReportLoading ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm">Loading GST report...</p>
                      </div>
                    </td>
                  </tr>
                ) : gstReportRows.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <FileText size={32} className="text-[#c0b8d8]" />
                        <p className="text-sm">No transactions found for this period.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedRows.map((row) => (
                    <tr
                      key={row.transactionId}
                      className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors"
                    >
                      <td className="px-4 py-3.5 text-xs text-[#9a9abf] whitespace-nowrap">
                        {fmtDate(row.date)}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-black whitespace-nowrap">
                        {row.invoiceNo}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-black whitespace-nowrap">
                        {TYPE_LABELS[row.type] || row.type}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-black">
                          {row.customerName}
                        </p>
                        <p className="text-xs text-[#9a9abf]">{row.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-black whitespace-nowrap">
                        {row.placeOfSupply}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-black whitespace-nowrap">
                        {fmtAmount(row.taxableAmount, row.currency)}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-black whitespace-nowrap">
                        {row.gstRateLabel}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-black whitespace-nowrap">
                        {row.gstType}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-black whitespace-nowrap">
                        {fmtAmount(row.gstAmount, row.currency)}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-black whitespace-nowrap">
                        {fmtAmount(row.totalAmount, row.currency)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          label={row.paymentStatus}
                          variant={STATUS_VARIANTS[row.paymentStatus] || "default"}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
