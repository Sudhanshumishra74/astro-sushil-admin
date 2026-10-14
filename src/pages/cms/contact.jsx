/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Search,
  ArrowUpDown,
  Mail,
  Trash2,
  Phone,
  MessageSquare,
  Eye,
} from "lucide-react";
import DateFilter from "../../components/common/DateFilter";
import { motion, AnimatePresence } from "framer-motion";

import { useSettingStore } from "../../store/useSettingStore";
import { Modal } from "../../components/common/Modal";
import Can from "../../components/common/Can";

export default function ContactsPage() {
  const {
    contacts,
    contactTotal,
    contactPage,
    contactPages,
    contactLoading,
    fetchContacts,
    deleteContact,
    updateContactRemarks,
  } = useSettingStore();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // "delete" | "view"
  const [activeContact, setActiveContact] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [remarksDraft, setRemarksDraft] = useState("");
  const [savingRemarks, setSavingRemarks] = useState(false);

  useEffect(() => {
    fetchContacts({ page: 1, limit: 10, search });
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchContacts({ page: 1, limit: 10, search: val, fromDate: dateFrom, toDate: dateTo });
  };

  const handlePageChange = (p) => {
    fetchContacts({ page: p, limit: 10, search, fromDate: dateFrom, toDate: dateTo });
  };

  const handleDateChange = ({ from, to }) => {
    setDateFrom(from);
    setDateTo(to);
    fetchContacts({ page: 1, limit: 10, search, fromDate: from, toDate: to });
  };

  const handleDateClear = () => {
    setDateFrom("");
    setDateTo("");
    fetchContacts({ page: 1, limit: 10, search, fromDate: "", toDate: "" });
  };

  const openView = (contact) => {
    setActiveContact(contact);
    setRemarksDraft(contact.remarks || "");
    setModal("view");
  };

  const openDelete = (contact) => {
    setActiveContact(contact);
    setModal("delete");
  };

  const handleDelete = async () => {
    await deleteContact(activeContact._id);
    setModal(null);
  };

  const handleSaveRemarks = async () => {
    setSavingRemarks(true);
    const updated = await updateContactRemarks(activeContact._id, remarksDraft);
    setSavingRemarks(false);
    if (updated) setActiveContact(updated);
  };

  return (
    <>
      <div className="space-y-5">
       
        <div className="bg-white border border-[#e0d9f5] rounded-2xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
            <div>
              <p className="font-heading text-base font-bold text-black">
                Contact Submissions
              </p>
              <p className="text-xs text-[#9a9abf] mt-0.5">
                View and manage contact form submissions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9a9abf] bg-[#f5f2fc] border border-[#ede8f8] rounded-lg px-3 py-1.5">
                Total:{" "}
                <span className="font-semibold text-black">{contactTotal}</span>
              </span>
            </div>
          </div>

         
          <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-[#ede8f8]">
            <div className="relative w-72">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a8c8]"
              />
              <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <DateFilter
              from={dateFrom}
              to={dateTo}
              onChange={handleDateChange}
              onClear={handleDateClear}
            />
          </div>

         
          <div className="overflow-hidden rounded-2xl border border-[#ede8f8] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#ede8f8] bg-white">
                    {[
                      { label: "Name", sortable: true },
                      { label: "Email", sortable: true },
                      { label: "Phone", sortable: false },
                      { label: "Subject", sortable: false },
                      { label: "Message", sortable: false },
                      { label: "Remarks", sortable: false },
                      { label: "Date", sortable: true },
                      { label: "Actions", sortable: false },
                    ].map(({ label, sortable }) => (
                      <th
                        key={label}
                        className="px-4 py-3 text-xs font-medium text-[#9a9abf] whitespace-nowrap"
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          {sortable && (
                            <ArrowUpDown size={11} className="text-[#c0b8d8]" />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {contactLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr
                        key={i}
                        className="border-b border-[#f5f2fc] animate-pulse"
                      >
                        {[...Array(8)].map((_, j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : contacts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <MessageSquare
                            size={32}
                            className="text-[#c0b8d8]"
                          />
                          <p className="text-sm">No contacts found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {contacts.map((row, idx) => (
                        <motion.tr
                          key={row._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, delay: idx * 0.03 }}
                          className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors"
                        >
                          {/* Name */}
                          <td className="px-4 py-3.5 text-sm font-semibold text-black whitespace-nowrap">
                            {row.name}
                          </td>

                          {/* Email */}
                          <td className="px-4 py-3.5 text-sm text-[#6b6b9a]">
                            <a
                              href={`mailto:${row.email}`}
                              className="hover:text-primary transition-colors flex items-center gap-1"
                            >
                              <Mail size={12} />
                              {row.email}
                            </a>
                          </td>

                          {/* Phone */}
                          <td className="px-4 py-3.5 text-sm text-black">
                            <span className="flex items-center gap-1">
                              <Phone size={12} className="text-[#b0a8c8]" />
                              {row.phone || "—"}
                            </span>
                          </td>

                          {/* Subject */}
                          <td className="px-4 py-3.5 text-sm text-black">
                            {row.subject || "—"}
                          </td>

                          {/* Message preview */}
                          <td className="px-4 py-3.5 text-sm text-[#9a9abf] max-w-50">
                            <p className="line-clamp-1">
                              {row.message || "—"}
                            </p>
                          </td>

                          {/* Remarks */}
                          <td className="px-4 py-3.5 text-sm text-[#9a9abf] max-w-50">
                            <p className="line-clamp-1">
                              {row.remarks || "—"}
                            </p>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5 text-sm text-[#9a9abf] whitespace-nowrap">
                            {row.createdAt
                              ? new Date(row.createdAt).toLocaleDateString()
                              : "—"}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 flex items-center gap-1.5">
                            <button
                              onClick={() => openView(row)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors"
                            >
                              <Eye size={12} /> View
                            </button>
                            <button
                              onClick={() => openDelete(row)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {contactPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#ede8f8]">
                <p className="text-xs text-[#9a9abf]">
                  Page {contactPage} of {contactPages}
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(contactPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        contactPage === i + 1
                          ? "bg-primary text-white"
                          : "text-[#9a9abf] hover:bg-[#f5f2fc]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

     
      <AnimatePresence mode="wait">
        {modal === "view" && activeContact && (
          <Modal title="Contact Details" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">Name</p>
                  <p className="text-sm font-semibold text-black">
                    {activeContact.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">Phone</p>
                  <p className="text-sm text-black">
                    {activeContact.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">Email</p>
                  <p className="text-sm text-black break-all">
                    {activeContact.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9a9abf] mb-1">Subject</p>
                  <p className="text-sm text-black">
                    {activeContact.subject || "—"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#9a9abf] mb-1">Message</p>
                <p className="text-sm text-black bg-[#faf8ff] border border-[#ede8f8] rounded-xl p-3 leading-relaxed">
                  {activeContact.message || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9a9abf] mb-1">Received</p>
                <p className="text-sm text-black">
                  {activeContact.createdAt
                    ? new Date(activeContact.createdAt).toLocaleString()
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#9a9abf] mb-1">Admin Remarks</p>
                <Can
                  permission="contacts.edit"
                  fallback={
                    <p className="text-sm text-black bg-[#faf8ff] border border-[#ede8f8] rounded-xl p-3 leading-relaxed">
                      {activeContact.remarks || "—"}
                    </p>
                  }
                >
                  <textarea
                    rows={3}
                    value={remarksDraft}
                    onChange={(e) => setRemarksDraft(e.target.value)}
                    placeholder="Add a remark for internal reference..."
                    className="w-full text-sm text-black bg-[#faf8ff] border border-[#ede8f8] rounded-xl p-3 leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSaveRemarks}
                      disabled={
                        savingRemarks ||
                        remarksDraft === (activeContact.remarks || "")
                      }
                      className="px-4 py-1.5 rounded-xl text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingRemarks ? "Saving…" : "Save Remarks"}
                    </button>
                  </div>
                </Can>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setModal(null)}
                  className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

     
      <AnimatePresence mode="wait">
        {modal === "delete" && activeContact && (
          <Modal title="Delete Contact" onClose={() => setModal(null)}>
            <div className="space-y-5">
              <p className="text-sm text-[#9a9abf]">
                Are you sure you want to delete the contact from{" "}
                <span className="font-semibold text-black">
                  {activeContact.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setModal(null)}
                  className="px-5 py-2 cursor-pointer rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={contactLoading}
                  className="px-5 py-2 cursor-pointer rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactLoading ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}