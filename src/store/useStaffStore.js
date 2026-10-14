import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useStaffStore = create((set) => ({
  staff: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  loading: false,

  fetchStaff: async ({ page = 1, limit = 10, search = "", role = "", status = "" } = {}) => {
    try {
      set({ loading: true });

      const res = await api.get("/admin/staff", {
        params: { page, limit, ...(search && { search }), ...(role && { role }), ...(status && { status }) },
      });

      set({ staff: res.data.data || [], pagination: res.data.meta, loading: false });
    } catch (err) {
      showError(err);
      set({ loading: false });
    }
  },

  createStaff: async (payload) => {
    try {
      set({ loading: true });

      const res = await api.post("/admin/staff", payload);
      set((state) => ({ staff: [res.data.data, ...state.staff], loading: false }));
      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);
      set({ loading: false });

      return false;
    }
  },

  updateStaff: async (id, payload) => {
    try {
      set({ loading: true });

      const res = await api.patch(`/admin/staff/${id}`, payload);
      set((state) => ({
        staff: state.staff.map((s) => (s._id === id ? res.data.data : s)),
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

  updateStaffRole: async (id, roleId) => {
    try {
      const res = await api.patch(`/admin/staff/${id}/role`, { roleId });
      set((state) => ({
        staff: state.staff.map((s) => (s._id === id ? res.data.data : s)),
      }));
      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);

      return false;
    }
  },

  updateStaffStatus: async (id, status) => {
    try {
      const res = await api.patch(`/admin/staff/${id}/status`, { status });
      set((state) => ({
        staff: state.staff.map((s) => (s._id === id ? res.data.data : s)),
      }));
      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);

      return false;
    }
  },

  resetStaffPassword: async (id, newPassword) => {
    try {
      const res = await api.post(`/admin/staff/${id}/reset-password`, { newPassword });
      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);

      return false;
    }
  },

  deleteStaff: async (id) => {
    try {
      const res = await api.delete(`/admin/staff/${id}`);
      set((state) => ({ staff: state.staff.filter((s) => s._id !== id) }));
      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);

      return false;
    }
  },
}));
