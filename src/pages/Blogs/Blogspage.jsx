/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X, Plus, Search, SlidersHorizontal, ArrowUpDown,
  FileText, Pencil, Trash2, Eye, ChevronLeft, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBlogStore } from "../../store/Useblogstore";

function StatusBadge({ status }) {
  const styles = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft:     "bg-amber-50 text-amber-600 border-amber-200",
    archived:  "bg-[#f5f5f8] text-[#9a9abf] border-[#e8e8f4]",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border capitalize ${styles[status] || styles.draft}`}>
      {status || "draft"}
    </span>
  );
}

function DeleteModal({ blog, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ede8f8]">
          <h2 className="font-bold text-base text-black">Delete Blog</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f5f2fc] text-gray-400 hover:text-[#6c63ff] transition">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <p className="text-sm text-[#9a9abf]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-black">{blog?.title}</span>?
            This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-1">
            <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-[#f5f2fc] transition">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-[#f5f2fc]">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 rounded-lg bg-[#f0eefa] animate-pulse" style={{ width: i === 1 ? 200 : 80 }} />
        </td>
      ))}
    </tr>
  );
}

export default function BlogsPage() {
  const navigate = useNavigate();
  const {
    blogs, total, loading, page, limit, search,
    fetchBlogs, deleteBlog, setPage,
  } = useBlogStore();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchInput, setSearchInput] = useState(search);
  const [selected, setSelected] = useState([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchBlogs(); }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== search) fetchBlogs({ search: searchInput, page: 1 });
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const totalPages = Math.ceil(total / limit) || 1;

  const handleDelete = async () => {
    setDeleting(true);
    await deleteBlog(deleteTarget._id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(selected.length === blogs.length ? [] : blogs.map((b) => b._id));

  const handlePageChange = (p) => { setPage(p); fetchBlogs({ page: p }); };

  return (
    <>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Blogs</h1>
          <nav className="flex items-center gap-2 text-sm text-[#9a9abf]">
            <Link to="/" className="hover:text-[#6c63ff] transition-colors">Home</Link>
            <span>›</span>
            <span className="text-[#6c63ff] font-medium">Blogs</span>
          </nav>
        </div>

        <div className="bg-white border border-[#e0d9f5] rounded-2xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
            <div>
              <p className="text-base font-bold text-[#1a1a2e]">Blogs List</p>
              <p className="text-xs text-[#9a9abf] mt-0.5">{total} blog{total !== 1 ? "s" : ""} total</p>
            </div>
            <button
              onClick={() => navigate("/blogs/add")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-linear-to-r from-[#6c63ff] to-[#a78bfa] text-white shadow-md shadow-[#6c63ff]/20 hover:-translate-y-0.5 hover:shadow-lg transition cursor-pointer"
            >
              <Plus size={14} /> Add Blog
            </button>
          </div>

          {/* Search bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#ede8f8]">
            <div className="relative w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a8c8]" />
              <input
                type="text"
                placeholder="Search blogs…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#f7f7fb] border border-[#d8d0ee] rounded-xl text-[#1a1a2e] placeholder-[#b0a8c8] outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10 transition-all"
              />
            </div>
            {/* <button className="flex items-center gap-1.5 px-4 py-2.5 border border-[#d8d0ee] rounded-xl text-sm text-[#1a1a2e] font-medium bg-white hover:bg-[#f5f2fc] transition-colors cursor-pointer">
              <SlidersHorizontal size={14} /> Filter
            </button> */}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#ede8f8]">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.length === blogs.length && blogs.length > 0}
                      onChange={toggleAll}
                      className="w-4 h-4 accent-[#6c63ff] cursor-pointer rounded"
                    />
                  </th>
                  {["Blog", "Author", "Category", "Status", "Created At"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#9a9abf] whitespace-nowrap uppercase tracking-wide">
                      <span className="flex items-center gap-1">
                        {h}
                        {["Blog"].includes(h) && <ArrowUpDown size={11} className="text-[#c0b8d8]" />}
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#9a9abf] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                  ) : blogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-[#9a9abf]">
                          <div className="w-14 h-14 rounded-2xl bg-[#f5f2fc] flex items-center justify-center">
                            <FileText size={24} className="text-[#c0b8d8]" />
                          </div>
                          <p className="text-sm font-medium">No blogs found</p>
                          <button onClick={() => navigate("/blogs/add")} className="text-xs text-[#6c63ff] hover:underline">
                            Write your first blog
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    blogs.map((blog) => (
                      <motion.tr
                        key={blog._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors"
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selected.includes(blog._id)}
                            onChange={() => toggleSelect(blog._id)}
                            className="w-4 h-4 accent-[#6c63ff] cursor-pointer rounded"
                          />
                        </td>

                        {/* Blog title + thumbnail */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#f5f2fc] border border-[#e0d9f5] overflow-hidden shrink-0">
                              {blog.thumbnail ? (
                                <img src={blog.thumbnail?.url} alt={blog.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FileText size={16} className="text-[#c0b8d8]" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#1a1a2e] whitespace-nowrap max-w-50 truncate">
                                {blog.title}
                              </p>
                              {blog.slug && (
                                <p className="text-[11px] text-[#b0a8c8] font-mono truncate max-w-50">
                                  /{blog.slug}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-[#9a9abf]">{blog.author.name || "—"}</td>
                        <td className="px-4 py-4 text-sm text-[#9a9abf]">{blog.category || "—"}</td>
                        <td className="px-4 py-4"><StatusBadge status={blog.status} /></td>

                        <td className="px-4 py-4 text-sm text-[#9a9abf] whitespace-nowrap">
                          {blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                            : "—"}
                        </td>

                        {/* Action buttons */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/blogs/${blog._id}`)}
                              title="View"
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9a9abf] hover:bg-[#f5f4ff] hover:text-[#6c63ff] transition"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                              title="Edit"
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9a9abf] hover:bg-[#f5f4ff] hover:text-[#6c63ff] transition"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(blog)}
                              title="Delete"
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9a9abf] hover:bg-red-50 hover:text-red-500 transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#ede8f8]">
              <p className="text-xs text-[#9a9abf]">Page {page} of {totalPages} — {total} blogs</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0d9f5] text-[#9a9abf] hover:bg-[#f5f2fc] hover:text-[#6c63ff] disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={15} />
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  if (p !== 1 && p !== totalPages && Math.abs(p - page) > 1) {
                    if (p === 2 || p === totalPages - 1) return <span key={p} className="text-[#c0b8d8] text-xs px-1">…</span>;
                    return null;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                        p === page
                          ? "bg-[#6c63ff] text-white shadow-md shadow-[#6c63ff]/25"
                          : "border border-[#e0d9f5] text-[#9a9abf] hover:bg-[#f5f2fc] hover:text-[#6c63ff]"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0d9f5] text-[#9a9abf] hover:bg-[#f5f2fc] hover:text-[#6c63ff] disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            blog={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}