import { create } from "zustand";
import api from "../services/axios";

export const useMediaStore = create((set) => ({
  items: [],
  fetchLoading: false,
  mutLoading: false,

  fetchMedia: async () => {
    set({ fetchLoading: true });

    try {
      const res = await api.get("/media/admin");

      set({
        items: res.data.data || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ fetchLoading: false });
    }
  },

  createMedia: async (fd) => {
    set({ mutLoading: true });

    try {
      await api.post("/media", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true };
    } catch (err) {
      console.error(err);

      return { success: false };
    } finally {
      set({ mutLoading: false });
    }
  },

  updateMedia: async (id, fd) => {
    set({ mutLoading: true });

    try {
      await api.put(`/media/${id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true };
    } catch (err) {
      console.error(err);

      return { success: false };
    } finally {
      set({ mutLoading: false });
    }
  },

  deleteMedia: async (id) => {
    set({ mutLoading: true });

    try {
      await api.delete(`/media/${id}`);

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    } finally {
      set({ mutLoading: false });
    }
  },

  toggleMedia: async (item) => {
    set({ mutLoading: true });

    try {
      const fd = new FormData();

      fd.append("isActive", !item.isActive);
      fd.append("title", item.title);
      fd.append("section", item.section);

      await api.put(`/media/${item._id}`, fd);

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    } finally {
      set({ mutLoading: false });
    }
  },
}));
