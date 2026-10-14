/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustomerStore } from "../../store/useCustomerStore";
import { motion, AnimatePresence } from "framer-motion";
import DateFilter from "../../components/common/DateFilter";
import toast from "react-hot-toast";
import AdminPhoneInput from "../../components/common/AdminPhoneInput";
import {
  MoreHorizontal,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  X,
  Save,
  Download,
} from "lucide-react";
import { downloadCsv } from "../../utils/exportCsv";

function RowMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
      >
        <MoreHorizontal size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-9 z-30 bg-white border border-[#ede8f8] rounded-xl shadow-lg overflow-hidden w-32"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <button
              onClick={() => { onEdit?.(); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-secondary transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => { onDelete?.(); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FIELD = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-[#9a9abf] uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full px-3 py-2 text-sm border border-[#d8d0ee] rounded-xl bg-white text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

function EditCustomerModal({ customer, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    email: customer.email || "",
    phoneNumber: customer.phoneNumber || "",
    username: customer.username || "",
    dob: customer.dob || "",
    gender: customer.gender || "",
    birthPlace: customer.birthPlace || "",
    birthTime: customer.birthTime || "",
    bio: customer.bio || "",
    status: customer.status || "ACTIVE",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#e0d9f5] shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ede8f8]">
          <div>
            <p className="font-heading text-base font-bold text-black">Edit Customer</p>
            <p className="text-xs text-[#9a9abf] mt-0.5">Update details for {customer.firstName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-[#b0a8c8] hover:bg-secondary hover:text-black transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FIELD label="First Name">
              <input className={inputCls} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First name" />
            </FIELD>
            <FIELD label="Last Name">
              <input className={inputCls} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last name" />
            </FIELD>
            <FIELD label="Email">
              <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email address" />
            </FIELD>
            <FIELD label="Phone Number">
              <AdminPhoneInput value={form.phoneNumber} onChange={(value) => set("phoneNumber", value)} variant="white" />
            </FIELD>
            <FIELD label="Username">
              <input className={inputCls} value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="Username" />
            </FIELD>
            <FIELD label="Status">
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </FIELD>
            <FIELD label="Date of Birth">
              <input className={inputCls} value={form.dob} onChange={(e) => set("dob", e.target.value)} placeholder="DD-MM-YYYY" />
            </FIELD>
            <FIELD label="Gender">
              <select className={inputCls} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </FIELD>
            <FIELD label="Birth Place">
              <input className={inputCls} value={form.birthPlace} onChange={(e) => set("birthPlace", e.target.value)} placeholder="Birth place" />
            </FIELD>
            <FIELD label="Birth Time">
              <input className={inputCls} value={form.birthTime} onChange={(e) => set("birthTime", e.target.value)} placeholder="HH:MM" />
            </FIELD>
            <FIELD label="Bio">
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Short bio..." style={{ gridColumn: "1 / -1" }} />
            </FIELD>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#ede8f8] bg-[#faf8ff]">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-[#363b62] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        isActive
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-red-50 text-red-600 border-red-200"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ── Verified Badge ────────────────────────────────────────────────────────────
function VerifiedBadge({ isVerified }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${
        isVerified
          ? "bg-primary/10 text-primary border-primary/20"
          : "bg-gray-50 text-gray-400 border-gray-200"
      }`}
    >
      {isVerified ? "Verified" : "Unverified"}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name }) {
  const initials = name
    ? name.slice(0, 2).toUpperCase()
    : "??";
  return (
    <div className="w-9 h-9 rounded-xl bg-secondary border border-[#e0d9f5] flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-primary">{initials}</span>
    </div>
  );
}

// ── Format date ───────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-[#f5f2fc] animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
        </td>
      ))}
    </tr>
  );
}

const HEADERS = [
  { label: "Customer", sortable: true },
  { label: "Username", sortable: false },
  { label: "Phone", sortable: false },
  { label: "Status", sortable: true },
  { label: "Verified", sortable: false },
  { label: "Joined", sortable: true },
];

export default function CustomerList() {
  const {
    customers,
    fetchCustomers,
    deleteCustomer,
    updateCustomer,
    loading,
    page,
    total,
    limit,
    setPage,
    setSearch,
  } = useCustomerStore();

  const [searchInput, setSearchInput] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [editCustomer, setEditCustomer] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDateChange = ({ from, to }) => {
    setDateFrom(from);
    setDateTo(to);
    fetchCustomers({ fromDate: from, toDate: to });
  };

  const handleDateClear = () => {
    setDateFrom("");
    setDateTo("");
    fetchCustomers({ fromDate: "", toDate: "" });
  };

  const handleSaveEdit = async (form) => {
    setSaving(true);
    const result = await updateCustomer(editCustomer._id, form);
    setSaving(false);
    if (result.ok) {
      toast.success("Customer updated successfully");
      setEditCustomer(null);
    } else {
      toast.error(result.message);
    }
  };


  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // `customers` already holds the full filtered set (the store fetches with
  // limit=1000 regardless of the on-screen page size), so export just dumps
  // what's currently loaded — no extra fetch needed.
  const handleExport = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Username",
      "Phone",
      "Status",
      "Verified",
      "Gender",
      "Date of Birth",
      "Birth Place",
      "Joined Date",
    ];

    const rows = customers.map((c) => [
      c.firstName ?? "",
      c.lastName ?? "",
      c.email ?? "",
      c.username ?? "",
      c.phoneNumber ?? "",
      c.status ?? "",
      c.isVerified ? "Yes" : "No",
      c.gender ?? "",
      c.dob ?? "",
      c.birthPlace ?? "",
      formatDate(c.createdAt),
    ]);

    downloadCsv("customers.csv", headers, rows);
  };

  return (
    <div className="flex flex-col gap-4">
     
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-black">Customers</h2>
          <p className="text-xs text-gray-400 mt-0.5">{total} total users</p>
        </div>

      
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e0d9f5] bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <DateFilter
            from={dateFrom}
            to={dateTo}
            onChange={handleDateChange}
            onClear={handleDateClear}
          />
          <button
            onClick={handleExport}
            disabled={customers.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e0d9f5] bg-white hover:bg-secondary text-primary text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

     
      <div className="overflow-hidden rounded-2xl border border-[#ede8f8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#ede8f8] bg-[#faf8ff]">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer rounded" />
                </th>
                {HEADERS.map(({ label, sortable }) => (
                  <th key={label} className="px-4 py-3 text-left text-xs font-medium text-[#9a9abf] whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      {label}
                      {sortable && <ArrowUpDown size={11} className="text-[#c0b8d8]" />}
                    </span>
                  </th>
                ))}
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <User size={32} className="text-[#c0b8d8]" />
                      <p className="text-sm">No customers found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {customers.map((customer, idx) => (
                    <motion.tr
                      key={customer._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, delay: idx * 0.03 }}
                      className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors group"
                    >
                    
                      <td className="px-4 py-3.5">
                        <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer rounded" />
                      </td>

                      {/* Customer name + email */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={customer.firstName} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-black capitalize leading-tight">
                              {customer.firstName}
                            </p>
                            <p className="text-xs text-[#9a9abf] truncate max-w-45">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                    
                      <td className="px-4 py-3.5 text-sm text-[#9a9abf]">
                        @{customer.username}
                      </td>

                      
                      <td className="px-4 py-3.5 text-sm text-black font-medium">
                        {customer.phoneNumber
                          ? customer.phoneNumber.startsWith("+")
                            ? customer.phoneNumber
                            : "+" + customer.phoneNumber
                          : "—"}
                      </td>

                    
                      <td className="px-4 py-3.5">
                        <StatusBadge status={customer.status} />
                      </td>

                   
                      <td className="px-4 py-3.5">
                        <VerifiedBadge isVerified={customer.isVerified} />
                      </td>

                     
                      <td className="px-4 py-3.5 text-sm text-[#9a9abf] whitespace-nowrap">
                        {formatDate(customer.createdAt)}
                      </td>

                     
                      <td className="px-4 py-3.5">
                        <RowMenu
                          onEdit={() => setEditCustomer(customer)}
                          onDelete={() => deleteCustomer(customer._id)}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#ede8f8] bg-[#faf8ff]">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-medium text-black">
              {customers.length === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, total)}
            </span>{" "}
            of <span className="font-medium text-black">{total}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0d9f5] text-primary hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>

            {/* Page pills */}
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              if (totalPages > 5 && Math.abs(p - page) > 2) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    p === page
                      ? "bg-primary text-white"
                      : "border border-[#e0d9f5] text-primary hover:bg-secondary"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage(page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0d9f5] text-primary hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editCustomer && (
          <EditCustomerModal
            customer={editCustomer}
            onClose={() => setEditCustomer(null)}
            onSave={handleSaveEdit}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}