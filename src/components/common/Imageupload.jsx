import { Upload, FileText, AlertCircle } from "lucide-react";
import { useState, useRef, useCallback } from "react";

const ImageUpload = ({
  value = null,
  onChange,
  maxSizeMB = 5,
  accept = "image/svg+xml,image/png,image/jpeg,image/gif",
  label,
  error,
  hint,
  className = "",
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(
    typeof value === "string" ? value : null
  );
  const [fileError, setFileError] = useState("");
  const [fileMeta, setFileMeta] = useState(null);

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = useCallback(
    (file) => {
      if (!file) return;
      setFileError("");

      const allowedTypes = accept.split(",").map((t) => t.trim());
      if (!allowedTypes.includes(file.type)) {
        setFileError(`Unsupported file type: ${file.type}`);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setFileError(`File too large. Max size is ${maxSizeMB} MB.`);
        return;
      }

      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileMeta({ name: file.name, size: formatBytes(file.size) });
      onChange?.(file);
    },
    [accept, maxSizeMB, onChange]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      processFile(e.dataTransfer.files?.[0]);
    },
    [processFile]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);

  const handleInputChange = (e) => {
    processFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileMeta(null);
    setFileError("");
    onChange?.(null);
  };

  const combinedError = error || fileError;

  const extLabel = accept
    .split(",")
    .map((t) => t.split("/")[1]?.toUpperCase().replace("SVG+XML", "SVG"))
    .join(", ");

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[11px] font-medium text-[#9a9abf] uppercase tracking-wide block">
          {label}
        </label>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => !preview && inputRef.current?.click()}
        onKeyDown={(e) =>
          e.key === "Enter" && !preview && inputRef.current?.click()
        }
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative flex flex-col items-center justify-center
          rounded-xl border-[1.5px] border-dashed transition-all duration-150
          min-h-40 px-4 py-6 gap-3 overflow-hidden
          ${preview ? "cursor-default border-solid border-[#d8d0ee]" : "cursor-pointer"}
          ${
            dragging
              ? "border-primary bg-[#EEEDFE33] border-solid"
              : combinedError
              ? "border-red-300 bg-red-50"
              : !preview
              ? "border-[#d8d0ee] bg-secondary hover:border-primary hover:bg-[#f5f2ff]"
              : "bg-secondary"
          }
        `}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <img
              src={preview}
              alt="Uploaded preview"
              className="max-h-24 max-w-full rounded-lg object-contain"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#d8d0ee] bg-white text-black hover:bg-secondary transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2.5 text-center select-none pointer-events-none">
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center border-[1.5px] transition-all
                ${
                  dragging
                    ? "border-primary bg-[#EEEDFE] text-primary"
                    : "border-[#d8d0ee] bg-white text-[#b0a8c8]"
                }
              `}
            >
              <Upload size={17} />
            </div>

            <p className="text-sm text-[#9a9abf] leading-relaxed">
              <span className="font-semibold text-black">Click to upload</span>
              {" "}or drag and drop
              <br />
              <span className="text-xs text-[#b0a8c8]">
                {extLabel} — max {maxSizeMB} MB
              </span>
            </p>

            {hint && (
              <p className="text-[11px] text-[#b0a8c8]">{hint}</p>
            )}
          </div>
        )}

        {dragging && !preview && (
          <div className="absolute inset-0 rounded-xl bg-[#EEEDFE99] flex items-center justify-center pointer-events-none">
            <p className="text-sm font-semibold text-primary">Drop to upload</p>
          </div>
        )}
      </div>

      {fileMeta && !combinedError && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#d8d0ee] bg-secondary text-xs text-[#9a9abf]">
          <FileText size={13} className="text-primary shrink-0" />
          <span className="font-medium text-black truncate max-w-50">
            {fileMeta.name}
          </span>
          <span className="ml-auto shrink-0">{fileMeta.size}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {combinedError && (
        <p className="text-[11px] text-red-500 flex items-center gap-1.5 mt-0.5">
          <AlertCircle size={12} />
          {combinedError}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;