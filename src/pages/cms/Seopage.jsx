/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Plus, Search, Pencil, Trash2, Globe2, Image as ImageIcon, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Toppage from "../../components/common/Toppage";
import { Modal } from "../../components/common/Modal";
import { useSettingStore } from "../../store/useSettingStore";

const EMPTY_FORM = { name: "", metaTitle: "", metaDescription: "", image: null, preview: "" };

// ─── Character Counter ─────────────────────────────────────────────────────────
function CharCount({ value, max, warn }) {
  const len = value?.length || 0;
  const color = len > max ? "text-red-500" : len >= warn ? "text-yellow-500" : "text-[#9a9abf]";
  return <span className={`text-xs ${color}`}>{len}/{max}</span>;
}

// ─── Field Wrapper ─────────────────────────────────────────────────────────────
function Field({ label, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[#9a9abf]">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        
      </div>
      {children}
    </div>
  );
}

// ─── Add / Edit Modal ──────────────────────────────────────────────────────────
function SeoFormModal({ title, initial, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set("image", file);
    set("preview", URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
  if (!form.metaTitle || !form.metaDescription) return;

  const fd = new FormData();

  if (form.name) fd.append("name", form.name);

  fd.append("metaTitle", form.metaTitle);
  fd.append("metaDescription", form.metaDescription);

  if (form.image instanceof File) {
    fd.append("file", form.image);
  }

  const success = await onSave(fd);

  if (success) {
    onClose();
  }
};

  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-4">
        {/* Page Name */}
        <Field label="Page Name" required>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. home, about, services"
            className="w-full px-3 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </Field>

        {/* Meta Title */}
        <Field
          label="Meta Title"
          required
          hint={<CharCount value={form.metaTitle}  />}
        >
          <input
            value={form.metaTitle}
            onChange={(e) => set("metaTitle", e.target.value)}
            placeholder="Page Title | Site Name"
            className="w-full px-3 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </Field>

        {/* Meta Description */}
        <Field
          label="Meta Description"
          required
          hint={<CharCount value={form.metaDescription}   />}
        >
          <textarea
            value={form.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)}
            placeholder="Brief description shown in search results..."
            rows={3}
            className="w-full px-3 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
          />
        </Field>

        {/* OG Image */}
        <Field label="OG Image (Open Graph)">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-dashed border-[#d8d0ee] text-[#9a9abf] hover:border-primary hover:text-primary cursor-pointer transition-all bg-secondary">
              <ImageIcon size={14} />
              {form.image instanceof File ? form.image.name : "Choose image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            {(form.preview || form.image?.url) && (
              <div className="relative">
                <img
                  src={form.preview || form.image?.url}
                  alt="preview"
                  className="w-12 h-8 rounded-lg object-cover border border-[#ede8f8]"
                />
                <button
                  onClick={() => { set("image", null); set("preview", ""); }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X size={9} />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-[#b0a8c8] mt-1">Recommended: 1200×630px. Used for social media sharing.</p>
        </Field>

        {/* Google Preview */}
        {(form.metaTitle || form.metaDescription) && (
          <div className="rounded-xl border border-[#ede8f8] bg-[#faf8ff] p-4">
            <p className="text-xs text-[#9a9abf] mb-2 font-medium">Google Search Preview</p>
            <p className="text-[#1a0dab] text-sm font-medium leading-tight line-clamp-1">
              {form.metaTitle || "Page Title"}
            </p>
            <p className="text-xs text-[#006621] mt-0.5">
              https://yourdomain.com/{form.name || "page"}
            </p>
            <p className="text-xs text-[#545454] mt-1 line-clamp-2 leading-relaxed">
              {form.metaDescription || "Meta description will appear here..."}
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 cursor-pointer rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.metaTitle || !form.metaDescription}
            className="px-5 py-2 cursor-pointer rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function SeoPage() {
  const {
    seos,
    seoLoading,
    fetchAllSeos,
    createSeo,
    updateSeo,
    deleteSeo,
  } = useSettingStore();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // "add" | "edit" | "delete"
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetchAllSeos();
  }, []);

  const filtered = (seos || []).filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.metaTitle?.toLowerCase().includes(search.toLowerCase()) ||
      c.metaDescription?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = async (fd) => {
    await createSeo(fd);
    setModal(null);
  };

  const handleEdit = async (fd) => {
    await updateSeo(active._id, fd);
    setModal(null);
  };

  const handleDelete = async () => {
    await deleteSeo(active._id);
    setModal(null);
  };

  return (
    <>
      <div className="space-y-5">
        <Toppage Title="SEO" />

        <div className="bg-white border border-[#e0d9f5] rounded-2xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
            <div>
              <p className="font-heading text-base font-bold text-black">SEO Pages</p>
              <p className="text-xs text-[#9a9abf] mt-0.5">
                Manage meta titles, descriptions and OG images for each page.
              </p>
            </div>
            <button
              onClick={() => setModal("add")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add SEO
            </button>
          </div>

          {/* Search */}
          <div className="px-6 py-4 border-b border-[#ede8f8]">
            <div className="relative w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a8c8]" />
              <input
                type="text"
                placeholder="Search pages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-[#ede8f8] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#ede8f8] bg-white">
                    {["Page", "Meta Title", "Meta Description", "OG Image", "Created", "Actions"].map((label) => (
                      <th key={label} className="px-4 py-3 text-xs font-medium text-[#9a9abf] whitespace-nowrap">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {seoLoading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="border-b border-[#f5f2fc] animate-pulse">
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Globe2 size={32} className="text-[#c0b8d8]" />
                          <p className="text-sm">No SEO entries found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {filtered.map((row, idx) => (
                        <motion.tr
                          key={row._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, delay: idx * 0.03 }}
                          className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors"
                        >
                          {/* Page */}
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/8 text-primary text-xs font-medium font-mono">
                              <Globe2 size={11} />
                              {row.name || "—"}
                            </span>
                          </td>

                          {/* Meta Title */}
                          <td className="px-4 py-3.5 max-w-50">
                            <p className="text-sm font-medium text-black line-clamp-1">{row.metaTitle}</p>
                            <p className="text-xs text-[#9a9abf] mt-0.5">{row.metaTitle?.length}/60 chars</p>
                          </td>

                          {/* Meta Description */}
                          <td className="px-4 py-3.5 max-w-65">
                            <p className="text-sm text-[#9a9abf] line-clamp-2 leading-relaxed">
                              {row.metaDescription}
                            </p>
                          </td>

                          {/* OG Image */}
                          <td className="px-4 py-3.5">
                            {row.image?.url ? (
                              <img
                                src={row.image.url}
                                alt="og"
                                className="w-14 h-9 rounded-lg object-cover border border-[#ede8f8]"
                              />
                            ) : (
                              <span className="text-xs text-[#c0b8d8]">No image</span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5 text-sm text-[#9a9abf] whitespace-nowrap">
                            {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 flex items-center gap-1.5">
                            <button
                              onClick={() => { setActive(row); setModal("edit"); }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors"
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <button
                              onClick={() => { setActive(row); setModal("delete"); }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 size={12} /> Delete
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
        </div>
      </div>

      {/* Add Modal */}
      {modal === "add" && (
        <SeoFormModal
          title="Add SEO Entry"
          initial={EMPTY_FORM}
          onSave={handleAdd}
          onClose={() => setModal(null)}
          loading={seoLoading}
        />
      )}

      {/* Edit Modal */}
      {modal === "edit" && active && (
        <SeoFormModal
          title="Edit SEO Entry"
          initial={{ ...active, preview: active.image?.url || "" }}
          onSave={handleEdit}
          onClose={() => setModal(null)}
          loading={seoLoading}
        />
      )}

      {/* Delete Modal */}
      <AnimatePresence mode="wait">
        {modal === "delete" && active && (
          <Modal title="Delete SEO Entry" onClose={() => setModal(null)}>
            <div className="space-y-5">
              <p className="text-sm text-[#9a9abf]">
                Are you sure you want to delete SEO for{" "}
                <span className="font-semibold text-black">/{active.name}</span>? This cannot be undone.
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
                  disabled={seoLoading}
                  className="px-5 py-2 cursor-pointer rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {seoLoading ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}