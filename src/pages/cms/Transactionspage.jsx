/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Search, Trash2, Eye, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Toppage from "../../components/common/Toppage";
import { Badge } from "../../components/common/Admintable";
import { Modal } from "../../components/common/Modal";
import { usePaymentStore } from "../../store/usePaymentStore";
import DateFilter from "../../components/common/DateFilter";

const PAGE_LIMIT = 10;

const STATUS_VARIANTS = {
  success: "success",
  failed: "danger",
  pending: "warning",
  refunded: "info",
};

export default function TransactionsPage() {
  const {
    transactions,
    transactionsLoading,
    transactionsTotal,
    transactionsPage,
    transactionsTotalPages,
    fetchTransactions,
  } = usePaymentStore();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [active, setActive] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef(null);

  const fetch = (overrides = {}) => {
    fetchTransactions({
      fromDate: dateFrom,
      toDate: dateTo,
      search,
      page,
      limit: PAGE_LIMIT,
      ...overrides,
    });
  };

  useEffect(() => {
    fetch({ page: 1 });
  }, []);

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetch({ page: newPage });
  };

  return (
    <>
      <div className="space-y-5">
        <Toppage Title="Transactions" />

        {/* Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: transactions.length, color: "text-black" },
            {
              label: "Success",
              value: transactions.filter((i) => i.status === "success").length,
              color: "text-green-500",
            },
            {
              label: "Pending",
              value: transactions.filter((i) => i.status === "pending").length,
              color: "text-yellow-500",
            },
            {
              label: "Revenue",
              value: `₹${(totalRevenue / 100).toLocaleString()}`,
              color: "text-primary",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white border border-[#e0d9f5] rounded-2xl px-5 py-4"
            >
              <p className="text-xs text-[#9a9abf]">{label}</p>
              <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div> */}

        <div className="bg-white border border-[#e0d9f5] rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
            <div>
              <p className="font-heading text-base font-bold text-black">
                Transaction History
              </p>
              <p className="text-xs text-[#9a9abf] mt-0.5">
                All payment transactions across your platform.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-[#ede8f8]">
            <div className="relative w-72">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a8c8]"
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <DateFilter
              from={dateFrom}
              to={dateTo}
              onChange={handleDateChange}
              onClear={handleDateClear}
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#ede8f8] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#ede8f8] bg-white">
                    {[
                      "Txn ID",
                      "User",
                      "Amount",
                      "Method",
                      "Razorpay Order",
                      "Status",
                      "Date",
                      "Actions",
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
                  {transactionsLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm">Loading transactions...</p>
                        </div>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <CreditCard size={32} className="text-[#c0b8d8]" />
                          <p className="text-sm">No transactions found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {transactions.map((row, idx) => (
                        <motion.tr
                          key={row._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, delay: idx * 0.03 }}
                          className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors"
                        >
                          <td className="px-4 py-3.5 text-xs font-mono text-[#9a9abf]">
                            {row.transactionId || row._id}
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-sm font-semibold text-black">
                              {row.user?.firstName}
                            </p>
                            <p className="text-xs text-[#9a9abf]">
                              {row.user?.email}
                            </p>
                            <p className="text-xs text-[#9a9abf]">
                              {row.user?.phoneNumber}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 text-sm font-semibold text-black whitespace-nowrap">
                            {row.currency.toLowerCase() === "inr" ? "₹" : "$"}
                            {row.amount?.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-3.5 text-sm text-black capitalize">
                            {row.method}
                          </td>
                          <td className="px-4 py-3.5 text-xs font-mono text-[#9a9abf] max-w-40">
                            <p className="truncate">{row.razorpayOrderId}</p>
                          </td>
                          <td className="px-4 py-3.5 flex flex-col items-center gap-2">
                            <Badge
                              label={
                                row.status.charAt(0).toUpperCase() +
                                row.status.slice(1)
                              }
                              variant={STATUS_VARIANTS[row.status] || "default"}
                            />
                            <span className="text-xs text-[#9a9abf] uppercase">
                              {row.currency ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-[#9a9abf] whitespace-nowrap">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => {
                                setActive(row);
                                setModal("view");
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors"
                            >
                              <Eye size={12} /> View
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {transactionsTotalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#ede8f8]">
              <p className="text-xs text-[#9a9abf]">
                Showing {((transactionsPage - 1) * PAGE_LIMIT) + 1}–{Math.min(transactionsPage * PAGE_LIMIT, transactionsTotal)} of {transactionsTotal}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(transactionsPage - 1)}
                  disabled={transactionsPage <= 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#d8d0ee] text-black hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: transactionsTotalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - transactionsPage) <= 2)
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        p === transactionsPage
                          ? "bg-primary text-white"
                          : "border border-[#d8d0ee] text-black hover:bg-secondary"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  onClick={() => handlePageChange(transactionsPage + 1)}
                  disabled={transactionsPage >= transactionsTotalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#d8d0ee] text-black hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      <AnimatePresence mode="wait">
        {modal === "view" && active && (
          <Modal title="Transaction Details" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">Transaction ID</p>
                  <p className="text-sm font-mono font-semibold text-black break-all">
                    {active.transactionId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">Status</p>
                  <Badge
                    label={
                      active.status.charAt(0).toUpperCase() +
                      active.status.slice(1)
                    }
                    variant={STATUS_VARIANTS[active.status] || "default"}
                  />
                </div>
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">User</p>
                  <p className="text-sm font-semibold text-black">
                    {active.user?.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">Phone</p>
                  <p className="text-sm text-black">
                    {active.user?.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">Email</p>
                  <p className="text-sm text-black break-all">
                    {active.user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">Amount</p>
                  <p className="text-sm font-bold text-black">
                    ₹{active.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">Method</p>
                  <p className="text-sm text-black capitalize">
                    {active.method}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">Date</p>
                  <p className="text-sm text-black">
                    {new Date(active.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#9a9abf] mb-1">Razorpay Order ID</p>
                <p className="text-sm font-mono text-black bg-[#faf8ff] border border-[#ede8f8] rounded-xl p-3 break-all">
                  {active.razorpayOrderId}
                </p>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setModal(null)}
                  className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
