import {
  LayoutGrid,
  Bot,
  ShoppingCart,
  Calendar,
  User,
  Image,
  Badge,
  Quote,
  CalendarClock,
  CreditCard,
  MessageSquare,
  Globe,
  TicketPercent,
  FileText,
  ShieldCheck,
  UserCog,
  Truck,
  Undo2,
  History,
} from "lucide-react";

// Single source of truth for the sidebar's structure — also used by
// getFirstAccessibleRoute.js to pick where a freshly-logged-in admin lands,
// so that list and the sidebar itself can never drift apart.
export const menuItems = [
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
      { id: 27, label: "Shipments", icon: Truck, route: "/shipments", permission: "shipments.view" },
      { id: 28, label: "Returns", icon: Undo2, route: "/returns", permission: "returns.view" },
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
      { id: 29, label: "Activity Log", icon: History, route: "/activity-log", permission: "activityLog.view" },
    ],
  },
];
