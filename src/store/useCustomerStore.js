import { create } from "zustand";
import api from "../services/axios";

export const useCustomerStore = create((set, get) => ({
  customers: [],
  total: 0,
  loading: false,
  page: 1,
  limit: 10,
  search: "",

  customer: null,
  customerLoading: false,

  // Separate from the /auth list endpoint above — the admin customer detail
  // page needs one customer by id, and /auth/:id (getUserById) is gated by
  // the customer's own token, not an admin's.
  fetchCustomerById: async (id) => {
    try {
      set({ customerLoading: true });

      const res = await api.get(`/auth/admin/${id}`);

      set({ customer: res.data.data });
    } catch (err) {
      console.error("Fetch customer error:", err);
      set({ customer: null });
    } finally {
      set({ customerLoading: false });
    }
  },

  clearCustomer: () => set({ customer: null }),

  fetchCustomers: async (params = {}) => {
    try {
      set({ loading: true });

      const state = get();

      const page = params.page ?? state.page;
      const limit = 1000;
      const search = params.search ?? state.search;
      const fromDate = params.fromDate ?? "";
      const toDate = params.toDate ?? "";

      const res = await api.get("/auth", {
        params: {
          page,
          limit,
          search,
          ...(fromDate && { fromDate }),
          ...(toDate && { toDate }),
        },
      });

      set({
        customers: res.data.data.users || [],
        total: res.data.data.total || 0,
        page,
        limit,
        search,
      });
    } catch (err) {
      console.error("Fetch customers error:", err);
    } finally {
      set({ loading: false });
    }
  },

  updateCustomer: async (id, data) => {
    try {
      const res = await api.patch(`/auth/${id}`, data);
      const updated = res.data.data;
      set((state) => ({
        customers: state.customers.map((c) => (c._id === id ? updated : c)),
        customer: state.customer?._id === id ? updated : state.customer,
      }));
      return { ok: true };
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to update customer";
      return { ok: false, message };
    }
  },

  deleteCustomer: async (id) => {
    try {
      set({ loading: true });

      await api.delete(`/auth/${id}`);

      set((state) => ({
        customers: state.customers.filter((c) => c._id !== id),
        total: state.total - 1,
      }));

      if (get().customers.length === 0 && get().page > 1) {
        get().fetchCustomers({ page: get().page - 1 });
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      set({ loading: false });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetchCustomers({ page });
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchCustomers({ search, page: 1 });
  },
}));
