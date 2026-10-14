/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  ArrowUpDown,
  Package,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "../../store/useProductStore";

function StockBadge({ stock }) {
  const isIn = Number(stock) > 0;
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
        isIn
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-red-50 text-red-600 border-red-200"
      }`}
    >
      {isIn ? "In Stock" : "Out of Stock"}
    </span>
  );
}

function DeleteModal({ product, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
          <h2 className="font-bold text-base text-black">Delete Product</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f5f2fc] transition-colors text-gray-400 hover:text-[#6c63ff]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <p className="text-sm text-[#9a9abf]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-black">{product?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-5 py-2 cursor-pointer rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-[#f5f2fc] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2 cursor-pointer rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div
            className="h-4 rounded-lg bg-[#f0eefa] animate-pulse"
            style={{ width: i === 1 ? 160 : 80 }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const {
    products,
    total,
    loading,
    page,
    limit,
    search,
    fetchProducts,
    deleteProduct,
    setPage,
  } = useProductStore();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchInput, setSearchInput] = useState(search);
  const [selected, setSelected] = useState([]);
  const [deleting, setDeleting] = useState(false);


  useEffect(() => {
    fetchProducts();
  }, []);


  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== search) {
        fetchProducts({ search: searchInput, page: 1 });
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

const totalPages =
  Math.ceil(Number(total) / Number(limit || 10)) || 1;

  const handleDelete = async () => {
    setDeleting(true);
    await deleteProduct(deleteTarget._id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const toggleAll = () =>
    setSelected(
      selected.length === products.length ? [] : products.map((p) => p._id),
    );

  const handlePageChange = (p) => {
    setPage(p);
    fetchProducts({ page: p });
  };

  return (
    <>
      <div className="space-y-5">
      
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Products</h1>
          <nav className="flex items-center gap-2 text-sm text-[#9a9abf]">
            <Link to="/" className="hover:text-[#6c63ff] transition-colors">
              Home
            </Link>
            <span>›</span>
            <span className="text-[#6c63ff] font-medium">Products</span>
          </nav>
        </div>

        <div className="bg-white border border-[#e0d9f5] rounded-2xl">
          
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
            <div>
              <p className="text-base font-bold text-[#1a1a2e]">
                Products List
              </p>
              <p className="text-xs text-[#9a9abf] mt-0.5">
                {total} product{total !== 1 ? "s" : ""} total
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/products/add")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold  bg-primary text-white shadow-md shadow-[#6c63ff]/20 hover:-translate-y-0.5 hover:shadow-lg transition cursor-pointer"
              >
                <Plus size={14} />
                Add Product
              </button>
            </div>
          </div>

          {/* Search + filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#ede8f8]">
            <div className="relative w-72">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a8c8]"
              />
              <input
                type="text"
                placeholder="Search products…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#f7f7fb] border border-[#d8d0ee] rounded-xl text-[#1a1a2e] placeholder-[#b0a8c8] outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10 transition-all"
              />
            </div>
            {/* <button className="flex items-center gap-1.5 px-4 py-2.5 border border-[#d8d0ee] rounded-xl text-sm text-[#1a1a2e] font-medium bg-white hover:bg-[#f5f2fc] transition-colors cursor-pointer">
              <SlidersHorizontal size={14} />
              Filter
            </button> */}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#ede8f8]">
                  {[
                    "Product",
                    "Category",
                    "SKU",
                   
                    // "Stock",
                    "Created At",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-[#9a9abf] whitespace-nowrap uppercase tracking-wide"
                    >
                      <span className="flex items-center gap-1">
                        {h}
                        {["Product",  "Stock"].includes(h) && (
                          <ArrowUpDown size={11} className="text-[#c0b8d8]" />
                        )}
                      </span>
                    </th>
                  ))}
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-[#9a9abf]">
                          <div className="w-14 h-14 rounded-2xl bg-[#f5f2fc] flex items-center justify-center">
                            <Package size={24} className="text-[#c0b8d8]" />
                          </div>
                          <p className="text-sm font-medium">
                            No products found
                          </p>
                          <button
                            onClick={() => navigate("/products/add")}
                            className="text-xs text-[#6c63ff] hover:underline"
                          >
                            Add your first product
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors"
                      >
                        {/* Product name + thumbnail */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#f5f2fc] border border-[#e0d9f5] overflow-hidden shrink-0">
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-[#6c63ff]">
                                    {product.name?.slice(0, 2).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#1a1a2e] whitespace-nowrap max-w-45 truncate">
                                {product.name}
                              </p>
                              {product.type && (
                                <p className="text-[11px] text-[#b0a8c8] capitalize">
                                  {product.type}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-[#9a9abf]">
                          {product.category?.name || product.category || "—"}
                        </td>

                        <td className="px-4 py-4 text-sm text-[#9a9abf] font-mono">
                          {product.sku || "—"}
                        </td>

                        {/* <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#1a1a2e]">
                              ₹
                              {Number(
                                product.price ?? product.originalPrice,
                              ).toLocaleString("en-IN")}
                            </span>
                            {product.originalPrice &&
                              product.price &&
                              product.originalPrice !== product.price && (
                                <span className="text-[11px] text-[#b0a8c8] line-through">
                                  ₹
                                  {Number(product.originalPrice).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              )}
                          </div>
                        </td> */}

                        {/* <td className="px-4 py-4">
                          <StockBadge stock={product.stock} />
                        </td> */}

                        <td className="px-4 py-4 text-sm text-[#9a9abf] whitespace-nowrap">
                          {product.createdAt
                            ? new Date(product.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                navigate(`/products/${product._id}`)
                              }
                              title="View"
                              className="w-8 h-8 flex items-center justify-center  cursor-pointer rounded-lg text-[#9a9abf] hover:bg-[#f5f4ff] hover:text-[#6c63ff] transition"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/products/edit/${product._id}`)
                              }
                              title="Edit"
                              className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-lg text-[#9a9abf] hover:bg-[#f5f4ff] hover:text-[#6c63ff] transition"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(product)}
                              title="Delete"
                              className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-lg text-[#9a9abf] hover:bg-red-50 hover:text-red-500 transition"
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
              <p className="text-xs text-[#9a9abf]">
                Page {page} of {totalPages} — {total} products
              </p>
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
                  // show first, last, current ±1
                  if (p !== 1 && p !== totalPages && Math.abs(p - page) > 1) {
                    if (p === 2 || p === totalPages - 1)
                      return (
                        <span key={p} className="text-[#c0b8d8] text-xs px-1">
                          …
                        </span>
                      );
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
            product={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}
