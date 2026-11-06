import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

// One shared "which return is currently being acted on" flag rather than a
// flag per action type — only one action can realistically be in flight for
// a given return card at a time (buttons are disabled while it's set).
export const useReturnStore = create((set) => ({
  returns: [],
  loading: false,
  actionLoadingId: null,
  creditNoteLoadingId: null,

  // Global, cross-order list (Sidebar "Returns" page) — each row is
  // { orderId, userName, userEmail, return: {...} }, distinct shape from
  // the per-order `returns` array above.
  allReturns: [],
  allLoading: false,
  allTotal: 0,
  allPage: 1,
  allLimit: 10,

  // Sidebar nav badge — count of returns still awaiting an admin decision.
  // No dedicated count endpoint exists on the backend; this reuses the same
  // paginated /returns list the "Returns" page itself calls, filtered to
  // status=requested with limit=1, and reads the total straight off the
  // pagination meta instead of the (discarded) single row it fetches.
  pendingReturnCount: 0,

  fetchPendingReturnCount: async () => {
    try {
      const res = await api.get("/returns", { params: { status: "requested", page: 1, limit: 1 } });
      set({ pendingReturnCount: res.data.meta?.total ?? 0 });
    } catch {
      // Silent — this polls in the background from the Sidebar, so a failed
      // refresh shouldn't pop a toast on every tick.
    }
  },

  fetchReturns: async (orderId) => {
    try {
      set({ loading: true });

      const res = await api.get(`/returns/order/${orderId}`);

      set({ returns: res.data.data ?? [] });
    } catch (error) {
      showError(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchAllReturns: async ({ page = 1, limit = 10, status = "" } = {}) => {
    try {
      set({ allLoading: true });

      const res = await api.get("/returns", {
        params: { page, limit, ...(status && { status }) },
      });

      set({
        allReturns: res.data.data ?? [],
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

  _runAction: async (returnId, request, successMessage) => {
    try {
      set({ actionLoadingId: returnId });

      const res = await request();
      const updated = res.data.data;

      set((state) => ({
        returns: state.returns.map((r) => (r._id === returnId ? updated : r)),
      }));

      showSuccess({ data: { message: successMessage } });

      return true;
    } catch (error) {
      showError(error);

      return false;
    } finally {
      set({ actionLoadingId: null });
    }
  },

  approveReturn: (returnId) =>
    useReturnStore
      .getState()
      ._runAction(returnId, () => api.patch(`/returns/${returnId}/approve`), "Return approved"),

  rejectReturn: (returnId, notes) =>
    useReturnStore
      .getState()
      ._runAction(
        returnId,
        () => api.patch(`/returns/${returnId}/reject`, { notes }),
        "Return rejected",
      ),

  retryReturn: (returnId) =>
    useReturnStore
      .getState()
      ._runAction(returnId, () => api.post(`/returns/${returnId}/retry`), "Return shipment retried"),

  inspectReturn: (returnId, { passed, notes }) =>
    useReturnStore
      .getState()
      ._runAction(
        returnId,
        () => api.post(`/returns/${returnId}/inspect`, { passed, notes }),
        "Inspection recorded",
      ),

  refundReturn: (returnId, notes) =>
    useReturnStore
      .getState()
      ._runAction(
        returnId,
        () => api.post(`/returns/${returnId}/refund`, { notes }),
        "Refund processed",
      ),

  cancelReturnPickup: (returnId) =>
    useReturnStore
      .getState()
      ._runAction(
        returnId,
        () => api.post(`/returns/${returnId}/cancel-pickup`),
        "Reverse pickup cancelled",
      ),

  // Credit note is only ever generated for a "refunded" return (the backend
  // 400s otherwise) — response is a raw PDF, so this bypasses _runAction
  // (which expects a JSON {data} envelope) and streams a blob download
  // instead, same pattern as the customer frontend's invoice downloads.
  downloadCreditNote: async (returnId) => {
    try {
      set({ creditNoteLoadingId: returnId });

      const res = await api.get(`/returns/${returnId}/credit-note`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `credit-note-${returnId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      // responseType: "blob" means an error JSON body also arrives as a
      // Blob, not parsed JSON — showError's err.response.data.message
      // lookup would silently find nothing. Re-parse it here so a 400
      // (e.g. "refund not yet processed") actually surfaces to the admin.
      const blob = error?.response?.data;
      if (blob instanceof Blob && blob.type.includes("json")) {
        try {
          const parsed = JSON.parse(await blob.text());
          if (parsed?.message) toast.error(parsed.message);
        } catch {
          showError(error);
        }
      } else {
        showError(error);
      }

      return false;
    } finally {
      set({ creditNoteLoadingId: null });
    }
  },

  clearReturns: () => set({ returns: [] }),
}));
