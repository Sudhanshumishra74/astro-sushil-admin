import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";
let isFetchingProfile = false;

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuth: false,
  loading: false,
  isInitialized: false,

  login: async (payload) => {
    set({ loading: true });

    try {
      const res = await api.post("/admin/login", payload);
      localStorage.setItem("adminAccessToken", res.data.data.accessToken);

      set({
        user: res.data.data.user,
        isAuth: true,
        loading: false,
        isInitialized: true,
      });

      showSuccess(res);
      return true;
    } catch (err) {
      showError(err);
      set({ loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      const res = await api.post("/admin/logout");
      showSuccess(res);
    } catch (err) {
      showError(err);
    }
    localStorage.removeItem("adminAccessToken");
    set({
      user: null,
      isAuth: false,
      isInitialized: true,
    });
  },

  // `force` re-fetches even when already initialized — e.g. to pick up a
  // role/permissions change made by another admin without a full re-login.
  fetchProfile: async (force = false) => {
    const { isInitialized } = get();
    if ((isInitialized && !force) || isFetchingProfile) return;

    isFetchingProfile = true;

    try {
      const res = await api.get("/admin/profile");

      set({
        user: res.data.data,
        isAuth: true,
        isInitialized: true,
      });
    } catch (err) {
      console.error("Error fetching profile:", err);

      set({
        user: null,
        isAuth: false,
        isInitialized: true, // ⚠️ loop break
      });
    } finally {
      isFetchingProfile = false;
    }
  },

  updateProfile: async (payload) => {
    set({ loading: true });

    try {
      const res = await api.patch("/admin/update", payload);

      // Merge rather than overwrite — the update response mirrors the
      // login/profile payload shape, but merging is a defensive backstop
      // against role/permissions ever silently dropping out of the store.
      set((state) => ({
        user: { ...state.user, ...res.data.data },
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

  changePassword: async (payload) => {
    set({ loading: true });

    try {
      const res = await api.post("/admin/change-password", payload);

      showSuccess(res);
      set({ loading: false });
      return true;
    } catch (err) {
      showError(err);
      set({ loading: false });
      return false;
    }
  },

  forgotPassword: async (payload) => {
    set({ loading: true });

    try {
      const res = await api.post("/admin/forgot-password", payload);

      showSuccess(res);
      set({ loading: false });
      return true;
    } catch (err) {
      showError(err);
      set({ loading: false });
      return false;
    }
  },

  resetPassword: async (payload) => {
    set({ loading: true });

    try {
      const res = await api.post("/admin/reset-password", payload);

      showSuccess(res);
      set({ loading: false });
      return true;
    } catch (err) {
      showError(err);
      set({ loading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
