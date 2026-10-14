import { create } from "zustand";
import api from "../services/axios";

export const useAvailabilityStore = create((set) => ({
  availability: null,
  schedule: null,
  blockedDates: [],
  slots: [],
  loading: false,

  setAvailability: async (payload) => {
    try {
      set({ loading: true });

      const res = await api.post("/availability", payload);

      set({ availability: res.data.data });
    } catch (err) {
      console.error("Set availability error:", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchAvailability: async () => {
    try {
      set({ loading: true });

      const res = await api.get("/availability");

      set({ availability: res.data.data });
    } catch (err) {
      console.error("Fetch availability error:", err);
    } finally {
      set({ loading: false });
    }
  },
  fetchBlockedDates: async (month, year) => {
    try {
      set({ loading: true });

      const res = await api.get("/availability/blocked-dates", {
        params: { month, year },
      });

      set({ blockedDates: res.data.data || [] });
    } catch (err) {
      console.error("Blocked dates error:", err);
    } finally {
      set({ loading: false });
    }
  },
  blockDay: async (date) => {
    try {
      set({ loading: true });

      await api.post("/availability/block-day", { date });

      set((state) => ({
        blockedDates: [...new Set([...state.blockedDates, date])],
      }));
    } catch (err) {
      console.error("Block day error:", err);
    } finally {
      set({ loading: false });
    }
  },

  unblockDay: async (date) => {
    try {
      set({ loading: true });

      await api.post("/availability/unblock-day", { date });

      set((state) => ({
        blockedDates: state.blockedDates.filter((d) => d !== date),
      }));
    } catch (err) {
      console.error("Unblock day error:", err);
    } finally {
      set({ loading: false });
    }
  },

  blockSlots: async (date, slots) => {
    try {
      set({ loading: true });

      await api.post("/availability/block-slots", { date, slots });
    } catch (err) {
      console.error("Block slots error:", err);
    } finally {
      set({ loading: false });
    }
  },

  unblockSlots: async (date, slots) => {
    try {
      set({ loading: true });

      await api.post("/availability/unblock-slots", { date, slots });
    } catch (err) {
      console.error("Unblock slots error:", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchSchedule: async (date) => {
    try {
      set({ loading: true });

      const res = await api.get("/availability/schedule", {
        params: { date },
      });

      set({ schedule: res.data.data });
    } catch (err) {
      console.error("Fetch schedule error:", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchSlots: async (date, consultationId) => {
    try {
      set({ loading: true, slots: [] });
      const res = await api.get("/availability/admin-slots", {
        params: { date, consultationId },
      });
      set({ slots: res.data.data || [] });
    } catch (err) {
      console.error("Fetch slots error:", err);
    } finally {
      set({ loading: false });
    }
  },

  reset: () => {
    set({
      availability: null,
      schedule: null,
      slots: [],
    });
  },
}));
