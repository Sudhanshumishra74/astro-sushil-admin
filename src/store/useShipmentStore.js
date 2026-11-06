import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useShipmentStore = create((set) => ({
  shipments: [],
  loading: false,
  retryingId: null,

  // Global, cross-order list (Sidebar "Shipments" page) — each row is
  // { orderId, userName, userEmail, shipment: {...} }.
  allShipments: [],
  allLoading: false,
  allTotal: 0,
  allPage: 1,
  allLimit: 10,

  fetchShipments: async (orderId) => {
    try {
      set({ loading: true });

      const res = await api.get(`/shipments/order/${orderId}`);

      set({ shipments: res.data.data ?? [] });
    } catch (error) {
      showError(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchAllShipments: async ({ page = 1, limit = 10, status = "", fulfillmentType = "" } = {}) => {
    try {
      set({ allLoading: true });

      const res = await api.get("/shipments", {
        params: { page, limit, ...(status && { status }), ...(fulfillmentType && { fulfillmentType }) },
      });

      set({
        allShipments: res.data.data ?? [],
        allTotal: res.data.meta?.total ?? 0,
        allPage: res.data.meta?.page ?? page,
        allLimit: res.data.meta?.limit ?? limit,
      });
    } catch (error) {
      showError(error);
    } finally {
      set({ allLoading: false });
    }
  },

  retryShipment: async (shipmentId) => {
    try {
      set({ retryingId: shipmentId });

      const res = await api.post(`/shipments/${shipmentId}/retry`);
      const updated = res.data.data;

      set((state) => ({
        shipments: state.shipments.map((s) => (s._id === shipmentId ? updated : s)),
      }));

      showSuccess({ data: { message: "Shipment retried" } });

      return true;
    } catch (error) {
      showError(error);

      return false;
    } finally {
      set({ retryingId: null });
    }
  },

  generateLabel: async (shipmentId) => {
    try {
      set({ retryingId: shipmentId });

      const res = await api.post(`/shipments/${shipmentId}/label`);
      const updated = res.data.data;

      set((state) => ({
        shipments: state.shipments.map((s) => (s._id === shipmentId ? updated : s)),
      }));

      showSuccess({ data: { message: "Label generated" } });

      return true;
    } catch (error) {
      showError(error);

      return false;
    } finally {
      set({ retryingId: null });
    }
  },

  clearShipments: () => set({ shipments: [] }),
}));
