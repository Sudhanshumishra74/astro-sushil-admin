import { Orbit, Zap } from "lucide-react";

const TRANSITS = [
  {
    planet: "♃",
    name: "Jupiter in Gemini",
    desc: "Boosts communication products",
    level: "High",
    levelClass: "bg-yellow-50 text-yellow-700",
  },
  {
    planet: "♀",
    name: "Venus in Pisces",
    desc: "Spiritual & love readings up",
    level: "High",
    levelClass: "bg-yellow-50 text-yellow-700",
  },
  {
    planet: "♄",
    name: "Saturn retrograde",
    desc: "Slowdown in impulse buys",
    level: "Med",
    levelClass: "bg-primary/8 text-primary",
  },
];

/**
 * PlanetaryTransits
 * Lists current planetary transits and their impact level on sales.
 */
export default function PlanetaryTransits() {
  return (
    <div className="mt-4 pt-4 border-t border-primary/7">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-primary text-sm flex items-center gap-1.5">
          <Orbit size={14} color="#424874" strokeWidth={2} />
          Planetary Transits
        </h3>
        <span className="text-[10px] text-gold cursor-pointer font-medium flex items-center gap-1">
          <Zap size={10} strokeWidth={2} /> Impact on sales
        </span>
      </div>

      {/* Transit Rows */}
      {TRANSITS.map((t) => (
        <div
          key={t.name}
          className="flex items-center gap-2.5 py-2 border-b border-primary/5 last:border-none"
        >
          {/* Planet symbol */}
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm shrink-0">
            {t.planet}
          </div>

          {/* Name & Description */}
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-black">{t.name}</div>
            <div className="text-[10.5px] text-primary/40 mt-0.5">
              {t.desc}
            </div>
          </div>

          {/* Level badge */}
          <span
            className={`text-[10px] px-2 py-1 rounded-full font-medium shrink-0 ${t.levelClass}`}
          >
            {t.level}
          </span>
        </div>
      ))}
    </div>
  );
}