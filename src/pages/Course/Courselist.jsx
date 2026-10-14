/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Search, ChevronLeft, ChevronRight,
  Pencil, Trash2, ArrowUpDown,
} from "lucide-react";
import { Avatar, Badge, formatDate } from "../../components/common/Admintable";
import { useCourseStore } from "../../store/useCourseStore";

export default function CourseList() {
  const navigate = useNavigate();
  const {
    courses, total, page, limit, loading,
    fetchCourses, deleteCourse, setPage, setSearch,
  } = useCourseStore();

  const [searchInput, setSearchInput] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => { fetchCourses(); }, []);

  const handleSearch = (val) => {
    setSearchInput(val);
    setSearch(val);
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-black">Courses</h2>
          <p className="text-xs text-gray-400 mt-0.5">{total} total records</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search…"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e0d9f5] bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#ede8f8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#ede8f8] bg-white">
                {[
                  { label: "Course", sortable: true },
                  { label: "Category", sortable: true },
                  { label: "Price", sortable: true },
                  { label: "Status" },
                  { label: "Featured" },
                  { label: "Created", sortable: true },
                  { label: "Actions" },
                ].map(({ label, sortable }) => (
                  <th key={label} className="px-4 py-3 text-xs font-medium text-[#9a9abf] whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      {label}
                      {sortable && <ArrowUpDown size={11} className="text-[#c0b8d8]" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#f5f2fc] animate-pulse">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <BookOpen size={32} className="text-[#c0b8d8]" />
                      <p className="text-sm">No courses found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {courses.map((row, idx) => {
                    const rowId = row._id ?? row.id ?? idx;
                    return (
                      <motion.tr
                        key={rowId}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15, delay: idx * 0.03 }}
                        className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors"
                      >
                        {/* Course */}
                        <td className="px-4 py-3.5 text-sm text-black">
                          <div className="flex items-center gap-3">
                            <Avatar name={row.title} img={row.thumbnail} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-black line-clamp-1">{row.title}</p>
                              <p className="text-xs text-[#9a9abf]">{row.instructorName ?? "—"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5 text-sm text-black">{row.category ?? "—"}</td>

                        {/* Price */}
                        <td className="px-4 py-3.5 text-sm font-semibold text-black">
                          {row.price === 0 ? "Free" : `₹${row.price}`}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          {row.status === "ACTIVE"
                            ? <Badge label="Active" variant="success" />
                            : <Badge label="Inactive" variant="default" />}
                        </td>

                        {/* Featured */}
                        <td className="px-4 py-3.5">
                          {row.isFeatured
                            ? <Badge label="Featured" variant="warning" />
                            : <span className="text-[#9a9abf]">—</span>}
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3.5 text-sm text-[#9a9abf]">
                          {formatDate(row.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          {confirmDeleteId === rowId ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-500 whitespace-nowrap">Sure?</span>
                              <button
                                onClick={() => { deleteCourse(rowId); setConfirmDeleteId(null); }}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => navigate(`/courses/edit/${rowId}`)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors"
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(rowId)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#ede8f8] bg-[#faf8ff]">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-medium text-black">
              {courses.length === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, total)}
            </span>{" "}
            of <span className="font-medium text-black">{total}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(page - 1)}
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
                  onClick={() => setPage(p)}
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
              onClick={() => setPage(page + 1)}
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