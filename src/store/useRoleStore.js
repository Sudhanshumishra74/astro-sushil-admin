import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useRoleStore = create((set, get) => ({
  roles: [],
  role: null,
  roleOptions: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  loading: false,
  optionsLoading: false,

  fetchRoles: async ({ page = 1, limit = 10, search = "", status = "" } = {}) => {
    try {
      set({ loading: true });

      const res = await api.get("/roles", {
        params: { page, limit, ...(search && { search }), ...(status && { status }) },
      });

      set({ roles: res.data.data || [], pagination: res.data.meta, loading: false });
    } catch (err) {
      showError(err);
      set({ loading: false });
    }
  },

  fetchRoleOptions: async (force = false) => {
    if (get().roleOptions.length && !force) return;

    set({ optionsLoading: true });

    try {
      const res = await api.get("/roles/options");
      set({ roleOptions: res.data.data || [], optionsLoading: false });
    } catch (err) {
      showError(err);
      set({ optionsLoading: false });
    }
  },

  fetchRoleById: async (id) => {
    try {
      set({ loading: true });

      const res = await api.get(`/roles/${id}`);
      set({ role: res.data.data, loading: false });
    } catch (err) {
      showError(err);
      set({ loading: false });
    }
  },

  createRole: async (payload) => {
    try {
      set({ loading: true });

      const res = await api.post("/roles", payload);
      set((state) => ({ roles: [res.data.data, ...state.roles], loading: false }));
      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);
      set({ loading: false });

      return false;
    }
  },

  updateRole: async (id, payload) => {
    try {
      set({ loading: true });

      const res = await api.put(`/roles/${id}`, payload);
      set((state) => ({
        roles: state.roles.map((r) => (r._id === id ? res.data.data : r)),
        role: res.data.data,
        loading: false,
      }));
      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);
      set({ loading: false });

      return false;
    }
  },

  updateRoleStatus: async (id, status) => {
    try {
      const res = await api.patch(`/roles/${id}/status`, { status });
      set((state) => ({
        roles: state.roles.map((r) => (r._id === id ? { ...r, status: res.data.data.status } : r)),
      }));
      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);

      return false;
    }
  },

  deleteRole: async (id) => {
    try {
      const res = await api.delete(`/roles/${id}`);
      set((state) => ({ roles: state.roles.filter((r) => r._id !== id) }));
      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);

      return false;
    }
  },

  clearRole: () => set({ role: null }),
}));
