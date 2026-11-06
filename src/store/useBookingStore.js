import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useBookingStore = create((set) => ({
  bookings: [],
  loading: false,
  creating: false,
  deleting: false,
  rescheduling: false,

  productResults: [],
  searchingProducts: false,
  recommending: false,

  fetchBookings: async ({ fromDate = "", toDate = "", search = "" } = {}) => {
    try {
      set({ loading: true });
      const res = await api.get("/booking/bookings", {
        params: {
          ...(fromDate && { fromDate }),
          ...(toDate && { toDate }),
          ...(search && { search }),
        },
      });
      set({ bookings: res.data.data || [] });
    } catch (err) {
      console.error("Fetch bookings error:", err);
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

  createBooking: async (payload) => {
    try {
      set({ creating: true });
      const res = await api.post("/booking/admin/book", payload);
      set((state) => ({ bookings: [res.data.data, ...state.bookings] }));
      showSuccess(res);
      return true;
    } catch (err) {
      console.error("Create booking error:", err);
      showError(err);
      return false; // ← drawer handleBook checks this
    } finally {
      set({ creating: false });
    }
  },
  rescheduleBooking: async (bookingId, payload) => {
    try {
      set({ rescheduling: true });

      const res = await api.patch(`/booking/reschedule/${bookingId}`, payload);

      const updatedBooking = res.data.data;

      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking._id === bookingId ? updatedBooking : booking,
        ),
      }));

      showSuccess(res);

      return true;
    } catch (err) {
      console.error("Reschedule booking error:", err);
      showError(err);

      return false;
    } finally {
      set({ rescheduling: false });
    }
  },
  changeBookingPlan: async (bookingId, payload) => {
    try {
      set({ loading: true });
      const res = await api.patch(`/booking/bookings/${bookingId}/change-plan`, payload);
      const updated = res.data.data;
      set((state) => ({
        bookings: state.bookings.map((b) => (b._id === bookingId ? updated : b)),
      }));
      showSuccess(res);
      return true;
    } catch (err) {
      showError(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Scoped to this store (not the shared useProductStore) so a search here
  // never clobbers the main Products page's own list/pagination/filter
  // state if both happen to be mounted.
  searchProducts: async (query) => {
    if (!query?.trim()) {
      set({ productResults: [] });
      return;
    }
    try {
      set({ searchingProducts: true });
      const res = await api.get("/products/admin", {
        params: { search: query, limit: 25 },
      });
      set({ productResults: res.data.data || [] });
    } catch (err) {
      console.error("Product search error:", err);
    } finally {
      set({ searchingProducts: false });
    }
  },

  // Appends — calling this again on the same booking adds another batch of
  // recommendations rather than replacing the existing ones.
  recommendProducts: async (bookingId, items) => {
    try {
      set({ recommending: true });
      const res = await api.patch(`/booking/bookings/${bookingId}/recommendations`, { items });
      const recommendedProducts = res.data.data;
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === bookingId ? { ...b, recommendedProducts } : b,
        ),
      }));
      showSuccess(res);
      return true;
    } catch (err) {
      console.error("Recommend products error:", err);
      showError(err);
      return false;
    } finally {
      set({ recommending: false });
    }
  },

  deleteBooking: async (id) => {
    try {
      set({ deleting: true });
      const res = await api.delete(`/booking/bookings/${id}`);
      set((state) => ({
        bookings: state.bookings.filter((b) => b._id !== id),
      }));
      showSuccess(res);
    } catch (err) {
      console.error("Delete booking error:", err);
      showError(err);
    } finally {
      set({ deleting: false });
    }
  },
}));
