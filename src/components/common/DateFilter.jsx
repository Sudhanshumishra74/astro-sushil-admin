import { Calendar, X } from "lucide-react";

export default function DateFilter({ from = "", to = "", onChange, onClear }) {
  const hasValue = from || to;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 text-xs text-[#9a9abf] font-medium shrink-0">
        <Calendar size={13} />
        <span>Date:</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="date"
          value={from}
          max={to || undefined}
          onChange={(e) => onChange({ from: e.target.value, to })}
          className="px-3 py-2 text-xs border border-[#d8d0ee] rounded-xl bg-white text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
        />

        <span className="text-xs text-[#b0a8c8]">to</span>

        <input
          type="date"
          value={to}
          min={from || undefined}
          onChange={(e) => onChange({ from, to: e.target.value })}
          className="px-3 py-2 text-xs border border-[#d8d0ee] rounded-xl bg-white text-black focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
        />

        {hasValue && (
          <button
            onClick={onClear}
            title="Clear date filter"
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#d8d0ee] text-[#b0a8c8] hover:text-red-400 hover:border-red-200 bg-white transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
