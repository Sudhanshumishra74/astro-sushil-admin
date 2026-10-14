/* eslint-disable no-unused-vars */
// CustomerStep.jsx

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, MapPin, Search, Check, ChevronDown } from "lucide-react";
import { TInput, SectionHeader, fadeUp } from "./bookingUtil";
import { UserCircle } from "lucide-react";
import AdminPhoneInput from "../../components/common/AdminPhoneInput";

export default function CustomerStep({
  customers,
  customerMode,
  setCustomerMode,
  customerSearch,
  setCustomerSearch,
  selectedCustomer,
  setSelectedCustomer,
  newCustomer,
  setNewCustomer,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = customers.filter(
    (c) =>
      !customerSearch ||
      c.firstName?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phoneNumber?.includes(customerSearch),
  );

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={UserCircle}
        title="Customer Details"
        subtitle="Search existing or add new customer"
      />

      {/* Mode toggle */}
      <div className="flex bg-secondary border border-[#d8d0ee] rounded-xl p-1 gap-1">
        {["existing", "new"].map((m) => (
          <button
            key={m}
            onClick={() => setCustomerMode(m)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              customerMode === m
                ? "bg-primary text-white shadow-sm"
                : "text-black hover:text-black"
            }`}
          >
            {m === "existing" ? "Existing Customer" : "New Customer"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {customerMode === "existing" ? (
          <motion.div
            key="existing"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Searchable Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {/* Trigger button */}
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white border rounded-xl text-sm transition-all ${
                  dropdownOpen
                    ? "border-primary ring-2 ring-primary/10"
                    : "border-[#d8d0ee] hover:border-primary/40"
                }`}
              >
                {selectedCustomer ? (
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-secondary text-primary flex items-center justify-center text-xs font-black shrink-0">
                      {selectedCustomer.firstName?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-semibold text-black truncate leading-tight">
                        {selectedCustomer.firstName}
                      </p>
                      <p className="text-xs text-[#b0a8c8]">
                        {selectedCustomer.phoneNumber?.startsWith("+") ? selectedCustomer.phoneNumber : selectedCustomer.phoneNumber ? "+" + selectedCustomer.phoneNumber : ""}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-[#b0a8c8] text-sm">
                    Select a customer...
                  </span>
                )}
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown size={14} className="text-[#b0a8c8]" />
                </motion.div>
              </button>

              {/* Dropdown panel */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute z-20 w-full mt-1.5 bg-white border border-[#e0d9f5] rounded-xl shadow-xl overflow-hidden"
                  >
                    {/* Search input */}
                    <div className="p-2 border-b border-[#ede8f8]">
                      <div className="relative">
                        <Search
                          size={13}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a8c8]"
                        />
                        <input
                          autoFocus
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          placeholder="Search by name or phone..."
                          className="w-full pl-8 pr-3 py-2 text-xs bg-secondary border border-[#d8d0ee] rounded-lg text-black placeholder-[#b0a8c8] focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Customer list */}
                    <div className="max-h-52 overflow-y-auto">
                      {filtered.length === 0 ? (
                        <p className="text-xs text-[#b0a8c8] text-center py-5">
                          No customers found
                        </p>
                      ) : (
                        filtered.map((c) => (
                          <button
                            key={c._id}
                            type="button"
                            onClick={() => {
                              setSelectedCustomer(c);
                              setCustomerSearch("");
                              setDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#faf8ff] ${
                              selectedCustomer?._id === c._id
                                ? "bg-primary/5"
                                : ""
                            }`}
                          >
                            <div className="w-7 h-7 rounded-lg bg-secondary text-primary flex items-center justify-center text-xs font-black shrink-0">
                              {c.firstName?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-black truncate leading-tight">
                                {c.firstName}
                              </p>
                              <p className="text-xs text-[#b0a8c8]">
                                {c.phoneNumber?.startsWith("+") ? c.phoneNumber : c.phoneNumber ? "+" + c.phoneNumber : ""}
                              </p>
                            </div>
                            {selectedCustomer?._id === c._id && (
                              <Check size={13} className="text-primary shrink-0" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          /* New customer form */
          <motion.div
            key="new"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-3"
          >
            <TInput
              icon={User}
              placeholder="Full Name *"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer((p) => ({ ...p, name: e.target.value }))
              }
            />
            <AdminPhoneInput
              value={newCustomer.phone}
              onChange={(value) =>
                setNewCustomer((p) => ({ ...p, phone: value }))
              }
              placeholder="Phone Number *"
            />
            <TInput
              icon={Mail}
              placeholder="Email Address"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer((p) => ({ ...p, email: e.target.value }))
              }
            />
            <TInput
              icon={MapPin}
              placeholder="City"
              value={newCustomer.city}
              onChange={(e) =>
                setNewCustomer((p) => ({ ...p, city: e.target.value }))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}