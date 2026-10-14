/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, UserCog, Pencil, Trash2, KeyRound, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useStaffStore } from "../../store/useStaffStore";
import { useRoleStore } from "../../store/useRoleStore";
import { useAuthStore } from "../../store/useAuthStore";
import { usePermission } from "../../hooks/usePermission";
import Can from "../../components/common/Can";
import StaffModal from "./Staffmodal";
import ResetPasswordModal from "./ResetPasswordModal";

export default function StaffList() {
  const { staff, pagination, loading, fetchStaff, createStaff, updateStaff, updateStaffRole, updateStaffStatus, deleteStaff } =
    useStaffStore();
  const { roleOptions, fetchRoleOptions } = useRoleStore();
  const currentUser = useAuthStore((s) => s.user);
  const { hasPermission, isSuperAdmin } = usePermission();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchRoleOptions();
  }, []);

  useEffect(() => {
    fetchStaff({ page, search: search || undefined });
  }, [page, search]);

  const openCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };
  const openEdit = (s) => {
    setEditData(s);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleSubmit = async (payload) => {
    const ok = editData ? await updateStaff(editData._id, payload) : await createStaff(payload);
    if (ok) closeModal();
  };

  const handleDelete = async () => {
    await deleteStaff(deleteId);
    setDeleteId(null);
  };

  const deleteTarget = staff.find((s) => s._id === deleteId);
  const assignableRoles = roleOptions.filter((r) => isSuperAdmin || !r.isSuperAdmin);

  const canTouch = (s) => s._id !== currentUser?._id && (isSuperAdmin || !s.role?.isSuperAdmin);

  return (
    <div className="min-h-screen bg-secondary px-6 py-8 font-sans">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="font-heading text-2xl text-primary">Staff</h1>
          <p className="text-sm text-black/50 mt-0.5">Manage admin staff accounts &amp; roles</p>
        </div>
        <Can permission="staff.create">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCreate}
            className="flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-primary text-secondary text-sm font-medium rounded-xl shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            New Staff
          </motion.button>
        </Can>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none" />
          <input
            className="w-full bg-white border border-primary/20 rounded-xl pl-8 pr-3 py-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="Search by name, email, username…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <span className="text-xs text-black/40 ml-auto">{pagination?.total ?? staff.length} staff</span>
      </div>

      <div className="bg-white rounded-2xl border border-primary/10 overflow-hidden shadow-sm">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-16 text-primary/40 text-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full"
            />
            Loading…
          </div>
        )}

        {!loading && staff.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-black/30">
            <UserCog size={40} strokeWidth={1.2} />
            <p className="text-sm">No staff accounts yet. Create one!</p>
          </div>
        )}

        {!loading && staff.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10 bg-secondary/60">
                  {["Staff", "Contact", "Phone", "Role", "Status", "Last Login", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-primary/60 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {staff.map((s, i) => {
                    const isSelf = s._id === currentUser?._id;
                    const editable = canTouch(s);

                    return (
                      <motion.tr
                        key={s._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ delay: i * 0.03, duration: 0.18 }}
                        className="border-b border-primary/5 last:border-0 hover:bg-secondary/40 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                              {s.fullName?.[0]?.toUpperCase() || s.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-black">{s.fullName || s.username}</span>
                                {isSelf && (
                                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">You</span>
                                )}
                              </div>
                              <p className="text-xs text-black/35">@{s.username}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-black/60">{s.email}</td>
                        <td className="px-4 py-3.5 text-black/60 whitespace-nowrap">{s.phoneNumber || "—"}</td>

                        <td className="px-4 py-3.5">
                          {s.role ? (
                            <select
                              value={s.role._id}
                              disabled={!editable}
                              title={!editable ? "You cannot change this account's role" : undefined}
                              onChange={(e) => updateStaffRole(s._id, e.target.value)}
                              className="text-xs bg-secondary/60 border border-primary/15 rounded-lg px-2 py-1.5 text-black/70 outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {!assignableRoles.some((r) => r._id === s.role._id) && (
                                <option value={s.role._id}>{s.role.name}</option>
                              )}
                              {assignableRoles.map((r) => (
                                <option key={r._id} value={r._id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                              No role
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5">
                          <motion.button
                            whileHover={editable ? { scale: 1.04 } : {}}
                            whileTap={editable ? { scale: 0.96 } : {}}
                            disabled={!editable}
                            title={!editable ? "You cannot change this account's status" : undefined}
                            onClick={() => updateStaffStatus(s._id, s.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE")}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                              s.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            } ${!editable ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            {s.status === "ACTIVE" ? (
                              <>
                                <CheckCircle2 size={12} /> Active
                              </>
                            ) : (
                              <>
                                <XCircle size={12} /> Suspended
                              </>
                            )}
                          </motion.button>
                        </td>

                        <td className="px-4 py-3.5 text-xs text-black/45 whitespace-nowrap">
                          {s.lastLoginAt
                            ? new Date(s.lastLoginAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Never"}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {hasPermission("staff.edit") && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.08 }}
                                  whileTap={{ scale: 0.92 }}
                                  onClick={() => openEdit(s)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-black/35 border border-transparent hover:border-primary/20 hover:bg-primary/8 hover:text-primary transition-all"
                                >
                                  <Pencil size={13} />
                                </motion.button>
                                <motion.button
                                  whileHover={editable ? { scale: 1.08 } : {}}
                                  whileTap={editable ? { scale: 0.92 } : {}}
                                  disabled={!editable}
                                  title={!editable ? "You cannot reset this account's password" : "Reset password"}
                                  onClick={() => setResetTarget(s)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-black/35 border border-transparent hover:border-primary/20 hover:bg-primary/8 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                >
                                  <KeyRound size={13} />
                                </motion.button>
                              </>
                            )}
                            {hasPermission("staff.delete") && (
                              <motion.button
                                whileHover={editable ? { scale: 1.08 } : {}}
                                whileTap={editable ? { scale: 0.92 } : {}}
                                disabled={!editable}
                                title={!editable ? "You cannot delete this account" : "Delete"}
                                onClick={() => setDeleteId(s._id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-black/35 border border-transparent hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                              >
                                <Trash2 size={13} />
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-8 h-8 rounded-lg border border-primary/20 bg-white flex items-center justify-center text-primary/50 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          <span className="text-sm text-black/40">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-8 h-8 rounded-lg border border-primary/20 bg-white flex items-center justify-center text-primary/50 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      )}

      <StaffModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editData={editData}
        loading={loading}
        roleOptions={assignableRoles}
      />

      <ResetPasswordModal target={resetTarget} onClose={() => setResetTarget(null)} />

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="relative bg-white rounded-2xl shadow-xl p-7 w-full max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <h3 className="font-heading text-lg text-black mb-1">
                Delete "{deleteTarget?.fullName || deleteTarget?.username}"?
              </h3>
              <p className="text-sm text-black/50 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2 rounded-xl border border-primary/20 text-sm text-black/60 hover:bg-secondary transition-colors font-sans"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors font-sans"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
