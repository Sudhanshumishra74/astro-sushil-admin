/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
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
import toast from "react-hot-toast";
import { useProductStore } from "../../store/useProductStore";
import RichTextEditor from "../../components/common/Richtexteditor2";
import { useCategoryStore } from "../../store/usecategoryStore";
import { v4 as uuidv4 } from "uuid";
import ImageCropModal from "../../components/common/ImageCropModal";

// Resolution shown alongside a preview so the admin can tell what they're
// about to upload — reads it from the browser's own decode of the file,
// same idea as the shared ImageUpload component.
function useImageDimensions(src) {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (!src) {
      setDimensions(null);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      if (!cancelled) setDimensions(null);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return dimensions;
}

function ImageResolutionBadge({ src }) {
  const dimensions = useImageDimensions(src);
  if (!dimensions) return null;
  return (
    <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
      {dimensions.width}×{dimensions.height}px
    </span>
  );
}

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

// Mirrors src/utils/ratti.js on the backend — must generate the exact same
// list, or a ratti value shown here as a valid option could be rejected
// server-side. Kept as a plain client-side duplicate (no shared package
// between these two separate repos) rather than an API round-trip, since
// it's a pure function of min/max.
const RATTI_STEP = 0.25;
const generateRattiOptions = (minRatti, maxRatti) => {
  const min = Number(minRatti);
  const max = Number(maxRatti);
  if (!Number.isFinite(min) || min <= 0) return [];
  const safeMax = Number.isFinite(max) && max >= min ? max : min;
  const minUnits = Math.round(min / RATTI_STEP);
  const maxUnits = Math.round(safeMax / RATTI_STEP);
  const options = [];
  for (let units = minUnits; units <= maxUnits; units += 1) {
    options.push(Math.round(units * RATTI_STEP * 100) / 100);
  }
  return options;
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
  const [cropSrc, setCropSrc] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);

  // Same crop step as the Media library (ImageCropModal) — every other
  // image upload in the admin routes through it too, see Imageupload.jsx.
  const startCrop = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setPendingFile(f);
    setCropSrc(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    startCrop(e.dataTransfer.files[0]);
  }, []);

  return (
    <>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current.click()}
        // Full aspect-ratio-correct width would stretch to this card's full
        // width (this Card spans most of the page) and make the box huge —
        // capped so the box stays a sane size; the crop step below still
        // enforces the real 4:3 ratio on the uploaded file regardless of
        // how big this preview box renders.
        className="group relative cursor-pointer mx-auto w-full max-w-sm rounded-2xl border-2 border-dashed border-[#d8d8f0] bg-[#fafafd] transition hover:border-[#6c63ff] hover:bg-[#f5f4ff] overflow-hidden"
        style={{ aspectRatio: "4/3" }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="thumbnail"
              className="h-full w-full object-cover"
            />
            <ImageResolutionBadge src={preview} />
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
            <p className="text-[11px]">PNG, JPG, WEBP — 4:3 recommended (matches product cards)</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => startCrop(e.target.files[0])}
        />
      </div>

      {/* Sibling, not a child of the clickable zone above — nesting it
          inside would let clicks on the modal's own buttons/slider bubble
          up and reopen the file picker. */}
      <ImageCropModal
        open={!!cropSrc}
        imageSrc={cropSrc}
        // Matches ProductCard.jsx/ProductCard2.jsx's card image container
        // (aspect-4/3, object-cover) — the thumbnail's most-seen display.
        aspect={4 / 3}
        fileName={pendingFile?.name || "thumbnail.jpg"}
        mimeType={pendingFile?.type || "image/jpeg"}
        onCancel={() => setCropSrc(null)}
        onCropComplete={(croppedFile) => {
          setCropSrc(null);
          onChange(croppedFile);
        }}
      />
    </>
  );
}

const MAX_PRODUCT_VIDEOS = 2;

function VideosZone({ videos, onChange }) {
  const inputRef = useRef();
  const atLimit = videos.length >= MAX_PRODUCT_VIDEOS;

  const addFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("video/"));
    onChange((prev) => [...prev, ...valid].slice(0, MAX_PRODUCT_VIDEOS));
  };

  const remove = (idx) => {
    onChange(videos.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-3">
      {videos.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {videos.map((f, i) => {
            const src = typeof f === "string" ? f : URL.createObjectURL(f);

            return (
              <div
                key={i}
                className="group relative w-44 rounded-2xl overflow-hidden border-2 border-[#d8d8f0] bg-black"
              >
                <video src={src} controls className="w-full h-28 object-cover" />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1.5 right-1.5 flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                  title="Remove video"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!atLimit && (
        <div
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-[#d8d8f0] bg-[#fafafd] py-8 flex flex-col items-center gap-2 text-[#9a9abf] hover:border-[#6c63ff] hover:bg-[#f5f4ff] transition"
        >
          <div className="rounded-2xl bg-[#6c63ff]/10 p-3">
            <Upload size={22} className="text-[#6c63ff]" />
          </div>
          <p className="text-xs font-medium">Drop video or click to upload</p>
          <p className="text-[11px]">
            Up to {MAX_PRODUCT_VIDEOS} videos, MP4 recommended
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}

function ImagesZone({ images, onChange }) {
  const inputRef = useRef();
  // Files awaiting the crop step, cropped one at a time — ImageCropModal
  // only handles a single image, so a multi-file drop/select queues up and
  // each cropped result is pushed in as its predecessor finishes.
  const [cropQueue, setCropQueue] = useState([]);

  const addFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setCropQueue((prev) => [...prev, ...valid]);
  };

  const remove = (idx) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const current = cropQueue[0] || null;
  const currentSrc = useMemo(
    () => (current ? URL.createObjectURL(current) : null),
    [current],
  );

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
                <ImageResolutionBadge src={src} />

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

      <ImageCropModal
        open={!!current}
        imageSrc={currentSrc}
        // Matches the PDP gallery's main image box (aspect-4/3 on desktop,
        // where product photos are viewed the most) — see
        // Productdetailpage.jsx.
        aspect={4 / 3}
        fileName={current?.name || "image.jpg"}
        mimeType={current?.type || "image/jpeg"}
        onCancel={() => setCropQueue((prev) => prev.slice(1))}
        onCropComplete={(croppedFile) => {
          onChange((prev) => [...prev, croppedFile]);
          setCropQueue((prev) => prev.slice(1));
        }}
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

function VariantsEditor({ variants = [], onChange, type, errors = {} }) {
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

  const updateDim = (i, dimKey, val) =>
    onChange(
      variants.map((v, idx) =>
        idx === i ? { ...v, dimensions: { ...v.dimensions, [dimKey]: val } } : v,
      ),
    );

  const remove = (i) => onChange(variants.filter((_, idx) => idx !== i));

  // Cascading second level — once a variant has any sub-variants it becomes
  // a pure grouping label; the customer must pick a leaf sub-variant to buy.
  const addSubVariant = (i) =>
    onChange(
      variants.map((v, idx) =>
        idx === i
          ? {
              ...v,
              subVariants: [
                ...(v.subVariants || []),
                { _id: uuidv4(), name: "", value: "", mrp: "", stock: "" },
              ],
            }
          : v,
      ),
    );

  const updateSubVariant = (i, si, key, val) =>
    onChange(
      variants.map((v, idx) =>
        idx === i
          ? {
              ...v,
              subVariants: (v.subVariants || []).map((sv, sidx) =>
                sidx === si ? { ...sv, [key]: val } : sv,
              ),
            }
          : v,
      ),
    );

  const updateSubVariantDim = (i, si, dimKey, val) =>
    onChange(
      variants.map((v, idx) =>
        idx === i
          ? {
              ...v,
              subVariants: (v.subVariants || []).map((sv, sidx) =>
                sidx === si
                  ? { ...sv, dimensions: { ...sv.dimensions, [dimKey]: val } }
                  : sv,
              ),
            }
          : v,
      ),
    );

  const removeSubVariant = (i, si) =>
    onChange(
      variants.map((v, idx) =>
        idx === i
          ? { ...v, subVariants: (v.subVariants || []).filter((_, sidx) => sidx !== si) }
          : v,
      ),
    );

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
        const hasSubVariants = v.subVariants?.length > 0;

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

            {/* BASIC DETAILS — MRP/Stock only matter here when this variant
                has no sub-variants (i.e. it's directly purchasable itself).
                Once sub-variants exist below, this row becomes a pure
                grouping label ("Color: Red") and its own MRP/Stock are
                never read at checkout — hiding them avoids the confusing
                appearance that they still do something. Every field is a
                labeled Field (not a bare placeholder-only Input) since a
                placeholder disappears the moment you type — leaving no way
                to tell, after the fact, which box was "attribute name" vs
                "value". */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                hasSubVariants ? "" : "lg:grid-cols-4"
              }`}
            >
              <Field label="Attribute Name" icon={Tag} error={errors[`variants.${i}.name`]}>
                <Input
                  value={v.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                  placeholder="e.g. Color"
                />
              </Field>

              <Field label="Value" icon={Hash} error={errors[`variants.${i}.value`]}>
                <Input
                  value={v.value}
                  onChange={(e) => update(i, "value", e.target.value)}
                  placeholder="e.g. Red"
                />
              </Field>

              {!hasSubVariants && (
                <>
                  <Field label="MRP (₹)" icon={DollarSign} error={errors[`variants.${i}.mrp`]}>
                    <Input
                      type="number"
                      value={v.mrp}
                      onChange={(e) => update(i, "mrp", e.target.value)}
                      placeholder="0"
                    />
                  </Field>

                  <Field label="Stock" icon={Box} error={errors[`variants.${i}.stock`]}>
                    <Input
                      type="number"
                      value={v.stock}
                      onChange={(e) => update(i, "stock", e.target.value)}
                      placeholder="0"
                    />
                  </Field>
                </>
              )}
            </div>

            {hasSubVariants && (
              <p className="text-[11px] text-[#9a9abf] -mt-2">
                This variant has sub-variants below — its own MRP/stock are
                unused; customers buy a specific sub-variant instead.
              </p>
            )}

            {/* SHIPPING — a variant like "Large" can weigh meaningfully
                more than the product's own top-level weight, which
                otherwise gets used for every variant alike and can badly
                under-quote the courier rate for a heavier one. Falls back
                to the product's weight/dimensions when left blank. */}
            {type === "physical" && (
              <div className="flex flex-col gap-2">
                {hasSubVariants && (
                  <p className="text-[11px] text-[#9a9abf]">
                    Fallback only — used when a sub-variant below doesn't set
                    its own weight/dimensions.
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Weight (g)" icon={BarChart2} error={errors[`variants.${i}.weight`]}>
                    <Input
                      type="number"
                      min={0}
                      value={v.weight}
                      onChange={(e) => update(i, "weight", e.target.value)}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Length (cm)" icon={Ruler}>
                    <Input
                      type="number"
                      min={0}
                      value={v.dimensions?.length}
                      onChange={(e) => updateDim(i, "length", e.target.value)}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Width (cm)" icon={Ruler}>
                    <Input
                      type="number"
                      min={0}
                      value={v.dimensions?.width}
                      onChange={(e) => updateDim(i, "width", e.target.value)}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Height (cm)" icon={Ruler}>
                    <Input
                      type="number"
                      min={0}
                      value={v.dimensions?.height}
                      onChange={(e) => updateDim(i, "height", e.target.value)}
                      placeholder="0"
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* SUB-VARIANTS — cascading second level, e.g. variant "Color:
                Red" narrows down to "Size: S" / "Size: M". Once any exist,
                the parent variant itself is no longer directly orderable —
                the customer must pick a leaf sub-variant. Physical only for
                now (see plan). */}
            {type === "physical" && (
              <div className="flex flex-col gap-3 rounded-xl border border-dashed border-[#d8d8f0] bg-[#fafafd] p-4 ml-0 sm:ml-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7c7ca0]">
                    Sub-variants {v.subVariants?.length > 0 && `(${v.subVariants.length})`}
                  </p>
                </div>

                {v.subVariants?.length > 0 && (
                  <p className="text-[11px] text-[#9a9abf] -mt-1">
                    This variant becomes a group label — customers pick a
                    sub-variant below to buy. Give every sub-variant here the{" "}
                    <span className="font-semibold text-[#6c63ff]">same
                    Attribute Name</span> (e.g. all "Color") — only the Value
                    should differ (e.g. "Red", "Blue"). That shared name is
                    what customers see as the picker's label.
                  </p>
                )}

                {(v.subVariants || []).map((sv, si) => (
                  <div
                    key={sv._id ?? si}
                    className="rounded-xl border border-[#ececf6] bg-white p-3 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#3b3b4f]">
                        Sub-variant {si + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeSubVariant(i, si)}
                        className="rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-red-500 hover:bg-red-100 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <Field
                        label="Attribute Name"
                        icon={Tag}
                        error={errors[`variants.${i}.subVariants.${si}.name`]}
                      >
                        <Input
                          value={sv.name}
                          onChange={(e) => updateSubVariant(i, si, "name", e.target.value)}
                          placeholder="e.g. Color (same for all)"
                        />
                      </Field>
                      <Field
                        label="Value"
                        icon={Hash}
                        error={errors[`variants.${i}.subVariants.${si}.value`]}
                      >
                        <Input
                          value={sv.value}
                          onChange={(e) => updateSubVariant(i, si, "value", e.target.value)}
                          placeholder="e.g. Red"
                        />
                      </Field>
                      <Field
                        label="MRP (₹)"
                        icon={DollarSign}
                        error={errors[`variants.${i}.subVariants.${si}.mrp`]}
                      >
                        <Input
                          type="number"
                          value={sv.mrp}
                          onChange={(e) => updateSubVariant(i, si, "mrp", e.target.value)}
                          placeholder="0"
                        />
                      </Field>
                      <Field
                        label="Stock"
                        icon={Box}
                        error={errors[`variants.${i}.subVariants.${si}.stock`]}
                      >
                        <Input
                          type="number"
                          value={sv.stock}
                          onChange={(e) => updateSubVariant(i, si, "stock", e.target.value)}
                          placeholder="0"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <Field
                        label="Weight (g)"
                        icon={BarChart2}
                        error={errors[`variants.${i}.subVariants.${si}.weight`]}
                      >
                        <Input
                          type="number"
                          min={0}
                          value={sv.weight}
                          onChange={(e) => updateSubVariant(i, si, "weight", e.target.value)}
                          placeholder="0"
                        />
                      </Field>
                      <Field label="Length (cm)" icon={Ruler}>
                        <Input
                          type="number"
                          min={0}
                          value={sv.dimensions?.length}
                          onChange={(e) => updateSubVariantDim(i, si, "length", e.target.value)}
                          placeholder="0"
                        />
                      </Field>
                      <Field label="Width (cm)" icon={Ruler}>
                        <Input
                          type="number"
                          min={0}
                          value={sv.dimensions?.width}
                          onChange={(e) => updateSubVariantDim(i, si, "width", e.target.value)}
                          placeholder="0"
                        />
                      </Field>
                      <Field label="Height (cm)" icon={Ruler}>
                        <Input
                          type="number"
                          min={0}
                          value={sv.dimensions?.height}
                          onChange={(e) => updateSubVariantDim(i, si, "height", e.target.value)}
                          placeholder="0"
                        />
                      </Field>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addSubVariant(i)}
                  className="flex items-center gap-2 self-start rounded-lg border border-dashed border-[#6c63ff]/40 px-3 py-1.5 text-[11px] font-semibold text-[#6c63ff] hover:bg-[#6c63ff]/5 transition"
                >
                  <Plus size={12} /> Add Sub-variant
                </button>
              </div>
            )}

            {/* FILE UPLOAD */}
            {type === "digital" && (
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase text-gray-400">
                  Downloadable File
                </label>
                {errors[`variants.${i}.downloadableFile`] && (
                  <p className="text-[11px] text-red-400">
                    {errors[`variants.${i}.downloadableFile`]}
                  </p>
                )}

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

function CertificatesEditor({ certificates = [], onChange, errors = {} }) {
  const add = () =>
    onChange([
      ...certificates,
      { _id: uuidv4(), name: "", price: "", includedInPrice: false },
    ]);

  const update = (i, key, val) =>
    onChange(certificates.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));

  const remove = (i) => onChange(certificates.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {certificates.map((c, i) => {
        const cKey = `certificates.${i}`;

        return (
          <div
            key={c._id || i}
            className="flex flex-col gap-3 rounded-2xl border border-[#e8e8f4] bg-[#fafafd] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Certificate Name" error={errors[`${cKey}.name`]}>
                  <Input
                    value={c.name}
                    onChange={(e) => update(i, "name", e.target.value)}
                    placeholder="e.g. IGI Lab Certificate"
                  />
                </Field>
                <Field label="Price (₹)" error={errors[`${cKey}.price`]}>
                  <Input
                    type="number"
                    min={0}
                    value={c.price}
                    disabled={c.includedInPrice}
                    onChange={(e) => update(i, "price", e.target.value)}
                    placeholder="e.g. 500"
                  />
                </Field>
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="mt-6 shrink-0 rounded-lg p-1.5 text-[#b0b0cc] hover:bg-red-50 hover:text-red-500 transition"
              >
                <X size={15} />
              </button>
            </div>

            <Toggle
              label="Included in product price"
              description="Off = the price above is charged as an extra when a customer picks this certificate"
              value={c.includedInPrice}
              onChange={(val) => update(i, "includedInPrice", val)}
            />
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 self-start rounded-xl border border-dashed border-[#6c63ff]/40 px-4 py-2 text-xs font-semibold text-[#6c63ff] hover:bg-[#6c63ff]/5 transition"
      >
        <Plus size={13} /> Add Certificate
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

function RattiToggle({ value, onChange }) {
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
          Sold by ratti (gemstone)
        </p>
        <p className="text-[11px] text-[#9a9abf] mt-0.5">
          {value
            ? "Customer picks a ratti weight; price scales automatically."
            : "Turn on for gemstones priced per ratti instead of a flat MRP."}
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

function GemstoneRattiFields({
  form,
  set,
  errors,
  gst,
  discountType,
  discountValue,
  onToggleOutOfStock,
}) {
  const rattiOptions = generateRattiOptions(form.minRatti, form.maxRatti);
  // Sample a handful of points across the range for the preview table rather
  // than every 0.25 step, which can run to dozens of rows for a wide range.
  const previewOptions =
    rattiOptions.length <= 6
      ? rattiOptions
      : [
          rattiOptions[0],
          rattiOptions[Math.floor(rattiOptions.length * 0.25)],
          rattiOptions[Math.floor(rattiOptions.length * 0.5)],
          rattiOptions[Math.floor(rattiOptions.length * 0.75)],
          rattiOptions[rattiOptions.length - 1],
        ];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] text-[#9a9abf]">
        Set the price for 1 ratti — every other ratti value in the range is
        priced automatically (price per ratti × selected ratti).
      </p>

      <Field label="Price per Ratti (₹)" icon={DollarSign} error={errors.pricePerRatti}>
        <Input
          type="number"
          min={0}
          value={form.pricePerRatti}
          onChange={set("pricePerRatti")}
          placeholder="e.g. 3500"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Min Ratti" icon={BarChart2} error={errors.minRatti}>
          <Input
            type="number"
            min={0.25}
            step={0.25}
            value={form.minRatti}
            onChange={set("minRatti")}
            placeholder="e.g. 1"
          />
        </Field>
        <Field label="Max Ratti" icon={BarChart2} error={errors.maxRatti}>
          <Input
            type="number"
            min={0.25}
            step={0.25}
            value={form.maxRatti}
            onChange={set("maxRatti")}
            placeholder="e.g. 10"
          />
        </Field>
      </div>

      {rattiOptions.length > 0 && (
        <Field label="Mark Specific Ratti Out of Stock" icon={BarChart2}>
          <p className="text-[11px] text-[#9a9abf] -mt-1 mb-2">
            Toggle off individual weights that are sold out — everything else in
            the range stays purchasable.
          </p>
          <div className="flex flex-wrap gap-2">
            {rattiOptions.map((ratti) => {
              const isOut = form.outOfStockRattis.includes(ratti);
              return (
                <button
                  key={ratti}
                  type="button"
                  onClick={() => onToggleOutOfStock(ratti)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    isOut
                      ? "bg-red-50 border-red-200 text-red-500 line-through"
                      : "bg-white border-[#e8e8f4] text-[#1a1a2e] hover:border-[#6c63ff]"
                  }`}
                  title={isOut ? "Out of stock — click to make available" : "In stock — click to mark out of stock"}
                >
                  {ratti}
                </button>
              );
            })}
          </div>
        </Field>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Discount Type" icon={Percent}>
          <Select value={discountType} onChange={set("discountType")}>
            {DISCOUNT_TYPES.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label={discountType === "percentage" ? "Discount (%)" : "Discount (₹)"}
          icon={Zap}
        >
          <Input
            type="number"
            min={0}
            value={discountValue}
            onChange={set("discountValue")}
            placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 200"}
          />
        </Field>
      </div>

      {rattiOptions.length > 0 && Number(form.pricePerRatti) > 0 && (
        <div className="rounded-xl border border-[#e8e8f4] bg-[#fafafd] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9a9abf] mb-2">
            {rattiOptions.length} ratti option{rattiOptions.length === 1 ? "" : "s"} available — preview
          </p>
          <div className="flex flex-col gap-1">
            {previewOptions.map((ratti) => (
              <div key={ratti} className="flex items-center justify-between text-sm">
                <span className="text-[#6b6b8f]">{ratti} ratti</span>
                <span className="font-semibold text-[#1a1a2e]">
                  ₹{(
                    previewPriceWithGst(
                      previewDiscountedPrice(form.pricePerRatti, discountType, discountValue),
                      gst,
                    ) * ratti
                  ).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#9a9abf] mt-2">Estimate — server computes the final value on save.</p>
        </div>
      )}
    </div>
  );
}

export default function AddProduct({ editData = null }) {
  const navigate = useNavigate();
  const { createProduct, updateProduct, loading } = useProductStore();

  const [thumbnail, setThumbnail] = useState(editData?.thumbnail || null);
  const [videos, setVideos] = useState(editData?.videos || []);
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
  const [certificates, setCertificates] = useState(() =>
    (editData?.certificates ?? []).map((c) => ({ ...c, _id: c._id || uuidv4() })),
  );
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: editData?.name ?? "",
    shortDescription: editData?.shortDescription ?? "",
    description: editData?.description ?? "",
    type: editData?.type ?? "physical",
    // getProductById (the admin edit fetch) returns `category` populated
    // ({_id, name, slug}), not a plain id — CategorySelect's `value` prop
    // and the FormData submit below both need the bare id string, or the
    // dropdown never matches anything in its options list and silently
    // never auto-selects the product's existing category.
    category: editData?.category?._id ?? editData?.category ?? "",
    hasVariants:
      editData?.type === "digital"
        ? true
        : Boolean(editData?.hasVariants) || (editData?.variants?.length ?? 0) > 0,
    soldByRatti: Boolean(editData?.soldByRatti),
    pricePerRatti: editData?.pricePerRatti ?? "",
    minRatti: editData?.minRatti ?? 1,
    maxRatti: editData?.maxRatti ?? "",
    outOfStockRattis: editData?.outOfStockRattis ?? [],
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

    gst: {
      enabled: editData?.gst?.enabled ?? true,
      rate: editData?.gst?.rate ?? 0,
      type: editData?.gst?.type ?? "exclusive",
    },
  });

  const isDigital = form.type === "digital";

  const setGst = (k, v) =>
    setForm((f) => ({ ...f, gst: { ...f.gst, [k]: v } }));

  const toggleOutOfStockRatti = (ratti) =>
    setForm((f) => ({
      ...f,
      outOfStockRattis: f.outOfStockRattis.includes(ratti)
        ? f.outOfStockRattis.filter((r) => r !== ratti)
        : [...f.outOfStockRattis, ratti],
    }));

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
      soldByRatti: newType === "digital" ? false : f.soldByRatti,
    }));
  };

  const computedPrice = (() => {
    // Removed - all products now use variant-based pricing
    return null;
  })();

  // Numbers arrive from Input's onChange as strings (or "" when cleared) —
  // "" and null both mean "not filled in", distinct from a real 0.
  const isBlank = (val) => val === "" || val === null || val === undefined;

  const validate = () => {
    const e = {};

    if (!form.name || form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";

    if (form.soldByRatti) {
      if (isBlank(form.pricePerRatti) || Number(form.pricePerRatti) <= 0) {
        e.pricePerRatti = "Price per ratti is required";
      }
      if (isBlank(form.minRatti) || Number(form.minRatti) <= 0) {
        e.minRatti = "Min ratti is required";
      }
      if (!isBlank(form.maxRatti) && Number(form.maxRatti) < Number(form.minRatti || 0)) {
        e.maxRatti = "Max ratti must be greater than or equal to min ratti";
      }
      if (isBlank(form.stock) || Number(form.stock) < 0) {
        e.stock = "Stock is required";
      }
    } else if (form.hasVariants) {
      if (!variants.length) {
        e.variants = "Add at least one variant";
      }

      variants.forEach((v, i) => {
        const vKey = `variants.${i}`;
        const hasSubVariants = v.subVariants?.length > 0;

        if (!v.name?.trim()) e[`${vKey}.name`] = "Required";
        if (!v.value?.trim()) e[`${vKey}.value`] = "Required";

        // MRP/stock/downloadable file only matter for a variant that's
        // directly purchasable itself — once it has sub-variants, it's a
        // pure grouping label and its own MRP/stock are never read at
        // checkout (see product.modal.js's pre-save hook).
        if (!hasSubVariants) {
          if (isBlank(v.mrp) || Number(v.mrp) <= 0) e[`${vKey}.mrp`] = "Required";
          if (isBlank(v.stock) || Number(v.stock) < 0) e[`${vKey}.stock`] = "Required";

          if (form.type === "digital" && !v.downloadableFile) {
            e[`${vKey}.downloadableFile`] = "A downloadable file is required";
          }
        }

        if (form.type === "physical" && !isBlank(v.weight) && Number(v.weight) < 0) {
          e[`${vKey}.weight`] = "Must be 0 or more";
        }

        (v.subVariants || []).forEach((sv, si) => {
          const svKey = `${vKey}.subVariants.${si}`;

          if (!sv.name?.trim()) e[`${svKey}.name`] = "Required";
          if (!sv.value?.trim()) e[`${svKey}.value`] = "Required";
          if (isBlank(sv.mrp) || Number(sv.mrp) <= 0) e[`${svKey}.mrp`] = "Required";
          if (isBlank(sv.stock) || Number(sv.stock) < 0) e[`${svKey}.stock`] = "Required";

          if (!isBlank(sv.weight) && Number(sv.weight) < 0) {
            e[`${svKey}.weight`] = "Must be 0 or more";
          }
        });
      });
    } else {
      if (isBlank(form.mrp) || Number(form.mrp) <= 0) e.mrp = "MRP is required";

      if (!isDigital && (isBlank(form.stock) || Number(form.stock) < 0)) {
        e.stock = "Stock is required";
      }
    }

    certificates.forEach((c, i) => {
      const cKey = `certificates.${i}`;

      if (!c.name?.trim()) e[`${cKey}.name`] = "Required";
      if (!c.includedInPrice && (isBlank(c.price) || Number(c.price) <= 0)) {
        e[`${cKey}.price`] = "Required unless included in price";
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    // Per-field errors render inline (some deep inside the Variants card,
    // well below the fold) — without a toast, submitting with an error at
    // the bottom of a long form silently does nothing visible above the
    // fold, and looks like the button just didn't work.
    if (!validate()) {
      toast.error("Please fix the highlighted fields before saving");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("shortDescription", form.shortDescription);
    formData.append("description", form.description);
    formData.append("type", form.type);
    formData.append("category", form.category);
    formData.append("hasVariants", form.hasVariants);
    formData.append("soldByRatti", form.soldByRatti);
    formData.append("sku", form.sku);
    formData.append("weight", form.weight);

    formData.append("metaTitle", form.metaTitle);
    formData.append("metaDescription", form.metaDescription);
    formData.append("isFeatured", form.isFeatured);
    formData.append("isPublished", form.isPublished);
    formData.append("gst", JSON.stringify(form.gst));

    formData.append("keywords", JSON.stringify(keywords));
    formData.append("dimensions", JSON.stringify(form.dimensions));
    formData.append("certificates", JSON.stringify(certificates));

    if (form.hasVariants) {
      // A File object can't be JSON-stringified — it travels separately via
      // the `variantFiles` multipart field, matched back up server-side by
      // variantFileIds. But a string (existing URL, untouched) or `null`
      // (the "Remove" button was clicked) must be kept in the JSON payload
      // as-is — dropping it here made an explicit removal indistinguishable
      // from "field not sent," so the backend always fell back to keeping
      // whatever file was already there and a digital variant's file could
      // never actually be deleted.
      const cleanedVariants = variants.map((v) => {
        if (v.downloadableFile instanceof File) {
          const { downloadableFile, ...rest } = v;
          return rest;
        }
        return v;
      });

      formData.append("variants", JSON.stringify(cleanedVariants));
      formData.append("discountType", form.discountType);
      formData.append("discountValue", form.discountValue);
    } else if (form.soldByRatti) {
      formData.append("pricePerRatti", form.pricePerRatti);
      formData.append("minRatti", form.minRatti || 1);
      formData.append("maxRatti", form.maxRatti || form.minRatti || 1);
      formData.append("outOfStockRattis", JSON.stringify(form.outOfStockRattis));
      formData.append("stock", form.stock);
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

    // Existing URLs the admin chose to keep travel separately from new
    // files — the backend combines them (see product.controller.js's
    // updateProduct), since plain array-of-Files omission can't tell
    // "removed" apart from "untouched" server-side. Always sent (harmless
    // on create, where the backend doesn't look at it): on edit, resending
    // the untouched existing list is a no-op server-side, and an admin who
    // removed a video without adding a new one still needs the shrunk list
    // to actually reach the backend.
    formData.append(
      "existingVideos",
      JSON.stringify(videos.filter((v) => typeof v === "string")),
    );
    videos.forEach((v) => {
      if (v instanceof File) formData.append("videos", v);
    });

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
    <div className="min-h-screen bg-[#f7f7fb] px-4 py-6 md:px-8 md:py-8 rounded-2xl">
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

          <Card title="Product Videos (optional, up to 2)">
            <VideosZone videos={videos} onChange={setVideos} />
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
                {form.sku ? (
                  <Input value={form.sku} disabled className="opacity-70 cursor-not-allowed" />
                ) : (
                  <div className="flex items-center h-10.5 px-3.5 text-sm text-[#b0b0cc] italic">
                    Auto-generated on save
                  </div>
                )}
              </Field>

              {/* Stock only for physical products without variants */}
              {!form.hasVariants && !isDigital && (
                <Field label="Stock" icon={Box} error={errors.stock}>
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
              <div className="flex flex-col gap-3">
                <HasVariantsToggle
                  value={form.hasVariants}
                  onChange={(val) =>
                    setForm((f) => ({ ...f, hasVariants: val, soldByRatti: val ? false : f.soldByRatti }))
                  }
                />
                <RattiToggle
                  value={form.soldByRatti}
                  onChange={(val) =>
                    setForm((f) => ({ ...f, soldByRatti: val, hasVariants: val ? false : f.hasVariants }))
                  }
                />
              </div>
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

            {form.soldByRatti ? (
              <GemstoneRattiFields
                form={form}
                set={set}
                errors={errors}
                gst={form.gst}
                discountType={form.discountType}
                discountValue={form.discountValue}
                onToggleOutOfStock={toggleOutOfStockRatti}
              />
            ) : form.hasVariants ? (
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
                  errors={errors}
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

          <Card title="Certificates (optional)">
            <p className="text-[11px] text-[#9a9abf] -mt-2">
              Customers pick one certificate from a dropdown at checkout. Toggle
              &quot;Included in product price&quot; off to charge its price as an extra.
              Only shown to customers when Settings &rarr; Certificates is enabled.
            </p>
            <CertificatesEditor
              certificates={certificates}
              onChange={setCertificates}
              errors={errors}
            />
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

            {form.soldByRatti ? (
              <div className="rounded-xl border border-[#e8e8f4] bg-[#fafafd] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9a9abf] mb-1">
                  Customer will be charged (per ratti)
                </p>
                <p className="text-lg font-bold text-[#1a1a2e]">
                  ₹{previewPriceWithGst(
                    previewDiscountedPrice(form.pricePerRatti, form.discountType, form.discountValue),
                    form.gst,
                  ).toLocaleString("en-IN")} / ratti
                </p>
                <p className="text-[11px] text-[#9a9abf] mt-0.5">
                  e.g. {form.minRatti || 1} ratti = ₹{(
                    previewPriceWithGst(
                      previewDiscountedPrice(form.pricePerRatti, form.discountType, form.discountValue),
                      form.gst,
                    ) * Number(form.minRatti || 1)
                  ).toLocaleString("en-IN")} — server computes the final value on save.
                </p>
              </div>
            ) : !form.hasVariants ? (
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
