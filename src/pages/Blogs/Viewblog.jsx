/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit2, Trash2, FileText, Tag,
  Globe, Hash, Eye, CheckCircle2, XCircle, Calendar, User,
} from "lucide-react";
import { useBlogStore } from "../../store/Useblogstore";


function Card({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-[#ebebf5] bg-white p-6 flex flex-col gap-5 shadow-sm ${className}`}>
      {title && <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#b0b0cc] border-b border-[#f0f0f8] pb-3">{title}</p>}
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5f4ff]">
        <Icon size={13} className="text-[#6c63ff]" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0cc]">{label}</span>
        <span className="text-sm font-medium text-[#1a1a2e] wrap-break-word">{value}</span>
      </div>
    </div>
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

function StatusBadge({ status }) {
  const styles = {
    published: "bg-emerald-50 text-emerald-600 border-emerald-200",
    draft: "bg-amber-50 text-amber-600 border-amber-200",
    archived: "bg-[#f5f5f8] text-[#9a9abf] border-[#e8e8f4]",
  };
  return (
    <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
}

export default function ViewBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blog, fetchBlogById, deleteBlog, resetBlog, loading } = useBlogStore();

  useEffect(() => {
    fetchBlogById(id);
    return () => resetBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    await deleteBlog(id);
    navigate(-1);
  };

  if (loading || !blog) {
    return (
      <div className="min-h-screen bg-[#f7f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 rounded-full border-[3px] border-[#6c63ff]/20 border-t-[#6c63ff] animate-spin" />
          <p className="text-sm text-[#9a9abf] font-medium">Loading blog…</p>
        </div>
      </div>
    );
  }

  const b = blog;

  return (
    <div className="min-h-screen bg-[#f7f7fb] px-4 py-8 md:px-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-xl p-2 text-[#9a9abf] hover:bg-white hover:text-[#6c63ff] border border-transparent hover:border-[#e8e8f4] transition">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a2e]">Blog Details</h1>
            <p className="text-[12px] text-[#9a9abf] mt-0.5">View full blog post information</p>
          </div>
        </div>
       
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Thumbnail */}
          {b.thumbnail && (
            <Card title="Thumbnail">
              <div className="rounded-2xl overflow-hidden border border-[#e8e8f4]" style={{ aspectRatio: "16/6" }}>
                <img src={b.thumbnail?.url} alt={b.title} className="h-full w-full object-cover" />
              </div>
            </Card>
          )}

          {/* Content */}
          <Card title="Blog Content">
            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e] leading-snug">{b.title}</h2>
              {b.slug && (
                <p className="mt-1 text-xs font-mono text-[#9a9abf] flex items-center gap-1">
                  <Hash size={10} /> {b.slug}
                </p>
              )}
            </div>

            {b.excerpt && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0cc] mb-1.5">Excerpt</p>
                <p className="text-sm text-[#7c7ca0] leading-relaxed">{b.excerpt}</p>
              </div>
            )}

            {b.content && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0cc] mb-2">Content</p>
                <div
                  className="prose prose-sm max-w-none text-[#1a1a2e] text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold [&_ul]:pl-5 [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#6c63ff] [&_blockquote]:pl-3 [&_blockquote]:text-[#7c7ca0] [&_blockquote]:italic"
                  dangerouslySetInnerHTML={{ __html: b.content }}
                />
              </div>
            )}
          </Card>

          {/* SEO */}
          {(b.metaTitle || b.metaDescription) && (
            <Card title="SEO & Meta">
              <InfoRow icon={FileText} label="Meta Title" value={b.metaTitle} />
              <InfoRow icon={FileText} label="Meta Description" value={b.metaDescription} />
            </Card>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5">

          {/* Status */}
          <Card title="Status">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7c7ca0]">Status</span>
                <StatusBadge status={b.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7c7ca0]">Featured</span>
                <StatusPill active={b.isFeatured} labelOn="Yes" labelOff="No" />
              </div>
            </div>
          </Card>

          {/* Details */}
          <Card title="Details">
            <InfoRow icon={User} label="Author" value={b.author?.name} />
            <InfoRow icon={Globe} label="Category" value={b.category} />
            {b.tags?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b0b0cc] mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {b.tags.map((t) => (
                    <span key={t} className="flex items-center gap-1 rounded-lg bg-[#f5f4ff] px-2.5 py-1 text-xs font-medium text-[#6c63ff]">
                      <Tag size={9} /> {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {b.createdAt && (
              <InfoRow
                icon={Calendar}
                label="Created At"
                value={new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              />
            )}
            {b.updatedAt && (
              <InfoRow
                icon={Edit2}
                label="Last Updated"
                value={new Date(b.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              />
            )}
          </Card>

         
        </div>
      </div>
    </div>
  );
}