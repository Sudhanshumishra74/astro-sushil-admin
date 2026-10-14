import { Sun, Calendar } from "lucide-react";

const SIGNS = [
  { sym: "♈", name: "Aries",   pct: 12, w: 72 },
  { sym: "♉", name: "Taurus",  pct: 9,  w: 54 },
  { sym: "♊", name: "Gemini",  pct: 7,  w: 42 },
  { sym: "♋", name: "Cancer",  pct: 11, w: 66 },
  { sym: "♌", name: "Leo",     pct: 15, w: 90 },
  { sym: "♍", name: "Virgo",   pct: 8,  w: 48 },
  { sym: "♎", name: "Libra",   pct: 6,  w: 36 },
  { sym: "♏", name: "Scorpio", pct: 13, w: 78 },
];

/**
 * SunSigns
 * Displays a 2-column grid of zodiac sun signs with horizontal progress bars
 * showing their share of total sales this month.
 */
export default function SunSigns() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-primary text-base flex items-center gap-1.5">
          <Sun size={15} color="#D4AF37" strokeWidth={2} />
          Sales by Sun Sign
        </h2>
        {/* <span className="text-xs text-gold cursor-pointer font-medium flex items-center gap-1">
          <Calendar size={11} strokeWidth={2} /> This month
        </span> */}
      </div>

      {/* Signs Grid */}
      <div className="grid grid-cols-2 gap-2">
        {SIGNS.map((z) => (
          <div
            key={z.name}
            className="flex items-center gap-2 bg-secondary rounded-xl px-2.5 py-2 border border-transparent hover:border-primary/15 hover:bg-[#ede8fa] cursor-pointer transition-all"
          >
            {/* Symbol */}
            <span className="text-lg w-7 text-center">{z.sym}</span>

            {/* Name & % */}
            <div className="min-w-0">
              <div className="text-xs font-medium text-primary">{z.name}</div>
              <div className="text-[10px] text-primary/45">{z.pct}%</div>
            </div>

            {/* Progress bar */}
            <div className="flex-1 bg-primary/8 rounded h-1 overflow-hidden">
              <div
                className="h-full bg-primary rounded"
                style={{ width: `${z.w}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}