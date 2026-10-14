/* eslint-disable react-hooks/exhaustive-deps */
import { IndianRupee, Package, CalendarCheck, ScrollText } from "lucide-react";

import StatCard from "./StatCard";
import RevenueChart from "./RevenueChart";
import TopProducts from "./Topproducts";
import RecentOrders from "../Orders/Recentorders";
import SunSigns from "./Sunsigns";
import PlanetaryTransits from "./Planetarytransits";
import { useSettingStore } from "../../store/useSettingStore";
import { useEffect } from "react";
import { usePermission } from "../../hooks/usePermission";

export default function Dashboard() {
  const { dashboard, dashboardLoading, fetchDashboard } = useSettingStore();
  const { hasPermission } = usePermission();

  useEffect(() => {
    // Skip the fetch entirely for a user without dashboard.view rather than
    // firing a request that's just going to 403.
    if (hasPermission("dashboard.view")) fetchDashboard();
  }, []);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const THIS_MONTH = [
    {
      icon: IndianRupee,
      iconBg: "#fef9ec",
      iconColor: "#D4AF37",
      label: "Revenue",
      value: fmt(dashboard?.revenueThisMonth),
      change: `${dashboard?.revenueGrowth || 0}%`,
      note: "vs last month",
      up: (dashboard?.revenueGrowth || 0) >= 0,
      permission: "transactions.view",
    },
    {
      icon: Package,
      iconBg: "#eef0fb",
      iconColor: "#424874",
      label: "Orders",
      value: dashboard?.orders?.count || 0,
      change: `${dashboard?.orders?.growth || 0}%`,
      note: "vs last month",
      up: (dashboard?.orders?.growth || 0) >= 0,
      permission: "orders.view",
    },
    {
      icon: CalendarCheck,
      iconBg: "#eafaf3",
      iconColor: "#16a34a",
      label: "Bookings",
      value: dashboard?.bookings?.count || 0,
      change: `${dashboard?.bookings?.growth || 0}%`,
      note: "vs last month",
      up: (dashboard?.bookings?.growth || 0) >= 0,
      permission: "bookings.view",
    },
    {
      icon: ScrollText,
      iconBg: "#fef2f2",
      iconColor: "#dc2626",
      label: "Report Orders",
      value: dashboard?.reportOrders?.count || 0,
      change: `${dashboard?.reportOrders?.growth || 0}%`,
      note: "vs last month",
      up: (dashboard?.reportOrders?.growth || 0) >= 0,
      permission: "reportOrders.view",
    },
  ].filter((s) => hasPermission(s.permission));

  const ALL_TIME = [
    {
      icon: IndianRupee,
      iconBg: "#fef9ec",
      iconColor: "#D4AF37",
      label: "Total Revenue",
      value: fmt(dashboard?.totalRevenue),
      permission: "transactions.view",
    },
    {
      icon: Package,
      iconBg: "#eef0fb",
      iconColor: "#424874",
      label: "Total Orders",
      value: dashboard?.orders?.total || 0,
      permission: "orders.view",
    },
    {
      icon: CalendarCheck,
      iconBg: "#eafaf3",
      iconColor: "#16a34a",
      label: "Total Bookings",
      value: dashboard?.bookings?.total || 0,
      permission: "bookings.view",
    },
    {
      icon: ScrollText,
      iconBg: "#fef2f2",
      iconColor: "#dc2626",
      label: "Total Report Orders",
      value: dashboard?.reportOrders?.total || 0,
      permission: "reportOrders.view",
    },
  ].filter((s) => hasPermission(s.permission));

  const showChart = hasPermission("transactions.view");
  const showTopProducts = hasPermission("products.view");
  const showRecentOrders = hasPermission("orders.view");
  const hasAnyWidget =
    THIS_MONTH.length > 0 || ALL_TIME.length > 0 || showChart || showTopProducts || showRecentOrders;

  return (
    <div className="flex flex-col gap-4 md:gap-6 min-h-screen font-sans">

      {!hasAnyWidget && (
        <div className="bg-white rounded-2xl p-8 border border-primary/8 text-center">
          <p className="text-sm text-black/50">Select a section from the sidebar to get started.</p>
        </div>
      )}

      {/* ── This Month ── */}
      {THIS_MONTH.length > 0 && (
        <div>
          <p className="text-[11px] tracking-[2px] uppercase text-primary/40 font-semibold mb-3 px-1">
            This Month
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {THIS_MONTH.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      )}

      {/* ── All Time ── */}
      {ALL_TIME.length > 0 && (
        <div>
          <p className="text-[11px] tracking-[2px] uppercase text-primary/40 font-semibold mb-3 px-1">
            All Time
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {ALL_TIME.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      )}

      {/* ── Revenue Chart (full width) ── */}
      {showChart && (
        <RevenueChart
          data={dashboard?.monthlyRevenue || []}
          yearlyData={dashboard?.yearlyRevenue || []}
          monthlyOrders={dashboard?.monthlyOrders || []}
          monthlyBookings={dashboard?.monthlyBookings || []}
          monthlyReportOrders={dashboard?.monthlyReportOrders || []}
        />
      )}

      {/* ── Top Products ── */}
      {showTopProducts && (
        <TopProducts
          products={dashboard?.topProducts || []}
          loading={dashboardLoading}
        />
      )}

      {showRecentOrders && (
        <div className="">
          <RecentOrders />
        </div>
      )}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-primary/8">
        <SunSigns />
        <PlanetaryTransits />
      </div>
    </div>
  );
}
