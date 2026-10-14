import { create } from "zustand";
import api from "../services/axios";
import { showError } from "../services/toast";

export const usePermissionStore = create((set, get) => ({
  permissionGroups: [],
  loading: false,
  loaded: false,

  fetchPermissions: async (force = false) => {
    if (get().loaded && !force) return;

    set({ loading: true });

    try {
      const res = await api.get("/permissions");
      set({ permissionGroups: res.data.data || [], loaded: true, loading: false });
    } catch (err) {
      showError(err);
      set({ loading: false });
    }
  },
}));
