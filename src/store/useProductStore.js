import { create } from "zustand";
import api from "../services/axios";
import { showError, showSuccess } from "../services/toast";

export const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  total: 0,
  loading: false,

  page: 1,
  limit: 10,
  search: "",
  source: "",
  type: "",

  fetchProducts: async (params = {}) => {
    try {
      set({ loading: true });

      const { page, limit, search, source, type } = {
        page: get().page,
        limit: get().limit,
        search: get().search,
        source: get().source,
        type: get().type,
        ...params,
      };

      // /products/admin (not the public /products) — the public listing
      // only ever returns published products, which meant a freshly
      // created draft was invisible even to the admin who created it.
      // source/type are already-supported buildProductQuery filters
      // (product.controller.js) — physical/digital/service for type;
      // omitted from the request entirely when empty so "All" doesn't send
      // a query param the backend would have to special-case.
      const res = await api.get("/products/admin", {
        params: {
          page,
          limit,
          search,
          ...(source ? { source } : {}),
          ...(type ? { type } : {}),
        },
      });

      set({
        products: res.data.data,
        total: res.data.meta?.total || 0,
        page,
        limit,
        search,
        source,
        type,
      });
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchProductById: async (id) => {
    try {
      set({ loading: true });

      const res = await api.get(`/products/${id}`);
      set({ product: res.data.data });
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

 createProduct: async (data) => {
  try {
    set({ loading: true });

    // const formData = new FormData();

    // Object.keys(data).forEach((key) => {
    //   if (key === "images") {
    //     data.images
    //       ?.flat(Infinity)
    //       ?.filter((file) => file instanceof File)
    //       ?.forEach((file) =>
    //         formData.append("images", file),
    //       );
    //   }

    //   else if (key === "thumbnail") {
    //     if (data.thumbnail instanceof File) {
    //       formData.append(
    //         "thumbnail",
    //         data.thumbnail,
    //       );
    //     }
    //   }

    //   else if (key === "downloadableFile") {
    //     if (
    //       data.downloadableFile instanceof
    //       File
    //     ) {
    //       formData.append(
    //         "downloadableFile",
    //         data.downloadableFile,
    //       );
    //     }
    //   }

    //   else if (
    //     typeof data[key] === "object" &&
    //     data[key] !== null
    //   ) {
    //     formData.append(
    //       key,
    //       JSON.stringify(data[key]),
    //     );
    //   }

    //   else {
    //     formData.append(
    //       key,
    //       data[key],
    //     );
    //   }
    // });

    const res = await api.post(
      "/products",
      data,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      },
    );

    set((state) => ({
      products: [
        res.data.data,
        ...state.products,
      ],
    }));

    showSuccess(res);
  }

  catch (err) {
    showError(err);
  }

  finally {
    set({ loading: false });
  }
},

  updateProduct: async (id, data) => {
  try {
    set({ loading: true });

    // const formData = new FormData();

    // Object.keys(data).forEach((key) => {
    //   if (key === "images") {
    //     data.images
    //       ?.forEach((file) =>
    //         formData.append(
    //           "images",
    //           file,
    //         ),
    //       );
    //   }

    //   else if (key === "thumbnail") {
    //     if (data.thumbnail) {
    //       formData.append(
    //         "thumbnail",
    //         data.thumbnail,
    //       );
    //     }
    //   }

    //   else if (key === "downloadableFile") {
    //     if (
    //       data.downloadableFile instanceof
    //       File
    //     ) {
    //       formData.append(
    //         "downloadableFile",
    //         data.downloadableFile,
    //       );
    //     }
    //   }

    //   else if (
    //     typeof data[key] === "object" &&
    //     data[key] !== null
    //   ) {
    //     formData.append(
    //       key,
    //       JSON.stringify(data[key]),
    //     );
    //   }

    //   else {
    //     formData.append(
    //       key,
    //       data[key],
    //     );
    //   }
    // });

    const res = await api.put(
      `/products/${id}`,
      data,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      },
    );

    set((state) => ({
      products:
        state.products.map((p) =>
          p._id === id
            ? res.data.data
            : p,
        ),

      product: res.data.data,
    }));

    showSuccess(res);
  }

  catch (err) {
    showError(err);
  }

  finally {
    set({ loading: false });
  }
},

  // Separate endpoint from updateProduct above — publish/unpublish is local
  // admin visibility, not part of the general product-edit fields, so it
  // goes through this dedicated route instead. Deliberately doesn't set the
  // global `loading` flag (unlike the other actions here) — that flag
  // drives the whole table's skeleton-row state, which would be a jarring
  // full-table flash for what's a single-row toggle; the row's own pending
  // state is tracked locally in the component instead.
  toggleProductStatus: async (id, isPublished) => {
    try {
      const res = await api.patch(`/products/${id}/status`, { isPublished });

      // Merge in just the field that actually changed rather than replacing
      // the whole cached row with the response — fetchProducts' /admin
      // listing populates fields (category, etc.) that a narrow single-field
      // update endpoint has no reason to fully replicate, and swapping in
      // its response wholesale reverts those to their raw, unpopulated form.
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? { ...p, isPublished: res.data.data.isPublished } : p,
        ),
      }));

      showSuccess(res);
      return true;
    } catch (err) {
      showError(err);
      return false;
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true });

      const res = await api.delete(`/products/${id}`);

      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
      }));

      showSuccess(res);
    } catch (err) {
      showError(err);
    } finally {
      set({ loading: false });
    }
  },

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSearch: (search) => set({ search }),

  resetProduct: () => set({ product: null }),
}));