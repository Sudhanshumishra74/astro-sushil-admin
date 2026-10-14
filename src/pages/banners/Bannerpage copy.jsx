/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Plus,
  Download,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  ArrowUpDown,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BannerCard from "./BannerCard"; 
import { useBannerStore } from "../../store/useBannerStore";

function Modal({ title, onClose, children }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />
        <motion.div
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#ede8f8]">
            <h2 className="font-heading font-bold text-base text-black">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 cursor-pointer rounded-full flex items-center justify-center hover:bg-secondary transition-colors text-gray-400 hover:text-primary"
            >
              <X size={16} />
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function StatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
        isActive
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-red-50 text-red-600 border-red-200"
      }`}
    >
      {status}
    </span>
  );
}

function RowMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
      >
        <MoreHorizontal size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-9 z-20 bg-white border border-[#ede8f8] rounded-xl shadow-lg overflow-hidden w-32"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-black hover:bg-secondary transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#9a9abf]">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

const EMPTY_FORM = {
  title: "",
  page: "",
  position: "",
  status: "Active",
  endDate: "",
  imageUrl: "",
};

function BannerForm({ initial, onSubmit, loading, submitLabel }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-4">
      <Field label="Banner Title *">
        <input
          type="text"
          placeholder="e.g. Summer Sale – Up to 50% Off"
          value={form.title}
          onChange={set("title")}
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Page">
          <select value={form.page} onChange={set("page")} className={inputCls}>
            <option value="">Select page</option>
            {[
              "Homepage Hero",
              "Category Page",
              "Product Page",
              "Profile Page",
              "Checkout Page",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Position">
          <select
            value={form.position}
            onChange={set("position")}
            className={inputCls}
          >
            <option value="">Select position</option>
            {["Top", "Middle", "Bottom", "Sidebar"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Status">
          <select
            value={form.status}
            onChange={set("status")}
            className={inputCls}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </Field>
        <Field label="End Date">
          <input
            type="date"
            value={form.endDate}
            onChange={set("endDate")}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Image URL (optional)">
        <input
          type="text"
          placeholder="https://..."
          value={form.imageUrl}
          onChange={set("imageUrl")}
          className={inputCls}
        />
      </Field>

      {form.title && (
        <div>
          <p className="text-xs font-medium text-[#9a9abf] mb-2">Preview</p>
          <BannerCard banner={{ ...form, page: form.page || "—" }} />
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => onSubmit(form)}
          disabled={loading || !form.title}
          className="px-5 py-2 cursor-pointer rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : submitLabel}
        </button>
      </div>
    </div>
  );
}

export default function BannersPage() {
  const {
    banners,
    loading,
    fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
  } = useBannerStore();
  useEffect(() => {
    fetchBanners();
  }, []);
  const [modal, setModal] = useState(null);
  const [activeBanner, setActiveBanner] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const openAdd = () => setModal("add");

  const openEdit = (banner) => {
    setActiveBanner(banner);
    setModal("edit");
  };

  const openDelete = (banner) => {
    setActiveBanner(banner);
    setModal("delete");
  };

  const handleAdd = async (form) => {
    const ok = await createBanner(form);
    if (ok) setModal(null);
  };

  const handleEdit = async (form) => {
    const ok = await updateBanner(activeBanner._id, form);
    if (ok) setModal(null);
  };

  const handleDelete = async () => {
  await deleteBanner(activeBanner._id);
  setModal(null);
};

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const toggleAll = () =>
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((b) => b.id),
    );

  const filtered = banners.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.page.toLowerCase().includes(search.toLowerCase()) ||
      b.position.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="space-y-5">
      
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-black">
            Banners
          </h1>
          <nav className="flex items-center gap-2 text-sm text-[#9a9abf]">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>›</span>
            <span className="text-primary font-medium">Banners</span>
          </nav>
        </div>

        <div className="bg-white border border-[#e0d9f5] rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
            <div>
              <p className="font-heading text-base font-bold text-black">
                Banners List
              </p>
              <p className="text-xs text-[#9a9abf] mt-0.5">
                Manage promotional banners across your store pages.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 border border-[#d8d0ee] rounded-xl text-sm text-black font-medium bg-white hover:bg-secondary transition-colors cursor-pointer">
                <Download size={14} />
                Export
              </button>
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Add Banner
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#ede8f8]">
            <div className="relative w-72">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a8c8]"
              />
              <input
                type="text"
                placeholder="Search banners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2.5 border border-[#d8d0ee] rounded-xl text-sm text-black font-medium bg-white hover:bg-secondary transition-colors cursor-pointer">
              <SlidersHorizontal size={14} />
              Filter
            </button>
          </div>

          <div>
            <table className="w-full h-full text-left">
              <thead>
                <tr className="border-b border-[#ede8f8]">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === filtered.length &&
                        filtered.length > 0
                      }
                      onChange={toggleAll}
                      className="w-4 h-4 accent-primary cursor-pointer rounded"
                    />
                  </th>
                  {["Banner", "Page", "Position", "Status", "End Date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium text-[#9a9abf] whitespace-nowrap"
                      >
                        <span className="flex items-center gap-1">
                          {h}
                          {["Banner", "Page", "Position"].includes(h) && (
                            <ArrowUpDown size={11} className="text-[#c0b8d8]" />
                          )}
                        </span>
                      </th>
                    ),
                  )}
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-sm text-[#9a9abf]"
                      >
                        No banners found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((banner) => (
                      <motion.tr
                       key={banner._id}

                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors"
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selected.includes(banner.id)}
                            onChange={() => toggleSelect(banner.id)}
                            className="w-4 h-4 accent-primary cursor-pointer rounded"
                          />
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-9 rounded-xl bg-secondary border border-[#e0d9f5] flex items-center justify-center shrink-0 overflow-hidden">
                              {banner.image ? (
                                <img
                                  src={banner.image}
                                  alt={banner.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon
                                  size={14}
                                  className="text-primary opacity-40"
                                />
                              )}
                            </div>
                            <span className="text-sm font-semibold text-black whitespace-nowrap max-w-50 truncate">
                              {banner.title}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-[#9a9abf]">
                          {banner.page}
                        </td>
                        <td className="px-4 py-4 text-sm text-black">
                          {banner.section}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={banner.status} />
                        </td>
                        <td className="px-4 py-4 text-sm text-[#9a9abf] whitespace-nowrap">
                          {banner.endDate || "—"}
                        </td>

                        <td className="px-4 py-4">
                          <RowMenu
                            onEdit={() => openEdit(banner)}
                            onDelete={() => openDelete(banner)}
                          />
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence mode="wait">
        {modal === "add" && (
          <Modal title="Add Banner" onClose={() => setModal(null)}>
            <BannerForm
              initial={EMPTY_FORM}
              onSubmit={handleAdd}
              loading={loading}
              submitLabel="Add Banner"
            />
          </Modal>
        )}

        {modal === "edit" && activeBanner && (
          <Modal title="Edit Banner" onClose={() => setModal(null)}>
            <BannerForm
              initial={{
                title: activeBanner.title,
                page: activeBanner.page,
                position: activeBanner.position,
                status: activeBanner.status,
                endDate: activeBanner.endDate || "",
                imageUrl: activeBanner.imageUrl || "",
              }}
              onSubmit={handleEdit}
              loading={loading}
              submitLabel="Save Changes"
            />
          </Modal>
        )}

        {modal === "delete" && activeBanner && (
          <Modal title="Delete Banner" onClose={() => setModal(null)}>
            <div className="space-y-5">
              <p className="text-sm text-[#9a9abf]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-black">
                  {activeBanner?.title}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setModal(null)}
                  className="px-5 py-2 cursor-pointer rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-5 py-2 cursor-pointer rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
