/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function Avatar({ name, img }) {
  if (img) {
    return (
      <img
        src={img}
        alt={name}
        className="w-9 h-9 rounded-xl object-cover border border-[#e0d9f5] shrink-0"
      />
    );
  }
  const initials = name ? name.slice(0, 2).toUpperCase() : "??";
  return (
    <div className="w-9 h-9 rounded-xl bg-secondary border border-[#e0d9f5] flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-primary">{initials}</span>
    </div>
  );
}

export function Badge({ label, variant = "default" }) {
  const styles = {
    success: "bg-green-50 text-green-700 border-green-200",
    danger: "bg-red-50 text-red-600 border-red-200",
    warning: "bg-amber-50 text-amber-600 border-amber-200",
    info: "bg-primary/10 text-primary border-primary/20",
    default: "bg-gray-50 text-gray-500 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center max-w-max gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[variant]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          variant === "success"
            ? "bg-green-500"
            : variant === "danger"
              ? "bg-red-500"
              : variant === "warning"
                ? "bg-amber-500"
                : variant === "info"
                  ? "bg-primary"
                  : "bg-gray-400"
        }`}
      />
      {label}
    </span>
  );
}

export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-[#f5f2fc] animate-pulse">
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
        </td>
      ))}
      <td className="px-4 py-4">
        <div className="h-7 w-20 bg-gray-100 rounded-lg" />
      </td>
    </tr>
  );
}

export default function AdminTable({
  title = "Items",
  subtitle,
  columns = [],
  rows = [],
  total = 0,
  page = 1,
  limit = 10,
  loading = false,
  onPageChange,
  onSearch,
  onEdit, // optional — renders Edit button if passed
  onDelete, // optional — renders Delete button if passed
  onView, // optional — renders View button if passed
  emptyIcon,
  emptyText = "No records found.",
  filterSlot, // optional extra filter UI rendered below search
  headerActions, // optional extra buttons (e.g. Export) rendered next to search
}) {
  const [searchInput, setSearchInput] = useState("");
  const safeLimit = Math.max(1, Number(limit) || 1);
  const safeTotal = Math.max(0, Number(total) || 0);
  const totalPages = Math.max(1, Math.ceil(safeTotal / safeLimit));

  const handleSearch = (val) => {
    setSearchInput(val);
    onSearch?.(val);
  };

  // Show Actions column only if at least one action handler is provided
  const hasActions = onEdit || onDelete || onView;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-black">
              {title}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {subtitle ?? `${total} total records`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onSearch && (
              <div className="relative w-full sm:w-64">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e0d9f5] bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            )}
            {headerActions}
          </div>
        </div>
        {filterSlot && <div>{filterSlot}</div>}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#ede8f8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#ede8f8] bg-white">
                {columns.map(({ key, label, sortable }) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-xs font-medium text-[#9a9abf] whitespace-nowrap"
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      {sortable && (
                        <ArrowUpDown size={11} className="text-[#c0b8d8]" />
                      )}
                    </span>
                  </th>
                ))}
                {hasActions && (
                  <th className="px-4 py-3 text-xs font-medium text-[#9a9abf]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <SkeletonRow
                    key={i}
                    cols={columns.length + (hasActions ? 1 : 0)}
                  />
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="px-4 py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      {emptyIcon && (
                        <div className="text-[#c0b8d8]">{emptyIcon}</div>
                      )}
                      <p className="text-sm">{emptyText}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {rows.map((row, idx) => {
                    const rowId = row._id ?? row.id ?? idx;
                    return (
                      <motion.tr
                        key={rowId}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15, delay: idx * 0.03 }}
                        className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors group"
                      >
                        {columns.map(({ key, render }) => (
                          <td
                            key={key}
                            className="px-4 py-3.5 text-sm text-black"
                          >
                            {render ? render(row) : (row[key] ?? "—")}
                          </td>
                        ))}

                        {hasActions && (
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              {onView && (
                                <button
                                  onClick={() => onView(row)}
                                  title="View"
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors"
                                >
                                  <Eye size={12} />
                                  View
                                </button>
                              )}
                              {onEdit && (
                                <button
                                  onClick={() => onEdit(row)}
                                  title="Edit"
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors"
                                >
                                  <Pencil size={12} />
                                  Edit
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  onClick={() => onDelete(row)}
                                  title="Delete"
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                                >
                                  <Trash2 size={12} />
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#ede8f8] bg-[#faf8ff]">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-medium text-black">
              {rows.length === 0 ? 0 : (page - 1) * limit + 1}–
              {Math.min(page * limit, total)}
            </span>{" "}
            of <span className="font-medium text-black">{total}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1 || loading}
              onClick={() => onPageChange?.(page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0d9f5] text-primary hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              if (totalPages > 5 && Math.abs(p - page) > 2) return null;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange?.(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    p === page
                      ? "bg-primary text-white"
                      : "border border-[#e0d9f5] text-primary hover:bg-secondary"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages || loading}
              onClick={() => onPageChange?.(page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0d9f5] text-primary hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
