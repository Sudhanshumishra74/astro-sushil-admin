/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, Tag, FileText, Search,
  Globe, Hash, X, Plus, ChevronDown, User, Calendar,
} from "lucide-react";

import RichTextEditor from "../../components/common/Richtexteditor2";
import { useBlogStore } from "../../store/Useblogstore";

const STATUSES = ["draft", "published"];

/* ─── Primitives ─── */
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
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9abf]" />
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
          <span key={t} className="flex items-center gap-1 rounded-lg bg-[#6c63ff]/10 px-2.5 py-1 text-xs font-medium text-[#6c63ff]">
            {t}
            <button type="button" onClick={() => remove(t)} className="ml-0.5 hover:text-red-400"><X size={10} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-[#1a1a2e] placeholder-[#b0b0cc] outline-none"
        />
        <button type="button" onClick={add} className="rounded-lg bg-[#6c63ff]/10 px-2 py-1 text-[#6c63ff] hover:bg-[#6c63ff]/20 transition">
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

function ThumbnailZone({ file, onChange }) {
  const inputRef = useRef();
 const preview =
  file instanceof File
    ? URL.createObjectURL(file)
    : typeof file === "string"
    ? file
    : file?.url || null;
  const onDrop = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) onChange(f);
  }, [onChange]);

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current.click()}
      className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-[#d8d8f0] bg-[#fafafd] transition hover:border-[#6c63ff] hover:bg-[#f5f4ff] overflow-hidden"
      style={{ aspectRatio: "16/6" }}
    >
      {preview ? (
        <>
          <img src={preview} alt="thumbnail" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
            <p className="text-xs font-semibold text-white">Change thumbnail</p>
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-[#9a9abf]">
          <div className="rounded-2xl bg-[#6c63ff]/10 p-3"><Upload size={22} className="text-[#6c63ff]" /></div>
          <p className="text-xs font-medium">Drop image or click to upload</p>
          <p className="text-[11px]">PNG, JPG, WEBP — 16:9 recommended</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files[0])} />
    </div>
  );
}

function AvatarZone({ file, onChange }) {
  const inputRef = useRef();
  const preview = typeof file === "string" ? file : file ? URL.createObjectURL(file) : null;
  return (
    <div className="flex items-center gap-4">
      <div
        onClick={() => inputRef.current.click()}
        className="group relative cursor-pointer h-16 w-16 shrink-0 rounded-2xl border-2 border-dashed border-[#d8d8f0] bg-[#fafafd] overflow-hidden transition hover:border-[#6c63ff] hover:bg-[#f5f4ff]"
      >
        {preview ? (
          <>
            <img src={preview} alt="avatar" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
              <Upload size={14} className="text-white" />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <User size={20} className="text-[#c0b8d8]" />
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files[0])} />
      </div>
      <p className="text-xs text-[#9a9abf]">Click to upload author avatar<br />PNG, JPG, WEBP</p>
    </div>
  );
}

function Toggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#e8e8f4] bg-[#fafafd] px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-[#1a1a2e]">{label}</p>
        {description && <p className="text-[11px] text-[#9a9abf]">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-[#6c63ff]" : "bg-[#d8d8f0]"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-1" : "-translate-x-4"}`} />
      </button>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#ebebf5] bg-white p-6 flex flex-col gap-5 shadow-sm">
      {title && <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b0b0cc] border-b border-[#f0f0f8] pb-3">{title}</p>}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function AddBlog({ editData = null }) {
  const navigate = useNavigate();
  const { createBlog, updateBlog, loading } = useBlogStore();

  const [thumbnail, setThumbnail] = useState(editData?.thumbnail || null);
  const [authorAvatar, setAuthorAvatar] = useState(editData?.author?.avatar || null);
  const [tags, setTags] = useState(editData?.tags ?? []);
  const [seoKeywords, setSeoKeywords] = useState(editData?.seo?.keywords ?? []);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: editData?.title ?? "",
    slug: editData?.slug ?? "",
    shortDescription: editData?.shortDescription ?? "",
    content: editData?.content ?? "",
    category: editData?.category ?? "",
    status: editData?.status ?? "draft",
    isFeatured: editData?.isFeatured ?? false,
    publishedAt: editData?.publishedAt ?? "",
    // flattened author
    authorName: editData?.author?.name ?? "",
    // flattened seo
    seoMetaTitle: editData?.seo?.metaTitle ?? "",
    seoMetaDescription: editData?.seo?.metaDescription ?? "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setBool = (k) => (val) => setForm((f) => ({ ...f, [k]: val }));

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm((f) => ({ ...f, title, slug }));
  };

  const validate = () => {
    const e = {};
    if (!form.title || form.title.length < 3) e.title = "Title must be at least 3 characters";
    if (!form.slug || form.slug.length < 3) e.slug = "Slug must be at least 3 characters";
    if (!form.shortDescription || form.shortDescription.length < 10) e.shortDescription = "Short description must be at least 10 characters";
    if (!form.content || form.content === "<p></p>" || form.content.length < 20) e.content = "Content is required (min 20 chars)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const data = {
      title: form.title,
      slug: form.slug,
      shortDescription: form.shortDescription,
      content: form.content,
      category: form.category,
      status: form.status,
      isFeatured: form.isFeatured,
      publishedAt: form.publishedAt || undefined,
      tags,
      author: {
        name: form.authorName,
        avatar: authorAvatar instanceof File ? authorAvatar : undefined,
      },
      seo: {
        metaTitle: form.seoMetaTitle,
        metaDescription: form.seoMetaDescription,
        keywords: seoKeywords,
      },
      thumbnail: thumbnail instanceof File ? thumbnail : undefined,
    };
    if (editData?._id) {
      await updateBlog(editData._id, data);
    } else {
      await createBlog(data);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7fb] px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-xl p-2 text-[#9a9abf] hover:bg-white hover:text-[#6c63ff] border border-transparent hover:border-[#e8e8f4] transition">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a2e]">{editData ? "Edit Blog" : "Add New Blog"}</h1>
            <p className="text-[12px] text-[#9a9abf] mt-0.5">
              {editData ? "Update blog post details below" : "Fill in the details to publish a new blog post"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-xl border border-[#e8e8f4] bg-white px-5 py-2.5 text-sm font-semibold text-[#9a9abf] hover:text-[#6c63ff] hover:border-[#6c63ff]/30 transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6c63ff]/20 hover:-translate-y-0.5 hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving…</>
            ) : editData ? "Update Blog" : "Publish Blog"}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          <Card title="Thumbnail">
            <ThumbnailZone file={thumbnail} onChange={setThumbnail} />
          </Card>

          <Card title="Blog Content">
            <Field label="Title" icon={FileText} error={errors.title}>
              <Input value={form.title} onChange={handleTitleChange} placeholder="e.g. How to Read Your Birth Chart" />
            </Field>

            <Field label="Slug" icon={Hash} error={errors.slug}>
              <Input value={form.slug} onChange={set("slug")} placeholder="auto-generated-from-title" />
            </Field>

            <Field label="Short Description" error={errors.shortDescription}>
              <textarea
                value={form.shortDescription}
                onChange={set("shortDescription")}
                placeholder="Short summary shown in listings... (min 10 chars)"
                rows={2}
                className="w-full resize-none rounded-xl border border-[#e8e8f4] bg-white px-3.5 py-2.5 text-sm text-[#1a1a2e] placeholder-[#b0b0cc] outline-none transition focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10"
              />
            </Field>

            <Field label="Content" icon={FileText} error={errors.content}>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                placeholder="Write your blog post content here..."
                minHeight={300}
              />
            </Field>
          </Card>

          {/* Author */}
          <Card title="Author">
            <AvatarZone file={authorAvatar} onChange={setAuthorAvatar} />
            <Field label="Author Name" icon={User}>
              <Input value={form.authorName} onChange={set("authorName")} placeholder="e.g. Astro Samarth Team" />
            </Field>
          </Card>

          {/* SEO */}
          <Card title="SEO & Meta">
            <Field label="Meta Title" icon={Search}>
              <Input value={form.seoMetaTitle} onChange={set("seoMetaTitle")} placeholder="SEO title (defaults to blog title if empty)" />
            </Field>
            <Field label="Meta Description">
              <textarea
                value={form.seoMetaDescription}
                onChange={set("seoMetaDescription")}
                placeholder="Brief description for search engines..."
                rows={2}
                className="w-full resize-none rounded-xl border border-[#e8e8f4] bg-white px-3.5 py-2.5 text-sm text-[#1a1a2e] placeholder-[#b0b0cc] outline-none transition focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10"
              />
            </Field>
            <Field label="SEO Keywords" icon={Tag}>
              <TagInput tags={seoKeywords} onChange={setSeoKeywords} placeholder="Add SEO keyword and press Enter" />
            </Field>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5">
          <Card title="Publish Settings">
            <Field label="Status" icon={Globe}>
              <Select value={form.status} onChange={set("status")}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </Select>
            </Field>
            <Toggle label="Featured" description="Show on homepage" value={form.isFeatured} onChange={setBool("isFeatured")} />
            <Field label="Published At" icon={Calendar}>
              <Input type="datetime-local" value={form.publishedAt} onChange={set("publishedAt")} />
            </Field>
          </Card>

          <Card title="Details">
            <Field label="Category" icon={Globe}>
              <Input value={form.category} onChange={set("category")} placeholder="e.g. Astrology, Vastu" />
            </Field>
            <Field label="Tags" icon={Tag}>
              <TagInput tags={tags} onChange={setTags} placeholder="Add tag and press Enter" />
            </Field>
          </Card>
        </div>
      </div>
    </div>
  );
}