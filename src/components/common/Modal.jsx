/* eslint-disable no-unused-vars */

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
export function Modal({ title, onClose, children }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />
        <motion.div
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#ede8f8]">
            <h2 className="font-heading font-bold text-base text-black">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 cursor-pointer rounded-full flex items-center justify-center hover:bg-secondary transition-colors text-gray-400 hover:text-primary"
            >
              <X size={16} />
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
