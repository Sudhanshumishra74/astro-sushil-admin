/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, FileText, Search, CheckSquare, Square } from "lucide-react";
import { usePermissionStore } from "../../store/usePermissionStore";

const initialForm = {
  name: "",
  description: "",
  isActive: true,
};

export default function RoleModal({ open, onClose, onSubmit, editData, loading }) {
  const { permissionGroups, fetchPermissions } = usePermissionStore();

  useEffect(() => {
    if (open) fetchPermissions();
  }, [open]);

  const [form, setForm] = useState(initialForm);
  const [selected, setSelected] = useState(() => new Set());
  const [permSearch, setPermSearch] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        description: editData.description || "",
        isActive: editData.status !== "INACTIVE",
      });
      setSelected(new Set((editData.permissions || []).map((p) => p._id || p)));
    } else {
      setForm(initialForm);
      setSelected(new Set());
    }
    setPermSearch("");
  }, [editData, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Cascade rule: any non-view action implies view; clearing view clears the
  // whole module (a role that can create but not list a module is nonsense).
  const toggleModule = (module, allPermissionIds) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = allPermissionIds.every((id) => next.has(id));
      allPermissionIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const togglePermission = (permission, modulePermissions) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const viewPermission = modulePermissions.find((p) => p.action === "view");

      if (next.has(permission._id)) {
        next.delete(permission._id);
        if (permission.action === "view") {
          modulePermissions.forEach((p) => next.delete(p._id));
        }
      } else {
        next.add(permission._id);
        if (permission.action !== "view" && viewPermission) {
          next.add(viewPermission._id);
        }
      }

      return next;
    });
  };

  const totalCount = useMemo(
    () => permissionGroups.reduce((sum, g) => sum + g.modules.reduce((s, m) => s + m.permissions.length, 0), 0),
    [permissionGroups],
  );

  const filteredGroups = useMemo(() => {
    if (!permSearch.trim()) return permissionGroups;
    const q = permSearch.toLowerCase();

    return permissionGroups
      .map((g) => ({
        ...g,
        modules: g.modules
          .map((m) => ({
            ...m,
            permissions: m.permissions.filter(
              (p) => p.label.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
            ),
          }))
          .filter((m) => m.permissions.length > 0),
      }))
      .filter((g) => g.modules.length > 0);
  }, [permissionGroups, permSearch]);

  const selectAll = () => {
    const all = new Set();
    permissionGroups.forEach((g) => g.modules.forEach((m) => m.permissions.forEach((p) => all.add(p._id))));
    setSelected(all);
  };
  const clearAll = () => setSelected(new Set());

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      description: form.description,
      status: form.isActive ? "ACTIVE" : "INACTIVE",
      permissions: [...selected],
    });
  };

  const isSuperAdminRole = Boolean(editData?.isSuperAdmin);
  const inputClass =
    "w-full bg-white border border-primary/20 rounded-lg px-3 py-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-sans";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="relative w-full max-w-3xl bg-secondary rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <ShieldCheck size={15} className="text-secondary" />
                </div>
                <h2 className="font-heading text-lg text-primary">{editData ? "Edit Role" : "New Role"}</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-black/40 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <X size={16} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto max-h-[76vh]">
              <div className="flex flex-col gap-4">
                {isSuperAdminRole && (
                  <div className="flex items-center gap-2.5 bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-gold">
                    <ShieldCheck size={16} className="shrink-0" />
                    The Super Admin role always has every permission and cannot be edited.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Role Name" required>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Sales Manager"
                      required
                      disabled={isSuperAdminRole}
                      className={inputClass}
                    />
                  </Field>
                  <div className="flex items-end pb-1">
                    <Toggle
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      label="Active"
                      disabled={isSuperAdminRole}
                    />
                  </div>
                </div>

                <Field label="Description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="What is this role for?"
                    rows={2}
                    disabled={isSuperAdminRole}
                    className={`${inputClass} resize-none`}
                  />
                </Field>

                {/* Permission matrix */}
                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-primary/70 uppercase tracking-wider">
                      <FileText size={13} className="text-primary" />
                      Permissions
                    </label>
                    <span className="text-xs text-black/40">
                      {selected.size} of {totalCount} selected
                    </span>
                    {!isSuperAdminRole && (
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          type="button"
                          onClick={selectAll}
                          className="text-xs text-primary hover:underline font-sans"
                        >
                          Select all
                        </button>
                        <span className="text-black/20">·</span>
                        <button
                          type="button"
                          onClick={clearAll}
                          className="text-xs text-black/40 hover:underline font-sans"
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none"
                    />
                    <input
                      value={permSearch}
                      onChange={(e) => setPermSearch(e.target.value)}
                      placeholder="Search permissions…"
                      className={`${inputClass} pl-8`}
                    />
                  </div>

                  <div className="border border-primary/10 rounded-xl bg-white divide-y divide-primary/8 max-h-80 overflow-y-auto">
                    {filteredGroups.length === 0 && (
                      <p className="text-xs text-black/35 px-4 py-6 text-center">No permissions match your search.</p>
                    )}
                    {filteredGroups.map((group) => (
                      <div key={group.group} className="px-4 py-3">
                        <p className="text-[10px] font-semibold text-primary/50 uppercase tracking-wider mb-2">
                          {group.group}
                        </p>
                        <div className="flex flex-col gap-2.5">
                          {group.modules.map((mod) => {
                            const ids = mod.permissions.map((p) => p._id);
                            const selectedCount = ids.filter((id) => selected.has(id)).length;
                            const allSelected = selectedCount === ids.length && ids.length > 0;
                            const someSelected = selectedCount > 0 && !allSelected;

                            return (
                              <div key={mod.module} className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                                <button
                                  type="button"
                                  disabled={isSuperAdminRole}
                                  onClick={() => toggleModule(mod.module, ids)}
                                  className="flex items-center gap-1.5 min-w-36 text-xs font-medium text-black/70 disabled:cursor-not-allowed"
                                >
                                  {allSelected || isSuperAdminRole ? (
                                    <CheckSquare size={14} className="text-primary" />
                                  ) : someSelected ? (
                                    <CheckSquare size={14} className="text-primary/40" />
                                  ) : (
                                    <Square size={14} className="text-black/25" />
                                  )}
                                  {mod.moduleLabel}
                                  <span className="text-black/30">
                                    ({selectedCount}/{ids.length})
                                  </span>
                                </button>

                                <div className="flex flex-wrap gap-1.5">
                                  {mod.permissions.map((p) => {
                                    const checked = selected.has(p._id) || isSuperAdminRole;
                                    return (
                                      <button
                                        type="button"
                                        key={p._id}
                                        disabled={isSuperAdminRole}
                                        onClick={() => togglePermission(p, mod.permissions)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors disabled:cursor-not-allowed ${
                                          checked
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-black/10 text-black/45 hover:border-primary/30 hover:text-primary/70"
                                        }`}
                                      >
                                        {p.action}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-primary/10">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm text-black/50 hover:bg-primary/10 hover:text-primary transition-colors font-sans"
                >
                  Cancel
                </motion.button>
                {!isSuperAdminRole && (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-primary text-secondary text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-sans"
                  >
                    {loading ? "Saving…" : editData ? "Update Role" : "Create Role"}
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="flex items-center gap-1.5 text-xs font-medium text-primary/70 uppercase tracking-wider font-sans">
          {label}
          {required && <span className="text-gold">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

function Toggle({ name, checked, onChange, label, disabled }) {
  return (
    <label className={`flex items-center gap-2.5 select-none group ${disabled ? "opacity-60" : "cursor-pointer"}`}>
      <div
        className="relative"
        onClick={() => !disabled && onChange({ target: { name, type: "checkbox", checked: !checked } })}
      >
        <div
          className={`w-9 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-primary" : "bg-black/15"}`}
        />
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm ${checked ? "left-5" : "left-0.5"}`}
        />
      </div>
      <span className="text-sm text-black/60 group-hover:text-black/80 transition-colors font-sans">{label}</span>
    </label>
  );
}
