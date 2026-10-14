import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useConsultationStore = create((set) => ({
  consultations: [],
  bookingconsultations: [],
  consultation: null,
  loading: false,

  fetchConsultations: async () => {
    try {
      set({ loading: true });

      const res = await api.get("/consultation/admin/all");

      set({
        consultations: res.data.data || [],
      });
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },
   fetchConsultationsadmin: async () => {
    try {
      set({ loading: true });

      const res = await api.get("/consultation/admin");

      set({
        bookingconsultations: res.data.data || [],
      });
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchConsultation: async (id) => {
    try {
      set({ loading: true });

      const res = await api.get(`/consultation/${id}`);

      set({
        consultation: res.data.data,
      });
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

  createConsultation: async (payload) => {
    try {
      set({ loading: true });

      const res = await api.post("/consultation/admin/create", payload);

      showSuccess(res);

      const newItem = res.data.data;

      set((state) => ({
        consultations: [newItem, ...state.consultations],
      }));

      return newItem;
    } catch (err) {
      showError(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateConsultation: async (id, payload) => {
    try {
      set({ loading: true });

      const res = await api.put(`/consultation/admin/${id}`, payload);

      showSuccess(res);

      const updated = res.data.data;

      set((state) => ({
        consultations: state.consultations.map((c) =>
          c._id === id ? updated : c,
        ),
        consultation: updated,
      }));

      return updated;
    } catch (err) {
      showError(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteConsultation: async (id) => {
    try {
      set({ loading: true });

      const res = await api.delete(`/consultation/admin/${id}`);

      showSuccess(res);

      set((state) => ({
        consultations: state.consultations.filter((c) => c._id !== id),
      }));
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

  blockDate: async ({ consultationId, date }) => {
    try {
      set({ loading: true });

      const res = await api.post("/consultation/admin/block-date", {
        consultationId,
        date,
      });

      showSuccess(res);
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },
}));
