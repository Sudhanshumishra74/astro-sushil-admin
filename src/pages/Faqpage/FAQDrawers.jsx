/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useSettingStore } from "../../store/useSettingStore";

const defaultForm = {
  question: "",
  answer: "",
  page: "",
  isActive: true,
  order: 0,
};

export default function FAQDrawer({ open, onClose, editFaq }) {
  const { createFAQ, updateFAQ, faqLoading } = useSettingStore();
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (editFaq) {
      setForm({
        question: editFaq.question || "",
        answer: editFaq.answer || "",
        page: editFaq.page || "",
        isActive: editFaq.isActive ?? true,
        order: editFaq.order ?? 0,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editFaq, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isValid =
    form.question.trim().length >= 5 &&
    form.answer.trim().length >= 5 &&
    form.page.trim().length >= 1;

  const handleSubmit = async () => {
    if (!isValid) return;

    const payload = {
      ...form,
      order: Number(form.order),
    };

    const success = editFaq
      ? await updateFAQ(editFaq._id, payload)
      : await createFAQ(payload);

    if (success) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
              <h2 className="font-heading text-xl text-primary">
                {editFaq ? "Edit FAQ" : "Add FAQ"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-secondary text-primary/60 hover:text-primary transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Question */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary/70 uppercase tracking-wider">
                  Question <span className="text-red-400">*</span>
                </label>
                <input
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  placeholder="e.g. How do I book a consultation?"
                  className="w-full border border-primary/20 rounded-xl px-4 py-3 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-secondary/40 transition"
                />
              </div>

              {/* Answer */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary/70 uppercase tracking-wider">
                  Answer <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="answer"
                  value={form.answer}
                  onChange={handleChange}
                  placeholder="Write the answer here..."
                  rows={6}
                  className="w-full border border-primary/20 rounded-xl px-4 py-3 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-secondary/40 resize-none transition"
                />
              </div>

              {/* Page */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary/70 uppercase tracking-wider">
                  Page <span className="text-red-400">*</span>
                </label>
                <input
                  name="page"
                  value={form.page}
                  onChange={handleChange}
                  placeholder="e.g. home, about, services"
                  className="w-full border border-primary/20 rounded-xl px-4 py-3 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-secondary/40 transition"
                />
              </div>

              {/* Order + isActive row */}
              <div className="flex gap-4">
                {/* Order */}
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-semibold text-primary/70 uppercase tracking-wider">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    min={0}
                    className="w-full border border-primary/20 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-secondary/40 transition"
                  />
                </div>

                {/* isActive toggle */}
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-semibold text-primary/70 uppercase tracking-wider">
                    Status
                  </label>
                  <div className="flex items-center h-11.5 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        form.isActive ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          form.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-black/60">
                      {form.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-primary/10 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-primary/20 text-primary rounded-xl py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={faqLoading || !isValid}
                className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity shadow-lg shadow-primary/20"
              >
                {faqLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : editFaq ? (
                  "Update"
                ) : (
                  "Add FAQ"
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}