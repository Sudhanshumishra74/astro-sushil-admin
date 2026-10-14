import { useState } from "react";
import { Modal } from "../../components/common/Modal";
import ImageUpload from "../../components/common/Imageupload";
import { useCategoryStore } from "../../store/usecategoryStore";
import FormInput from "../../components/common/FormInput";
import FormTextarea from "../../components/common/FormTextarea";
import FormSelect from "../../components/common/FormSelect";

export default function EditCategoryModal({ category, onClose }) {
  const { updateCategory, loading, categories } = useCategoryStore();

  const [form, setForm] = useState({
    name: category.name ?? "",
    description: category.description ?? "",
    parent: category.parent?._id || "",
    isActive: category.isActive ?? true,
    image: category.image ?? null,
  });

  const [file, setFile] = useState(null);

  const set = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

  const parentOptions = [
    { label: "None (Top-level)", value: "" },
    ...categories
      .filter((c) => c._id !== category._id)
      .map((c) => ({
        label: c.name,
        value: c._id,
      })),
  ];

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

    if (file) formData.append("image", file);

    const success = await updateCategory(category._id, formData);
    if (success) onClose();
  };

  return (
    <Modal title="Edit Category" onClose={onClose}>
      <div className="space-y-4">
        <FormInput
          label="Category Name"
          required
          value={form.name}
          onChange={set("name")}
          placeholder="e.g. Electronics"
        />

        <FormTextarea
          label="Description"
          value={form.description}
          onChange={set("description")}
          placeholder="Brief description"
        />

        <FormSelect
          label="Parent Category"
          value={form.parent ?? ""}
          onChange={set("parent")}
          options={parentOptions}
        />

        <FormSelect
          label="Status"
          value={String(form.isActive)}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              isActive: e.target.value === "true",
            }))
          }
          options={[
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
          ]}
        />

        <div>
          <label className="text-xs font-medium text-[#9a9abf] mb-1 block">
            Upload Image
          </label>
          <ImageUpload value={form.image} onChange={(file) => setFile(file)} />
        </div>

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
            className="px-5 py-2 rounded-xl text-sm font-medium bg-primary text-white"
          >
            {loading ? "Saving…" : "Update Category"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
