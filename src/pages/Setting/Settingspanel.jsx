/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Phone,
  Share2,
  Briefcase,
  CreditCard,
  Truck,
  Package,
  Tag,
  ShoppingCart,
  Bell,
  Mail,
  MessageSquare,
  Key,
  Settings,
  FileText,
  ChevronRight,
  Menu,
  X,
  Megaphone,
  Sparkles,
} from "lucide-react";

import Toppage from "../../components/common/Toppage";

import { useSettingStore } from "../../store/useSettingStore";
import { slideIn } from "./Settingsui";
import BrandingSection from "./Brandingsection";
import ContactSection from "./Contactsection";
import SocialSection from "./Socialsection";
import {
  BusinessSection,
  OffersSection,
  PaymentSection,
  ProductSection,
  ShippingSection,
} from "./Miscsections";
import {
  CommunicationSection,
  OtpSection,
  SmsSection,
  SmtpSection,
  SystemSection,
} from "./Techsections";
import TopBarSection from "./Topbarsection";
import HighlightsBarSection from "./Highlightsbarsection";

// ─── Nav config ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "topbar", label: "Top Bar", icon: Megaphone },
  { id: "highlightsbar", label: "Highlights Bar", icon: Sparkles },
  { id: "branding", label: "Branding", icon: Store },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "social", label: "Social Links", icon: Share2 },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "product", label: "Products", icon: Package },
  // { id: "offers",        label: "Offers",         icon: Tag },
  // { id: "communication", label: "Notifications",  icon: Bell },
  // { id: "smtp",          label: "SMTP Email",     icon: Mail },
  // { id: "sms",           label: "SMS",            icon: MessageSquare },
  // { id: "otp",           label: "OTP",            icon: Key },
  { id: "system", label: "System", icon: Settings },
];

function NavItem({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full ${
        isActive
          ? "bg-primary text-white shadow-md shadow-primary/20"
          : "text-[#6b6b9a] hover:bg-white hover:text-black hover:shadow-sm"
      }`}
    >
      <Icon size={15} className={isActive ? "text-white" : "text-[#b0a8c8]"} />
      {item.label}
      {isActive && <ChevronRight size={13} className="ml-auto text-white/60" />}
    </button>
  );
}

function renderSection(id) {
  switch (id) {
    case "topbar":
      return <TopBarSection />;
    case "highlightsbar":
      return <HighlightsBarSection />;
    case "branding":
      return <BrandingSection />;
    case "contact":
      return <ContactSection />;
    case "social":
      return <SocialSection />;
    case "business":
      return <BusinessSection />;
    case "payment":
      return <PaymentSection />;
    case "shipping":
      return <ShippingSection />;
    case "product":
      return <ProductSection />;
    // case "offers":        return <OffersSection />;
    // case "order":         return <OrderSection />;
    // case "communication": return <CommunicationSection />;
    // case "smtp":          return <SmtpSection />;
    // case "sms":           return <SmsSection />;
    // case "otp":           return <OtpSection />;
    case "system":
      return <SystemSection />;

    default:
      return null;
  }
}

export default function SettingsPanel2() {
  const { fetchSettings, loading } = useSettingStore();
  const [active, setActive] = useState("topbar");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const activeNav = NAV.find((n) => n.id === active);

  const handleNav = (id) => {
    setActive(id);
    setMobileOpen(false);
  };

  return (
    <div className="space-y-5">
      <Toppage Title="Settings" />

      <div className="flex gap-5 relative">
        {/* ── Desktop Sidebar ── */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex flex-col gap-1 w-52 xl:w-56 shrink-0 sticky top-6 self-start bg-white border  border-[#e0d9f5] rounded-2xl p-3"
        >
          <p className="text-xs font-semibold text-[#9a9abf] uppercase tracking-wider px-3 py-2">
            Settings
          </p>
          {NAV.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={active === item.id}
              onClick={() => handleNav(item.id)}
            />
          ))}
        </motion.aside>

        {/* ── Mobile: Tab Strip ── */}
        <div className="lg:hidden w-full">
          {/* Top bar with current section + hamburger */}
          <div className="flex items-center justify-between bg-white border border-[#e0d9f5] rounded-2xl px-4 py-3 mb-4">
            <div className="flex items-center gap-2">
              {activeNav && (
                <activeNav.icon size={16} className="text-primary" />
              )}
              <span className="text-sm font-bold text-black">
                {activeNav?.label}
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#d8d0ee] bg-secondary text-[#9a9abf] hover:text-primary transition-colors"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>

        {/* ── Mobile Sidebar Drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 260 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-2xl p-4 flex flex-col gap-1 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <p className="text-sm font-bold text-black">Settings</p>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 rounded-xl border border-[#d8d0ee] flex items-center justify-center text-[#9a9abf] hover:text-black transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                {NAV.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={active === item.id}
                    onClick={() => handleNav(item.id)}
                  />
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Content Area ── */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 mb-4">
            <span className="text-xs text-[#9a9abf] font-medium">Settings</span>
            <ChevronRight size={12} className="text-[#c0b8d8]" />
            <span className="text-xs font-bold text-primary">
              {activeNav?.label}
            </span>
          </div>

          {/* Section content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-5"
            >
              {renderSection(active)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
