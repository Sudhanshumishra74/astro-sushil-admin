import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useBannerStore = create((set) => ({
  banners: [],
  banner: null,
  loading: false,
  pagination: null,

  fetchBanners: async (query = {}) => {
    set({ loading: true });

    try {
      const res = await api.get("/banners", { params: query });

      set({
        banners: res.data.data || [],
        pagination: res.data.meta || null,
        loading: false,
      });
    } catch (err) {
      showError(err);
      set({ loading: false });
    }
  },

  fetchFrontendBanners: async () => {
    try {
      const res = await api.get("/banners/frontend");

      set({
        banners: res.data.data || [],
      });
    } catch (err) {
      showError(err);
    }
  },

  fetchBannerById: async (id) => {
    set({ loading: true });

    try {
      const res = await api.get(`/banners/${id}`);

      set({
        banner: res.data.data,
        loading: false,
      });
    } catch (err) {
      showError(err);
      set({ loading: false });
    }
  },

 createBanner: async (payload) => {
  set({ loading: true });

  try {
    const res = await api.post("/banners", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    set((state) => ({
      banners: [res.data.data, ...state.banners],
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
 updateBanner: async (id, payload) => {
  set({ loading: true });

  try {
    const res = await api.put(`/banners/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    set((state) => ({
      banners: state.banners.map((b) =>
        b._id === id ? res.data.data : b
      ),
      banner: res.data.data,
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

  deleteBanner: async (id) => {
    try {
      const res = await api.delete(`/banners/${id}`);

      set((state) => ({
        banners: state.banners.filter((b) => b._id !== id),
      }));

      showSuccess(res);
    } catch (err) {
      showError(err);
    }
  },

  toggleBannerStatus: async (id) => {
    try {
      const res = await api.patch(`/banners/${id}/toggle`);

      set((state) => ({
        banners: state.banners.map((b) => (b._id === id ? res.data.data : b)),
      }));

      showSuccess(res);
    } catch (err) {
      showError(err);
    }
  },

  clearBanner: () => set({ banner: null }),
}));
