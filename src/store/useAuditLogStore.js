import { create } from "zustand";
import api from "../services/axios";

export const useAuditLogStore = create((set, get) => ({
  logs: [],
  total: 0,
  page: 1,
  limit: 20,
  loading: false,

  fetchAuditLogs: async (params = {}) => {
    try {
      set({ loading: true });

      const state = get();
      const page = params.page ?? state.page;
      const limit = params.limit ?? state.limit;

      const res = await api.get("/activity-log", {
        params: {
          page,
          limit,
          ...(params.search ? { search: params.search } : {}),
          ...(params.targetType ? { targetType: params.targetType } : {}),
          ...(params.action ? { action: params.action } : {}),
          ...(params.admin ? { admin: params.admin } : {}),
          ...(params.fromDate ? { fromDate: params.fromDate } : {}),
          ...(params.toDate ? { toDate: params.toDate } : {}),
        },
      });

      set({
        logs: res.data.data,
        total: res.data.meta?.total || 0,
        page,
        limit,
      });
    } catch (err) {
      console.error("Fetch audit logs error:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
