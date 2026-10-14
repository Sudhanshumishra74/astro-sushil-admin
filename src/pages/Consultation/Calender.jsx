/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  ChevronRight,
  X,
  ChevronLeft,
  CalendarOff,
  RotateCcw,
  Ban,
} from "lucide-react";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAvailabilityStore } from "../../store/useAvailabilityStore";

const formatDateStr = (date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

const parseDateStr = (str) => {
  const [d, m, y] = str.split("-");
  return new Date(+y, +m - 1, +d);
};

const LegendDot = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-[10px] text-black">{label}</span>
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 pb-1">
    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
      <Icon size={15} className="text-primary" />
    </div>
    <div>
      <h3 className="text-sm font-bold text-black">{title}</h3>
      <p className="text-xs text-black">{subtitle}</p>
    </div>
  </div>
);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export function Callender() {
  const {
    blockDay,
    unblockDay,
    fetchSchedule,
    schedule,
    blockedDates,
    fetchBlockedDates,
  } = useAvailabilityStore();

  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  const isBlocked = (d) => {
    if (!d) return false;
    return blockedDates.includes(formatDateStr(new Date(calYear, calMonth, d)));
  };

  const isInRange = (d) => {
    if (!d || !rangeStart) return false;
    const target = new Date(calYear, calMonth, d);
    const end = rangeEnd || hoverDate;
    if (!end) return false;
    const [s, e] = rangeStart <= end ? [rangeStart, end] : [end, rangeStart];
    return target >= s && target <= e;
  };

  const isRangeStart = (d) =>
    d &&
    rangeStart &&
    formatDateStr(new Date(calYear, calMonth, d)) === formatDateStr(rangeStart);

  const isRangeEnd = (d) =>
    d &&
    rangeEnd &&
    formatDateStr(new Date(calYear, calMonth, d)) === formatDateStr(rangeEnd);

  const handleDayClick = (d) => {
    if (!d) return;
    const date = new Date(calYear, calMonth, d);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      setRangeEnd(date);
    }
  };
  const blockRange = async () => {
    if (!rangeStart) return;

    const end = rangeEnd || rangeStart;
    const [s, e] = rangeStart <= end ? [rangeStart, end] : [end, rangeStart];

    const cur = new Date(s);

    while (cur <= e) {
      const formatted = formatDateStr(new Date(cur));

      // 🔥 backend call
      await blockDay(formatted);

      cur.setDate(cur.getDate() + 1);
    }

    // UI update (same design)
    const dates = [];
    const cur2 = new Date(s);
    while (cur2 <= e) {
      dates.push(formatDateStr(new Date(cur2)));
      cur2.setDate(cur2.getDate() + 1);
    }

    setRangeStart(null);
    setRangeEnd(null);
  };

  const unblockDate = async (date) => {
    await unblockDay(date);
  };

  

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d);

  const sortedBlocked = [...blockedDates].sort(
    (a, b) => parseDateStr(a) - parseDateStr(b),
  );
  useEffect(() => {
    const month = calMonth + 1;
    const year = calYear;
  }, [calMonth, calYear]);
  useEffect(() => {
    fetchBlockedDates(calMonth + 1, calYear);
  }, [calMonth, calYear]);
  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-5">
        <SectionHeader
          icon={Ban}
          title="Block Dates"
          subtitle="Select a date range to mark as globally unavailable"
        />

        {/* Calendar */}
        <div className="bg-white border border-[#e0d9f5] rounded-2xl p-5 shadow-sm">
          {/* Nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                const d = new Date(calYear, calMonth - 1, 1);
                setCalYear(d.getFullYear());
                setCalMonth(d.getMonth());
                setRangeStart(null);
                setRangeEnd(null);
              }}
              className="w-8 h-8 rounded-lg border border-[#d8d0ee] flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronLeft size={14} className="text-black" />
            </button>
            <div className="text-center">
              <p className="text-base font-black text-black">
                {MONTHS[calMonth]}
              </p>
              <p className="text-xs text-black">{calYear}</p>
            </div>
            <button
              onClick={() => {
                const d = new Date(calYear, calMonth + 1, 1);
                setCalYear(d.getFullYear());
                setCalMonth(d.getMonth());
                setRangeStart(null);
                setRangeEnd(null);
              }}
              className="w-8 h-8 rounded-lg border border-[#d8d0ee] flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronRight size={14} className="text-black" />
            </button>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-bold text-[#b0a8c8] uppercase py-1.5"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((d, i) => {
              if (!d) return <div key={`e${i}`} />;
              const blocked = isBlocked(d);
              const inRange = isInRange(d);
              const isStart = isRangeStart(d);
              const isEnd = isRangeEnd(d);
              const isToday =
                formatDateStr(new Date()) ===
                formatDateStr(new Date(calYear, calMonth, d));
              return (
                <motion.button
                  key={d}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => !blocked && handleDayClick(d)}
                  onMouseEnter={() =>
                    rangeStart &&
                    !rangeEnd &&
                    setHoverDate(new Date(calYear, calMonth, d))
                  }
                  onMouseLeave={() => setHoverDate(null)}
                  className={` aspect-square rounded-xl text-xs font-bold flex items-center justify-center transition-all duration-100 relative select-none ${
                    blocked
                      ? "bg-red-100 text-red-500 border border-red-200 cursor-pointer hover:bg-red-200"
                      : isStart || isEnd
                        ? "bg-primary text-white shadow-md shadow-primary/30"
                        : inRange
                          ? "bg-primary/20 text-primary"
                          : isToday
                            ? "bg-gold/15 text-gold border border-gold/30"
                            : "hover:bg-primary/10 hover:text-primary text-black cursor-pointer"
                  }`}
                >
                  {d}
                  {blocked && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-4 pt-3 border-t border-[#ede8f8] flex-wrap">
            <LegendDot color="bg-primary" label="Range start/end" />
            <LegendDot color="bg-primary/20" label="In range" />
            <LegendDot color="bg-gold" label="Today" />
            <LegendDot color="bg-red-400" label="Blocked" />
          </div>
        </div>

        {/* Range Action */}
        <AnimatePresence>
          {rangeStart && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-black">
                  {rangeStart && !rangeEnd
                    ? `Start: ${formatDateStr(rangeStart)} — Click end date`
                    : `Blocking: ${formatDateStr(rangeStart)} → ${formatDateStr(rangeEnd)}`}
                </p>
              </div>
              {rangeStart && rangeEnd && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={blockRange}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Ban size={12} /> Block Range
                </motion.button>
              )}
              <button
                onClick={() => {
                  setRangeStart(null);
                  setRangeEnd(null);
                }}
                className="w-8 h-8 rounded-lg bg-white border border-[#d8d0ee] flex items-center justify-center text-black hover:text-black transition-colors"
              >
                <X size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right — Blocked List */}
      <div className="w-64 shrink-0 hidden lg:block">
        <div className="bg-white border border-[#e0d9f5] rounded-2xl overflow-hidden shadow-sm sticky top-0">
          <div className="px-4 py-3.5 border-b border-[#ede8f8] bg-[#faf8ff] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-black">Blocked Dates</p>
              <p className="text-[10px] text-black">
                Global (All Consultations)
              </p>
            </div>
           
          </div>

          <div className="max-h-96 overflow-y-auto">
            {sortedBlocked.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <CalendarOff size={24} className="text-[#d8d0ee] mb-2" />
                <p className="text-xs text-[#b0a8c8]">No dates blocked</p>
                <p className="text-[10px] text-[#b0a8c8] mt-0.5">
                  Select range on calendar
                </p>
              </div>
            ) : (
              <div className="p-3 space-y-1.5">
                <AnimatePresence>
                  {sortedBlocked.map((date) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-3 py-2"
                    >
                      <span className="text-xs text-red-600 font-mono font-semibold">
                        {date}
                      </span>
                      <button
                        onClick={() => unblockDate(date)}
                        className="w-5 h-5 rounded-md cursor-pointer hover:bg-red-200 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {sortedBlocked.length > 0 && (
            <div className="px-4 py-2.5 border-t border-[#ede8f8] bg-[#faf8ff]">
              <p className="text-[10px] text-black text-center">
                <span className="font-bold text-red-500">
                  {sortedBlocked.length}
                </span>{" "}
                date{sortedBlocked.length !== 1 ? "s" : ""} blocked
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
