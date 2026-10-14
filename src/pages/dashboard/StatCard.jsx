import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  change,
  note,
  up,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-primary/8 relative overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-transform">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{ background: iconBg }}
      >
        <Icon size={18} color={iconColor} strokeWidth={2} />
      </div>

      <div className="text-[10px] tracking-[1.5px] uppercase text-primary/50 font-medium">
        {label}
      </div>

      <div className="font-heading text-3xl text-primary mt-1 leading-none">
        {value}
      </div>

      {change != null && (
        <div
          className={`text-xs flex items-center gap-1 mt-1.5 ${
            up ? "text-green-600" : "text-rose-500"
          }`}
        >
          {up ? (
            <TrendingUp size={13} strokeWidth={2} />
          ) : (
            <TrendingDown size={13} strokeWidth={2} />
          )}
          {change}&nbsp;
          <span className="text-primary/40">{note}</span>
        </div>
      )}
    </div>
  );
}
