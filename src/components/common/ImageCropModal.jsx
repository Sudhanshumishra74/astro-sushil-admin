/* eslint-disable no-unused-vars */
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, Check } from "lucide-react";
import { getCroppedImg } from "../../utils/cropImage";

export default function ImageCropModal({
  open,
  imageSrc,
  aspect = 16 / 9,
  fileName = "cropped.jpg",
  mimeType = "image/jpeg",
  onCancel,
  onCropComplete,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const file = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        fileName,
        mimeType,
      );
      onCropComplete(file);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(26,26,46,0.6)", backdropFilter: "blur(4px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebf5]">
              <h3 className="text-sm font-bold text-[#1a1a2e]">Crop Image</h3>
              <button
                onClick={onCancel}
                className="rounded-lg p-1.5 text-[#9a9abf] hover:bg-[#f5f4ff] hover:text-[#6c63ff] transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative h-80 bg-[#1a1a2e]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            <div className="flex items-center gap-3 px-5 py-4">
              <ZoomIn size={15} className="text-[#9a9abf] shrink-0" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#6c63ff]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#ebebf5]">
              <button
                onClick={onCancel}
                className="rounded-xl border border-[#e8e8f4] bg-white px-4 py-2 text-sm font-semibold text-[#9a9abf] hover:text-red-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={saving || !croppedAreaPixels}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#6c63ff]/25 disabled:opacity-60 transition"
              >
                {saving ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                  />
                ) : (
                  <Check size={14} />
                )}
                Apply Crop
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
