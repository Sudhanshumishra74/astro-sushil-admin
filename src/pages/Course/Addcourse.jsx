import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Upload,
  Link,
  BookOpen,
  Tag,
  User,
  Globe,
  BarChart2,
  DollarSign,
  Star,
  Zap,
  ChevronDown,
  Plus,
  ArrowLeft,
  Timer,
} from "lucide-react";
import { useCourseStore } from "../../store/useCourseStore";

const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const STATUSES = ["ACTIVE", "INACTIVE"];
const LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Japanese",
];
const CATEGORIES = [
  "Development",
  "Design",
  "Backend",
  "Data Science",
  "Marketing",
  "Business",
  "DevOps",
];

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

function TagInput({ tags, onChange }) {
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
          placeholder="Add tag and press Enter"
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

export default function AddCourse({ editData = null }) {
  const navigate = useNavigate();
  const { createCourse, updateCourse, loading } = useCourseStore();

  const [thumbnail, setThumbnail] = useState(editData?.thumbnail || null);
  const [tags, setTags] = useState(editData?.tags ?? []);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: editData?.title ?? "",
    shortDescription: editData?.shortDescription ?? "",
    category: editData?.category ?? "",
    instructorName: editData?.instructorName ?? "",
    language: editData?.language ?? "English",
    level: editData?.level ?? "BEGINNER",
    price: editData?.price ?? "",
    originalPrice: editData?.originalPrice ?? "",
    redirectUrl: editData?.redirectUrl ?? "",
    platformName: editData?.platformName ?? "",
    rating: editData?.rating ?? "",
    isFeatured: editData?.isFeatured ?? false,
    status: editData?.status ?? "ACTIVE",
    totalDurationMinutes: editData?.totalDurationMinutes ?? "",
     metaTitle: editData?.metaTitle ?? "",
  metaDescription: editData?.metaDescription ?? "",
  });

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const validate = () => {
    const e = {};
    if (!form.title || form.title.length < 2)
      e.title = "Title must be at least 2 characters";
    if (form.price === "" || form.price === null) e.price = "Price is required";
    if (!form.redirectUrl) e.redirectUrl = "Redirect URL is required";
    else {
      try {
        new URL(form.redirectUrl);
      } catch {
        e.redirectUrl = "Must be a valid URL";
      }
    }
    if (form.rating && (Number(form.rating) < 0 || Number(form.rating) > 5))
      e.rating = "Rating must be 0–5";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) fd.append(k, v);
    });
    tags.forEach((t) => fd.append("tags[]", t));
    if (thumbnail) fd.append("thumbnail", thumbnail);

    if (editData?._id) {
      await updateCourse(editData._id, fd);
    } else {
      await createCourse(fd);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7fb] px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl p-2 text-[#9a9abf] hover:bg-white hover:text-[#6c63ff] border border-transparent hover:border-[#e8e8f4] transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a2e]">
              {editData ? "Edit Course" : "Add New Course"}
            </h1>
            <p className="text-[12px] text-[#9a9abf] mt-0.5">
              {editData
                ? "Update course details below"
                : "Fill in the details to publish a new course"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
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
              "Update Course"
            ) : (
              "Publish Course"
            )}
          </button>
        </div>
      </div>

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* LEFT — main content (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Thumbnail */}
          <Card title="Thumbnail">
            <ThumbnailZone file={thumbnail} onChange={setThumbnail} />
          </Card>

        
          <Card title="Basic Info">
            <Field label="Course Title" icon={BookOpen} error={errors.title}>
              <Input
                value={form.title}
                onChange={set("title")}
                placeholder="e.g. React JS Mastery 2026"
              />
            </Field>

            <Field label="Short Description">
              <textarea
                value={form.shortDescription}
                onChange={set("shortDescription")}
                placeholder="A quick summary of what students will learn..."
                rows={3}
                className="w-full resize-none rounded-xl border border-[#e8e8f4] bg-white px-3.5 py-2.5 text-sm text-[#1a1a2e] placeholder-[#b0b0cc] outline-none transition focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <Select value={form.category} onChange={set("category")}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Instructor" icon={User}>
                <Input
                  value={form.instructorName}
                  onChange={set("instructorName")}
                  placeholder="Instructor name"
                />
              </Field>
            </div>

            <Field label="Tags" icon={Tag}>
              <TagInput tags={tags} onChange={setTags} />
            </Field>
          </Card>
<Card title="SEO Meta">
  <Field label="Meta Title">
    <Input
      value={form.metaTitle}
      onChange={set("metaTitle")}
      placeholder="SEO title (fallback: course title)"
    />
  </Field>

  <Field label="Meta Description">
    <textarea
      value={form.metaDescription}
      onChange={set("metaDescription")}
      rows={3}
      placeholder="SEO description (fallback: short description)"
      className="w-full resize-none rounded-xl border border-[#e8e8f4] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#6c63ff]"
    />
  </Field>
</Card>
          <Card title="Platform & Redirect">
            <Field label="Redirect URL" icon={Link} error={errors.redirectUrl}>
              <Input
                value={form.redirectUrl}
                onChange={set("redirectUrl")}
                placeholder="https://udemy.com/course/..."
              />
            </Field>
            <Field label="Platform Name">
              <Input
                value={form.platformName}
                onChange={set("platformName")}
                placeholder="e.g. Udemy, Coursera"
              />
            </Field>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Publish Settings">
            <Field label="Status" icon={Zap}>
              <Select value={form.status} onChange={set("status")}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>

            <div className="flex items-center justify-between rounded-2xl border border-[#e8e8f4] bg-[#fafafd] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">Featured</p>
                <p className="text-[11px] text-[#9a9abf]">Show on homepage</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, isFeatured: !f.isFeatured }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${form.isFeatured ? "bg-[#6c63ff]" : "bg-[#d8d8f0]"}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${form.isFeatured ? "translate-x-1" : "-translate-x-4"}`}
                />
              </button>
            </div>
          </Card>

          <Card title="Course Details">
            <Field label="Language" icon={Globe}>
              <Select value={form.language} onChange={set("language")}>
                {LANGUAGES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
            </Field>

            <Field label="Level" icon={BarChart2}>
              <Select value={form.level} onChange={set("level")}>
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
            </Field>

            <Field label="Rating (0–5)" icon={Star} error={errors.rating}>
              <Input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={set("rating")}
                placeholder="4.5"
              />
            </Field>
          </Card>

          <Card title="Pricing">
            <Field label="Duration" icon={Timer} error={errors.duration}>
              <Input
                type="number"
                min={0}
                value={form.totalDurationMinutes}
                onChange={set("totalDurationMinutes")}
                placeholder="Course duration in minutes"
              />
            </Field>
            <Field label="Price (₹)" icon={DollarSign} error={errors.price}>
              <Input
                type="number"
                min={0}
                value={form.price}
                onChange={set("price")}
                placeholder="0 for free"
              />
            </Field>

            <Field label="Original Price (₹)">
              <Input
                type="number"
                min={0}
                value={form.originalPrice}
                onChange={set("originalPrice")}
                placeholder="Strike-through price"
              />
            </Field>
          </Card>
        </div>
      </div>
    </div>
  );
}
