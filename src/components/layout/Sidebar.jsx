/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Bot,
  ShoppingCart,
  Calendar,
  User,
  ChevronDown,
  X,
  Image,
  Badge,
  Quote,
  CalendarClock,
  CreditCard,
  MessageSquare,
  Globe,
  Sparkles,
  TicketPercent,
  FileText,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { usePermission } from "../../hooks/usePermission";

const menuItems = [
  {
    category: "Main",
    items: [{ id: 1, label: "Dashboard", icon: LayoutGrid, route: "/", permission: "dashboard.view" }],
  },
  {
    category: "Catalog",
    items: [
      { id: 2, label: "Banners", icon: Image, route: "/banners", permission: "banners.view" },
      { id: 3, label: "Categories", icon: Badge, route: "/categories", permission: "categories.view" },
      {
        id: 15,
        label: "Courses",
        icon: Calendar,
        hasChildren: true,
        children: [
          { label: "Course List", route: "/courses", permission: "courses.view" },
          { label: "Add Course", route: "/courses/add", permission: "courses.create" },
        ],
      },
      {
        id: 4,
        label: "Products",
        icon: Image,
        hasChildren: true,
        children: [
          { label: "Product List", route: "/products", permission: "products.view" },
          { label: "Add Product", route: "/products/add", permission: "products.create" },
        ],
      },
      {
        id: 16,
        label: "Consultations",
        icon: CalendarClock,
        route: "/consultations",
        permission: "consultations.view",
      }, // ← Catalog mein add
    ],
  },
  {
    category: "Sales",
    items: [
      { id: 5, label: "Orders", icon: ShoppingCart, route: "/orders", permission: "orders.view" },
      {
        id: 22,
        label: "Report Orders",
        icon: FileText,
        route: "/report-orders",
        permission: "reportOrders.view",
      },
      {
        id: 11,
        label: "Transactions",
        icon: CreditCard,
        route: "/transactions",
        permission: "transactions.view",
      },
      { id: 20, label: "Bookings", icon: CalendarClock, route: "/booking", permission: "bookings.view" },
      {
        id: 21,
        label: "Coupons",
        icon: TicketPercent,
        route: "/coupons",
        permission: "coupons.view",
      },
      {
        id: 23,
        label: "GST Report",
        icon: FileText,
        route: "/gst-report",
        permission: "gstReport.view",
      },
    ],
  },
  {
    category: "Users",
    items: [
      { id: 7, label: "Customers", icon: User, route: "/customers", permission: "customers.view" },
      { id: 12, label: "Contacts", icon: MessageSquare, route: "/contacts", permission: "contacts.view" },
    ],
  },
  {
    category: "Content",
    items: [
      {
        id: 8,
        label: "Blogs",
        icon: Bot,
        hasChildren: true,
        children: [
          { label: "Blog List", route: "/blogs", permission: "blogs.view" },
          { label: "Add Blog", route: "/blogs/add", permission: "blogs.create" },
        ],
      },
      { id: 17, label: "FAQs", icon: MessageSquare, route: "/faqs", permission: "faqs.view" },
      { id: 9, label: "Testimonials", icon: Quote, route: "/testimonials", permission: "testimonials.view" },
      // Consultations yahan se hata diya
    ],
  },
  {
    category: "Media", // ← Naya Media section
    items: [{ id: 18, label: "Media Manager", icon: Image, route: "/media", permission: "media.view" }],
  },
  {
    category: "Global Setting",
    items: [
      {
        id: 19,
        label: "Global",
        icon: Globe,
        hasChildren: true,
        children: [
          { label: "Availability", route: "/global", permission: "availability.view" },
          { label: "Calendar", route: "/callender", permission: "availability.view" }, // ← Calendar Global ke andar
        ],
      },
    ],
  },
  {
    category: "Settings",
    items: [
      {
        id: 13,
        label: "Settings",
        icon: Globe,
        hasChildren: true,
        children: [
          { label: "Privacy Policy", route: "/settings/privacy-policy", permission: "settings.view" },
          {
            label: "Terms & Conditions",
            route: "/settings/terms-conditions",
            permission: "settings.view",
          },
          {
            label: "Cancellation & Refund Policy",
            route: "/settings/Cancellation-Refund-Policy",
            permission: "settings.view",
          },
          {
            label: "Shipping Delivery Policy",
            route: "/settings/shipping-delivery-policy",
            permission: "settings.view",
          },
          { label: "Website Settings", route: "/settings/website", permission: "settings.view" },
          { label: "SEO Settings", route: "/settings/seo", permission: "seo.view" },
          { label: "Profile", route: "/profile" },
        ],
      },
    ],
  },
  {
    category: "Administration",
    items: [
      { id: 24, label: "Roles & Permissions", icon: ShieldCheck, route: "/roles", permission: "roles.view" },
      { id: 25, label: "Staff Accounts", icon: UserCog, route: "/staff", permission: "staff.view" },
    ],
  },
];

function MenuItem({ item, isActive, isChildActive, isOpen, onToggle }) {
  const Icon = item.icon;
  const highlighted = isActive || isChildActive;
  const location = useLocation();

  const handleClick = (e) => {
    if (item.hasChildren) {
      e.preventDefault();
      onToggle(item.id);
    }
  };

  return (
    <div>
      <Link
        to={item.hasChildren ? "#" : item.route || "#"}
        onClick={handleClick}
        className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative
          ${
            highlighted
              ? "bg-white/10 text-white"
              : "text-white/60 hover:bg-white/6 hover:text-white"
          }`}
      >
        {highlighted && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#a78bfa] rounded-full" />
        )}

        <span
          className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors shrink-0
            ${highlighted ? "bg-[#6c63ff]/30 text-[#c4b8ff]" : "text-white/40 group-hover:text-white/70"}`}
        >
          <Icon size={15} strokeWidth={1.8} />
        </span>

        <span className="flex-1 leading-none">{item.label}</span>

        {item.hasChildren && (
          <ChevronDown
            size={13}
            className={`ml-auto transition-transform duration-200 text-white/30 ${
              isOpen ? "rotate-180 text-white/60" : ""
            }`}
          />
        )}

        {item.badge && (
          <span className="text-[9px] font-bold bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>

      {/* children dropdown */}
      <AnimatePresence initial={false}>
        {isOpen && item.hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="ml-4 mt-1 pl-4 border-l border-white/8 space-y-0.5 pb-1">
              {item.children?.map((sub) => {
                const isSubActive = location.pathname === sub.route;
                return (
                  <Link
                    key={sub.route}
                    to={sub.route}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] transition-all duration-150
                      ${
                        isSubActive
                          ? "bg-[#6c63ff]/20 text-[#c4b8ff] font-semibold"
                          : "text-white/45 hover:bg-white/6 hover:text-white/80"
                      }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full shrink-0 transition-colors ${
                        isSubActive ? "bg-[#a78bfa]" : "bg-white/20"
                      }`}
                    />
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarContent({ onClose }) {
  const location = useLocation();
  const { hasPermission } = usePermission();

  // Parents with children get no permission of their own — visibility
  // derives from whether any child survives filtering. A category left
  // with zero visible items is dropped entirely rather than shown empty.
  const visibleMenu = menuItems
    .map((group) => ({
      ...group,
      items: group.items
        .map((item) =>
          item.hasChildren
            ? { ...item, children: (item.children ?? []).filter((c) => hasPermission(c.permission)) }
            : item,
        )
        .filter((item) => (item.hasChildren ? item.children.length > 0 : hasPermission(item.permission))),
    }))
    .filter((group) => group.items.length > 0);

  const [openId, setOpenId] = useState(() => {
    for (const group of menuItems) {
      for (const item of group.items) {
        if (item.hasChildren) {
          const match = item.children?.some(
            (c) => location.pathname === c.route,
          );
          if (match) return item.id;
        }
      }
    }
    return null;
  });

  const handleToggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <aside
      className="w-64 h-screen flex flex-col overflow-y-auto bg-primary"
      style={{
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between px-5 pt-6 pb-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-bold text-white tracking-tight">
            Admin
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/8 transition-colors"
        >
          <X size={15} className="text-white/40" />
        </button>
      </div>

      <div className="mx-5 h-px bg-white/6 mb-4 shrink-0" />

      <nav className="flex-1 px-3 space-y-5 pb-6">
        {visibleMenu.map((group, index) => (
          <div key={index}>
            <p className="text-[9.5px] font-bold text-white/25 tracking-[0.18em] uppercase px-3 mb-1.5">
              {group.category}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.route &&
                  location.pathname === item.route &&
                  !item.hasChildren;

                const isChildActive =
                  item.hasChildren &&
                  item.children?.some((c) => location.pathname === c.route);

                return (
                  <MenuItem
                    key={item.id}
                    item={item}
                    isActive={isActive}
                    isChildActive={isChildActive}
                    isOpen={openId === item.id}
                    onToggle={handleToggle}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div className="hidden lg:flex lg:shrink-0">
        <SidebarContent onClose={onClose} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 h-full z-50 lg:hidden"
            >
              <SidebarContent onClose={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
