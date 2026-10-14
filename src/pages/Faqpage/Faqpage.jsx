/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Loader2, Edit2 } from "lucide-react";
import Swal from "sweetalert2";
import { useSettingStore } from "../../store/useSettingStore";
import FAQDrawer from "./FAQDrawers";

export default function FAQPage() {
  const { faqs, faqLoading, fetchFAQsAdmin, deleteFAQ } = useSettingStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editFaq, setEditFaq] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchFAQsAdmin();
  }, []);

  const handleEdit = (faq) => {
    setEditFaq(faq);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditFaq(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete FAQ?",
      text: "Yeh action undo nahi hoga.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#424874",
      cancelButtonColor: "#e5e7eb",
      confirmButtonText: "Haan, delete karo",
      cancelButtonText: "Cancel",
      customClass: {
        cancelButton: "!text-gray-700",
        popup: "!rounded-2xl !font-sans",
        title: "!font-heading !text-[#424874]",
      },
    });

    if (result.isConfirmed) {
      await deleteFAQ(id);
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditFaq(null);
  };

  return (
    <div className="min-h-screen bg-secondary p-6">
    
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading text-primary">FAQs</h1>
          <p className="text-sm text-primary/60 mt-1">
            {faqs.length} question{faqs.length !== 1 ? "s" : ""} listed
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-primary/20"
        >
          <Plus size={16} />
          Add FAQ
        </motion.button>
      </div>

    
      {faqLoading && faqs.length === 0 && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}

   
      {!faqLoading && faqs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-primary/40">
          <div className="text-6xl mb-4">🙋</div>
          <p className="font-heading text-xl">No FAQs yet</p>
          <p className="text-sm mt-1">Add FAQS question </p>
        </div>
      )}

      
      <div className="space-y-3 max-w-5xl">
        <AnimatePresence>
          {faqs.map((faq, idx) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden"
            >
              
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
                onClick={() =>
                  setExpandedId(expandedId === faq._id ? null : faq._id)
                }
              >
               
                <span className="min-w-7 h-7 flex items-center justify-center rounded-full bg-secondary text-primary text-xs font-bold font-heading">
                  {faq.order ?? idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-primary font-medium text-sm leading-snug truncate">
                    {faq.question}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    
                    <span className="text-[11px] bg-secondary text-primary/70 px-2 py-0.5 rounded-full font-medium">
                      {faq.page}
                    </span>
                    
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        faq.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {faq.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2 shrink-0">
                
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(faq);
                    }}
                    className="p-1.5  cursor-pointer rounded-lg hover:bg-secondary text-primary/60 hover:text-primary transition-colors"
                  >
                   <Edit2 size={15}/>
                  </button>

                 
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(faq._id);
                    }}
                    className="p-1.5 rounded-lg cursor-pointer hover:bg-red-50 text-primary/60 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>

                
                  <span className="text-primary/40 ml-1">
                    {expandedId === faq._id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                </div>
              </div>

           
              <AnimatePresence>
                {expandedId === faq._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4">
                      <div className="border-t border-primary/10 pt-3">
                        <p className="text-sm text-black/70 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    
      <FAQDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        editFaq={editFaq}
      />
    </div>
  );
}