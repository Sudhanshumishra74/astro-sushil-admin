import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  currentCategory: null, 

  loading: false,

  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  search: "",

 
  fetchCategories: async (params = {}) => {
    try {
      set({ loading: true });

      const { page, limit, search } = get();

      const res = await api.get("/categories", {
        params: {
          page: params.page || page,
          limit: params.limit || limit,
          search: params.search ?? search,
        },
      });

      const data = res.data;

      set({
        categories: data.data || [],
        total: data.meta?.total || 0,
        totalPages: data.meta?.totalPages || 1,
        page: data.meta?.page || 1,
        limit: data.meta?.limit || 10,
      });
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

 
  getCategoryById: async (id) => {
    try {
      set({ loading: true });

      const res = await api.get(`/categories/${id}`);

      set({
        currentCategory: res.data.data,
      });

      return res.data.data;
    } catch (err) {
      showError(err);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  createCategory: async (formData) => {
    try {
      set({ loading: true });

      const res = await api.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess(res);

      get().fetchCategories();
      return true;
    } catch (err) {
      showError(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id, formData) => {
    try {
      set({ loading: true });

      const res = await api.put(`/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess(res);

      get().fetchCategories();
      return true;
    } catch (err) {
      showError(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ loading: true });

      const res = await api.delete(`/categories/${id}`);

      showSuccess(res);

      get().fetchCategories();
      return true;
    } catch (err) {
      showError(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchCategories({ search, page: 1 });
  },

  setPage: (page) => {
    set({ page });
    get().fetchCategories({ page });
  },
}));
