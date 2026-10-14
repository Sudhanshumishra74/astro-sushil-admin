import { Trash2 } from "lucide-react";

export default function DeleteDialog({ onConfirm, onCancel, loading }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(26,26,46,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-2xl bg-red-50 p-4">
            <Trash2 size={24} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1a1a2e]">Delete Media?</h3>
            <p className="text-sm text-[#9a9abf] mt-1">
              This will permanently delete the media and its files from storage. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-[#e8e8f4] py-2.5 text-sm font-semibold text-[#9a9abf] hover:border-[#6c63ff]/30 hover:text-[#6c63ff] transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}