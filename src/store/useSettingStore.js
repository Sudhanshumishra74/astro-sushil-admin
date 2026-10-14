import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useSettingStore = create((set, get) => ({
  settings: null,
  loading: false,
  isFetched: false,

  fetchSettings: async () => {
    try {
      if (get().isFetched) return;

      set({ loading: true });

      const res = await api.get("/settings");

      set({
        settings: res.data.data,
        loading: false,
        isFetched: true,
      });
    } catch (error) {
      set({ loading: false });
      showError(error?.response?.data?.message || "Failed to fetch settings");
    }
  },

  updateSettings: async (payload) => {
    try {
      set({ loading: true });

      const res = await api.put("/settings", payload);

      set({
        settings: res.data.data,
        loading: false,
      });

      showSuccess("Settings updated successfully");
      return true;
    } catch (error) {
      set({ loading: false });

      showError(error?.response?.data?.message || "Failed to update settings");

      return false;
    }
  },

 updateSection: async (
  sectionKey,
  sectionData
) => {
  try {
    set({ loading: true });

    const payload = {
      [sectionKey]: sectionData,
    };

    const res = await api.put(
      "/settings",
      payload
    );

    set({
      settings: res.data.data,
      loading: false,
    });

    showSuccess(
      res.data.message ||
        `${sectionKey} updated`
    );

    return true;
  } catch (error) {
    set({ loading: false });

    const message =
      error?.response?.data?.message ||
      "Update failed";

    console.log(
      "Settings update error:",
      error?.response?.data
    );

    showError(message);

    return false;
  }
},

  contacts: [],
  contact: null,
  contactTotal: 0,
  contactPage: 1,
  contactPages: 1,
  contactLoading: false,

  fetchContacts: async ({ page = 1, limit = 10, search = "", fromDate = "", toDate = "" } = {}) => {
    try {
      set({ contactLoading: true });

      const res = await api.get("/inquiry", {
        params: {
          page,
          limit,
          search,
          ...(fromDate && { fromDate }),
          ...(toDate && { toDate }),
        },
      });

      const data = res.data.data;

      set({
        contacts: data.contacts,
        contactTotal: data.total,
        contactPage: data.page,
        contactPages: data.pages,
      });
    } catch (err) {
      showError(err);
    } finally {
      set({ contactLoading: false });
    }
  },

  fetchContactById: async (id) => {
    try {
      set({ contactLoading: true });

      const res = await api.get(`/inquiry/contact/${id}`);

      set({ contact: res.data.data });
    } catch (err) {
      showError(err);
    } finally {
      set({ contactLoading: false });
    }
  },

  deleteContact: async (id) => {
    try {
      const res = await api.delete(`/inquiry/contact/${id}`);

      showSuccess(res);

      set((state) => ({
        contacts: state.contacts.filter((c) => c._id !== id),
        contactTotal: state.contactTotal - 1,
      }));
    } catch (err) {
      showError(err);
    }
  },

  updateContactRemarks: async (id, remarks) => {
    try {
      const res = await api.patch(`/inquiry/contact/${id}/remarks`, { remarks });

      const updated = res.data.data;

      set((state) => ({
        contacts: state.contacts.map((c) => (c._id === id ? updated : c)),
        contact: state.contact?._id === id ? updated : state.contact,
      }));

      showSuccess(res.data.message || "Remarks updated successfully");
      return updated;
    } catch (err) {
      showError(err);
      return null;
    }
  },

  clearContact: () => set({ contact: null }),

  testimonials: [],
  testimonial: null,
  testimonialLoading: false,
  testimonialTotal: 0,

  fetchTestimonials: async (params = {}) => {
    try {
      set({ testimonialLoading: true });

      const res = await api.get("/testimonial", { params });

      set({
        testimonials: res.data.data.items,
        testimonialTotal: res.data.data.total,
      });
    } catch (err) {
      showError(err);
    } finally {
      set({ testimonialLoading: false });
    }
  },

  fetchTestimonialById: async (id) => {
    try {
      set({ testimonialLoading: true });

      const res = await api.get(`/testimonial/${id}`);

      set({ testimonial: res.data.data });
    } catch (err) {
      showError(err);
    } finally {
      set({ testimonialLoading: false });
    }
  },

  createTestimonial: async (formData) => {
    try {
      const res = await api.post("/testimonial", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess(res);

      set((state) => ({
        testimonials: [res.data.data, ...state.testimonials],
        testimonialTotal: state.testimonialTotal + 1,
      }));

      return { success: true };
    } catch (err) {
      showError(err);
      return { success: false };
    }
  },

  updateTestimonial: async (id, formData) => {
    try {
      const res = await api.put(`/testimonial/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess(res);

      set((state) => ({
        testimonials: state.testimonials.map((t) =>
          t._id === id ? res.data.data : t,
        ),
      }));

      return { success: true };
    } catch (err) {
      showError(err);
      return { success: false };
    }
  },

  deleteTestimonial: async (id) => {
    try {
      const res = await api.delete(`/testimonial/${id}`);

      showSuccess(res);

      set((state) => ({
        testimonials: state.testimonials.filter((t) => t._id !== id),
        testimonialTotal: state.testimonialTotal - 1,
      }));
    } catch (err) {
      showError(err);
    }
  },

  toggleTestimonial: async (id) => {
    try {
      const res = await api.patch(`/testimonial/toggle/${id}`);

      showSuccess(res);

      set((state) => ({
        testimonials: state.testimonials.map((t) =>
          t._id === id ? res.data.data : t,
        ),
      }));
    } catch (err) {
      showError(err);
    }
  },

  clearTestimonial: () => set({ testimonial: null }),

  seos: [],
  seo: null,
  seoLoading: false,

  fetchAllSeos: async () => {
    try {
      set({ seoLoading: true });

      const res = await api.get("/seo");

      set({ seos: res.data.data });
    } catch (err) {
      showError(err);
    } finally {
      set({ seoLoading: false });
    }
  },

  fetchSeoByName: async (name) => {
    try {
      set({ seoLoading: true });

      const res = await api.get(`/seo/${name}`);

      set({ seo: res.data.data });
    } catch (err) {
      showError(err);
    } finally {
      set({ seoLoading: false });
    }
  },

  createSeo: async (formData) => {
    try {
      const res = await api.post("/seo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess(res);

      set((state) => ({
        seos: [res.data.data, ...state.seos],
      }));

      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  },

  updateSeo: async (id, formData) => {
    try {
      const res = await api.put(`/seo/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess(res);

      set((state) => ({
        seos: state.seos.map((item) =>
          item._id === id ? res.data.data : item,
        ),
        seo: res.data.data,
      }));

      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  },

  deleteSeo: async (id) => {
    try {
      const res = await api.delete(`/seo/${id}`);

      showSuccess(res);

      set((state) => ({
        seos: state.seos.filter((item) => item._id !== id),
      }));
    } catch (err) {
      showError(err);
    }
  },

  clearSeo: () => set({ seo: null }),

  faqs: [],
  faqLoading: false,

  fetchFAQsAdmin: async () => {
    try {
      set({ faqLoading: true });

      const res = await api.get("/faqs/admin");

      set({
        faqs: res.data.data,
      });
    } catch (err) {
      showError(err);
    } finally {
      set({ faqLoading: false });
    }
  },

  createFAQ: async (payload) => {
    try {
      set({ faqLoading: true });

      const res = await api.post("/faqs", payload);

      set((state) => ({
        faqs: [res.data.data, ...state.faqs],
      }));

      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);
      return false;
    } finally {
      set({ faqLoading: false });
    }
  },

  updateFAQ: async (id, payload) => {
    try {
      set({ faqLoading: true });

      const res = await api.put(`/faqs/${id}`, payload);

      set((state) => ({
        faqs: state.faqs.map((faq) => (faq._id === id ? res.data.data : faq)),
      }));

      showSuccess(res);

      return true;
    } catch (err) {
      showError(err);
      return false;
    } finally {
      set({ faqLoading: false });
    }
  },

  deleteFAQ: async (id) => {
    try {
      const res = await api.delete(`/faqs/${id}`);

      set((state) => ({
        faqs: state.faqs.filter((faq) => faq._id !== id),
      }));

      showSuccess(res);
    } catch (err) {
      showError(err);
    }
  },
  dashboard: null,
  dashboardLoading: false,

  fetchDashboard: async () => {
    set({ dashboardLoading: true });

    try {
      const res = await api.get("/settings/dashboard");

      set({
        dashboard: res.data.data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ dashboardLoading: false });
    }
  },
}));
