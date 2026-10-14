/* eslint-disable no-unused-vars */


import React from "react";
import { CheckCircle2, UserCircle, Layers, Calendar, IndianRupee, AlertCircle, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader, ConfirmRow, fadeSlide, formatDateStr } from "./bookingUtil";

export default function ConfirmStep({
  activeCustomer,
  selectedConsult,
  selectedDate,
  selectedSlot,
  note,
  setNote,
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  error,
}) {
  const basePrice = selectedConsult?.price || 0;
  const gst = selectedConsult?.gst;
  const gstRate = gst?.enabled ? Number(gst.rate) || 0 : 0;
  const isExclusiveGst = gst?.type === "exclusive";

  const rawDiscount =
    discountType === "PERCENTAGE"
      ? (basePrice * (Number(discountValue) || 0)) / 100
      : Number(discountValue) || 0;

  const appliedDiscount = Math.min(Math.max(rawDiscount, 0), basePrice);
  // Consultation prices are GST-inclusive by default (the configured price
  // already has tax baked in, so discounting it is the final charge — no
  // tax gets added on top). Only an "exclusive"-type mode adds GST on top
  // of the discounted price, mirroring booking.controller.js's
  // createAdminBooking (computeGst runs on priceInr - discountAmount).
  const taxableAmount = basePrice - appliedDiscount;
  const gstAmount = !gstRate
    ? 0
    : isExclusiveGst
      ? Math.round(((taxableAmount * gstRate) / 100) * 100) / 100
      : Math.round((taxableAmount - taxableAmount / (1 + gstRate / 100)) * 100) / 100;
  const discountedPrice = isExclusiveGst ? Math.round((taxableAmount + gstAmount) * 100) / 100 : taxableAmount;
  return (
    <motion.div
      key="step2"
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <SectionHeader
        icon={CheckCircle2}
        title="Confirm Booking"
        subtitle="Review and place the appointment"
      />

      {/* Summary rows */}
      <div className="space-y-3">
        <ConfirmRow
          icon={UserCircle}
          label="Customer"
          value={activeCustomer?.name || activeCustomer?.firstName}
          sub={activeCustomer?.phone || activeCustomer?.phoneNumber}
        />
        <ConfirmRow
          icon={Layers}
          label="Service"
          value={`${selectedConsult?.title} ${selectedConsult?.mode === "video" ? "🎥" : "🎙️"}`}
          sub={`${selectedConsult?.mode} · ${selectedConsult?.duration} min`}
        />
        <ConfirmRow
          icon={Calendar}
          label="Date & Time"
          value={selectedDate ? formatDateStr(selectedDate) : ""}
          sub={selectedSlot}
        />
      </div>

      {/* Discount */}
      <div>
        <label className="text-xs font-medium text-black flex items-center gap-1.5 mb-1.5">
          <Percent size={12} /> Discount (optional)
        </label>
        <div className="flex gap-2">
          <div className="flex rounded-xl border border-[#d8d0ee] overflow-hidden shrink-0">
            {["FLAT", "PERCENTAGE"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDiscountType(discountType === t ? null : t)}
                className={`px-3 py-2.5 text-xs font-semibold transition-colors ${
                  discountType === t
                    ? "bg-primary text-white"
                    : "bg-white text-black hover:bg-secondary"
                }`}
              >
                {t === "FLAT" ? "₹ Flat" : "% Off"}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={0}
            max={discountType === "PERCENTAGE" ? 100 : undefined}
            disabled={!discountType}
            value={discountValue || ""}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder={discountType ? "Enter value" : "Select type first"}
            className="flex-1 bg-secondary border border-[#d8d0ee] rounded-xl px-4 py-2.5 text-sm text-black
              placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2
              focus:ring-primary/10 transition-all disabled:opacity-50"
          />
        </div>
      </div>

      {/* Total */}
      <div className="bg-[#faf8ff] border border-[#e0d9f5] rounded-xl p-4 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-black">Service Price</span>
          <span className="text-sm font-semibold text-black flex items-center gap-0.5">
            <IndianRupee size={12} />
            {basePrice.toLocaleString()}
          </span>
        </div>

        {appliedDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-600">Discount</span>
            <span className="text-sm font-semibold text-green-600 flex items-center gap-0.5">
              − <IndianRupee size={12} />
              {appliedDiscount.toLocaleString()}
            </span>
          </div>
        )}

        {isExclusiveGst && gstAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-black">GST ({gstRate}%)</span>
            <span className="text-sm font-semibold text-black flex items-center gap-0.5">
              + <IndianRupee size={12} />
              {gstAmount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1.5 border-t border-[#e0d9f5]">
          <span className="text-sm font-semibold text-black">Total Amount</span>
          <span className="text-lg font-black text-primary flex items-center gap-0.5">
            <IndianRupee size={15} />
            {discountedPrice.toLocaleString()}
          </span>
        </div>

        {selectedConsult?.priceLabel && (
          <p className="text-xs text-[#b0a8c8] text-right">{selectedConsult.priceLabel}</p>
        )}
        {gstRate > 0 && (
          <p className="text-[10px] text-[#b0a8c8] text-right">
            {isExclusiveGst ? "Plus applicable GST" : "Includes applicable GST"}
          </p>
        )}
      </div>

      {/* Optional note */}
      <div>
        <label className="text-xs font-medium text-black block mb-1.5">
          Booking Note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Any special instructions..."
          className="w-full bg-secondary border border-[#d8d0ee] rounded-xl px-4 py-2.5 text-sm text-black
            placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2
            focus:ring-primary/10 transition-all resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </motion.div>
  );
}