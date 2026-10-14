import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useCourseStore = create((set, get) => ({
  courses: [],
  total: 0,
  loading: false,
  page: 1,
  limit: 10,
  search: "",

  fetchCourses: async (params = {}) => {
    try {
      set({ loading: true });

      const state = get();

      const page = params.page ?? state.page;
      const limit = params.limit ?? state.limit;
      const search = params.search ?? state.search;

      const res = await api.get("/courses", {
        params: { page, limit, search },
      });

      set({
        courses: res.data.data || [],
        total: res.data.total || 0,
        page,
        limit,
        search,
      });
    } catch (err) {
      showError(err);
      console.error("Fetch courses error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ================= CREATE =================
  createCourse: async (formData) => {
    try {
      set({ loading: true });

      const res = await api.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess(res);

      await get().fetchCourses();
      return true;
    } catch (err) {
      showError(err);
      console.error("Create course error:", err);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateCourse: async (id, formData) => {
    try {
      set({ loading: true });

      const res = await api.put(`/courses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess(res);

      await get().fetchCourses();
      return true;
    } catch (err) {
      showError(err);
      console.error("Update course error:", err);
      return false;
    } finally {
      set({ loading: false });
    }
  },


  deleteCourse: async (id) => {
    try {
      set({ loading: true });

      const res = await api.delete(`/courses/${id}`);

      showSuccess(res);

      set((state) => ({
        courses: state.courses.filter((c) => c._id !== id),
        total: state.total - 1,
      }));

      if (get().courses.length === 0 && get().page > 1) {
        await get().fetchCourses({ page: get().page - 1 });
      }

      return true;
    } catch (err) {
      showError(err);
      console.error("Delete course error:", err);
      return false;
    } finally {
      set({ loading: false });
    }
  },


  getCourseById: async (id) => {
    try {
      set({ loading: true });

      const res = await api.get(`/courses/${id}`);
      return res.data.data;
    } catch (err) {
      showError(err);
      console.error("Get course by id error:", err);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetchCourses({ page });
  },


  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchCourses({ search, page: 1 });
  },
}));