/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Plus, Search, Star, Pencil, Trash2, X, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Toppage from "../../components/common/Toppage";
import { Badge } from "../../components/common/Admintable";
import { Modal } from "../../components/common/Modal";
import { useSettingStore } from "../../store/useSettingStore";

const EMPTY_FORM = {
  name: "",
  designation: "",
  message: "",
  rating: 5,
  serviceName: "",
  tagline: "",
  page: "",
  type: "text",
  videoUrl: "",
  order: 0,
  isActive: true,
  image: null,
};

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange && onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
        >
          <Star
            size={18}
            className={
              s <= (hovered || value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200 fill-gray-200"
            }
          />
        </button>
      ))}
    </div>
  );
}

function TestimonialFormModal({ title, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [preview, setPreview] = useState(
    typeof initial?.image === "string" ? initial.image : null
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = (file) => {
    if (!file) return;
    set("image", file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-3">

      
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#9a9abf] mb-1 block">Name *</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-[#9a9abf] mb-1 block">Designation</label>
            <input
              value={form.designation}
              onChange={(e) => set("designation", e.target.value)}
              placeholder="CEO, Company"
              className="w-full px-3 py-2 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="text-xs text-[#9a9abf] mb-1.5 block">Rating</label>
          <StarRating value={form.rating} onChange={(v) => set("rating", v)} />
        </div>

        {/* Message */}
        <div>
          <label className="text-xs text-[#9a9abf] mb-1 block">Message *</label>
          <textarea
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Write testimonial..."
            rows={3}
            className="w-full px-3 py-2 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
          />
        </div>

        {/* Service + Tagline */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#9a9abf] mb-1 block">Service name</label>
            <input
              value={form.serviceName}
              placeholder="e.g. Web Design"
              onChange={(e) => set("serviceName", e.target.value)}
              className="w-full px-3 py-2 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-[#9a9abf] mb-1 block">Tagline</label>
            <input
              value={form.tagline}
              placeholder="Short tagline"
              onChange={(e) => set("tagline", e.target.value)}
              className="w-full px-3 py-2 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Page + Order */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#9a9abf] mb-1 block">Page</label>
            <input
              value={form.page}
              placeholder="home, product, about…"
              onChange={(e) => set("page", e.target.value)}
              className="w-full px-3 py-2 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-[#9a9abf] mb-1 block">Order</label>
            <input
              type="number"
              value={form.order}
              placeholder="1"
              onChange={(e) => set("order", e.target.value)}
              className="w-full px-3 py-2 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Photo upload with preview */}
        <div>
          <label className="text-xs text-[#9a9abf] mb-1 block">Photo</label>
          <label className="flex items-center gap-3 px-3 py-2 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-[#9a9abf] cursor-pointer hover:border-primary transition-all">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#d8d0ee]"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#ede8f8] flex items-center justify-center shrink-0">
                <span className="text-primary text-base leading-none">↑</span>
              </div>
            )}
            <span className="truncate text-xs">
              {form.image instanceof File
                ? form.image.name
                : preview
                ? "Current photo (click to change)"
                : "Click to upload image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImage(e.target.files[0])}
            />
          </label>
        </div>

        {/* Footer: Active toggle + Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#ede8f8]">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => set("isActive", !form.isActive)}
              className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors duration-200 ${
                form.isActive ? "bg-primary" : "bg-[#d8d0ee]"
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  form.isActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-sm text-black">Active</span>
          </label>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (form.name && form.message) onSave(form);
              }}
              className="px-4 py-1.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors"
            >
              Save
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
}

export default function TestimonialsPage() {
  const {
    testimonials,
    testimonialLoading,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = useSettingStore();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [active, setActive] = useState(null);

  const filtered = (testimonials || []).filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.designation?.toLowerCase().includes(search.toLowerCase()) ||
      c.message?.toLowerCase().includes(search.toLowerCase())
  );

  const buildFormData = (form) => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("designation", form.designation);
    fd.append("message", form.message);
    if (form.rating !== undefined) fd.append("rating", form.rating);
    if (form.serviceName) fd.append("serviceName", form.serviceName);
    if (form.tagline) fd.append("tagline", form.tagline);
    if (form.page) fd.append("page", form.page);
    if (form.type) fd.append("type", form.type);
    if (form.videoUrl) fd.append("videoUrl", form.videoUrl);
    if (form.order !== undefined) fd.append("order", form.order);
    fd.append("isActive", form.isActive);
    if (form.image instanceof File) fd.append("image", form.image);
    return fd;
  };

  const handleAdd = async (form) => {
    await createTestimonial(buildFormData(form));
    setModal(null);
  };

  const handleEdit = async (form) => {
    await updateTestimonial(active._id, buildFormData(form));
    setModal(null);
  };

  const handleDelete = async () => {
    await deleteTestimonial(active._id);
    setModal(null);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <>
      <div className="space-y-5">
        <Toppage Title="Testimonials" />

        <div className="bg-white border border-[#e0d9f5] rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
            <div>
              <p className="font-heading text-base font-bold text-black">
                Testimonials List
              </p>
              <p className="text-xs text-[#9a9abf] mt-0.5">
                Manage client testimonials shown on your site.
              </p>
            </div>
            <button
              onClick={() => setModal("add")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Testimonial
            </button>
          </div>

          <div className="px-6 py-4 border-b border-[#ede8f8]">
            <div className="relative w-72">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a8c8]"
              />
              <input
                type="text"
                placeholder="Search testimonials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#ede8f8] bg-white shadow-sm">
            <div className="overflow-x-auto">
              {testimonialLoading && (
                <p className="text-sm text-gray-400 px-4 py-3">Loading...</p>
              )}
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#ede8f8] bg-white">
                    {["Name", "Designation", "Rating", "Message", "Status", "Date", "Actions"].map(
                      (label) => (
                        <th
                          key={label}
                          className="px-4 py-3 text-xs font-medium text-[#9a9abf] whitespace-nowrap"
                        >
                          {label}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Quote size={32} className="text-[#c0b8d8]" />
                          <p className="text-sm">No testimonials found.</p>
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
                          {/* Name + Avatar */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              {row.image ? (
                                <img
                                  src={row.image}
                                  alt={row.name}
                                  className="w-7 h-7 rounded-full object-cover border border-[#e0d9f5] shrink-0"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <span className="text-primary text-xs font-semibold">
                                    {row.name?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <span className="text-sm font-semibold text-black">
                                {row.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-[#9a9abf]">
                            {row.designation || "—"}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={13}
                                  className={
                                    s <= row.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-200 fill-gray-200"
                                  }
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-[#9a9abf] max-w-55">
                            <p className="line-clamp-1">{row.message}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            {row.isActive ? (
                              <Badge label="Active" variant="success" />
                            ) : (
                              <Badge label="Inactive" variant="default" />
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-sm text-[#9a9abf] whitespace-nowrap">
                            {row.createdAt
                              ? new Date(row.createdAt).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setActive(row);
                                  setModal("edit");
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors"
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  setActive(row);
                                  setModal("delete");
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
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

      {modal === "add" && (
        <TestimonialFormModal
          title="Add Testimonial"
          initial={EMPTY_FORM}
          onSave={handleAdd}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "edit" && active && (
        <TestimonialFormModal
          title="Edit Testimonial"
          initial={active}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}

      <AnimatePresence mode="wait">
        {modal === "delete" && active && (
          <Modal title="Delete Testimonial" onClose={() => setModal(null)}>
            <div className="space-y-5">
              <p className="text-sm text-[#9a9abf]">
                Are you sure you want to delete testimonial from{" "}
                <span className="font-semibold text-black">{active.name}</span>?
                This cannot be undone.
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
                  className="px-5 py-2 cursor-pointer rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}