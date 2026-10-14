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

  fetchProducts: async (params = {}) => {
    try {
      set({ loading: true });

      const { page, limit, search } = {
        page: get().page,
        limit: get().limit,
        search: get().search,
        ...params,
      };

      const res = await api.get("/products", {
        params: { page, limit, search },
      });

      set({
        products: res.data.data,
        total: res.data.meta?.total || 0,
        page,
        limit,
        search,
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