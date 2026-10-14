/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Package,
  Tag,
  Globe,
  BarChart2,
  DollarSign,
  Star,
  Zap,
  Hash,
  Layers,
  Box,
  Ruler,
  FileText,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Eye,
  ChevronLeft,
  ChevronRight,
  Percent,
} from "lucide-react";
import { useProductStore } from "../../store/useProductStore";

/* ─── Primitives ─── */
function Card({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-[#ebebf5] bg-white p-6 flex flex-col gap-5 shadow-sm ${className}`}>
      {title && (
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b0b0cc] border-b border-[#f0f0f8] pb-3">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, valueClass = "" }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5f4ff]">
        <Icon size={13} className="text-[#6c63ff]" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#b0b0cc]">{label}</span>
        <span className={`text-sm font-medium text-[#1a1a2e] wrap-break-word ${valueClass}`}>{value}</span>
      </div>
    </div>
  );
}

function Badge({ children, color = "purple" }) {
  const styles = {
    purple: "bg-[#6c63ff]/10 text-[#6c63ff]",
    green:  "bg-emerald-50 text-emerald-600",
    red:    "bg-red-50 text-red-500",
    amber:  "bg-amber-50 text-amber-600",
    blue:   "bg-blue-50 text-blue-600",
  };
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${styles[color]}`}>
      {children}
    </span>
  );
}

function StatusPill({ active, labelOn, labelOff }) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
      <CheckCircle2 size={11} /> {labelOn}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f5f8] px-2.5 py-1 text-xs font-semibold text-[#b0b0cc]">
      <XCircle size={11} /> {labelOff}
    </span>
  );
}

/* ─── Image Gallery ─── */
function ImageGallery({ thumbnail, images = [] }) {
  const all = [thumbnail, ...images].filter(Boolean);
  const [active, setActive] = useState(0);

  if (all.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-[#f5f4ff] border border-[#e8e8f4]">
        <div className="flex flex-col items-center gap-2 text-[#b0b0cc]">
          <Package size={32} className="text-[#d8d8f0]" />
          <p className="text-xs">No images uploaded</p>
        </div>
      </div>
    );
  }

  const prev = () => setActive((i) => (i - 1 + all.length) % all.length);
  const next = () => setActive((i) => (i + 1) % all.length);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-[#fafafd] border border-[#e8e8f4] group" style={{ aspectRatio: "16/9" }}>
        <img
          src={all[active]}
          alt="product"
          className="h-full w-full object-contain"
        />
        {all.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 shadow flex items-center justify-center text-[#6c63ff] opacity-0 group-hover:opacity-100 transition hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 shadow flex items-center justify-center text-[#6c63ff] opacity-0 group-hover:opacity-100 transition hover:bg-white"
            >
              <ChevronRight size={16} />
            </button>
            <span className="absolute bottom-2 right-2 rounded-lg bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-white">
              {active + 1} / {all.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {all.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {all.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-14 w-14 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                i === active ? "border-[#6c63ff]" : "border-[#e8e8f4] hover:border-[#6c63ff]/40"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Stars ─── */
function StarRating({ value }) {
  const num = parseFloat(value) || 0;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            className={s <= Math.round(num) ? "fill-amber-400 text-amber-400" : "text-[#e8e8f4]"}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-[#1a1a2e]">{num.toFixed(1)}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, fetchProductById, deleteProduct, resetProduct, loading } = useProductStore();

  useEffect(() => {
    fetchProductById(id);
    return () => resetProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await deleteProduct(id);
    navigate(-1);
  };

  /* ── Loading ── */
  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#f7f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 rounded-full border-[3px] border-[#6c63ff]/20 border-t-[#6c63ff] animate-spin" />
          <p className="text-sm text-[#9a9abf] font-medium">Loading product…</p>
        </div>
      </div>
    );
  }

  const p = product;

  /* Computed final price */
  const finalPrice = (() => {
    const orig = parseFloat(p.originalPrice);
    const disc = parseFloat(p.discountValue);
    if (!orig) return null;
    if (!disc) return orig;
    if (p.discountType === "percentage") return Math.round(orig - (orig * disc) / 100);
    return Math.max(0, orig - disc);
  })();

  const saving = finalPrice !== null ? parseFloat(p.originalPrice) - finalPrice : 0;

  return (
    <div className="min-h-screen bg-[#f7f7fb] px-4 py-8 md:px-8">

      {/* ── Header ── */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl p-2 text-[#9a9abf] hover:bg-white hover:text-[#6c63ff] border border-transparent hover:border-[#e8e8f4] transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a2e]">Product Details</h1>
            <p className="text-[12px] text-[#9a9abf] mt-0.5">View full product information</p>
          </div>
        </div>

      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* LEFT — 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Images */}
          <Card title="Images">
            <ImageGallery thumbnail={p.thumbnail} images={p.images} />
          </Card>

          {/* Basic Info */}
          <Card title="Basic Info">
            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e] leading-snug">{p.name}</h2>
              {p.shortDescription && (
                <p className="mt-1.5 text-sm text-[#7c7ca0] leading-relaxed">{p.shortDescription}</p>
              )}
            </div>

            {p.description && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0cc] mb-2">Full Description</p>
                <div
                  className="prose prose-sm max-w-none text-[#1a1a2e] text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold [&_ul]:pl-5 [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#6c63ff] [&_blockquote]:pl-3 [&_blockquote]:text-[#7c7ca0] [&_blockquote]:italic"
                  dangerouslySetInnerHTML={{ __html: p.description }}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-1">
              <InfoRow icon={Globe} label="Type" value={p.type?.charAt(0).toUpperCase() + p.type?.slice(1)} />
              <InfoRow icon={Layers} label="Category" value={p.category?.name || p.category} />
              <InfoRow icon={Hash} label="SKU" value={p.sku} />
              <InfoRow icon={Box} label="Stock" value={p.stock !== undefined ? `${p.stock} units` : null} />
            </div>

            {/* Keywords */}
            {p.keywords?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0cc] mb-2">Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.keywords.map((k) => (
                    <span key={k} className="flex items-center gap-1 rounded-lg bg-[#f5f4ff] px-2.5 py-1 text-xs font-medium text-[#6c63ff]">
                      <Tag size={9} /> {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Variants */}
          {p.variants?.length > 0 && (
            <Card title="Variants">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#f0f0f8]">
                      {["Name", "Value", "Price (₹)", "Stock"].map((h) => (
                        <th key={h} className="pb-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#b0b0cc]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {p.variants.map((v, i) => (
                      <tr key={i} className="border-b border-[#f9f9fc] last:border-0">
                        <td className="py-2.5 font-medium text-[#1a1a2e]">{v.name || "—"}</td>
                        <td className="py-2.5 text-[#7c7ca0]">{v.value || "—"}</td>
                        <td className="py-2.5 text-[#1a1a2e]">{v.price ? `₹${parseFloat(v.price).toLocaleString("en-IN")}` : "—"}</td>
                        <td className="py-2.5 text-[#7c7ca0]">{v.stock ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Shipping */}
          {p.type === "physical" && (p.weight || p.dimensions?.length) && (
            <Card title="Shipping & Dimensions">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={BarChart2} label="Weight" value={p.weight ? `${p.weight} g` : null} />
                {(p.dimensions?.length || p.dimensions?.width || p.dimensions?.height) && (
                  <InfoRow
                    icon={Ruler}
                    label="Dimensions (L×W×H)"
                    value={`${p.dimensions.length || 0} × ${p.dimensions.width || 0} × ${p.dimensions.height || 0} cm`}
                  />
                )}
              </div>
            </Card>
          )}

          {/* SEO */}
          {(p.metaTitle || p.metaDescription) && (
            <Card title="SEO & Meta">
              <InfoRow icon={FileText} label="Meta Title" value={p.metaTitle} />
              <InfoRow icon={FileText} label="Meta Description" value={p.metaDescription} />
            </Card>
          )}
        </div>

        {/* RIGHT sidebar */}
        <div className="flex flex-col gap-5">

          {/* Status badges */}
          <Card title="Status">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7c7ca0]">Published</span>
                <StatusPill active={p.isPublished} labelOn="Live" labelOff="Draft" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7c7ca0]">Featured</span>
                <StatusPill active={p.isFeatured} labelOn="Yes" labelOff="No" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7c7ca0]">Trending</span>
                <StatusPill active={p.isTrending} labelOn="Yes" labelOff="No" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7c7ca0]">Best Seller</span>
                <StatusPill active={p.isBestSeller} labelOn="Yes" labelOff="No" />
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card title="Pricing">
            {finalPrice !== null && (
              <div className="rounded-xl bg-[#f5f4ff] border border-[#6c63ff]/20 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9a9abf] mb-1">Final Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#6c63ff]">
                    ₹{finalPrice.toLocaleString("en-IN")}
                  </span>
                  {saving > 0 && (
                    <span className="text-sm text-[#b0b0cc] line-through">
                      ₹{parseFloat(p.originalPrice).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                {saving > 0 && (
                  <p className="text-[11px] text-emerald-500 mt-0.5 font-medium">
                    Saving ₹{saving.toLocaleString("en-IN")}
                    {p.discountType === "percentage" ? ` (${p.discountValue}% off)` : " off"}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-1">
              <InfoRow icon={DollarSign} label="Original Price" value={p.originalPrice ? `₹${parseFloat(p.originalPrice).toLocaleString("en-IN")}` : null} />
              {p.discountValue && (
                <InfoRow
                  icon={Percent}
                  label="Discount"
                  value={p.discountType === "percentage" ? `${p.discountValue}%` : `₹${p.discountValue}`}
                />
              )}
            </div>
          </Card>

          {/* Product Details */}
          <Card title="Product Details">
            {p.rating !== undefined && p.rating !== "" && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0cc]">Rating</p>
                <StarRating value={p.rating} />
              </div>
            )}
            {p.createdAt && (
              <InfoRow
                icon={Eye}
                label="Created At"
                value={new Date(p.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              />
            )}
            {p.updatedAt && (
              <InfoRow
                icon={Edit2}
                label="Last Updated"
                value={new Date(p.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              />
            )}
          </Card>

          {/* Quick actions */}
          
        </div>
      </div>
    </div>
  );
}