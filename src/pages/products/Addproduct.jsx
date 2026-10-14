/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Upload,
  Tag,
  Globe,
  BarChart2,
  DollarSign,
  Star,
  Zap,
  ChevronDown,
  Plus,
  ArrowLeft,
  Package,
  Hash,
  Layers,
  FileText,
  Box,
  Percent,
  Ruler,
  Search,
} from "lucide-react";
import { useProductStore } from "../../store/useProductStore";
import RichTextEditor from "../../components/common/Richtexteditor2";
import { useCategoryStore } from "../../store/usecategoryStore";
import { v4 as uuidv4 } from "uuid";

const TYPES = ["physical", "digital"];
const DISCOUNT_TYPES = ["percentage", "fixed"];
const GST_RATE_OPTIONS = [0, 5, 12, 18, 28];

// Client-side preview only — the server recomputes and stores the
// authoritative priceWithGst on save.
const previewDiscountedPrice = (mrp, discountType, discountValue) => {
  const m = Number(mrp) || 0;
  const d = Number(discountValue) || 0;
  if (!m) return 0;
  let price = m;
  if (!d) return m;
  if (discountType === "percentage") price = Math.round(m - (m * d) / 100);
  if (discountType === "fixed") price = m - d;
  return Math.max(0, price);
};

const previewPriceWithGst = (price, gst) => {
  const rate = gst?.enabled ? Number(gst.rate) || 0 : 0;
  if (!rate || gst?.type === "inclusive") return price;
  return Math.round((price + (price * rate) / 100) * 100) / 100;
};

function Field({ label, icon: Icon, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#7c7ca0]">
        {Icon && <Icon size={11} />} {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-[#e8e8f4] bg-white px-3.5 py-2.5 text-sm text-[#1a1a2e] placeholder-[#b0b0cc] outline-none transition focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10 ${className}`}
      {...props}
    />
  );
}

function Select({ children, className = "", ...props }) {
  return (
    <div className="relative">
      <select
        className={`w-full appearance-none rounded-xl border border-[#e8e8f4] bg-white px-3.5 py-2.5 text-sm text-[#1a1a2e] outline-none transition focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10 ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9abf]"
      />
    </div>
  );
}

function TagInput({ tags, onChange, placeholder = "Add and press Enter" }) {
  const [input, setInput] = useState("");
  const add = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  };
  const remove = (t) => onChange(tags.filter((x) => x !== t));

  return (
    <div className="rounded-xl border border-[#e8e8f4] bg-white p-2 transition focus-within:border-[#6c63ff] focus-within:ring-2 focus-within:ring-[#6c63ff]/10">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span
            key={t}
            className="flex items-center gap-1 rounded-lg bg-[#6c63ff]/10 px-2.5 py-1 text-xs font-medium text-[#6c63ff]"
          >
            {t}
            <button
              type="button"
              onClick={() => remove(t)}
              className="ml-0.5 hover:text-red-400"
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-[#1a1a2e] placeholder-[#b0b0cc] outline-none"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-[#6c63ff]/10 px-2 py-1 text-[#6c63ff] hover:bg-[#6c63ff]/20 transition"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

function ThumbnailZone({ file, onChange }) {
  const inputRef = useRef();
  const preview =
    typeof file === "string" ? file : file ? URL.createObjectURL(file) : null;

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith("image/")) onChange(f);
    },
    [onChange],
  );

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current.click()}
      className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-[#d8d8f0] bg-[#fafafd] transition hover:border-[#6c63ff] hover:bg-[#f5f4ff] overflow-hidden"
      style={{ aspectRatio: "16/5" }}
    >
      {preview ? (
        <>
          <img
            src={preview}
            alt="thumbnail"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
            <p className="text-xs font-semibold text-white">Change thumbnail</p>
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-[#9a9abf]">
          <div className="rounded-2xl bg-[#6c63ff]/10 p-3">
            <Upload size={22} className="text-[#6c63ff]" />
          </div>
          <p className="text-xs font-medium">Drop image or click to upload</p>
          <p className="text-[11px]">PNG, JPG, WEBP — 16:9 recommended</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files[0])}
      />
    </div>
  );
}

function ImagesZone({ images, onChange }) {
  const inputRef = useRef();

  const addFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));

    onChange((prev) => [...prev, ...valid]);
  };

  const remove = (idx) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-3">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((f, i) => {
            const src = typeof f === "string" ? f : URL.createObjectURL(f);

            return (
              <div
                key={i}
                className="group relative h-20 w-20 rounded-xl overflow-hidden border border-[#e8e8f4]"
              >
                <img src={src} alt="" className="h-full w-full object-cover" />

                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white"
                >
                  <X size={10} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div
        onClick={() => inputRef.current.click()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-[#d8d8f0] bg-[#fafafd] py-5 flex flex-col items-center gap-1 text-[#9a9abf] hover:border-[#6c63ff] hover:bg-[#f5f4ff] transition"
      >
        <Upload size={18} className="text-[#6c63ff]" />

        <p className="text-xs font-medium">Drop images or click to upload</p>

        <p className="text-[11px]">Multiple allowed</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}

function DownloadableFileZone({ file, onChange }) {
  const inputRef = useRef();
  const isUrl = typeof file === "string";
  const fileName = isUrl ? file.split("/").pop() : (file?.name ?? null);

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) onChange(f);
      }}
      onDragOver={(e) => e.preventDefault()}
      className="cursor-pointer rounded-xl border-2 border-dashed border-[#d8d8f0] bg-[#fafafd] py-6 flex flex-col items-center gap-2 text-[#9a9abf] hover:border-[#6c63ff] hover:bg-[#f5f4ff] transition"
    >
      <div className="rounded-2xl bg-[#6c63ff]/10 p-3">
        <FileText size={22} className="text-[#6c63ff]" />
      </div>
      {fileName ? (
        <>
          <p className="text-xs font-semibold text-[#6c63ff] truncate max-w-[80%]">
            {fileName}
          </p>
          <p className="text-[11px]">Click to replace file</p>
        </>
      ) : (
        <>
          <p className="text-xs font-medium">Drop file or click to upload</p>
          <p className="text-[11px]">PDF, ZIP, MP4, MP3, etc.</p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => onChange(e.target.files[0])}
      />
    </div>
  );
}

function VariantsEditor({ variants = [], onChange, type }) {
  const add = () =>
    onChange([
      ...variants,
      {
        _id: uuidv4(),

        name: "",
        value: "",
        mrp: "",
        stock: "",
        downloadableFile: null,
        metaTitle: "",
        metaDescription: "",
      },
    ]);

  const update = (i, key, val) =>
    onChange(variants.map((v, idx) => (idx === i ? { ...v, [key]: val } : v)));

  const remove = (i) => onChange(variants.filter((_, idx) => idx !== i));

  const fileInputRefs = useRef({});

  const getFileName = (file) => {
    if (!file) return null;
    if (typeof file === "string") return file.split("/").pop();
    if (file.name) return file.name;
    if (file.url) return String(file.url).split("/").pop();
    if (file.path) return String(file.path).split("/").pop();
    if (file.location) return String(file.location).split("/").pop();
    return null;
  };

  const renderFilePreview = (file) => {
    if (!file) return null;

    // Resolve URL and mime safely
    let fileURL = null;
    let mime = null;

    if (typeof file === "string") {
      fileURL = file;
    } else if (typeof File !== "undefined" && file instanceof File) {
      fileURL = URL.createObjectURL(file);
      mime = file.type || null;
    } else if (file && typeof file === "object") {
      fileURL = file.url || file.path || file.location || file.fileUrl || null;
      mime = file.type || null;
    }

    const lower = String(fileURL || "").toLowerCase();

    // IMAGE PREVIEW
    if (
      (mime && mime.startsWith("image/")) ||
      /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/.test(lower)
    ) {
      return (
        <img
          src={fileURL}
          alt="preview"
          className="w-20 h-20 object-cover rounded-lg border"
        />
      );
    }

    // PDF PREVIEW
    if (mime === "application/pdf" || lower.includes(".pdf")) {
      return (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-[#6c63ff]">📄 PDF File</div>
          {fileURL ? (
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-[#6c63ff] px-2 py-1 text-xs font-semibold text-[#6c63ff] hover:bg-[#6c63ff]/10"
            >
              Open file
            </a>
          ) : null}
        </div>
      );
    }

    // DEFAULT: filename and open link when URL available
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-600">📎 {getFileName(file)}</div>
        {fileURL ? (
          <a
            href={fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-[#6c63ff] px-2 py-1 text-xs font-semibold text-[#6c63ff] hover:bg-[#6c63ff]/10"
          >
            Open file
          </a>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      {/* {variants.length > 0 && (
        <div className="hidden sm:grid grid-cols-4 gap-2 px-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#b0b0cc]">
            Name
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#b0b0cc]">
            Value
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#b0b0cc]">
            MRP (₹)
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#b0b0cc]">
            Stock
          </p>
        </div>
      )} */}

      {/* VARIANTS */}
      {variants.map((v, i) => {
        const vid = v._id ?? v.id ?? i;

        return (
          <div
            key={i}
            className="rounded-2xl border border-[#ececf6] bg-white shadow-sm p-5 flex flex-col gap-5"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#3b3b4f]">
                Variant {i + 1}
              </h3>

              {i > 0 && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-red-500 hover:bg-red-100 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* BASIC DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input
                value={v.name}
                onChange={(e) => update(i, "name", e.target.value)}
                placeholder="Option name (e.g. Color)"
              />

              <Input
                value={v.value}
                onChange={(e) => update(i, "value", e.target.value)}
                placeholder="Value (e.g. Red)"
              />

              <Input
                type="number"
                value={v.mrp}
                onChange={(e) => update(i, "mrp", e.target.value)}
                placeholder="MRP"
              />

              <Input
                type="number"
                value={v.stock}
                onChange={(e) => update(i, "stock", e.target.value)}
                placeholder="Stock"
              />
            </div>

            {/* FILE UPLOAD */}
            {type === "digital" && (
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase text-gray-400">
                  Downloadable File
                </label>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-[#6c63ff] transition bg-gray-50">
                  <input
                    type="file"
                    className="hidden"
                    ref={(el) => (fileInputRefs.current[vid] = el)}
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.doc,.docx,.xls,.xlsx,.zip"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const allowedTypes = [
                        "application/pdf",
                        "image/png",
                        "image/jpeg",
                        "image/webp",
                        "image/gif",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/vnd.ms-excel",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "application/zip",
                        "application/x-zip-compressed",
                        "application/octet-stream",
                      ];

                      const isZipFile = file.name
                        ?.toLowerCase()
                        .endsWith(".zip");
                      if (!allowedTypes.includes(file.type) && !isZipFile) {
                        alert("Unsupported file format");
                        return;
                      }

                      update(i, "downloadableFile", file);
                    }}
                  />

                  {/* If a file exists show preview + replace/remove actions */}
                  {v.downloadableFile ? (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="cursor-pointer">
                        {renderFilePreview(v.downloadableFile)}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[vid]?.click()}
                          className="rounded-lg border px-2 py-1 text-xs bg-white"
                        >
                          Replace
                        </button>

                        <button
                          type="button"
                          onClick={() => update(i, "downloadableFile", null)}
                          className="rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-xs text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[vid]?.click()}
                        className="w-full rounded-lg border-dashed border border-[#d8d8f0] px-3 py-2 text-xs text-[#6c63ff] bg-white"
                      >
                        Upload file
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-gray-400 mt-1">
                  Supports: PDF, Images, Docs, Excel, ZIP
                </p>
              </div>
            )}

            {/* SEO FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                value={v.metaTitle}
                onChange={(e) => update(i, "metaTitle", e.target.value)}
                placeholder="Meta Title"
              />

              <Input
                value={v.metaDescription}
                onChange={(e) => update(i, "metaDescription", e.target.value)}
                placeholder="Meta Description"
              />
            </div>
          </div>
        );
      })}

      {/* ADD BUTTON */}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 self-start rounded-xl border border-dashed border-[#6c63ff]/40 px-4 py-2 text-xs font-semibold text-[#6c63ff] hover:bg-[#6c63ff]/5 transition"
      >
        <Plus size={13} /> Add Variant
      </button>
    </div>
  );
}

function Toggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#e8e8f4] bg-[#fafafd] px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-[#1a1a2e]">{label}</p>
        {description && (
          <p className="text-[11px] text-[#9a9abf]">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-[#6c63ff]" : "bg-[#d8d8f0]"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-1" : "-translate-x-4"}`}
        />
      </button>
    </div>
  );
}

function HasVariantsToggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 cursor-pointer transition-colors select-none ${
        value
          ? "border-[#6c63ff] bg-[#6c63ff]/5"
          : "border-[#e8e8f4] bg-[#fafafd]"
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-[#1a1a2e]">
          This product has variants
        </p>
        <p className="text-[11px] text-[#9a9abf] mt-0.5">
          {value
            ? "Each variant will have its own MRP & stock."
            : "Single MRP and stock for this product."}
        </p>
      </div>
      <div
        className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ml-4 ${
          value ? "bg-[#6c63ff]" : "bg-[#d8d8f0]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#ebebf5] bg-white p-6 flex flex-col gap-5 shadow-sm">
      {title && (
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b0b0cc] border-b border-[#f0f0f8] pb-3">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

function CategorySelect({ value, onChange }) {
  const { categories, fetchCategories, loading } = useCategoryStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    fetchCategories({ limit: 100, page: 1 });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = categories.find((c) => c._id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between rounded-xl border border-[#e8e8f4] bg-white px-3.5 py-2.5 text-sm text-left transition focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10"
      >
        <span className={selected ? "text-[#1a1a2e]" : "text-[#b0b0cc]"}>
          {selected ? selected.name : "Select category"}
        </span>
        <ChevronDown
          size={14}
          className={`text-[#9a9abf] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full rounded-xl border border-[#e8e8f4] bg-white shadow-xl overflow-hidden">
          <div className="p-2 border-b border-[#f0f0f8]">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#b0b0cc]"
              />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories…"
                className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border border-[#e8e8f4] bg-[#fafafd] text-[#1a1a2e] placeholder-[#b0b0cc] outline-none focus:border-[#6c63ff]"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
                setSearch("");
              }}
              className="w-full text-left px-3.5 py-2.5 text-sm text-[#b0b0cc] hover:bg-[#f5f4ff] transition"
            >
              Select
            </button>
            {loading ? (
              <div className="px-3.5 py-3 text-xs text-[#b0b0cc]">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="px-3.5 py-3 text-xs text-[#b0b0cc]">
                No categories found
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => {
                    onChange(c._id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-sm transition flex items-center gap-2 ${
                    value === c._id
                      ? "bg-[#6c63ff]/10 text-[#6c63ff] font-medium"
                      : "text-[#1a1a2e] hover:bg-[#f5f4ff]"
                  }`}
                >
                  {c.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddProduct({ editData = null }) {
  const navigate = useNavigate();
  const { createProduct, updateProduct, loading } = useProductStore();

  const [thumbnail, setThumbnail] = useState(editData?.thumbnail || null);
  const [images, setImages] = useState(editData?.images || []);
  // const [downloadableFile, setDownloadableFile] = useState(
  //   editData?.downloadableFile || null,
  // );
  const [keywords, setKeywords] = useState(editData?.keywords ?? []);
  const [variants, setVariants] = useState(() => {
    const initialVariants = (editData?.variants ?? []).map((v) => ({
      ...v,
      id: v.id || uuidv4(),
    }));
    // For digital products, ensure at least one variant exists by default
    const isDigital = editData?.type === "digital";
    if (isDigital && initialVariants.length === 0) {
      return [
        {
          _id: uuidv4(),
          name: "",
          value: "",
          mrp: "",
          stock: "",
          downloadableFile: null,
          metaTitle: "",
          metaDescription: "",
        },
      ];
    }
    return initialVariants;
  });
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: editData?.name ?? "",
    shortDescription: editData?.shortDescription ?? "",
    description: editData?.description ?? "",
    type: editData?.type ?? "physical",
    category: editData?.category ?? "",
    hasVariants:
      editData?.type === "digital"
        ? true
        : Boolean(editData?.hasVariants) || (editData?.variants?.length ?? 0) > 0,
    mrp: editData?.mrp ?? "",
    discountType: editData?.discountType ?? "percentage",
    discountValue: editData?.discountValue ?? "",
    stock: editData?.stock ?? "",
    sku: editData?.sku ?? "",
    weight: editData?.weight ?? "",
    dimensions: {
      length: editData?.dimensions?.length ?? "",
      width: editData?.dimensions?.width ?? "",
      height: editData?.dimensions?.height ?? "",
    },

    metaTitle: editData?.metaTitle ?? "",
    metaDescription: editData?.metaDescription ?? "",
    isFeatured: editData?.isFeatured ?? false,
    isPublished: editData?.isPublished ?? true,
    thumbnail: editData?.thumbnail ?? true,

    gst: {
      enabled: editData?.gst?.enabled ?? true,
      rate: editData?.gst?.rate ?? 0,
      type: editData?.gst?.type ?? "exclusive",
    },
  });

  const isDigital = form.type === "digital";

  const setGst = (k, v) =>
    setForm((f) => ({ ...f, gst: { ...f.gst, [k]: v } }));

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const setDim = (k) => (e) =>
    setForm((f) => ({
      ...f,
      dimensions: { ...f.dimensions, [k]: e.target.value },
    }));

  const setBool = (k) => (val) => setForm((f) => ({ ...f, [k]: val }));

  const handleHasVariants = (val) => {
    // Removed - all products now require variants
  };

  // When switching to digital, set hasVariants to true; for physical, set to false
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setForm((f) => ({
      ...f,
      type: newType,
      stock: newType === "digital" ? "" : f.stock,
      hasVariants: newType === "digital" ? true : false,
    }));
  };

  const computedPrice = (() => {
    // Removed - all products now use variant-based pricing
    return null;
  })();

  const validate = () => {
    const e = {};

    if (!form.name || form.name.length < 2)
      e.name = "Name must be at least 2 characters";

    if (form.hasVariants) {
      if (!variants.length) e.variants = "Add at least one variant";
    } else {
      if (!form.mrp) e.mrp = "MRP is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("shortDescription", form.shortDescription);
    formData.append("description", form.description);
    formData.append("type", form.type);
    formData.append("category", form.category);
    formData.append("hasVariants", form.hasVariants);
    formData.append("sku", form.sku);
    formData.append("weight", form.weight);

    formData.append("metaTitle", form.metaTitle);
    formData.append("metaDescription", form.metaDescription);
    formData.append("isFeatured", form.isFeatured);
    formData.append("isPublished", form.isPublished);
    formData.append("gst", JSON.stringify(form.gst));

    formData.append("keywords", JSON.stringify(keywords));
    formData.append("dimensions", JSON.stringify(form.dimensions));

    if (form.hasVariants) {
      const cleanedVariants = variants.map((v) => {
        const { downloadableFile, ...rest } = v;
        return rest;
      });

      formData.append("variants", JSON.stringify(cleanedVariants));
      formData.append("discountType", form.discountType);
      formData.append("discountValue", form.discountValue);
    } else {
      formData.append("mrp", form.mrp);

      if (!isDigital) {
        formData.append("stock", form.stock);
      }

      formData.append("discountType", form.discountType);
      formData.append("discountValue", form.discountValue);
    }

    images.forEach((img) => {
      if (img instanceof File) {
        formData.append("images", img);
      }
    });

    if (thumbnail instanceof File) {
      formData.append("thumbnail", thumbnail);
    }

    variants.forEach((v) => {
      if (v.downloadableFile instanceof File) {
        formData.append("variantFiles", v.downloadableFile);
        formData.append("variantFileIds", v._id);
      }
    });

    if (editData?._id) {
      await updateProduct(editData._id, formData);
    } else {
      await createProduct(formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7fb] px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl p-2 text-[#9a9abf] hover:bg-white hover:text-[#6c63ff] border border-transparent hover:border-[#e8e8f4] transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a2e]">
              {editData ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-[12px] text-[#9a9abf] mt-0.5">
              {editData
                ? "Update product details below"
                : "Fill in the details to publish a new product"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-[#e8e8f4] bg-white px-5 py-2.5 text-sm font-semibold text-[#9a9abf] hover:text-[#6c63ff] hover:border-[#6c63ff]/30 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl  bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6c63ff]/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#6c63ff]/25 active:translate-y-0 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Saving…
              </>
            ) : editData ? (
              "Update Product"
            ) : (
              "Publish Product"
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left / Main column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card title="Thumbnail">
            <ThumbnailZone file={thumbnail} onChange={setThumbnail} />
          </Card>

          <Card title="Product Images">
            <ImagesZone images={images} onChange={setImages} />
          </Card>

          {/* Downloadable file — only for digital products */}

          <Card title="Basic Info">
            <Field label="Product Name" icon={Package} error={errors.name}>
              <Input
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Premium Wireless Headphones"
              />
            </Field>

            <Field label="Short Description">
              <textarea
                value={form.shortDescription}
                onChange={set("shortDescription")}
                placeholder="A brief summary shown in listings..."
                rows={2}
                className="w-full resize-none rounded-xl border border-[#e8e8f4] bg-white px-3.5 py-2.5 text-sm text-[#1a1a2e] placeholder-[#b0b0cc] outline-none transition focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10"
              />
            </Field>

            <Field label="Full Description" icon={FileText}>
              <RichTextEditor
                value={form.description}
                onChange={(html) =>
                  setForm((f) => ({ ...f, description: html }))
                }
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Product Type" icon={Globe}>
                {/* Use handleTypeChange instead of set("type") */}
                <Select value={form.type} onChange={handleTypeChange}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Category" icon={Layers}>
                <CategorySelect
                  value={form.category}
                  onChange={(val) => setForm((f) => ({ ...f, category: val }))}
                />
              </Field>
            </div>

            <div
              className={`grid gap-4 ${
                form.hasVariants || isDigital
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              <Field label="SKU" icon={Hash}>
                <Input
                  value={form.sku}
                  onChange={set("sku")}
                  placeholder="e.g. WH-1000XM5"
                />
              </Field>

              {/* Stock only for physical products without variants */}
              {!form.hasVariants && !isDigital && (
                <Field label="Stock" icon={Box}>
                  <Input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={set("stock")}
                    placeholder="Available quantity"
                  />
                </Field>
              )}
            </div>

            <Field label="Keywords / Tags" icon={Tag}>
              <TagInput
                tags={keywords}
                onChange={setKeywords}
                placeholder="Add keyword and press Enter"
              />
            </Field>
          </Card>

          <Card title="Variants & Pricing">
            {form.type === "physical" && (
              <HasVariantsToggle
                value={form.hasVariants}
                onChange={(val) => setForm((f) => ({ ...f, hasVariants: val }))}
              />
            )}
            {form.type === "digital" && (
              <div className="rounded-2xl border-2 border-[#6c63ff] bg-[#6c63ff]/5 px-4 py-3.5">
                <p className="text-sm font-semibold text-[#1a1a2e]">
                  Digital products require variants
                </p>
                <p className="text-[11px] text-[#9a9abf] mt-0.5">
                  Each variant will have its own downloadable file and pricing.
                </p>
              </div>
            )}

            {form.hasVariants ? (
              <div className="flex flex-col gap-3">
                <p className="text-[11px] text-[#9a9abf]">
                  Each variant has its own MRP, stock, and pricing. Apply a
                  shared discount from the sidebar.
                </p>
                {errors.variants && (
                  <p className="text-[11px] text-red-400">{errors.variants}</p>
                )}
                <VariantsEditor
                  variants={variants}
                  onChange={setVariants}
                  type={form.type}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-[11px] text-[#9a9abf]">
                  Set a single MRP and optional discount for this product.
                </p>

                <Field label="MRP (₹)" icon={DollarSign} error={errors.mrp}>
                  <Input
                    type="number"
                    min={0}
                    value={form.mrp}
                    onChange={set("mrp")}
                    placeholder="Maximum Retail Price"
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Discount Type" icon={Percent}>
                    <Select
                      value={form.discountType}
                      onChange={set("discountType")}
                    >
                      {DISCOUNT_TYPES.map((d) => (
                        <option key={d} value={d}>
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    label={
                      form.discountType === "percentage"
                        ? "Discount (%)"
                        : "Discount (₹)"
                    }
                    icon={Zap}
                  >
                    <Input
                      type="number"
                      min={0}
                      value={form.discountValue}
                      onChange={set("discountValue")}
                      placeholder={
                        form.discountType === "percentage"
                          ? "e.g. 20"
                          : "e.g. 500"
                      }
                    />
                  </Field>
                </div>
              </div>
            )}
          </Card>

          {form.hasVariants && (
            <Card title="Shared Discount (optional)">
              <p className="text-[11px] text-[#9a9abf] -mt-2">
                One discount applied across all variants. Backend computes each
                variant's final price.
              </p>
              <Field label="Discount Type" icon={Percent}>
                <Select
                  value={form.discountType}
                  onChange={set("discountType")}
                >
                  {DISCOUNT_TYPES.map((d) => (
                    <option key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label={
                  form.discountType === "percentage"
                    ? "Discount (%)"
                    : "Discount (₹)"
                }
                icon={Zap}
              >
                <Input
                  type="number"
                  min={0}
                  value={form.discountValue}
                  onChange={set("discountValue")}
                  placeholder={
                    form.discountType === "percentage" ? "e.g. 10" : "e.g. 200"
                  }
                />
              </Field>
            </Card>
          )}

          {form.type === "physical" && (
            <Card title="Shipping & Dimensions">
              <Field label="Weight (grams)" icon={BarChart2}>
                <Input
                  type="number"
                  min={0}
                  value={form.weight}
                  onChange={set("weight")}
                  placeholder="e.g. 250"
                />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Length (cm)" icon={Ruler}>
                  <Input
                    type="number"
                    min={0}
                    value={form.dimensions.length}
                    onChange={setDim("length")}
                    placeholder="L"
                  />
                </Field>
                <Field label="Width (cm)" icon={Ruler}>
                  <Input
                    type="number"
                    min={0}
                    value={form.dimensions.width}
                    onChange={setDim("width")}
                    placeholder="W"
                  />
                </Field>
                <Field label="Height (cm)" icon={Ruler}>
                  <Input
                    type="number"
                    min={0}
                    value={form.dimensions.height}
                    onChange={setDim("height")}
                    placeholder="H"
                  />
                </Field>
              </div>
            </Card>
          )}

          <Card title="SEO & Meta">
            <Field label="Meta Title" icon={Search}>
              <Input
                value={form.metaTitle}
                onChange={set("metaTitle")}
                placeholder="SEO title (defaults to product name if empty)"
              />
            </Field>
            <Field label="Meta Description">
              <textarea
                value={form.metaDescription}
                onChange={set("metaDescription")}
                placeholder="Brief description for search engines..."
                rows={2}
                className="w-full resize-none rounded-xl border border-[#e8e8f4] bg-white px-3.5 py-2.5 text-sm text-[#1a1a2e] placeholder-[#b0b0cc] outline-none transition focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10"
              />
            </Field>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Publish Settings">
            <Toggle
              label="Published"
              description="Visible to customers"
              value={form.isPublished}
              onChange={setBool("isPublished")}
            />
            <Toggle
              label="Featured"
              description="Show on homepage"
              value={form.isFeatured}
              onChange={setBool("isFeatured")}
            />
          </Card>

          <Card title="Tax / GST">
            <Toggle
              label="Apply GST"
              description="Turn off if this product is tax-exempt"
              value={form.gst.enabled}
              onChange={(v) => setGst("enabled", v)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="GST Rate (%)" icon={Percent}>
                <Select
                  value={form.gst.rate}
                  onChange={(e) => setGst("rate", Number(e.target.value))}
                >
                  {GST_RATE_OPTIONS.map((rate) => (
                    <option key={rate} value={rate}>{rate}%</option>
                  ))}
                </Select>
              </Field>
              <Field label="GST Type">
                <Select
                  value={form.gst.type}
                  onChange={(e) => setGst("type", e.target.value)}
                >
                  <option value="exclusive">Exclusive (added on top)</option>
                  <option value="inclusive">Inclusive (already in price)</option>
                </Select>
              </Field>
            </div>

            {!form.hasVariants ? (
              <div className="rounded-xl border border-[#e8e8f4] bg-[#fafafd] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9a9abf] mb-1">
                  Customer will be charged
                </p>
                <p className="text-lg font-bold text-[#1a1a2e]">
                  ₹{previewPriceWithGst(
                    previewDiscountedPrice(form.mrp, form.discountType, form.discountValue),
                    form.gst,
                  ).toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-[#9a9abf] mt-0.5">Estimate — server computes the final value on save.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-[#e8e8f4] bg-[#fafafd] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9a9abf] mb-2">
                  Customer will be charged (per variant)
                </p>
                <div className="flex flex-col gap-1">
                  {variants.map((v, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[#6b6b8f]">{v.name || `Variant ${i + 1}`}{v.value ? ` — ${v.value}` : ""}</span>
                      <span className="font-semibold text-[#1a1a2e]">
                        ₹{previewPriceWithGst(
                          previewDiscountedPrice(v.mrp, form.discountType, form.discountValue),
                          form.gst,
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#9a9abf] mt-2">Estimate — server computes the final value on save.</p>
              </div>
            )}
          </Card>

          {/* {isDigital && (
            <Card title="Downloadable File">
              <p className="text-[11px] text-[#9a9abf] -mt-2">
                This file will be delivered to the customer after purchase.
                Images are auto-watermarked by the server.
              </p>
              <DownloadableFileZone
                file={downloadableFile}
                onChange={setDownloadableFile}
              />
            </Card>
          )} */}
        </div>
      </div>
    </div>
  );
}
