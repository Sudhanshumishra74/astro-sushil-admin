/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Upload,
  Link,
  Tag,
  User,
  Zap,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Film,
  Image,
  Mic,
  Star,
  Search,
  MoreVertical,
  ChevronDown,
  Hash,
  AlignLeft,
  Layers,
  LayoutGrid,
  List,
} from "lucide-react";
import ImageCropModal from "../../components/common/ImageCropModal";

const SECTION_META = {
  podcast: { label: "Podcast", icon: Mic, color: "#6c63ff" },
  celebrity: { label: "Celebrity", icon: Star, color: "#f59e0b" },
  wishes: { label: "Wishes", icon: Image, color: "#10b981" },
};

const SECTIONS = ["podcast", "celebrity", "wishes"];

// ── Framer Motion variants ────────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 16,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};


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

function UploadZone({
  file,
  onChange,
  accept = "image/*",
  label = "Drop file or click to upload",
  hint = "PNG, JPG, WEBP",
  aspect = 16 / 9,
}) {
  const inputRef = useRef();
  const preview =
    typeof file === "string" ? file : file ? URL.createObjectURL(file) : null;
  const isVideo = accept.includes("video");

  const [cropSrc, setCropSrc] = useState(null);
  const [cropFileMeta, setCropFileMeta] = useState(null);

  const openCropFor = (f) => {
    if (isVideo) {
      onChange(f);
      return;
    }
    setCropFileMeta({ name: f.name, type: f.type || "image/jpeg" });
    setCropSrc(URL.createObjectURL(f));
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) openCropFor(f);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current.click()}
      className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-[#d8d8f0] bg-[#fafafd] transition hover:border-[#6c63ff] hover:bg-[#f5f4ff] overflow-hidden"
      style={{ minHeight: 100 }}
    >
      {preview ? (
        <>
          {isVideo ? (
            <div className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-[#6c63ff]/10 p-3">
                <Film size={20} className="text-[#6c63ff]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">
                  {typeof file === "string" ? "Current file" : file.name}
                </p>
                <p className="text-xs text-[#9a9abf]">Click to change</p>
              </div>
            </div>
          ) : (
            <>
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-cover max-h-40"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                <p className="text-xs font-semibold text-white">Change file</p>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-[#9a9abf] py-6">
          <div className="rounded-2xl bg-[#6c63ff]/10 p-3">
            <Upload size={20} className="text-[#6c63ff]" />
          </div>
          <p className="text-xs font-medium">{label}</p>
          <p className="text-[11px]">{hint}</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files[0];
          if (f) openCropFor(f);
          e.target.value = "";
        }}
      />

      {!isVideo && (
        <div onClick={(e) => e.stopPropagation()}>
          <ImageCropModal
            open={!!cropSrc}
            imageSrc={cropSrc}
            aspect={aspect}
            fileName={cropFileMeta?.name}
            mimeType={cropFileMeta?.type}
            onCancel={() => {
              setCropSrc(null);
              setCropFileMeta(null);
            }}
            onCropComplete={(croppedFile) => {
              onChange(croppedFile);
              setCropSrc(null);
              setCropFileMeta(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

function SectionBadge({ section }) {
  const meta = SECTION_META[section] || { label: section, color: "#9a9abf" };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: meta.color + "18", color: meta.color }}
    >
      {meta.icon && <meta.icon size={10} />}
      {meta.label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * Usage:
 *   <AnimatePresence>
 *     {isOpen && <MediaFormModal ... />}
 *   </AnimatePresence>
 *
 * The component handles its own backdrop + modal animation.
 * Wrap with <AnimatePresence> in the parent so exit animations play on unmount.
 */
export function MediaFormModal({ editData, onClose, onSave, loading }) {
  const [mediaFile, setMediaFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: editData?.title ?? "",
    description: editData?.description ?? "",
    section: editData?.section ?? "podcast",
    mediaUrl: editData?.mediaUrl ?? "",
    tag: editData?.tag ?? "",
    personName: editData?.personName ?? "",
    background: editData?.background ?? "",
    isActive: editData?.isActive ?? true,
    order: editData?.order ?? "",
  });

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const section = form.section;
  const isPodcast = section === "podcast";
  const isCelebrity = section === "celebrity";
  const isWishes = section === "wishes";

  const validate = () => {
    const e = {};
    if (!form.title || form.title.length < 2)
      e.title = "Title must be at least 2 characters";
    if (isWishes && !form.personName) e.personName = "Person name is required";
    if (isPodcast && !form.mediaUrl) e.mediaUrl = "YouTube URL is required";
    if (
      isPodcast &&
      form.mediaUrl &&
      !/^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\//.test(form.mediaUrl)
    )
      e.mediaUrl = "Only YouTube URLs are allowed";
    if (isCelebrity && !editData && !mediaFile)
      e.mediaFile = "Video file is required";
    if (isCelebrity && !editData && !thumbFile)
      e.thumbFile = "Thumbnail is required";
    if (isWishes && !editData && !mediaFile) e.mediaFile = "Image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) fd.append(k, v);
    });
    if (mediaFile) fd.append("media", mediaFile);
    if (thumbFile) fd.append("thumbnail", thumbFile);
    onSave(fd, editData?._id);
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(26,26,46,0.45)", backdropFilter: "blur(4px)" }}
      >
        {/* Modal panel — stop click propagation so backdrop click closes only */}
        <motion.div
          key="modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#f7f7fb] shadow-2xl"
        >
          {/* ── Header ── */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ebebf5] bg-white px-6 py-4 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#6c63ff]/10 p-2">
                <Film size={16} className="text-[#6c63ff]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1a1a2e]">
                  {editData ? "Edit Media" : "Add New Media"}
                </h2>
                <p className="text-[11px] text-[#9a9abf]">
                  {editData
                    ? "Update media details"
                    : "Upload or link media content"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="rounded-xl border border-[#e8e8f4] bg-white px-4 py-2 text-sm font-semibold text-[#9a9abf] cursor-pointer hover:text-red-500  transition"
              >
                Cancel
              </motion.button>

             
              <motion.button
                whileHover={{ translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2  hover:bg-gold bg-primary rounded-xl px-5 py-2 text-sm font-semibold text-white cursor-pointer shadow-lg shadow-[#6c63ff]/25 disabled:opacity-60 transition-all"
               
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                      style={{ display: "block" }}
                    />
                    Saving…
                  </>
                ) : editData ? (
                  "Update"
                ) : (
                  "Publish"
                )}
              </motion.button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="p-5 flex flex-col gap-4">
            {/* Section picker */}
            <Card title="Section">
              <div className="grid grid-cols-3 gap-3">
                {SECTIONS.map((s) => {
                  const meta = SECTION_META[s];
                  const active = form.section === s;
                  return (
                    <motion.button
                      key={s}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setForm((f) => ({ ...f, section: s }))}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition ${
                        active
                          ? "border-[#6c63ff] bg-[#f5f4ff]"
                          : "border-[#e8e8f4] bg-white hover:border-[#6c63ff]/40"
                      }`}
                    >
                      <div
                        className="rounded-xl p-2"
                        style={{ background: meta.color + "18" }}
                      >
                        <meta.icon size={18} style={{ color: meta.color }} />
                      </div>
                      <span className="text-xs font-semibold text-[#1a1a2e]">
                        {meta.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </Card>

            {/* Basic Info */}
            <Card title="Basic Info">
              <Field label="Title" icon={AlignLeft} error={errors.title}>
                <Input
                  value={form.title}
                  onChange={set("title")}
                  placeholder="Media title"
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={set("description")}
                  placeholder="Optional description…"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-[#e8e8f4] bg-white px-3.5 py-2.5 text-sm text-[#1a1a2e] placeholder-[#b0b0cc] outline-none transition focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                {(isWishes || isCelebrity) && (
                  <Field
                    label="Person Name"
                    icon={User}
                    error={errors.personName}
                  >
                    <Input
                      value={form.personName}
                      onChange={set("personName")}
                      placeholder="Name"
                    />
                  </Field>
                )}
                <Field label="Tag" icon={Tag}>
                  <Input
                    value={form.tag}
                    onChange={set("tag")}
                    placeholder="e.g. Actor, Student"
                  />
                </Field>
                <Field label="Order" icon={Hash}>
                  <Input
                    type="number"
                    value={form.order}
                    onChange={set("order")}
                    placeholder="Display order"
                  />
                </Field>
              </div>
              {isCelebrity && (
                <Field label="Background Color / CSS">
                  <Input
                    value={form.background}
                    onChange={set("background")}
                    placeholder="#f5f5f5 or any CSS value"
                  />
                </Field>
              )}
            </Card>

            {/* Media */}
            <Card title="Media">
              {isPodcast && (
                <Field label="YouTube URL" icon={Link} error={errors.mediaUrl}>
                  <Input
                    value={form.mediaUrl}
                    onChange={set("mediaUrl")}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </Field>
              )}
              {isCelebrity && (
                <>
                  <Field label="Video File" error={errors.mediaFile}>
                    <UploadZone
                      file={mediaFile || editData?.mediaUrl}
                      onChange={setMediaFile}
                      accept="video/*"
                      label="Drop video or click to upload"
                      hint="MP4, MOV, WEBM"
                    />
                  </Field>
                  <Field label="Thumbnail" error={errors.thumbFile}>
                    <UploadZone
                      file={thumbFile || editData?.thumbnail}
                      onChange={setThumbFile}
                      accept="image/*"
                      label="Drop thumbnail or click to upload"
                      hint="PNG, JPG, WEBP — 16:9 recommended"
                      aspect={16 / 9}
                    />
                  </Field>
                </>
              )}
              {isWishes && (
                <Field label="Image" error={errors.mediaFile}>
                  <UploadZone
                    file={mediaFile || editData?.mediaUrl}
                    onChange={setMediaFile}
                    accept="image/*"
                    label="Drop image or click to upload"
                    hint="PNG, JPG, WEBP"
                    aspect={16 / 9}
                  />
                </Field>
              )}
            </Card>

            {/* Settings */}
            <Card title="Settings">
              <div className="flex items-center justify-between rounded-2xl border border-[#e8e8f4] bg-[#fafafd] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e]">Active</p>
                  <p className="text-[11px] text-[#9a9abf]">
                    Show this media publicly
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, isActive: !f.isActive }))
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    form.isActive ? "bg-[#6c63ff]" : "bg-[#d8d8f0]"
                  }`}
                >
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm`}
                    style={{ left: form.isActive ? "auto" : "2px", right: form.isActive ? "2px" : "auto" }}
                  />
                </button>
              </div>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}