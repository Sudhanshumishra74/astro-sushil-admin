/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";




import Toppage from "../../components/common/Toppage";
import { Avatar, Badge } from "../../components/common/Admintable";
import { useCategoryStore } from "../../store/usecategoryStore";
import { Modal } from "../../components/common/Modal";
import AddCategoryModal from "./Addcategorymodal";
import EditCategoryModal from "./Editcategorymodal";

export default function CategoriesPage() {
  const { categories, loading, fetchCategories, deleteCategory } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const [modal, setModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");

  const openAdd = () => setModal("add");

  const openEdit = (category) => {
    setActiveCategory(category);
    setModal("edit");
  };

  const openDelete = (category) => {
    setActiveCategory(category);
    setModal("delete");
  };

  const handleDelete = async () => {
    await deleteCategory(activeCategory._id);
    setModal(null);
  };

  const filtered = categories.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.slug?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="space-y-5">
        <Toppage Title="Categories" />

        <div className="bg-white border border-[#e0d9f5] rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
            <div>
              <p className="font-heading text-base font-bold text-black">
                Categories List
              </p>
              <p className="text-xs text-[#9a9abf] mt-0.5">
                Manage product categories across your store.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Add Category
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#ede8f8]">
            <div className="relative w-72">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a8c8]"
              />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
           
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#ede8f8] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#ede8f8] bg-white">
                    {[
                      { label: "Category", sortable: true },
                      { label: "Slug", sortable: true },
                      { label: "Parent", sortable: false },
                      { label: "Status" },
                      { label: "Created" },
                      { label: "Actions" },
                    ].map(({ label, sortable }) => (
                      <th
                        key={label}
                        className="px-4 py-3 text-xs font-medium text-[#9a9abf] whitespace-nowrap"
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          {sortable && (
                            <ArrowUpDown size={11} className="text-[#c0b8d8]" />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr
                        key={i}
                        className="border-b border-[#f5f2fc] animate-pulse"
                      >
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Tag size={32} className="text-[#c0b8d8]" />
                          <p className="text-sm">No categories found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {filtered.map((row, idx) => {
                        const rowId = row._id ?? row.id ?? idx;
                        return (
                          <motion.tr
                            key={rowId}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15, delay: idx * 0.03 }}
                            className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors"
                          >
                            <td className="px-4 py-3.5 text-sm text-black">
                              <div className="flex items-center gap-3">
                                <Avatar name={row.name} img={row.image?.url} />
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-black line-clamp-1">
                                    {row.name}
                                  </p>
                                  <p className="text-xs text-[#9a9abf] line-clamp-1">
                                    {row.description || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3.5 text-sm text-black font-mono">
                              {row.slug ?? "—"}
                            </td>

                            <td className="px-4 py-3.5 text-sm text-black">
                              {row.parent?.name?? "—"}
                            </td>

                            <td className="px-4 py-3.5">
                              {row.isActive ? (
                                <Badge label="Active" variant="success" />
                              ) : (
                                <Badge label="Inactive" variant="default" />
                              )}
                            </td>

                            <td className="px-4 py-3.5 text-sm text-[#9a9abf]">
                              {row.createdAt
                                ? new Date(row.createdAt).toLocaleDateString()
                                : "—"}
                            </td>

                            <td className="px-4 py-3.5 flex items-center gap-1.5">
                              <button
                                onClick={() => openEdit(row)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors"
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              <button
                                onClick={() => openDelete(row)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {modal === "delete" && activeCategory && (
          <Modal title="Delete Category" onClose={() => setModal(null)}>
            <div className="space-y-5">
              <p className="text-sm text-[#9a9abf]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-black">
                  {activeCategory?.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setModal(null)}
                  className="px-5 py-2 cursor-pointer rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-5 py-2 cursor-pointer rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {modal === "add" && <AddCategoryModal onClose={() => setModal(null)} />}
      {modal === "edit" && activeCategory && (
        <EditCategoryModal
          category={activeCategory}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}