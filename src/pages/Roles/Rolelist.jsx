/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  ShieldCheck,
  Pencil,
  Trash2,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useRoleStore } from "../../store/useRoleStore";
import { usePermission } from "../../hooks/usePermission";
import Can from "../../components/common/Can";
import RoleModal from "./Rolemodal";

export default function RoleList() {
  const { roles, pagination, loading, fetchRoles, createRole, updateRole, updateRoleStatus, deleteRole } =
    useRoleStore();
  const { hasPermission } = usePermission();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchRoles({ page, search: search || undefined });
  }, [page, search]);

  const openCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };
  const openEdit = (role) => {
    setEditData(role);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleSubmit = async (payload) => {
    const ok = editData ? await updateRole(editData._id, payload) : await createRole(payload);
    if (ok) closeModal();
  };

  const handleDelete = async () => {
    await deleteRole(deleteId);
    setDeleteId(null);
  };

  const deleteTarget = roles.find((r) => r._id === deleteId);

  return (
    <div className="min-h-screen bg-secondary px-6 py-8 font-sans">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="font-heading text-2xl text-primary">Roles</h1>
          <p className="text-sm text-black/50 mt-0.5">Manage admin roles &amp; permissions</p>
        </div>
        <Can permission="roles.create">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCreate}
            className="flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-primary text-secondary text-sm font-medium rounded-xl shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            New Role
          </motion.button>
        </Can>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none"
          />
          <input
            className="w-full bg-white border border-primary/20 rounded-xl pl-8 pr-3 py-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="Search roles…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <span className="text-xs text-black/40 ml-auto">{pagination?.total ?? roles.length} roles</span>
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

        {!loading && roles.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-black/30">
            <ShieldCheck size={40} strokeWidth={1.2} />
            <p className="text-sm">No roles yet. Create one!</p>
          </div>
        )}

        {!loading && roles.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10 bg-secondary/60">
                  {["Role", "Description", "Permissions", "Assigned", "Status", ""].map((h) => (
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
                  {roles.map((role, i) => (
                    <motion.tr
                      key={role._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ delay: i * 0.03, duration: 0.18 }}
                      className="border-b border-primary/5 last:border-0 hover:bg-secondary/40 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-black">{role.name}</span>
                          {role.isSuperAdmin && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-gold/15 text-gold px-1.5 py-0.5 rounded">
                              <ShieldCheck size={9} /> Super Admin
                            </span>
                          )}
                          {role.isSystem && !role.isSuperAdmin && (
                            <span className="text-[10px] bg-black/6 text-black/40 px-1.5 py-0.5 rounded">
                              System
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-black/35 font-mono mt-0.5">{role.slug}</p>
                      </td>

                      <td className="px-4 py-3.5 text-black/60 max-w-60 truncate">
                        {role.description || <span className="text-black/25">—</span>}
                      </td>

                      <td className="px-4 py-3.5 text-black/60 whitespace-nowrap">
                        {role.permissionCount === "ALL" ? (
                          <span className="text-gold font-medium">All permissions</span>
                        ) : (
                          `${role.permissionCount} permission${role.permissionCount === 1 ? "" : "s"}`
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-black/50">
                          <Users size={11} /> {role.adminCount}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <motion.button
                          whileHover={role.isSuperAdmin ? {} : { scale: 1.04 }}
                          whileTap={role.isSuperAdmin ? {} : { scale: 0.96 }}
                          disabled={role.isSuperAdmin}
                          title={role.isSuperAdmin ? "The Super Admin role cannot be modified" : undefined}
                          onClick={() =>
                            updateRoleStatus(role._id, role.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")
                          }
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                            role.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-black/5 text-black/40 hover:bg-black/10"
                          } ${role.isSuperAdmin ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          {role.status === "ACTIVE" ? (
                            <>
                              <CheckCircle2 size={12} /> Active
                            </>
                          ) : (
                            <>
                              <XCircle size={12} /> Inactive
                            </>
                          )}
                        </motion.button>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {hasPermission("roles.edit") && (
                            <motion.button
                              whileHover={role.isSuperAdmin ? {} : { scale: 1.08 }}
                              whileTap={role.isSuperAdmin ? {} : { scale: 0.92 }}
                              disabled={role.isSuperAdmin}
                              title={role.isSuperAdmin ? "The Super Admin role cannot be modified" : "Edit"}
                              onClick={() => openEdit(role)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-black/35 border border-transparent hover:border-primary/20 hover:bg-primary/8 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-transparent"
                            >
                              {role.isSuperAdmin ? <Lock size={12} /> : <Pencil size={13} />}
                            </motion.button>
                          )}
                          {hasPermission("roles.delete") && (
                            <motion.button
                              whileHover={role.isSuperAdmin || role.isSystem || role.adminCount > 0 ? {} : { scale: 1.08 }}
                              whileTap={role.isSuperAdmin || role.isSystem || role.adminCount > 0 ? {} : { scale: 0.92 }}
                              disabled={role.isSuperAdmin || role.isSystem || role.adminCount > 0}
                              title={
                                role.isSuperAdmin || role.isSystem
                                  ? "System roles cannot be deleted"
                                  : role.adminCount > 0
                                    ? `Assigned to ${role.adminCount} admin account(s)`
                                    : "Delete"
                              }
                              onClick={() => setDeleteId(role._id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-black/35 border border-transparent hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-transparent"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
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

      <RoleModal open={modalOpen} onClose={closeModal} onSubmit={handleSubmit} editData={editData} loading={loading} />

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
              <h3 className="font-heading text-lg text-black mb-1">Delete "{deleteTarget?.name}"?</h3>
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
