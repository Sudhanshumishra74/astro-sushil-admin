import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useBlogStore = create((set, get) => ({
  blogs: [],
  blog: null,
  total: 0,
  loading: false,

  page: 1,
  limit: 10,
  search: "",

  fetchBlogs: async (params = {}) => {
    try {
      set({ loading: true });
      const { page, limit, search } = {
        page: get().page,
        limit: get().limit,
        search: get().search,
        ...params,
      };
      const res = await api.get("/blogs", { params: { page, limit, search } });
      set({
  blogs: res.data.data?.blogs || [],
  total: res.data.data?.total || 0,
  page,
  limit,
  search,
});
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchBlogById: async (id) => {
    try {
      set({ loading: true });
      const res = await api.get(`/blogs/${id}`);
      set({ blog: res.data.data });
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

  createBlog: async (data) => {
    try {
      set({ loading: true });
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "thumbnail") {
          if (data.thumbnail instanceof File) formData.append("thumbnail", data.thumbnail);
        } else if (Array.isArray(data[key]) || typeof data[key] === "object" && data[key] !== null) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      const res = await api.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({ blogs: [res.data.data, ...state.blogs] }));
      showSuccess(res);
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

  updateBlog: async (id, data) => {
    try {
      set({ loading: true });
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "thumbnail") {
          if (data.thumbnail instanceof File) formData.append("thumbnail", data.thumbnail);
        } else if (Array.isArray(data[key]) || typeof data[key] === "object" && data[key] !== null) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      const res = await api.put(`/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        blogs: state.blogs.map((b) => (b._id === id ? res.data.data : b)),
        blog: res.data.data,
      }));
      showSuccess(res);
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteBlog: async (id) => {
    try {
      set({ loading: true });
      const res = await api.delete(`/blogs/${id}`);
      set((state) => ({ blogs: state.blogs.filter((b) => b._id !== id) }));
      showSuccess(res);
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSearch: (search) => set({ search }),
  resetBlog: () => set({ blog: null }),
}));