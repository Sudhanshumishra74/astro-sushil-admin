/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Film,
  Image,
  Star,
  Search,
  LayoutGrid,
  List,
  Mic,
} from "lucide-react";
import DeleteDialog from "./Deletedialog";
import { MediaFormModal } from "./MediaFormModal";
import { useMediaStore } from "../../store/useMediaStore";


const SECTIONS = ["podcast", "celebrity", "wishes"];
const SECTION_META = {
  podcast: { label: "Podcast", icon: Mic, color: "#6c63ff" },
  celebrity: { label: "Celebrity", icon: Star, color: "#f59e0b" },
  wishes: { label: "Wishes", icon: Image, color: "#10b981" },
};

function MediaCard({ item, onEdit, onDelete, viewMode }) {
  const isVideo = item.type === "video";

  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-[#ebebf5] bg-white px-4 py-3 shadow-sm hover:border-[#6c63ff]/30 transition group">
        <div className="relative h-12 w-20 shrink-0 rounded-xl overflow-hidden bg-[#f0f0f8]">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {isVideo ? <Film size={16} className="text-[#b0b0cc]" /> : <Image size={16} className="text-[#b0b0cc]" />}
            </div>
          )}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-black/50 p-1">
                <Film size={10} className="text-white" />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[#1a1a2e] truncate">{item.title}</p>
            <SectionBadge section={item.section} />
          </div>
          {item.personName && <p className="text-xs text-[#9a9abf] truncate">{item.personName}</p>}
        </div>

        <div className="text-[11px] text-[#b0b0cc] font-mono w-8 text-center">#{item.order ?? "—"}</div>

        <div className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${item.isActive ? "bg-emerald-50 text-emerald-600" : "bg-[#f5f5fd] text-[#b0b0cc]"}`}>
          {item.isActive ? "Active" : "Inactive"}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
         
          <button onClick={() => onEdit(item)} className="rounded-lg p-2 hover:bg-[#f5f4ff] text-[#9a9abf] hover:text-[#6c63ff] transition">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(item._id)} className="rounded-lg p-2 hover:bg-red-50 text-[#9a9abf] hover:text-red-400 transition">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#ebebf5] bg-white shadow-sm hover:border-[#6c63ff]/30 hover:-translate-y-0.5 transition group overflow-hidden flex flex-col">
      <div className="relative aspect-video bg-[#f0f0f8] shrink-0">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {isVideo ? <Film size={28} className="text-[#d8d8f0]" /> : <Image size={28} className="text-[#d8d8f0]" />}
          </div>
        )}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/50 p-3">
              <Film size={16} className="text-white" />
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2"><SectionBadge section={item.section} /></div>
        <div className="absolute top-2 right-2">
          <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${item.isActive ? "bg-emerald-500 text-white" : "bg-[#1a1a2e]/60 text-white/70"}`}>
            {item.isActive ? "LIVE" : "OFF"}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-sm font-bold text-[#1a1a2e] line-clamp-1">{item.title}</p>
        {item.personName && <p className="text-xs text-[#9a9abf]">{item.personName}</p>}
        {item.description && <p className="text-xs text-[#b0b0cc] line-clamp-2">{item.description}</p>}
      </div>

      <div className="border-t border-[#f0f0f8] px-4 py-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
       
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(item)} className="rounded-lg p-1.5 text-[#9a9abf] hover:text-[#6c63ff] hover:bg-[#f5f4ff] transition">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(item._id)} className="rounded-lg p-1.5 text-[#9a9abf] hover:text-red-400 hover:bg-red-50 transition">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
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
export default function MediaManager() {
  const {
    items,
    fetchLoading,
    mutLoading,
    fetchMedia,
    createMedia,
    updateMedia,
    deleteMedia,
    toggleMedia,
  } = useMediaStore();

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterSection, setFilterSection] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSave = async (fd, id) => {
    const result = id ? await updateMedia(id, fd) : await createMedia(fd);
    if (result.success) {
      await fetchMedia();
      setShowForm(false);
      setEditItem(null);
    }
  };

  const handleDelete = async () => {
    const result = await deleteMedia(deleteId);
    if (result.success) {
      await fetchMedia();
      setDeleteId(null);
    }
  };

  const handleToggle = async (item) => {
    const result = await toggleMedia(item);
    if (result.success) await fetchMedia();
  };

  const filtered = items.filter((it) => {
    const matchSection = filterSection === "all" || it.section === filterSection;
    const matchSearch =
      !search ||
      it.title?.toLowerCase().includes(search.toLowerCase()) ||
      it.personName?.toLowerCase().includes(search.toLowerCase());
    return matchSection && matchSearch;
  });

  const counts = SECTIONS.reduce((acc, s) => {
    acc[s] = items.filter((i) => i.section === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#f7f7fb] px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#6c63ff]/10 p-2.5">
            <Film size={20} className="text-[#6c63ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a2e]">Media Manager</h1>
            <p className="text-[12px] text-[#9a9abf] mt-0.5">Manage podcasts, celebrity videos &amp; wishes</p>
          </div>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl  bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6c63ff]/20 hover:-translate-y-0.5 transition cursor-pointer"
        >
          <Plus size={15} /> Add Media
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#ebebf5] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9a9abf]">Total</p>
          <p className="text-2xl font-bold text-[#1a1a2e] mt-1">{items.length}</p>
        </div>
        {SECTIONS.map((s) => {
          const meta = SECTION_META[s];
          return (
            <div key={s} className="rounded-2xl border border-[#ebebf5] bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: meta.color }}>{meta.label}</p>
              <p className="text-2xl font-bold text-[#1a1a2e] mt-1">{counts[s] ?? 0}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-5 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-50">
          <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b0b0cc]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or person…"
            className="w-full rounded-xl border border-[#e8e8f4] bg-white pl-9 pr-4 py-2.5 text-sm text-[#1a1a2e] placeholder-[#b0b0cc] outline-none transition focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/10"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-[#e8e8f4] bg-white p-1">
          {["all", ...SECTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilterSection(s)}
              className={`rounded-lg px-3 cursor-pointer py-1.5 text-[11px] font-semibold transition ${filterSection === s ? "bg-[#6c63ff] text-white" : "text-[#9a9abf] hover:text-[#6c63ff]"}`}
            >
              {s === "all" ? "All" : SECTION_META[s]?.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-[#e8e8f4] bg-white p-1">
          <button onClick={() => setViewMode("grid")} className={`rounded-lg p-2 transition ${viewMode === "grid" ? "bg-[#6c63ff] text-white" : "text-[#9a9abf] hover:text-[#6c63ff]"}`}>
            <LayoutGrid size={14} />
          </button>
          <button onClick={() => setViewMode("list")} className={`rounded-lg p-2 transition ${viewMode === "list" ? "bg-[#6c63ff] text-white" : "text-[#9a9abf] hover:text-[#6c63ff]"}`}>
            <List size={14} />
          </button>
        </div>
      </div>

      {fetchLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="h-8 w-8 rounded-full border-2 border-[#e8e8f4] border-t-[#6c63ff] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="rounded-3xl bg-[#6c63ff]/10 p-6"><Film size={32} className="text-[#6c63ff]" /></div>
          <div className="text-center">
            <p className="text-base font-bold text-[#1a1a2e]">No media found</p>
            <p className="text-sm text-[#9a9abf]">
              {search || filterSection !== "all" ? "Try adjusting your filters" : "Add your first media item to get started"}
            </p>
          </div>
          {!search && filterSection === "all" && (
            <button
              onClick={() => { setEditItem(null); setShowForm(true); }}
              className="flex items-center gap-2 rounded-xl bg-[#6c63ff] px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Plus size={14} /> Add Media
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <MediaCard
              key={item._id}
              item={item}
              viewMode="grid"
              onEdit={(i) => { setEditItem(i); setShowForm(true); }}
              onDelete={(id) => setDeleteId(id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((item) => (
            <MediaCard
              key={item._id}
              item={item}
              viewMode="list"
              onEdit={(i) => { setEditItem(i); setShowForm(true); }}
              onDelete={(id) => setDeleteId(id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {showForm && (
        <MediaFormModal
          editData={editItem}
          loading={mutLoading}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}

      {deleteId && (
        <DeleteDialog
          loading={mutLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}