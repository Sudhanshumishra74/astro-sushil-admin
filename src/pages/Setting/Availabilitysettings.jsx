/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
  Loader2,
  Settings2,
  Calendar,
  AlertCircle,
  Unlock,
  Lock,
  Zap,
  Timer,
} from "lucide-react";
import { useAvailabilityStore } from "../../store/useAvailabilityStore";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

function fmtDate(d) {
  const day = String(d.getDate()).padStart(2, "0");
  const mon = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}-${mon}-${d.getFullYear()}`;
}
function generateSlots(startTime, endTime, duration, gap) {
  const slots = [];

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  let cur = sh * 60 + sm;
  const end = eh * 60 + em;

  while (cur + duration <= end) {
    const startH = String(Math.floor(cur / 60)).padStart(2, "0");
    const startM = String(cur % 60).padStart(2, "0");

    const endMin = cur + duration;
    const endH = String(Math.floor(endMin / 60)).padStart(2, "0");
    const endM = String(endMin % 60).padStart(2, "0");

    slots.push(`${startH}:${startM}-${endH}:${endM}`);

    cur += duration + gap;
  }

  return slots;
}
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
const SectionCard = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden"
  >
    <div className="px-4 sm:px-6 py-4 border-b border-primary/10 flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
        <Icon size={15} />
      </div>
      <h3 className="text-sm font-bold text-primary tracking-tight font-heading">
        {title}
      </h3>
    </div>
    <div className="px-4 sm:px-6 py-5">{children}</div>
  </motion.div>
);

const TimeInput = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-primary/60 uppercase tracking-wider">
      {label}
    </label>
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-secondary border border-primary/20 rounded-xl px-3 sm:px-4 py-2.5 text-sm font-mono text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all w-full"
    />
  </div>
);

const NumberInput = ({ label, value, onChange, min, unit }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-primary/60 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-secondary border border-primary/20 rounded-xl px-3 sm:px-4 py-2.5 pr-12 text-sm font-mono text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {unit && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary/40 font-medium">
          {unit}
        </span>
      )}
    </div>
  </div>
);

export default function AvailabilitySettings() {
  const today = new Date();

  const {
    availability,
    schedule,
    blockedDates,
    loading,
    fetchAvailability,
    setAvailability,
    fetchBlockedDates,
    fetchSchedule,
    blockDay,
    unblockDay,
    blockSlots: storeBlockSlots,
    unblockSlots: storeUnblockSlots,
  } = useAvailabilityStore();

  const [settings, setSettings] = useState({
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: 30,
    gap: 20,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (availability) {
      setSettings({
        startTime: availability.startTime ?? "09:00",
        endTime: availability.endTime ?? "01:00",
        slotDuration: availability.slotDuration ?? 30,
        gap: availability.gap ?? 10,
      });
    }
  }, [availability]);

  useEffect(() => {
    fetchAvailability();
  }, []);

  useEffect(() => {
    fetchBlockedDates(calMonth + 1, calYear);
  }, [calMonth, calYear]);

  useEffect(() => {
    if (!selectedDate) return;
    setSelectedSlots([]);
    fetchSchedule(selectedDate);
  }, [selectedDate]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await setAvailability(settings);
      setSettingsSaved(true);
      showToast("Availability settings saved!");
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch {
      showToast("Failed to save settings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleBlockDay = async () => {
    setActionLoading("block-day");
    try {
      await blockDay(selectedDate);
      showToast("Day blocked successfully");
    } catch {
      showToast("Failed to block day", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockDay = async () => {
    setActionLoading("unblock-day");
    try {
      await unblockDay(selectedDate);
      showToast("Day unblocked");
    } catch {
      showToast("Failed to unblock day", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlockSlots = async () => {
    if (!selectedSlots.length) return;
    setActionLoading("block-slots");
    try {
      await storeBlockSlots(selectedDate, selectedSlots);
      await fetchSchedule(selectedDate);
      setSelectedSlots([]);
      showToast(`${selectedSlots.length} slot(s) blocked`);
    } catch {
      showToast("Failed to block slots", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockSlots = async () => {
    if (!selectedSlots.length) return;
    setActionLoading("unblock-slots");
    try {
      await storeUnblockSlots(selectedDate, selectedSlots);
      await fetchSchedule(selectedDate);
      setSelectedSlots([]);
      showToast(`${selectedSlots.length} slot(s) unblocked`);
    } catch {
      showToast("Failed to unblock slots", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const allSlots = generateSlots(
    settings.startTime,
    settings.endTime,
    settings.slotDuration,
    settings.gap,
  );

  const toggleSlot = (slot) =>
    setSelectedSlots((s) =>
      s.includes(slot) ? s.filter((x) => x !== slot) : [...s, slot],
    );

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  };

  const isToday = (day) =>
    new Date(calYear, calMonth, day).toDateString() === today.toDateString();
  const isPast = (day) =>
    new Date(calYear, calMonth, day) < new Date(today.toDateString());
  const isSelected = (day) =>
    selectedDate === fmtDate(new Date(calYear, calMonth, day));
  const isBlocked = (day) =>
    blockedDates.includes(fmtDate(new Date(calYear, calMonth, day)));

  const isDayBlocked = schedule?.isBlocked ?? false;
  const blockedSlots = schedule?.blockedSlots ?? [];
  const isLoadingSchedule = loading && !!selectedDate;

  return (
    <div className="min-h-screen bg-secondary p-3 sm:p-6 font-sans">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold max-w-[calc(100vw-2rem)]
              ${toast.type === "error" ? "bg-red-500 text-white" : "bg-primary text-white"}`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={15} />
            ) : (
              <CheckCircle2 size={15} className="text-gold" />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-2xl flex items-center justify-center shrink-0">
            <Settings2 size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-primary leading-none">
              Availability Settings
            </h1>
            <p className="text-xs text-primary/50 mt-0.5 hidden sm:block">
              Manage your global schedule & date-level controls
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid — stacks on mobile, side-by-side on xl */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* Global Availability */}
          <SectionCard title="Global Availability" icon={Zap}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <TimeInput
                label="Start Time"
                value={settings.startTime}
                onChange={(v) => setSettings((s) => ({ ...s, startTime: v }))}
              />
              <TimeInput
                label="End Time"
                value={settings.endTime}
                onChange={(v) => setSettings((s) => ({ ...s, endTime: v }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <NumberInput
                label="Slot Duration"
                value={settings.slotDuration}
                onChange={(v) =>
                  setSettings((s) => ({ ...s, slotDuration: v }))
                }
                min={5}
                unit="min"
              />
              <NumberInput
                label="Gap Between Slots"
                value={settings.gap}
                onChange={(v) => setSettings((s) => ({ ...s, gap: v }))}
                min={0}
                unit="min"
              />
            </div>

            {/* Slot Preview */}
            <div className="bg-secondary rounded-xl p-3 sm:p-4 mb-5 border border-primary/10">
              <p className="text-xs font-semibold text-primary/60 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Timer size={12} /> Slot Preview
              </p>
              <div className="flex flex-wrap gap-1.5">
                {allSlots.slice(0, 12).map((slot) => (
                  <span
                    key={slot}
                    className="bg-white border border-primary/15 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-mono text-primary shadow-sm"
                  >
                    {slot}
                  </span>
                ))}
                {allSlots.length > 12 && (
                  <span className="bg-primary/10 rounded-lg px-2.5 py-1 text-xs text-primary/60 font-medium">
                    +{allSlots.length - 12} more
                  </span>
                )}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {savingSettings ? (
                <Loader2 size={15} className="animate-spin" />
              ) : settingsSaved ? (
                <CheckCircle2 size={15} className="text-gold" />
              ) : (
                <Save size={15} />
              )}
              {savingSettings
                ? "Saving..."
                : settingsSaved
                  ? "Saved!"
                  : "Save Settings"}
            </motion.button>
          </SectionCard>

          {/* Date Schedule Panel */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                key="date-panel"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <SectionCard
                  title={`Schedule — ${selectedDate}`}
                  icon={Calendar}
                >
                  {isLoadingSchedule ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2
                        size={20}
                        className="animate-spin text-primary/40"
                      />
                    </div>
                  ) : (
                    <>
                      <div
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl mb-5 border
                        ${
                          isDayBlocked
                            ? "bg-red-50 border-red-200"
                            : "bg-secondary border-primary/15"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isDayBlocked ? (
                            <Lock size={15} className="text-red-500 shrink-0" />
                          ) : (
                            <Unlock
                              size={15}
                              className="text-primary shrink-0"
                            />
                          )}
                          <div>
                            <p className="text-sm font-bold text-primary">
                              {isDayBlocked
                                ? "Day is Blocked"
                                : "Day is Available"}
                            </p>
                            <p className="text-xs text-primary/50">
                              {isDayBlocked
                                ? "No bookings accepted"
                                : "Accepting bookings"}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={
                            isDayBlocked ? handleUnblockDay : handleBlockDay
                          }
                          disabled={!!actionLoading}
                          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60
                            ${
                              isDayBlocked
                                ? "bg-primary hover:bg-primary/90 text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                        >
                          {actionLoading === "block-day" ||
                          actionLoading === "unblock-day" ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : isDayBlocked ? (
                            <Unlock size={12} />
                          ) : (
                            <Lock size={12} />
                          )}
                          {isDayBlocked ? "Unblock Day" : "Block Full Day"}
                        </motion.button>
                      </div>

                      {/* Slot Grid */}
                      {!isDayBlocked && (
                        <>
                          <p className="text-xs font-semibold text-primary/60 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Clock size={12} /> Select Slots to Block / Unblock
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-4 gap-2 mb-4">
                            {allSlots.map((slot) => {
                              const isBlockedSlot = blockedSlots.includes(slot);
                              const isChosen = selectedSlots.includes(slot);
                              return (
                                <motion.button
                                  key={slot}
                                  whileTap={{ scale: 0.93 }}
                                  onClick={() => toggleSlot(slot)}
                                  className={`py-2 rounded-xl text-xs font-mono font-semibold border transition-all duration-150
                                    ${
                                      isChosen
                                        ? "bg-primary border-primary text-white shadow-md"
                                        : isBlockedSlot
                                          ? "bg-red-50 border-red-200 text-red-400 line-through"
                                          : "bg-secondary border-primary/15 text-primary hover:border-primary/40 hover:bg-primary/10"
                                    }`}
                                >
                                  {slot}
                                </motion.button>
                              );
                            })}
                          </div>

                          <AnimatePresence>
                            {selectedSlots.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-col sm:flex-row gap-2 overflow-hidden"
                              >
                                <button
                                  onClick={handleBlockSlots}
                                  disabled={!!actionLoading}
                                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
                                >
                                  {actionLoading === "block-slots" ? (
                                    <Loader2
                                      size={12}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Ban size={12} />
                                  )}
                                  Block {selectedSlots.length} Slot
                                  {selectedSlots.length > 1 ? "s" : ""}
                                </button>
                                <button
                                  onClick={handleUnblockSlots}
                                  disabled={!!actionLoading}
                                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
                                >
                                  {actionLoading === "unblock-slots" ? (
                                    <Loader2
                                      size={12}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <CheckCircle2 size={12} />
                                  )}
                                  Unblock {selectedSlots.length} Slot
                                  {selectedSlots.length > 1 ? "s" : ""}
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </>
                  )}
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN — Calendar */}
        <div>
          <SectionCard title="Calendar" icon={Calendar}>
            {/* Month Nav */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-xl hover:bg-primary/10 flex items-center justify-center text-primary transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-heading text-sm font-bold text-primary">
                {MONTHS[calMonth]} {calYear}
              </span>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-xl hover:bg-primary/10 flex items-center justify-center text-primary transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-bold text-primary/40 py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const past = isPast(day);
                const todayDay = isToday(day);
                const selected = isSelected(day);
                const blocked = isBlocked(day);

                return (
                  <motion.button
                    key={day}
                    whileTap={past ? {} : { scale: 0.88 }}
                    onClick={() => {
                      if (past) return;
                      const d = fmtDate(new Date(calYear, calMonth, day));
                      setSelectedDate((prev) => (prev === d ? null : d));
                    }}
                    disabled={past}
                    className={`relative aspect-square rounded-xl flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-150
                      ${past ? "text-primary/20 cursor-not-allowed" : "cursor-pointer"}
                      ${selected ? "bg-primary text-white shadow-lg" : ""}
                      ${!selected && todayDay ? "bg-gold/20 text-primary ring-2 ring-gold" : ""}
                      ${!selected && !todayDay && !past ? "hover:bg-primary/10 text-primary" : ""}
                      ${blocked && !selected ? "text-red-400 bg-red-200" : ""}
                    `}
                  >
                    {day}
                    {blocked && !selected && (
                      <span className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-primary/10 flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-primary/60">
                <div className="w-3 h-3 rounded-full bg-primary" /> Selected
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary/60">
                <div className="w-3 h-3 rounded-full bg-gold/30 ring-1 ring-gold" />{" "}
                Today
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary/60">
                <div className="w-3 h-3 rounded-full bg-red-400" /> Blocked
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                <p className="text-xs text-red-400 font-semibold uppercase tracking-wider">
                  Blocked Days
                </p>
                <p className="text-xl font-bold text-red-500 font-heading mt-0.5">
                  {blockedDates.length}
                </p>
                <p className="text-xs text-red-300">this month</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-3 border border-primary/15">
                <p className="text-xs text-primary/60 font-semibold uppercase tracking-wider">
                  Daily Slots
                </p>
                <p className="text-xl font-bold text-primary font-heading mt-0.5">
                  {allSlots.length}
                </p>
                <p className="text-xs text-primary/40">generated</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
