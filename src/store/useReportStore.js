import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useReportStore = create((set) => ({
  reports: [],
  report: null,
  reportOrders: [],
  reportOrdersTotal: 0,
  loading: false,
  reportOrdersLoading: false,

  fetchReports: async () => {
    set({
      loading: true,
    });

    try {
      const res = await api.get("/report");

      set({
        reports: res.data.data || [],
        loading: false,
      });
    } catch (err) {
      showError(err);

      set({
        loading: false,
      });
    }
  },

  fetchReportOrders: async ({ fromDate = "", toDate = "", page = 1, limit = 10, search = "", reportType = "" } = {}) => {
    set({ reportOrdersLoading: true });

    try {
      const res = await api.get("/report/orders/all", {
        params: {
          ...(fromDate && { fromDate }),
          ...(toDate && { toDate }),
          page,
          limit,
          ...(search && { search }),
          ...(reportType && { reportType }),
        },
      });

      const data = res.data.data || {};
      set({
        reportOrders: data.orders || [],
        reportOrdersTotal: data.total || 0,
        reportOrdersLoading: false,
      });
    } catch (err) {
      showError(err?.response?.data?.message || "Failed to fetch report orders");
      set({ reportOrdersLoading: false });
    }
  },

  // Fetches every report order matching the current filters for CSV export.
  // getAllReportOrders (backend) hard-caps `limit` at 100, so this pages
  // through the full filtered set instead of asking for one giant page.
  exportReportOrders: async ({ fromDate = "", toDate = "", search = "", reportType = "" } = {}) => {
    const all = [];
    const limit = 100;
    const MAX_PAGES = 100; // generous backstop (10,000 rows) against a runaway loop

    try {
      for (let page = 1; page <= MAX_PAGES; page++) {
        const res = await api.get("/report/orders/all", {
          params: {
            page,
            limit,
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
            ...(search && { search }),
            ...(reportType && { reportType }),
          },
        });

        const data = res.data.data || {};
        all.push(...(data.orders || []));

        if (page >= (data.totalPages || 1)) break;
      }
      return all;
    } catch (err) {
      showError(err?.response?.data?.message || "Failed to export report orders");
      return all;
    }
  },

  fetchReportById: async (id) => {
    set({
      loading: true,
    });

    try {
      const res = await api.get(`/report/${id}`);

      set({
        report: res.data.data,
        loading: false,
      });
    } catch (err) {
      showError(err);

      set({
        loading: false,
      });
    }
  },

  createReport: async (formData) => {
    set({
      loading: true,
    });

    try {
      console.log("=== Payload ===");
      console.log(formData);

      console.log("=== FormData Payload ===");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await api.post("/report/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        reports: [res.data.data, ...state.reports],
        loading: false,
      }));

      showSuccess(res);

      return true;
    } catch (err) {
      console.error("=== Create Report Error ===");
      console.error("Response:", err?.response?.data);

      showError(err);

      set({
        loading: false,
      });

      return false;
    }
  },
  updateReport: async (id, payload) => {
    set({
      loading: true,
    });

    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "benefits" || key === "features") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "coverImage") {
          if (value instanceof File) {
            formData.append("coverImage", value);
          }
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const res = await api.put(`/report/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        reports: state.reports.map((r) => (r._id === id ? res.data.data : r)),
        report: res.data.data,
        loading: false,
      }));

      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);

      set({
        loading: false,
      });

      return false;
    }
  },

  deleteReport: async (id) => {
    try {
      const res = await api.delete(`/report/delete/${id}`);

      set((state) => ({
        reports: state.reports.filter((r) => r._id !== id),
      }));

      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);

      return false;
    }
  },

  clearReport: () =>
    set({
      report: null,
    }),
}));
