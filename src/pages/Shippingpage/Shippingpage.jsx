/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Truck,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  X,
  MapPin,
  Package,
  Clock,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Globe,
  Home,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Toppage from "../../components/common/Toppage";
import { Badge } from "../../components/common/Admintable";
import { Modal } from "../../components/common/Modal";

// ─── Static Data ───────────────────────────────────────────────────────────────
const INITIAL_ZONES = [
  {
    _id: "Z001",
    name: "Metro Cities",
    description: "Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata",
    type: "domestic",
    active: true,
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    _id: "Z002",
    name: "Tier 2 Cities",
    description: "Jaipur, Lucknow, Bhopal, Indore, Nagpur, Surat",
    type: "domestic",
    active: true,
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    _id: "Z003",
    name: "Rest of India",
    description: "All remaining Indian pin codes",
    type: "domestic",
    active: true,
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    _id: "Z004",
    name: "International",
    description: "USA, UK, Canada, Australia, UAE, Singapore",
    type: "international",
    active: false,
    createdAt: "2026-02-01T08:00:00Z",
  },
];

const INITIAL_RATES = [
  {
    _id: "R001",
    zoneId: "Z001",
    zoneName: "Metro Cities",
    method: "Standard",
    methodIcon: "standard",
    baseCharge: 49,
    perKgCharge: 10,
    estimatedDays: "2-3",
    freeAbove: 999,
    active: true,
  },
  {
    _id: "R002",
    zoneId: "Z001",
    zoneName: "Metro Cities",
    method: "Express",
    methodIcon: "express",
    baseCharge: 99,
    perKgCharge: 20,
    estimatedDays: "1",
    freeAbove: 1999,
    active: true,
  },
  {
    _id: "R003",
    zoneId: "Z002",
    zoneName: "Tier 2 Cities",
    method: "Standard",
    methodIcon: "standard",
    baseCharge: 69,
    perKgCharge: 12,
    estimatedDays: "3-5",
    freeAbove: 1499,
    active: true,
  },
  {
    _id: "R004",
    zoneId: "Z002",
    zoneName: "Tier 2 Cities",
    method: "Express",
    methodIcon: "express",
    baseCharge: 149,
    perKgCharge: 25,
    estimatedDays: "2",
    freeAbove: 2499,
    active: true,
  },
  {
    _id: "R005",
    zoneId: "Z003",
    zoneName: "Rest of India",
    method: "Standard",
    methodIcon: "standard",
    baseCharge: 89,
    perKgCharge: 15,
    estimatedDays: "5-7",
    freeAbove: 1999,
    active: true,
  },
  {
    _id: "R006",
    zoneId: "Z004",
    zoneName: "International",
    method: "Standard",
    methodIcon: "international",
    baseCharge: 999,
    perKgCharge: 200,
    estimatedDays: "10-15",
    freeAbove: 9999,
    active: false,
  },
];

const METHOD_ICON = {
  standard: <Package size={14} className="text-primary" />,
  express: <Zap size={14} className="text-gold" />,
  international: <Globe size={14} className="text-blue-500" />,
};

const METHOD_BG = {
  standard: "bg-primary/8",
  express: "bg-[#D4AF37]/10",
  international: "bg-blue-50",
};

const EMPTY_ZONE = { name: "", description: "", type: "domestic", active: true };
const EMPTY_RATE = {
  zoneId: "",
  method: "Standard",
  baseCharge: "",
  perKgCharge: "",
  estimatedDays: "",
  freeAbove: "",
  active: true,
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function InputField({ label, name, value, onChange, type = "text", placeholder, required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-black mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-black mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none px-3.5 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all pr-8"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0a8c8] pointer-events-none" />
      </div>
    </div>
  );
}

function ToggleField({ label, name, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-1">
      <label className="text-xs font-medium text-black">{label}</label>
      <button
        type="button"
        onClick={() => onChange({ target: { name, type: "checkbox", checked: !checked } })}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-[#d8d0ee]"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-[#e0d9f5] rounded-2xl px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={14} />
        </div>
        <p className="text-xs text-[#9a9abf]">{label}</p>
      </div>
      <p className="text-xl font-bold text-black">{value}</p>
    </div>
  );
}

// ─── Zone Form ─────────────────────────────────────────────────────────────────
function ZoneForm({ initial, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial);
  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  return (
    <div className="space-y-4">
      <InputField label="Zone Name" name="name" value={form.name} onChange={handle} placeholder="e.g. Metro Cities" required />
      <div>
        <label className="block text-xs font-medium text-black mb-1.5">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handle}
          rows={2}
          placeholder="List cities or regions covered..."
          className="w-full px-3.5 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
        />
      </div>
      <SelectField
        label="Type"
        name="type"
        value={form.type}
        onChange={handle}
        options={[{ value: "domestic", label: "Domestic" }, { value: "international", label: "International" }]}
      />
      <ToggleField label="Active" name="active" checked={form.active} onChange={handle} />
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#ede8f8]">
        <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors">
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={!form.name || loading}
          className="px-5 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save Zone"}
        </button>
      </div>
    </div>
  );
}

// ─── Rate Form ─────────────────────────────────────────────────────────────────
function RateForm({ initial, zones, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial);
  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  return (
    <div className="space-y-4">
      <SelectField
        label="Zone"
        name="zoneId"
        value={form.zoneId}
        onChange={handle}
        required
        options={[{ value: "", label: "Select zone…" }, ...zones.map((z) => ({ value: z._id, label: z.name }))]}
      />
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Method Name" name="method" value={form.method} onChange={handle} placeholder="e.g. Express" required />
        <InputField label="Estimated Days" name="estimatedDays" value={form.estimatedDays} onChange={handle} placeholder="e.g. 2-3" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Base Charge (₹)" name="baseCharge" value={form.baseCharge} onChange={handle} type="number" placeholder="49" required />
        <InputField label="Per Kg Charge (₹)" name="perKgCharge" value={form.perKgCharge} onChange={handle} type="number" placeholder="10" />
      </div>
      <InputField label="Free Shipping Above (₹)" name="freeAbove" value={form.freeAbove} onChange={handle} type="number" placeholder="999" />
      <ToggleField label="Active" name="active" checked={form.active} onChange={handle} />
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#ede8f8]">
        <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors">
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={!form.zoneId || !form.method || !form.baseCharge || loading}
          className="px-5 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save Rate"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ShippingPage() {
  const [tab, setTab] = useState("rates");
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [rates, setRates] = useState(INITIAL_RATES);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // "add-zone"|"edit-zone"|"view-zone"|"delete-zone"|"add-rate"|"edit-rate"|"view-rate"|"delete-rate"
  const [active, setActive] = useState(null);
  const [saving, setSaving] = useState(false);

  // ── Filtered lists ──
  const filteredZones = zones.filter(
    (z) =>
      z.name.toLowerCase().includes(search.toLowerCase()) ||
      z.description.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredRates = rates.filter(
    (r) =>
      r.zoneName.toLowerCase().includes(search.toLowerCase()) ||
      r.method.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Zone handlers ──
  const handleSaveZone = async (form) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    if (modal === "add-zone") {
      const zone = { ...form, _id: `Z${Date.now()}`, createdAt: new Date().toISOString() };
      setZones((p) => [zone, ...p]);
    } else {
      setZones((p) => p.map((z) => (z._id === active._id ? { ...z, ...form } : z)));
    }
    setSaving(false);
    setModal(null);
  };

  const handleDeleteZone = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setZones((p) => p.filter((z) => z._id !== active._id));
    setRates((p) => p.filter((r) => r.zoneId !== active._id));
    setSaving(false);
    setModal(null);
  };

  // ── Rate handlers ──
  const handleSaveRate = async (form) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const zone = zones.find((z) => z._id === form.zoneId);
    const methodKey = form.method.toLowerCase().includes("express")
      ? "express"
      : form.method.toLowerCase().includes("international")
      ? "international"
      : "standard";
    const enriched = {
      ...form,
      zoneName: zone?.name ?? "Unknown",
      methodIcon: methodKey,
      baseCharge: Number(form.baseCharge),
      perKgCharge: Number(form.perKgCharge) || 0,
      freeAbove: Number(form.freeAbove) || 0,
    };
    if (modal === "add-rate") {
      setRates((p) => [{ ...enriched, _id: `R${Date.now()}` }, ...p]);
    } else {
      setRates((p) => p.map((r) => (r._id === active._id ? { ...r, ...enriched } : r)));
    }
    setSaving(false);
    setModal(null);
  };

  const handleDeleteRate = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setRates((p) => p.filter((r) => r._id !== active._id));
    setSaving(false);
    setModal(null);
  };

  // ── Stats ──
  const activeZones = zones.filter((z) => z.active).length;
  const activeRates = rates.filter((r) => r.active).length;
  const freeShippingRates = rates.filter((r) => r.freeAbove > 0).length;
  const intlZones = zones.filter((z) => z.type === "international").length;

  return (
    <>
      <div className="space-y-5">
        <Toppage Title="Shipping" />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={MapPin} label="Active Zones" value={activeZones} color="bg-primary/10 text-primary" />
          <StatCard icon={Truck} label="Active Rates" value={activeRates} color="bg-[#D4AF37]/10 text-[#D4AF37]" />
          <StatCard icon={Package} label="Free Shipping Rules" value={freeShippingRates} color="bg-green-50 text-green-600" />
          <StatCard icon={Globe} label="International Zones" value={intlZones} color="bg-blue-50 text-blue-500" />
        </div>

        {/* Main card */}
        <div className="bg-white border border-[#e0d9f5] rounded-2xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
            <div>
              <p className="font-heading text-base font-bold text-black">Shipping Management</p>
              <p className="text-xs text-[#9a9abf] mt-0.5">
                Manage delivery zones and shipping rates.
              </p>
            </div>
            <button
              onClick={() => setModal(tab === "zones" ? "add-zone" : "add-rate")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-[#363b62] transition-colors shadow-md shadow-primary/20"
            >
              <Plus size={14} />
              {tab === "zones" ? "Add Zone" : "Add Rate"}
            </button>
          </div>

          {/* Tabs + Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#ede8f8]">
            <div className="flex gap-1 bg-secondary rounded-xl p-1">
              {[
                { key: "rates", label: "Shipping Rates", icon: Truck },
                { key: "zones", label: "Delivery Zones", icon: MapPin },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => { setTab(key); setSearch(""); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === key
                      ? "bg-white text-primary shadow-sm border border-[#e0d9f5]"
                      : "text-[#9a9abf] hover:text-black"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a8c8]" />
              <input
                type="text"
                placeholder={tab === "zones" ? "Search zones…" : "Search rates…"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* ── RATES TABLE ── */}
          <AnimatePresence mode="wait">
            {tab === "rates" && (
              <motion.div
                key="rates"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#ede8f8] bg-white">
                      {["Zone", "Method", "Base Charge", "Per Kg", "Free Above", "ETA (Days)", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-xs font-medium text-[#9a9abf] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRates.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-2 text-[#9a9abf]">
                            <Truck size={32} className="text-[#c0b8d8]" />
                            <p className="text-sm">No shipping rates found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {filteredRates.map((r, idx) => (
                          <motion.tr
                            key={r._id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, delay: idx * 0.03 }}
                            className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors"
                          >
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-[#b0a8c8] shrink-0" />
                                <span className="text-sm font-medium text-black">{r.zoneName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${METHOD_BG[r.methodIcon]}`}>
                                {METHOD_ICON[r.methodIcon]}
                                {r.method}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-sm font-semibold text-black">
                              ₹{r.baseCharge.toLocaleString()}
                            </td>
                            <td className="px-4 py-3.5 text-sm text-[#9a9abf]">
                              {r.perKgCharge > 0 ? `₹${r.perKgCharge}/kg` : "—"}
                            </td>
                            <td className="px-4 py-3.5 text-sm text-[#9a9abf]">
                              {r.freeAbove > 0 ? (
                                <span className="text-green-600 font-medium">₹{r.freeAbove.toLocaleString()}+</span>
                              ) : "—"}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1 text-sm text-[#9a9abf]">
                                <Clock size={12} className="text-[#b0a8c8]" />
                                {r.estimatedDays} days
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              {r.active ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                                  <CheckCircle2 size={10} /> Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#9a9abf] bg-secondary border border-[#d8d0ee] px-2.5 py-1 rounded-full">
                                  <XCircle size={10} /> Inactive
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => { setActive(r); setModal("view-rate"); }}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9a9abf] hover:bg-primary/8 hover:text-primary transition-colors"
                                  title="View"
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  onClick={() => { setActive(r); setModal("edit-rate"); }}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9a9abf] hover:bg-primary/8 hover:text-primary transition-colors"
                                  title="Edit"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => { setActive(r); setModal("delete-rate"); }}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9a9abf] hover:bg-red-50 hover:text-red-500 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* ── ZONES TABLE ── */}
            {tab === "zones" && (
              <motion.div
                key="zones"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#ede8f8] bg-white">
                      {["Zone Name", "Description", "Type", "Rates", "Status", "Created", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-xs font-medium text-[#9a9abf] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredZones.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-2 text-[#9a9abf]">
                            <MapPin size={32} className="text-[#c0b8d8]" />
                            <p className="text-sm">No delivery zones found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {filteredZones.map((z, idx) => {
                          const zoneRates = rates.filter((r) => r.zoneId === z._id);
                          return (
                            <motion.tr
                              key={z._id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15, delay: idx * 0.03 }}
                              className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors"
                            >
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${z.type === "international" ? "bg-blue-50" : "bg-primary/8"}`}>
                                    {z.type === "international" ? <Globe size={13} className="text-blue-500" /> : <Home size={13} className="text-primary" />}
                                  </div>
                                  <span className="text-sm font-semibold text-black">{z.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 max-w-48">
                                <p className="text-xs text-[#9a9abf] line-clamp-2">{z.description}</p>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${z.type === "international" ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-primary/8 text-primary border border-primary/20"}`}>
                                  {z.type}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className="text-sm font-semibold text-black">{zoneRates.length}</span>
                                <span className="text-xs text-[#9a9abf] ml-1">rate{zoneRates.length !== 1 ? "s" : ""}</span>
                              </td>
                              <td className="px-4 py-3.5">
                                {z.active ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                                    <CheckCircle2 size={10} /> Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#9a9abf] bg-secondary border border-[#d8d0ee] px-2.5 py-1 rounded-full">
                                    <XCircle size={10} /> Inactive
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3.5 text-xs text-[#9a9abf] whitespace-nowrap">
                                {new Date(z.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => { setActive(z); setModal("view-zone"); }}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9a9abf] hover:bg-primary/8 hover:text-primary transition-colors"
                                    title="View"
                                  >
                                    <Eye size={13} />
                                  </button>
                                  <button
                                    onClick={() => { setActive(z); setModal("edit-zone"); }}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9a9abf] hover:bg-primary/8 hover:text-primary transition-colors"
                                    title="Edit"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    onClick={() => { setActive(z); setModal("delete-zone"); }}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9a9abf] hover:bg-red-50 hover:text-red-500 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#ede8f8] flex items-center justify-between">
            <p className="text-xs text-[#9a9abf]">
              {tab === "rates"
                ? `${filteredRates.length} of ${rates.length} rates`
                : `${filteredZones.length} of ${zones.length} zones`}
            </p>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence mode="wait">
        {/* Add Zone */}
        {modal === "add-zone" && (
          <Modal title="Add Delivery Zone" onClose={() => setModal(null)}>
            <ZoneForm initial={EMPTY_ZONE} onSave={handleSaveZone} onClose={() => setModal(null)} loading={saving} />
          </Modal>
        )}

        {/* Edit Zone */}
        {modal === "edit-zone" && active && (
          <Modal title="Edit Delivery Zone" onClose={() => setModal(null)}>
            <ZoneForm initial={active} onSave={handleSaveZone} onClose={() => setModal(null)} loading={saving} />
          </Modal>
        )}

        {/* View Zone */}
        {modal === "view-zone" && active && (
          <Modal title="Zone Details" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-[#9a9abf] mb-1">Zone Name</p><p className="text-sm font-semibold text-black">{active.name}</p></div>
                <div><p className="text-xs text-[#9a9abf] mb-1">Type</p><span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${active.type === "international" ? "bg-blue-50 text-blue-600" : "bg-primary/8 text-primary"}`}>{active.type}</span></div>
                <div><p className="text-xs text-[#9a9abf] mb-1">Status</p>{active.active ? <span className="text-xs text-green-700 font-medium">Active</span> : <span className="text-xs text-[#9a9abf] font-medium">Inactive</span>}</div>
                <div><p className="text-xs text-[#9a9abf] mb-1">Rates Count</p><p className="text-sm font-semibold text-black">{rates.filter((r) => r.zoneId === active._id).length}</p></div>
              </div>
              <div><p className="text-xs text-[#9a9abf] mb-1">Coverage</p><p className="text-sm text-black bg-secondary border border-[#ede8f8] rounded-xl p-3">{active.description || "—"}</p></div>
              <div className="flex justify-end pt-1">
                <button onClick={() => setModal(null)} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors">Close</button>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Zone */}
        {modal === "delete-zone" && active && (
          <Modal title="Delete Zone" onClose={() => setModal(null)}>
            <div className="space-y-5">
              <p className="text-sm text-[#9a9abf]">
                Delete zone <span className="font-semibold text-black">{active.name}</span>? This will also remove all {rates.filter((r) => r.zoneId === active._id).length} associated rate(s). This cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setModal(null)} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors">Cancel</button>
                <button onClick={handleDeleteZone} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50">
                  {saving ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Add Rate */}
        {modal === "add-rate" && (
          <Modal title="Add Shipping Rate" onClose={() => setModal(null)}>
            <RateForm initial={EMPTY_RATE} zones={zones} onSave={handleSaveRate} onClose={() => setModal(null)} loading={saving} />
          </Modal>
        )}

        {/* Edit Rate */}
        {modal === "edit-rate" && active && (
          <Modal title="Edit Shipping Rate" onClose={() => setModal(null)}>
            <RateForm initial={active} zones={zones} onSave={handleSaveRate} onClose={() => setModal(null)} loading={saving} />
          </Modal>
        )}

        {/* View Rate */}
        {modal === "view-rate" && active && (
          <Modal title="Rate Details" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-[#9a9abf] mb-1">Zone</p><p className="text-sm font-semibold text-black">{active.zoneName}</p></div>
                <div><p className="text-xs text-[#9a9abf] mb-1">Method</p>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${METHOD_BG[active.methodIcon]}`}>
                    {METHOD_ICON[active.methodIcon]}{active.method}
                  </div>
                </div>
                <div><p className="text-xs text-[#9a9abf] mb-1">Base Charge</p><p className="text-sm font-bold text-black">₹{active.baseCharge.toLocaleString()}</p></div>
                <div><p className="text-xs text-[#9a9abf] mb-1">Per Kg Charge</p><p className="text-sm text-black">{active.perKgCharge > 0 ? `₹${active.perKgCharge}/kg` : "—"}</p></div>
                <div><p className="text-xs text-[#9a9abf] mb-1">Free Shipping Above</p><p className="text-sm text-green-600 font-medium">{active.freeAbove > 0 ? `₹${active.freeAbove.toLocaleString()}` : "Not set"}</p></div>
                <div><p className="text-xs text-[#9a9abf] mb-1">Estimated Delivery</p><p className="text-sm text-black">{active.estimatedDays} days</p></div>
                <div><p className="text-xs text-[#9a9abf] mb-1">Status</p>{active.active ? <span className="text-xs text-green-700 font-medium">Active</span> : <span className="text-xs text-[#9a9abf] font-medium">Inactive</span>}</div>
              </div>
              <div className="flex justify-end pt-1">
                <button onClick={() => setModal(null)} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors">Close</button>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Rate */}
        {modal === "delete-rate" && active && (
          <Modal title="Delete Rate" onClose={() => setModal(null)}>
            <div className="space-y-5">
              <p className="text-sm text-[#9a9abf]">
                Delete <span className="font-semibold text-black">{active.method}</span> rate for <span className="font-semibold text-black">{active.zoneName}</span>? This cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setModal(null)} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors">Cancel</button>
                <button onClick={handleDeleteRate} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50">
                  {saving ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}