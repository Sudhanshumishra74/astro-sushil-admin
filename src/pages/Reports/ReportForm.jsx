/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReportStore } from "../../store/useReportStore";
import {
  Info, Image, CircleDollarSign, List, Settings,
  ChevronsLeft, Check, Upload, X, Plus, Tag,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const cx = (...classes) => classes.filter(Boolean).join(" ");

function slugify(str) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function deriveTitle(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const slice = words.slice(0, 4).join(" ");
  return slice.charAt(0).toUpperCase() + slice.slice(1).replace(/[,;:]+$/, "");
}

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Report name is required.";
  if (!form.slug.trim()) errors.slug = "Slug is required.";
  if (!form.description.trim()) errors.description = "Full description is required.";
  if (!form.originalPrice || Number(form.originalPrice) < 0)
    errors.originalPrice = "Enter a valid original price.";
  if (!form.salePrice || Number(form.salePrice) < 0)
    errors.salePrice = "Enter a valid sale price.";
  if (Number(form.salePrice) > Number(form.originalPrice))
    errors.salePrice = "Sale price cannot exceed original price.";
  if (!form.coverImage && !form._hasExistingCover)
    errors.coverImage = "Cover image is required.";
  return errors;
}

const defaultForm = {
  name: "", slug: "", shortDescription: "", description: "",
  originalPrice: "", salePrice: "",
  isActive: true, isPremium: false,
  gst: { enabled: true, rate: 0, type: "exclusive" },
  benefits: [], features: [],
  coverImage: null,
  _hasExistingCover: false,
};

// ─── Base UI Components ───────────────────────────────────────────────────────

const baseInput =
  "w-full px-4 py-2.5 rounded-xl border bg-white text-[#1a1a2e] text-sm placeholder:text-[#aaaabc] focus:outline-none focus:ring-2 transition-all";

const inputBorder = (error) =>
  error
    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
    : "border-primary/15 focus:ring-primary/25 focus:border-primary/40";

function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-primary mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ msg }) {
  return msg ? <p className="text-xs text-red-500 mt-1.5">{msg}</p> : null;
}

function Input({ className = "", error, ...props }) {
  return (
    <input {...props} className={cx(baseInput, inputBorder(error), className)} />
  );
}

function Textarea({ className = "", error, ...props }) {
  return (
    <textarea {...props} className={cx(baseInput, "resize-none", inputBorder(error), className)} />
  );
}

function Select({ className = "", error, ...props }) {
  return (
    <select {...props} className={cx(baseInput, inputBorder(error), className)} />
  );
}

const GST_RATE_OPTIONS = [0, 5, 12, 18, 28];

// Client-side preview only — the server recomputes and stores the
// authoritative priceWithGst on save.
const previewPriceWithGst = (price, gst) => {
  const p = Number(price) || 0;
  const rate = gst?.enabled ? Number(gst.rate) || 0 : 0;
  if (!rate || gst?.type === "inclusive") return p;
  return Math.round((p + (p * rate) / 100) * 100) / 100;
};

function Toggle({ checked, onChange, label, sublabel }) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl border border-primary/10 bg-white cursor-pointer hover:bg-secondary/60 transition-colors"
      onClick={() => onChange(!checked)}
    >
      <div>
        <p className="text-sm font-semibold text-[#1a1a2e]">{label}</p>
        {sublabel && <p className="text-xs text-[#888899] mt-0.5">{sublabel}</p>}
      </div>
      <div className={cx("relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0", checked ? "bg-primary" : "bg-gray-200")}>
        <span className={cx("absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200", checked ? "translate-x-5" : "translate-x-0")} />
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-primary/8 bg-primary/2">
        <span className="text-primary/60">{icon}</span>
        <h2 className="font-heading text-sm font-semibold text-[#1a1a2e] tracking-wide uppercase">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// ─── Smart List Field ─────────────────────────────────────────────────────────

function SmartListField({ label, items, onChange, placeholder, showTitleInput = false }) {
  const [draftDesc, setDraftDesc] = useState("");
  const [draftTitle, setDraftTitle] = useState("");

  const makeItem = (desc, title = "") => ({
    description: desc.trim(),
    title: title.trim() || deriveTitle(desc),
    _titleManual: Boolean(title.trim()),
  });

  const commit = (desc, title = "") => {
    const lines = desc.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return;
    const newItems = lines.map((line, i) => makeItem(line, i === 0 ? title : ""));
    onChange([...items, ...newItems]);
    setDraftDesc("");
    setDraftTitle("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commit(draftDesc, draftTitle);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted.includes("\n")) {
      e.preventDefault();
      commit(draftDesc + "\n" + pasted, draftTitle);
    }
  };

  const updateItem = (i, patch) =>
    onChange(items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));

  const handleDescChange = (i, val) =>
    updateItem(i, {
      description: val,
      title: items[i]._titleManual ? items[i].title : deriveTitle(val),
    });

  const handleTitleChange = (i, val) =>
    updateItem(i, { title: val, _titleManual: true });

  const handleRemove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <Label>{label}</Label>

      {items.length > 0 && (
        <ul className="space-y-3 mb-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 group">
              <span className="mt-3 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                {showTitleInput ? (
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-primary/40 shrink-0" />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleTitleChange(i, e.target.value)}
                      placeholder="Title"
                      className="flex-1 px-2 py-0.5 rounded-lg border border-primary/10 bg-primary/2 text-[10px] font-semibold text-primary/70 placeholder:text-primary/25 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                ) : (
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-primary/50 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full truncate max-w-50">
                    {item.title || "—"}
                  </span>
                )}
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleDescChange(i, e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-primary/10 bg-white text-[#1a1a2e] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="mt-6 p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2">
        {showTitleInput && (
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-primary/40 shrink-0" />
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Title (optional — auto-generated if blank)"
              className="flex-1 px-3 py-1.5 rounded-lg border border-primary/15 bg-white text-xs text-[#1a1a2e] placeholder:text-[#aaaabc] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>
        )}
        <div className="relative">
          <textarea
            rows={2}
            value={draftDesc}
            onChange={(e) => setDraftDesc(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 pr-28 rounded-xl border border-dashed border-primary/25 bg-primary/2 text-[#1a1a2e] text-sm placeholder:text-[#aaaabc] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/35 transition-all resize-none"
          />
          <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5">
            <span className="text-[10px] text-[#aaaabc] hidden sm:block">Enter ↵</span>
            <button
              type="button"
              onClick={() => commit(draftDesc, draftTitle)}
              disabled={!draftDesc.trim()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-white text-[11px] font-semibold disabled:opacity-30 hover:bg-primary/80 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-[#aaaabc] mt-1.5">
        {showTitleInput
          ? "Add an optional title, then type the description and press Enter."
          : "Type and press Enter, or paste multiple lines. Title is auto-generated."}
      </p>
    </div>
  );
}

// ─── Cover Upload ─────────────────────────────────────────────────────────────

function CoverUpload({ preview, onChange, error }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) onChange(file);
  };

  return (
    <div>
      <div
        className={cx(
          "relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors bg-white",
          error ? "border-red-300 hover:border-red-400" : "border-primary/20 hover:border-primary/40",
        )}
        style={{ minHeight: 160 }}
        onClick={() => inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Cover preview" className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-lg">Click to change</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-secondary border border-primary/15 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5 text-primary/40" />
            </div>
            <p className="text-sm font-semibold text-[#1a1a2e]">Upload cover image</p>
            <p className="text-xs text-[#888899] mt-1">Drag & drop or click to browse</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => e.target.files[0] && onChange(e.target.files[0])} />
      </div>
      <FieldError msg={error} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReportForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { report, loading, fetchReportById, createReport, updateReport, clearReport } = useReportStore();

  const [form, setForm] = useState(defaultForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [slugManual, setSlugManual] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) fetchReportById(id);
    return () => clearReport();
  }, [id]);

  useEffect(() => {
    if (isEdit && report) {
      setForm({
        name: report.name || "",
        slug: report.slug || "",
        shortDescription: report.shortDescription || "",
        description: report.description || "",
        originalPrice: report.originalPrice || "",
        salePrice: report.salePrice || "",
        isActive: report.isActive ?? true,
        isPremium: report.isPremium ?? false,
        gst: {
          enabled: report.gst?.enabled ?? true,
          rate: report.gst?.rate ?? 0,
          type: report.gst?.type ?? "exclusive",
        },
        benefits: Array.isArray(report.benefits) ? report.benefits : [],
        features: Array.isArray(report.features) ? report.features : [],
        coverImage: null,
        _hasExistingCover: Boolean(report.coverImage),
      });
      if (report.coverImage) setImagePreview(report.coverImage);
      setSlugManual(true);
    }
  }, [report]);

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setGst = (key, val) =>
    setForm((prev) => ({ ...prev, gst: { ...prev.gst, [key]: val } }));

  const handleNameChange = (val) => {
    if (!slugManual) {
      setForm((prev) => ({ ...prev, name: val, slug: slugify(val) }));
    } else {
      set("name", val);
    }
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({ ...prev, coverImage: file, _hasExistingCover: true }));
    setImagePreview(URL.createObjectURL(file));
    if (errors.coverImage) setErrors((prev) => ({ ...prev, coverImage: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const fd = new FormData();
    const { _hasExistingCover, ...payload } = form;

    Object.entries(payload).forEach(([key, val]) => {
      if (key === "coverImage") {
        if (val) fd.append(key, val);
      } else if (key === "benefits" || key === "features") {
        // Strip internal _titleManual flag before sending
        const clean = val
          .filter((b) => b.description?.trim())
          .map(({  ...rest }) => rest);
        fd.append(key, JSON.stringify(clean));
      } else if (key === "gst") {
        fd.append(key, JSON.stringify(val));
      } else {
        fd.append(key, val);
      }
    });

    const ok = isEdit ? await updateReport(id, fd) : await createReport(fd);
    if (ok) navigate("/pdfreports");
  };

  const discount =
    form.originalPrice && form.salePrice && Number(form.originalPrice) > 0
      ? Math.round(((Number(form.originalPrice) - Number(form.salePrice)) / Number(form.originalPrice)) * 100)
      : null;

  const hasErrors = Object.keys(errors).length > 0;

  // Report creation/editing is dev-only — block the page even on a direct
  // URL hit in production, not just the entry points in ReportList.
  if (!import.meta.env.DEV) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h1 className="font-heading text-xl text-[#1a1a2e] mb-2">Not available</h1>
          <p className="text-sm text-[#888899] mb-6">
            Creating and editing reports is only available in the development environment.
          </p>
          <button onClick={() => navigate("/pdfreports")}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-[#3b3f63] transition-colors">
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/pdfreports")}
            className="p-2 rounded-xl bg-white border border-primary/15 hover:bg-secondary text-primary transition-colors">
            <ChevronsLeft size={16} />
          </button>
          <div>
            <h1 className="font-heading text-xl text-[#1a1a2e]">{isEdit ? "Edit Report" : "Add Report"}</h1>
            <p className="text-xs text-[#888899] mt-0.5">
              {isEdit ? "Update the report details below" : "Fill in the details to create a new report"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/pdfreports")}
            className="px-5 py-2.5 rounded-xl border border-primary/20 text-primary text-sm font-medium hover:bg-white transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium tracking-wide hover:bg-[#3b3f63] transition-colors shadow-sm disabled:opacity-60">
            {loading
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Check className="w-4 h-4" />}
            {isEdit ? "Save Changes" : "Create Report"}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {hasErrors && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Please fix the following before submitting:</p>
            <ul className="mt-1 space-y-0.5">
              {Object.values(errors).map((msg, i) => (
                <li key={i} className="text-xs text-red-600">• {msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isEdit && loading && !report ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <Section title="Basic Information" icon={<Info className="w-4 h-4" strokeWidth={1.8} />}>
              <div id="field-name">
                <Label required>Report Name</Label>
                <Input value={form.name} error={errors.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Premium Personalised Kundli Report" />
                <FieldError msg={errors.name} />
              </div>

              <div id="field-slug">
                <Label required>Slug</Label>
                <div className="relative">
                  <Input value={form.slug} error={errors.slug}
                    onChange={(e) => { setSlugManual(true); set("slug", slugify(e.target.value)); }}
                    placeholder="auto-generated-from-name"
                    className="font-mono text-xs pr-16" />
                  {!slugManual && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-primary/40 uppercase tracking-wide">
                      Auto
                    </span>
                  )}
                </div>
                <FieldError msg={errors.slug} />
              </div>

              <div>
                <Label>Short Description</Label>
                <Input value={form.shortDescription}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  placeholder="Brief one-liner shown in listing" />
              </div>

              <div id="field-description">
                <Label required>Full Description</Label>
                <Textarea rows={5} value={form.description} error={errors.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Detailed description of the report..." />
                <FieldError msg={errors.description} />
              </div>
            </Section>

            <Section title="Pricing" icon={<CircleDollarSign className="w-4 h-4" strokeWidth={1.8} />}>
              <div className="grid grid-cols-2 gap-4">
                <div id="field-originalPrice">
                  <Label required>Original Price (₹)</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#888899] font-semibold">₹</span>
                    <Input type="number" min="0" value={form.originalPrice} error={errors.originalPrice}
                      onChange={(e) => set("originalPrice", e.target.value)}
                      placeholder="0" className="pl-8" />
                  </div>
                  <FieldError msg={errors.originalPrice} />
                </div>
                <div id="field-salePrice">
                  <Label required>Sale Price (₹)</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gold font-semibold">₹</span>
                    <Input type="number" min="0" value={form.salePrice} error={errors.salePrice}
                      onChange={(e) => set("salePrice", e.target.value)}
                      placeholder="0" className="pl-8 text-gold" />
                  </div>
                  <FieldError msg={errors.salePrice} />
                </div>
              </div>

              {discount !== null && discount >= 0 && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <CircleDollarSign className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">{discount}% discount applied</p>
                    <p className="text-xs text-emerald-600">
                      Saving ₹{(Number(form.originalPrice) - Number(form.salePrice)).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </Section>

            <Section title="Benefits & Features" icon={<List className="w-4 h-4" strokeWidth={1.8} />}>
              <SmartListField label="Benefits" items={form.benefits}
                onChange={(val) => set("benefits", val)}
                placeholder="e.g. Comprehensive market analysis covering 15 sectors"
                showTitleInput={false} />
              <div className="border-t border-primary/8 pt-5">
                <SmartListField label="Features" items={form.features}
                  onChange={(val) => set("features", val)}
                  placeholder="e.g. 150+ pages of in-depth research and data"
                  showTitleInput={true} />
              </div>
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Section title="Cover Image" icon={<Image className="w-4 h-4" strokeWidth={1.8} />}>
              <div id="field-coverImage">
                <CoverUpload preview={imagePreview} onChange={handleImageChange} error={errors.coverImage} />
              </div>
            </Section>

            <Section title="Settings" icon={<Settings className="w-4 h-4" strokeWidth={1.8} />}>
              <Toggle checked={form.isActive} onChange={(val) => set("isActive", val)}
                label="Active" sublabel="Visible to users on the platform" />
              <Toggle checked={form.isPremium} onChange={(val) => set("isPremium", val)}
                label="Premium" sublabel="Requires subscription to access" />
              <Toggle checked={form.gst.enabled} onChange={(val) => setGst("enabled", val)}
                label="Apply GST" sublabel="Turn off if this report is tax-exempt" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>GST Rate (%)</Label>
                  <Select value={form.gst.rate} onChange={(e) => setGst("rate", Number(e.target.value))}>
                    {GST_RATE_OPTIONS.map((rate) => (
                      <option key={rate} value={rate}>{rate}%</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>GST Type</Label>
                  <Select value={form.gst.type} onChange={(e) => setGst("type", e.target.value)}>
                    <option value="exclusive">Exclusive (added on top)</option>
                    <option value="inclusive">Inclusive (already in price)</option>
                  </Select>
                </div>
              </div>
              <div className="rounded-xl border border-primary/10 bg-primary/2 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary/50 mb-1">
                  Customer will be charged
                </p>
                <p className="text-lg font-bold text-[#1a1a2e]">
                  ₹{previewPriceWithGst(form.salePrice, form.gst).toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-[#888899] mt-0.5">Estimate — server computes the final value on save.</p>
              </div>
            </Section>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm p-5">
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wide text-primary mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#888899]">Name</span>
                  <span className="text-[#1a1a2e] font-medium text-right max-w-35 truncate">{form.name || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888899]">Price</span>
                  <span className="text-gold font-bold">{form.salePrice ? `₹${form.salePrice}` : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888899]">Status</span>
                  <span className={cx("px-2 py-0.5 rounded-full text-xs font-medium", form.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600")}>
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888899]">Tier</span>
                  <span className={cx("px-2 py-0.5 rounded-full text-xs font-medium", form.isPremium ? "bg-gold/10 text-gold" : "bg-gray-100 text-gray-500")}>
                    {form.isPremium ? "✦ Premium" : "Free"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888899]">Benefits</span>
                  <span className="text-[#1a1a2e] font-medium">{form.benefits.filter((b) => b.description?.trim()).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888899]">Features</span>
                  <span className="text-[#1a1a2e] font-medium">{form.features.filter((f) => f.description?.trim()).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}