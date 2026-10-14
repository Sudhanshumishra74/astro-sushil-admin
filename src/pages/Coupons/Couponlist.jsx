/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Plus,
  Search,
  Tag,
  Pencil,
  Trash2,
  Percent,
  DollarSign,
  Users,
  User,
  Calendar,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useCouponStore } from "../../store/useCouponStore";
import CouponModal from "./Couponmodal";

export default function CouponList() {
  const {
    coupons,
    pagination,
    loading,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
  } = useCouponStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCoupons({ page, search: search || undefined });
  }, [page, search]);

  const openCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };
  const openEdit = (c) => {
    setEditData(c);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleSubmit = async (payload) => {
    const ok = editData
      ? await updateCoupon(editData._id, payload)
      : await createCoupon(payload);
    if (ok) closeModal();
  };

  const handleDelete = async () => {
    await deleteCoupon(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-secondary px-6 py-8 font-sans">
      {/* Top bar */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="font-heading text-2xl text-primary">Coupons</h1>
          <p className="text-sm text-black/50 mt-0.5">
            Manage discount codes &amp; promotions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-primary text-secondary text-sm font-medium rounded-xl shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          New Coupon
        </motion.button>
      </div>

      {/* Search row */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none"
          />
          <input
            className="w-full bg-white border border-primary/20 rounded-xl pl-8 pr-3 py-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="Search by code…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <span className="text-xs text-black/40 ml-auto">
          {pagination?.total ?? coupons.length} coupons
        </span>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-primary/10 overflow-hidden shadow-sm">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-16 text-primary/40 text-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full"
            />
            Loading…
          </div>
        )}

        {!loading && coupons.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-black/30">
            <Tag size={40} strokeWidth={1.2} />
            <p className="text-sm">No coupons yet. Create one!</p>
          </div>
        )}

        {!loading && coupons.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10 bg-secondary/60">
                  {[
                    "Code",
                    "Type",
                    "Discount",
                    "Min Order",
                    "Visibility",
                    "Valid Till",
                    "Usage",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-primary/60 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {coupons.map((c, i) => (
                    <motion.tr
                      key={c._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ delay: i * 0.03, duration: 0.18 }}
                      className="border-b border-primary/5 last:border-0 hover:bg-secondary/40 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-medium text-primary bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-md tracking-wider uppercase">
                            {c.code}
                          </span>
                          {c.oneTimePerUser && (
                            <span className="text-[10px] bg-black/6 text-black/40 px-1.5 py-0.5 rounded">
                              1×
                            </span>
                          )}
                        </div>
                        {c.description && (
                          <p className="text-xs text-black/40 mt-1 max-w-45 truncate">
                            {c.description}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            c.type === "PERCENTAGE"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {c.type === "PERCENTAGE" ? (
                            <Percent size={10} />
                          ) : (
                            <DollarSign size={10} />
                          )}
                          {c.type}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-sm font-medium text-black">
                        {c.type === "PERCENTAGE"
                          ? `${c.discount}%`
                          : `₹${c.discount}`}
                        {c.maxDiscount != null && (
                          <span className="block text-xs text-black/35 font-sans mt-0.5">
                            max ₹{c.maxDiscount}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        {c.minOrderAmount ? (
                          <span className="inline-flex items-center gap-1 text-xs text-black/50">
                            <ShoppingBag size={11} /> ₹{c.minOrderAmount}
                          </span>
                        ) : (
                          <span className="text-black/25 text-xs">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            c.couponType === "PUBLIC"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-violet-50 text-violet-700"
                          }`}
                        >
                          {c.couponType === "PUBLIC" ? (
                            <Users size={10} />
                          ) : (
                            <User size={10} />
                          )}
                          {c.couponType}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-black/50 whitespace-nowrap">
                          <Calendar size={11} />
                          {new Date(c.validTill).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 min-w-22.5">
                        <UsageBar used={c.usedCount} limit={c.usageLimit} />
                      </td>

                      <td className="px-4 py-3.5">
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => toggleCouponStatus(c._id)}
                          className={`inline-flex items-center cursor-pointer gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                            c.isActive
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-black/5 text-black/40 hover:bg-black/10"
                          }`}
                        >
                          {c.isActive ? (
                            <>
                              <CheckCircle2 size={12} /> Active
                            </>
                          ) : (
                            <>
                              <XCircle size={12} /> Inactive
                            </>
                          )}
                        </motion.button>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => openEdit(c)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-black/35 border border-transparent hover:border-primary/20 hover:bg-primary/8 hover:text-primary transition-all"
                          >
                            <Pencil size={13} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setDeleteId(c._id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-black/35 border border-transparent hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={13} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-5">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-8 h-8 rounded-lg border border-primary/20 bg-white flex items-center justify-center text-primary/50 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={15} />
          </motion.button>
          <span className="text-sm text-black/40">
            Page {page} of {pagination.totalPages}
          </span>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-8 h-8 rounded-lg border border-primary/20 bg-white flex items-center justify-center text-primary/50 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={15} />
          </motion.button>
        </div>
      )}

      <CouponModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editData={editData}
        loading={loading}
      />

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="relative bg-white rounded-2xl shadow-xl p-7 w-full max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <h3 className="font-heading text-lg text-black mb-1">
                Delete Coupon?
              </h3>
              <p className="text-sm text-black/50 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2 rounded-xl border border-primary/20 text-sm text-black/60 hover:bg-secondary transition-colors font-sans"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors font-sans"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UsageBar({ used, limit }) {
  const pct = limit ? Math.min((used / limit) * 100, 100) : 0;
  const color =
    pct >= 90 ? "bg-red-400" : pct >= 60 ? "bg-[#D4AF37]" : "bg-[#424874]";

  return (
    <div>
      <p className="text-xs text-black/40 mb-1.5">
        {used}
        {limit ? `/${limit}` : ""} used
      </p>
      {limit && (
        <div className="h-1 rounded-full bg-primary/10 overflow-hidden w-20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full rounded-full ${color}`}
          />
        </div>
      )}
    </div>
  );
}
