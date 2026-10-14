import React, { useState,  } from "react";
import { Modal } from "../../components/common/Modal";
import ImageUpload from "../../components/common/Imageupload";
import { useCategoryStore } from "../../store/usecategoryStore";
import FormInput from "../../components/common/FormInput";
import FormTextarea from "../../components/common/FormTextarea";
import FormSelect from "../../components/common/FormSelect";

export default function CategoryModal({ category, onClose }) {
  const { createCategory, updateCategory, loading, categories } =
    useCategoryStore();

  const isEdit = !!category;

  const [form, setForm] = useState({
    name: "",
    description: "",
    parent: "",
    isActive: true,
    image: null,
  });

  const [file, setFile] = useState(null);

  React.useEffect(() => {
    if (category) {
      setForm({
        name: category.name ?? "",
        description: category.description ?? "",
        parent: category.parent?._id || "",
        isActive: category.isActive ?? true,
        image: category.image ?? null,
      });
    }
  }, [category]);

  const set = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

  const parentOptions = [
    { label: "None (Top-level)", value: "" },
    ...categories
      .filter((c) => c._id !== category?._id)
      .map((c) => ({
        label: c.name,
        value: c._id,
      })),
  ];

  const statusOptions = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== "" && form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

    if (file) formData.append("image", file);

    let success;

    if (isEdit) {
      success = await updateCategory(category._id, formData);
    } else {
      success = await createCategory(formData);
    }

    if (success) onClose();
  };

  return (
    <Modal
      title={isEdit ? "Edit Category" : "Add Category"}
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* Name */}
        <FormInput
          label="Category Name"
          required
          value={form.name}
          onChange={set("name")}
          placeholder="e.g. Electronics"
        />

        {/* Description */}
        <FormTextarea
          label="Description"
          value={form.description}
          onChange={set("description")}
          placeholder="Brief description"
        />

        {/* Parent */}
        <FormSelect
          label="Parent Category"
          value={form.parent}
          onChange={set("parent")}
          options={parentOptions}
        />

        {/* Status */}
        <FormSelect
          label="Status"
          value={String(form.isActive)}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              isActive: e.target.value === "true",
            }))
          }
          options={statusOptions}
        />

        {/* Image */}
        <div>
          <label className="text-xs text-[#9a9abf] mb-1 block">
            Upload Image
          </label>
          <ImageUpload
            value={form.image}
            onChange={(file) => setFile(file)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.name}
            className="px-5 py-2 rounded-xl text-sm bg-primary text-white"
          >
            {loading
              ? "Saving…"
              : isEdit
              ? "Update Category"
              : "Create Category"}
          </button>
        </div>
      </div>
    </Modal>
  );
}