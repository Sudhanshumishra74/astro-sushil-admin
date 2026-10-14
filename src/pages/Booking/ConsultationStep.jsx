/* eslint-disable no-unused-vars */
// ─── ConsultationStep.jsx ─────────────────────────────────────────────────────
// Step 1: Pick a consultation service, then pick date + time slot.

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Clock, IndianRupee, ChevronLeft, ChevronRight, Loader2, Layers, CalendarDays,
} from "lucide-react";
import {
  TInput, SectionHeader, LegendDot,
  fadeUp, stagger, cardItem,
  MONTHS, DAYS, formatDateStr,
} from "./bookingUtil";

// ── Mini Calendar ─────────────────────────────────────────────────────────────
function BookingCalendar({ calendarDate, setCalendarDate, selectedDate, setSelectedDate, selectedConsult }) {
  const year     = calendarDate.getFullYear();
  const month    = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDay  = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) cells.push(d);

  const isBlocked = (d) =>
    d && selectedConsult?.unavailableDates?.includes(formatDateStr(new Date(year, month, d)));

  const isPast = (d) =>
    d && new Date(year, month, d) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="bg-white border border-[#e0d9f5] rounded-2xl p-4">
      {/* Month navigator */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
          className="w-8 h-8 rounded-lg border border-[#d8d0ee] flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ChevronLeft size={14} className="text-black" />
        </button>
        <span className="text-sm font-bold text-black">{MONTHS[month]} {year}</span>
        <button
          onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
          className="w-8 h-8 rounded-lg border border-[#d8d0ee] flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ChevronRight size={14} className="text-black" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-[#b0a8c8] uppercase py-1">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;

          const blocked    = isBlocked(d);
          const past       = isPast(d);
          const dateObj    = new Date(year, month, d);
          const isSelected = selectedDate && formatDateStr(selectedDate) === formatDateStr(dateObj);
          const isToday    = formatDateStr(new Date()) === formatDateStr(dateObj);
          const disabled   = blocked || past;

          return (
            <motion.button
              key={d}
              whileTap={disabled ? {} : { scale: 0.9 }}
              disabled={disabled}
              onClick={() => setSelectedDate(dateObj)}
              className={`aspect-square rounded-lg text-xs font-semibold flex items-center justify-center transition-all duration-150 relative ${
                isSelected
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : blocked
                  ? "bg-red-50 text-red-300 border border-red-100 cursor-not-allowed"
                  : past
                  ? "text-[#d8d0ee] cursor-not-allowed"
                  : isToday
                  ? "bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20"
                  : "hover:bg-primary/10 hover:text-primary text-black"
              }`}
            >
              {d}
              {blocked && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#ede8f8]">
        <LegendDot color="bg-primary" label="Selected" />
        <LegendDot color="bg-gold"    label="Today"    />
        <LegendDot color="bg-red-300" label="Blocked"  />
      </div>
    </div>
  );
}

// ── Time Slot Grid ─────────────────────────────────────────────────────────────
function TimeSlots({ slots, slotsLoading, selectedDate, selectedSlot, setSelectedSlot }) {
  if (!selectedDate) return null;

  return (
    <AnimatePresence>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" exit="exit">
        <p className="text-xs font-semibold text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Clock size={11} className="text-primary" />
          Available Slots — {formatDateStr(selectedDate)}
        </p>

        {slotsLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 size={18} className="animate-spin text-primary/40" />
          </div>
        ) : slots.length === 0 ? (
          <p className="text-xs text-[#b0a8c8] py-3 text-center bg-secondary rounded-xl border border-[#e0d9f5]">
            No slots available for this date
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {slots.map(({ slot, status }) => {
              const isBooked = status === "booked";
              const isSelected = selectedSlot === slot;
              return (
                <motion.button
                  key={slot}
                  whileTap={isBooked ? {} : { scale: 0.94 }}
                  disabled={isBooked}
                  onClick={() => !isBooked && setSelectedSlot(slot)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    isBooked
                      ? "bg-red-50 border-red-200 text-red-400 cursor-not-allowed"
                      : isSelected
                        ? "bg-primary border-primary text-white shadow-sm"
                        : "bg-white border-[#d8d0ee] text-black hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {slot}
                  {isBooked && (
                    <span className="block text-[9px] font-medium text-red-400 leading-none mt-0.5">
                      Booked
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default function ConsultationStep({
  consultations,      // list from store
  consultSearch,
  setConsultSearch,
  selectedConsult,
  setSelectedConsult,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  calendarDate,
  setCalendarDate,
  slots,
  slotsLoading,
}) {
  const filtered = consultations.filter(
    (c) => !consultSearch || c.title?.toLowerCase().includes(consultSearch.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* ── Service list ── */}
      <SectionHeader icon={Layers} title="Select Service" subtitle="Choose the consultation type" />

      <TInput
        icon={Search}
        placeholder="Search services..."
        value={consultSearch}
        onChange={(e) => setConsultSearch(e.target.value)}
      />

      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2">
        {filtered.map((c) => (
          <motion.button
            key={c._id}
            variants={cardItem}
            onClick={() => {
              setSelectedConsult(c);
              setSelectedDate(null);
              setSelectedSlot(null);
            }}
            className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
              selectedConsult?._id === c._id
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : "border-[#e0d9f5] bg-white hover:border-primary/40 hover:bg-[#faf8ff]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left: dot + title + mode badge */}
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${c.type === "special" ? "bg-gold" : "bg-primary"}`} />
                <div>
                  <p className="text-sm font-bold text-black">{c.title}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                      c.mode === "video"
                        ? "bg-blue-50 text-blue-500 border border-blue-100"
                        : "bg-purple-50 text-purple-500 border border-purple-100"
                    }`}
                  >
                    {c.mode === "video" ? "🎥" : "🎙️"} {c.mode}
                  </span>
                </div>
              </div>

              {/* Right: price + duration */}
              <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
                <p className="text-base font-black text-primary flex items-center gap-0.5">
                  <IndianRupee size={13} />
                  {c.price?.toLocaleString()}
                </p>
                <span className="flex items-center gap-1 text-[11px] text-black bg-secondary px-2 py-0.5 rounded-lg border border-[#ede8f8]">
                  <Clock size={10} className="text-[#b0a8c8]" />
                  {c.duration} min
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* ── Calendar + Slots (shown after service selected) ── */}
      <AnimatePresence>
        {selectedConsult && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-4">
            <SectionHeader icon={CalendarDays} title="Pick Date & Time" subtitle="Select an available slot" />

            <BookingCalendar
              calendarDate={calendarDate}
              setCalendarDate={setCalendarDate}
              selectedDate={selectedDate}
              setSelectedDate={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
              selectedConsult={selectedConsult}
            />

            <TimeSlots
              slots={slots}
              slotsLoading={slotsLoading}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}