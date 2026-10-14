import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const usePaymentStore = create((set) => ({
  orders: [],
  order: null,
  reports: null,

  loading: false,
  reportsLoading: false,
  detailsLoading: false,
  updateLoading: false,

  totalOrders: 0,
  currentPage: 1,
  totalPages: 1,

  fetchOrders: async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    fromDate = "",
    toDate = "",
    productId = "",
  } = {}) => {
    try {
      set({ loading: true });

      const res = await api.get("/orders/admin/all", {
        params: {
          page,
          limit,
          search,
          status,
          ...(fromDate && { fromDate }),
          ...(toDate && { toDate }),
          ...(productId && { productId }),
        },
      });

      const data = res.data.data;

      set({
        orders: data.orders,
        totalOrders: data.pagination.totalOrders,
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
      });
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to fetch orders");
    } finally {
      set({ loading: false });
    }
  },

  // Fetches every order matching the current filters (not just the current
  // page) for CSV export — a separate call from fetchOrders so it never
  // disturbs the paginated list already on screen.
  exportOrders: async ({ search = "", status = "", fromDate = "", toDate = "", productId = "" } = {}) => {
    try {
      const res = await api.get("/orders/admin/all", {
        params: {
          page: 1,
          limit: 10000,
          search,
          status,
          ...(fromDate && { fromDate }),
          ...(toDate && { toDate }),
          ...(productId && { productId }),
        },
      });
      return res.data.data.orders || [];
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to export orders");
      return [];
    }
  },

  fetchOrderDetails: async (orderId) => {
    try {
      set({ detailsLoading: true });

      const res = await api.get(`/orders/admin/${orderId}`);

      set({
        order: res.data.data,
      });
    } catch (error) {
      showError(
        error?.response?.data?.message || "Failed to fetch order details",
      );
    } finally {
      set({ detailsLoading: false });
    }
  },

  updateOrderStatus: async (orderId, orderStatus) => {
    try {
      set({ updateLoading: true });

      const res = await api.patch(`/orders/admin/${orderId}/status`, {
        orderStatus,
      });

      const updatedOrder = res.data.data;

      set((state) => ({
        orders: state.orders.map((item) =>
          item._id === orderId ? updatedOrder : item,
        ),
        order: state.order?._id === orderId ? updatedOrder : state.order,
      }));

      showSuccess("Order status updated successfully");

      return true;
    } catch (error) {
      showError(
        error?.response?.data?.message || "Failed to update order status",
      );

      return false;
    } finally {
      set({ updateLoading: false });
    }
  },

  fetchReports: async () => {
    try {
      set({ reportsLoading: true });

      const res = await api.get("/orders/admin/reports");

      set({
        reports: res.data.data,
      });
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to fetch reports");
    } finally {
      set({ reportsLoading: false });
    }
  },

 
  clearOrderDetails: () => {
    set({ order: null });
  },
  transactions: [],
  transactionsLoading: false,
  transactionsTotal: 0,
  transactionsPage: 1,
  transactionsTotalPages: 1,

  fetchTransactions: async ({ fromDate = "", toDate = "", search = "", page = 1, limit = 10 } = {}) => {
    try {
      set({ transactionsLoading: true });

      const res = await api.get("/transactions", {
        params: {
          ...(fromDate && { fromDate }),
          ...(toDate && { toDate }),
          ...(search && { search }),
          page,
          limit,
        },
      });

      const data = res.data.data;
      set({
        transactions: data.transactions || [],
        transactionsTotal: data.total || 0,
        transactionsPage: data.page || 1,
        transactionsTotalPages: data.totalPages || 1,
      });
    } catch (error) {
      showError(
        error?.response?.data?.message || "Failed to fetch transactions",
      );
    } finally {
      set({ transactionsLoading: false });
    }
  },

  gstReportRows: [],
  gstReportSummary: { taxableTotal: 0, gstTotal: 0, grandTotal: 0, count: 0 },
  gstReportLoading: false,

  fetchGstReport: async ({ fromDate = "", toDate = "", transactionType = "", status = "success" } = {}) => {
    try {
      set({ gstReportLoading: true });

      const res = await api.get("/transactions/gst-report", {
        params: {
          ...(fromDate && { fromDate }),
          ...(toDate && { toDate }),
          ...(transactionType && { transactionType }),
          ...(status && { status }),
        },
      });

      const data = res.data.data;
      set({
        gstReportRows: data.rows || [],
        gstReportSummary: data.summary || { taxableTotal: 0, gstTotal: 0, grandTotal: 0, count: 0 },
      });
    } catch (error) {
      showError(
        error?.response?.data?.message || "Failed to fetch GST report",
      );
    } finally {
      set({ gstReportLoading: false });
    }
  },
}));
