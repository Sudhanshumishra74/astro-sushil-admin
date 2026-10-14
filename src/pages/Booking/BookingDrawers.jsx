/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  CalendarDays,
  Loader2,
} from "lucide-react";

import { useCustomerStore } from "../../store/useCustomerStore";
import { useConsultationStore } from "../../store/useConsultationStore";
import { useBookingStore } from "../../store/useBookingStore";
import { useAvailabilityStore } from "../../store/useAvailabilityStore";

import {
  drawerVariants,
  overlayVariants,
  fadeSlide,
  formatDateStr,
  Stepper,
} from "./bookingUtil";
import CustomerStep from "./CustomerStep";
import ConsultationStep from "./ConsultationStep";
import ConfirmStep from "./ConfirmStep";

// ── Initial state factory ─────────────────────────────────────────────────────
const initState = () => ({
  step: 0,
  customerMode: "existing",
  customerSearch: "",
  selectedCustomer: null,
  newCustomer: { name: "", phone: "", email: "", city: "" },
  consultSearch: "",
  selectedConsult: null,
  selectedDate: null,
  selectedSlot: null,
  calendarDate: new Date(),
  note: "",
  discountType: "FLAT",
  discountValue: "",
  error: "",
});

// ─────────────────────────────────────────────────────────────────────────────
export default function BookingDrawer({ open, onClose }) {
  const { customers, fetchCustomers } = useCustomerStore();
  const { bookingconsultations, fetchConsultationsadmin } =
    useConsultationStore();
  const { createBooking, creating } = useBookingStore();
  const { slots, fetchSlots, loading: slotsLoading } = useAvailabilityStore();

  // ── State ──────────────────────────────────────────────────────────────────
  const [s, setS] = useState(initState()); // single state object
  const set = (patch) => setS((prev) => ({ ...prev, ...patch }));

  // Fetch on open
  useEffect(() => {
    if (open) {
      fetchCustomers();
      fetchConsultationsadmin();
    }
  }, [open]);

  // Fetch slots whenever date or consultation changes
  useEffect(() => {
    if (s.selectedDate && s.selectedConsult?.consultationId) {
      fetchSlots(
        formatDateStr(s.selectedDate),
        s.selectedConsult.consultationId,
      );
      set({ selectedSlot: null });
    }
  }, [s.selectedDate, s.selectedConsult]);

  console.log("STATE", s);
  console.log("Slots: ", slots);

  // ── Derived ────────────────────────────────────────────────────────────────
  const activeCustomer =
    s.customerMode === "existing"
      ? s.selectedCustomer
      : s.newCustomer.name
        ? s.newCustomer
        : null;

  // ── Step validation ────────────────────────────────────────────────────────
  const canProceed = [
    () =>
      !!activeCustomer &&
      (s.customerMode === "existing" ||
        !!(s.newCustomer.name && s.newCustomer.phone)),
    () => !!s.selectedConsult && !!s.selectedDate && !!s.selectedSlot,
    () => true,
  ];

  // ── Handlers ──────────────────────────────────────────────────────────────
  // Reset state + close — call this ONLY on success or user-initiated cancel
  const handleClose = () => {
    setS(initState());
    onClose();
  };

  const handleBook = async () => {
    set({ error: "" });

    const payload = {
      consultationId: s.selectedConsult?.consultationId,
      mode: s.selectedConsult?.mode,
      date: formatDateStr(s.selectedDate),
      slot: s.selectedSlot,
      userId: s.customerMode === "existing" ? activeCustomer?._id : undefined,
      name: s.customerMode === "new" ? s.newCustomer.name : undefined,
      phone: s.customerMode === "new" ? s.newCustomer.phone : undefined,
      email: s.customerMode === "new" ? s.newCustomer.email : undefined,
      ...(s.discountType && Number(s.discountValue) > 0
        ? { discountType: s.discountType, discountValue: Number(s.discountValue) }
        : {}),
      ...(s.note?.trim() ? { note: s.note.trim() } : {}),
    };

    let ok;
    try {
      ok = await createBooking(payload);
    } catch (err) {
      ok = false;
    }

    // Only close on explicit true — anything else = show error, stay open
    if (ok === true) {
      handleClose();
    } else {
      set({ error: "Something went wrong. Please try again." });
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Drawer panel */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white border-l border-[#e0d9f5] z-50 flex flex-col shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#ede8f8] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CalendarDays size={16} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-black">New Booking</h2>
                  <p className="text-xs text-black">Fill in booking details</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg cursor-pointer hover:bg-secondary flex items-center justify-center text-black transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* ── Stepper ── */}
            <Stepper step={s.step} />

            {/* ── Step body ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <AnimatePresence mode="wait">
                {s.step === 0 && (
                  <motion.div
                    key="s0"
                    variants={fadeSlide}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <CustomerStep
                      customers={customers}
                      customerMode={s.customerMode}
                      setCustomerMode={(v) => set({ customerMode: v })}
                      customerSearch={s.customerSearch}
                      setCustomerSearch={(v) => set({ customerSearch: v })}
                      selectedCustomer={s.selectedCustomer}
                      setSelectedCustomer={(v) => set({ selectedCustomer: v })}
                      newCustomer={s.newCustomer}
                      setNewCustomer={(fn) =>
                        set({ newCustomer: fn(s.newCustomer) })
                      }
                    />
                  </motion.div>
                )}

                {s.step === 1 && (
                  <motion.div
                    key="s1"
                    variants={fadeSlide}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <ConsultationStep
                      consultations={bookingconsultations}
                      consultSearch={s.consultSearch}
                      setConsultSearch={(v) => set({ consultSearch: v })}
                      selectedConsult={s.selectedConsult}
                      setSelectedConsult={(v) => set({ selectedConsult: v })}
                      selectedDate={s.selectedDate}
                      setSelectedDate={(v) => set({ selectedDate: v })}
                      selectedSlot={s.selectedSlot}
                      setSelectedSlot={(v) => set({ selectedSlot: v })}
                      calendarDate={s.calendarDate}
                      setCalendarDate={(v) => set({ calendarDate: v })}
                      slots={slots}
                      slotsLoading={slotsLoading}
                    />
                  </motion.div>
                )}

                {s.step === 2 && (
                  <motion.div
                    key="s2"
                    variants={fadeSlide}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <ConfirmStep
                      activeCustomer={activeCustomer}
                      selectedConsult={s.selectedConsult}
                      selectedDate={s.selectedDate}
                      selectedSlot={s.selectedSlot}
                      note={s.note}
                      setNote={(v) => set({ note: v })}
                      discountType={s.discountType}
                      setDiscountType={(v) => set({ discountType: v, discountValue: "" })}
                      discountValue={s.discountValue}
                      setDiscountValue={(v) => set({ discountValue: v })}
                      error={s.error}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer actions ── */}
            <div className="px-6 py-4 border-t border-[#ede8f8] flex gap-3 shrink-0">
              {/* Back / Cancel */}
              <button
                onClick={
                  s.step > 0 ? () => set({ step: s.step - 1 }) : handleClose
                }
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#d8d0ee] text-black text-sm font-semibold hover:bg-secondary transition-colors"
              >
                {s.step > 0 ? (
                  <>
                    <ChevronLeft size={15} /> Back
                  </>
                ) : (
                  "Cancel"
                )}
              </button>

              {/* Continue / Confirm */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={!canProceed[s.step]() || creating}
                onClick={() =>
                  s.step < 2 ? set({ step: s.step + 1 }) : handleBook()
                }
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-[#363b62] text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Creating...
                  </>
                ) : s.step < 2 ? (
                  <>
                    Continue <ChevronRight size={15} />
                  </>
                ) : (
                  <>
                    <Check size={15} /> Confirm Booking
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
