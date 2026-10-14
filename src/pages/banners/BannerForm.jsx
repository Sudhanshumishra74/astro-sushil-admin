import { useState } from "react";
import ImageUpload from "../../components/common/Imageupload";

const inputCls =
  "w-full px-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black outline-none focus:border-primary";

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-[#9a9abf] mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function BannerForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState(null);

  const set = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const addButton = () => {
    setForm((p) => ({
      ...p,
      buttons: [...(p.buttons || []), { text: "", link: "" }],
    }));
  };

  const updateButton = (i, key, value) => {
    const updated = [...form.buttons];
    updated[i][key] = value;
    setForm((p) => ({ ...p, buttons: updated }));
  };

  const removeButton = (i) => {
    const updated = form.buttons.filter((_, idx) => idx !== i);
    setForm((p) => ({ ...p, buttons: updated }));
  };

  const handleSubmit = () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "buttons") {
        if (form.buttons?.length > 0) {
          formData.append("buttons", JSON.stringify(form.buttons));
        }
      } else {
        formData.append(key, form[key]);
      }
    });

    if (file) formData.append("image", file);

    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <Field label="Banner Title *">
        <input value={form.title} onChange={set("title")} className={inputCls} />
      </Field>

      <Field label="Banner Subtitle *">
        <input value={form.subtitle} onChange={set("subtitle")} className={inputCls} />
      </Field>

      <Field label="Description *">
        <input value={form.description} onChange={set("description")} className={inputCls} />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Type">
          <select value={form.type} onChange={set("type")} className={inputCls}>
            <option value="">Select</option>
            {["hero", "slider", "offer", "banner"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>

        <Field label="Page">
          <select value={form.page} onChange={set("page")} className={inputCls}>
            <option value="">Select</option>
            {["Homepage", "Category", "Product", "Checkout"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>

        <Field label="Position">
          <select value={form.section} onChange={set("section")} className={inputCls}>
            <option value="">Select</option>
            {["Top", "Middle", "Bottom", "Sidebar"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Status">
          <select
            value={form.isActive}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                isActive: e.target.value === "true",
              }))
            }
            className={inputCls}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </Field>

        <Field label="Order">
          <input
            type="number"
            value={form.order}
            onChange={set("order")}
            className={inputCls}
          />
        </Field>
      </div>

      {/* Buttons */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-medium text-[#9a9abf]">Buttons</p>
          <button type="button" onClick={addButton} className="text-xs text-primary">
            + Add
          </button>
        </div>

        {(form.buttons || []).map((btn, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 mb-2">
            <input
              value={btn.text}
              onChange={(e) => updateButton(i, "text", e.target.value)}
              className={inputCls}
            />
            <input
              value={btn.link}
              onChange={(e) => updateButton(i, "link", e.target.value)}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => removeButton(i)}
              className="text-xs text-red-500 col-span-2 text-right"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <Field label="Upload Image (Recommended: 665px x 665px)">
        <ImageUpload  value={form.image}  onChange={(file) => setFile(file)} />
      </Field>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSubmit}
          disabled={loading || !form.title}
          className="px-5 py-2 rounded-xl text-sm font-medium bg-primary text-white"
        >
          {loading ? "Saving…" : "Save Banner"}
        </button>
      </div>
    </div>
  );
}