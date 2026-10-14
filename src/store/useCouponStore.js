import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useCouponStore = create((set) => ({
  coupons: [],
  coupon: null,
  loading: false,
  pagination: null,

  fetchCoupons: async (query = {}) => {
    set({ loading: true });

    try {
      const res = await api.get("/coupons", {
        params: query,
      });

      set({
        coupons: res.data.data || [],
        pagination: res.data.meta || null,
        loading: false,
      });
    } catch (err) {
      showError(err);
      set({ loading: false });
    }
  },

  fetchCouponById: async (id) => {
    set({ loading: true });

    try {
      const res = await api.get(`/coupons/${id}`);

      set({
        coupon: res.data.data,
        loading: false,
      });
    } catch (err) {
      showError(err);
      set({ loading: false });
    }
  },

  createCoupon: async (payload) => {
    set({ loading: true });

    try {
      const res = await api.post("/coupons/create", payload);

      set((state) => ({
        coupons: [res.data.data, ...state.coupons],
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

  updateCoupon: async (id, payload) => {
    set({ loading: true });

    try {
      const res = await api.put(`/coupons/${id}`, payload);

      set((state) => ({
        coupons: state.coupons.map((c) => (c._id === id ? res.data.data : c)),
        coupon: res.data.data,
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

  deleteCoupon: async (id) => {
    try {
      const res = await api.delete(`/coupons/${id}`);

      set((state) => ({
        coupons: state.coupons.filter((c) => c._id !== id),
      }));

      showSuccess(res);
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  },

  toggleCouponStatus: async (id) => {
    try {
      const res = await api.patch(`/coupons/toggle/${id}`);

      set((state) => ({
        coupons: state.coupons.map((c) =>
          c._id === id
            ? {
                ...c,
                isActive: res.data.data.isActive,
              }
            : c,
        ),
      }));

      showSuccess(res);
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  },

  clearCoupon: () =>
    set({
      coupon: null,
    }),
}));
