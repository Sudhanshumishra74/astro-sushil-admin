  /* eslint-disable react-hooks/exhaustive-deps */
  /* eslint-disable no-unused-vars */
  import Chart from "chart.js/auto";

  import { useEffect, useRef, useState } from "react";
  import { motion } from "framer-motion";
  import {
    ShoppingBag,
    IndianRupee,
    TrendingUp,
    Package,
    CreditCard,
    Truck,
    BarChart2,
    RefreshCw,
  } from "lucide-react";

  import { formatDate } from "../../components/common/Admintable";
  import { usePaymentStore } from "../../store/usePaymentStore";


  function formatINR(val) {
    if (val >= 100000)
      return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000)
      return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
  }

  function arrayToMap(arr, key = "_id") {
    return Object.fromEntries((arr ?? []).map((x) => [x[key], x.count]));
  }

  function StatCard({ label, value, sub, icon: Icon, color, delay = 0 }) {
    const colors = {
      purple: "bg-primary/10 text-primary",
      green:  "bg-green-50 text-green-600",
      amber:  "bg-amber-50 text-amber-600",
      blue:   "bg-blue-50 text-blue-600",
      rose:   "bg-rose-50 text-rose-600",
    };
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay }}
        className="bg-white rounded-2xl border border-[#ede8f8] p-5 shadow-sm flex items-start gap-4"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors[color] ?? colors.purple}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-[#9a9abf] font-medium">{label}</p>
          <p className="text-xl font-bold text-black mt-0.5">{value}</p>
          {sub && <p className="text-xs text-[#9a9abf] mt-0.5">{sub}</p>}
        </div>
      </motion.div>
    );
  }

 function BarChart({ data }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data?.length || !chartRef.current) return;

    if (instanceRef.current) instanceRef.current.destroy();

    const lastIdx = data.length - 1;

    // Revenue bars: gradient-like effect using opacity steps
    const revColors = data.map((_, i) =>
      i === lastIdx
        ? "#6c63ff"
        : `rgba(108,99,255,${0.15 + (i / (data.length - 1)) * 0.25})`
    );
    const revHover = data.map((_, i) =>
      i === lastIdx ? "#a78bfa" : "rgba(108,99,255,0.55)"
    );

    // Orders bars
    const ordColors = data.map((_, i) =>
      i === lastIdx
        ? "#D4AF37"
        : `rgba(212,175,55,${0.15 + (i / (data.length - 1)) * 0.3})`
    );
    const ordHover = data.map(() => "rgba(212,175,55,0.75)");

    instanceRef.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => d._id?.slice(5) ?? ""),
        datasets: [
          {
            label: "Revenue",
            data: data.map((d) => d.revenue ?? 0),
            backgroundColor: revColors,
            hoverBackgroundColor: revHover,
            borderRadius: { topLeft: 5, topRight: 5 },
            borderSkipped: false,
            yAxisID: "y",
            barPercentage: 0.6,
            categoryPercentage: 0.8,
            order: 1,
          },
          {
            label: "Orders",
            data: data.map((d) => d.orders ?? 0),
            backgroundColor: ordColors,
            hoverBackgroundColor: ordHover,
            borderRadius: { topLeft: 5, topRight: 5 },
            borderSkipped: false,
            yAxisID: "y2",
            barPercentage: 0.6,
            categoryPercentage: 0.8,
            order: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a1a2e",
            titleColor: "#9a9abf",
            bodyColor: "#ffffff",
            borderColor: "rgba(108,99,255,0.3)",
            borderWidth: 1,
            padding: { top: 10, bottom: 10, left: 12, right: 12 },
            titleFont: { size: 10, weight: "600" },
            bodyFont: { size: 11, weight: "700" },
            cornerRadius: 10,
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            boxPadding: 4,
            usePointStyle: true,
            callbacks: {
              title: (items) => items[0]?.label ?? "",
              label: (ctx) =>
                ctx.datasetIndex === 0
                  ? `  ₹${ctx.raw.toLocaleString("en-IN")}`
                  : `  ${ctx.raw} orders`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              font: { size: 9, weight: "500" },
              color: "#9a9abf",
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 14,
            },
          },
          y: {
            display: false,
            beginAtZero: true,
            grace: "10%",
          },
          y2: {
            display: false,
            beginAtZero: true,
            grace: "15%",
          },
        },
        animation: {
          duration: 600,
          easing: "easeOutQuart",
        },
      },
    });

    return () => instanceRef.current?.destroy();
  }, [data]);

  if (!data?.length)
    return (
      <p className="text-xs text-[#9a9abf] text-center py-8">No data</p>
    );

  const totalRevenue = data.reduce((s, d) => s + (d.revenue ?? 0), 0);
  const totalOrders  = data.reduce((s, d) => s + (d.orders ?? 0), 0);

  return (
    <div className="flex flex-col gap-4">
      {/* mini kpi strip */}
      <div className="flex items-center gap-5 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: "#6c63ff" }}
          />
          <span className="text-[11px] text-[#9a9abf]">
            Revenue{" "}
            <span className="font-bold text-[#1a1a2e]">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: "#D4AF37" }}
          />
          <span className="text-[11px] text-[#9a9abf]">
            Orders{" "}
            <span className="font-bold text-[#1a1a2e]">{totalOrders}</span>
          </span>
        </div>
      </div>

  
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: "clamp(140px, 22vw, 200px)" }}
      >
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}

  function DonutChart({ segments, size = 100 }) {
    const r = 36;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;

    let offset = 0;
    const arcs = segments.map((seg) => {
      const dash = (seg.value / total) * circumference;
      const gap = circumference - dash;
      const arc = { ...seg, dash, gap, offset };
      offset += dash;
      return arc;
    });

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f5f2fc" strokeWidth="14" />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth="14"
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#1a1a2e"
        >
          {total}
        </text>
      </svg>
    );
  }

  function BreakdownCard({ title, icon: Icon, segments }) {
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    return (
      <div className="bg-white rounded-2xl border border-[#ede8f8] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon size={14} className="text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-black">{title}</h3>
        </div>
        <div className="flex items-center gap-5">
          <DonutChart segments={segments} />
          <div className="flex flex-col gap-2 flex-1">
            {segments.map((seg, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-xs text-[#9a9abf] capitalize">{seg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-black">{seg.value}</span>
                  <span className="text-[10px] text-[#9a9abf]">
                    ({Math.round((seg.value / total) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const STATUS_COLORS = {
    confirmed:  "bg-green-50 text-green-700",
    placed:     "bg-blue-50 text-blue-700",
    processing: "bg-amber-50 text-amber-700",
    shipped:    "bg-indigo-50 text-indigo-700",
    delivered:  "bg-green-50 text-green-700",
    cancelled:  "bg-red-50 text-red-600",
  };

  function RecentOrders({ orders }) {
    if (!orders?.length)
      return <p className="text-xs text-[#9a9abf] py-4">No recent orders.</p>;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#ede8f8]">
              {["Order ID", "Customer", "Amount", "Status", "Date"].map((h) => (
                <th key={h} className="px-3 py-2.5 text-xs font-medium text-[#9a9abf] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o._id} className="border-b border-[#f5f2fc] last:border-0 hover:bg-[#faf8ff] transition-colors">
                <td className="px-3 py-3 font-mono text-xs text-primary font-semibold">
                  #{o._id.slice(-8).toUpperCase()}
                </td>
                <td className="px-3 py-3 text-xs text-black">
                  <p className="font-medium">{o.shippingAddress?.fullName ?? "—"}</p>
                  <p className="text-[#9a9abf] text-[10px]">{o.user?.email ?? "—"}</p>
                </td>
                <td className="px-3 py-3 text-xs font-semibold text-black">
                  ₹{o.totalAmount?.toLocaleString("en-IN")}
                </td>
                <td className="px-3 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[o.orderStatus] ?? "bg-gray-50 text-gray-500"}`}>
                    {o.orderStatus}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-[#9a9abf] whitespace-nowrap">
                  {formatDate(o.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const STATUS_PALETTE = {
    placed:     "#818cf8",
    confirmed:  "#22c55e",
    processing: "#f59e0b",
    shipped:    "#3b82f6",
    delivered:  "#10b981",
    cancelled:  "#ef4444",
  };

  const PAYMENT_METHOD_PALETTE = { cod: "#f59e0b", razorpay: "#424874" };
  const PAYMENT_STATUS_PALETTE  = { paid: "#22c55e", pending: "#f59e0b", failed: "#ef4444" };
  const ORDER_TYPE_PALETTE       = { physical: "#424874", digital: "#818cf8" };

  export default function OrderReports() {
    const { reports, reportsLoading, fetchReports } = usePaymentStore();
    const [view, setView] = useState("weekly"); 

    useEffect(() => {
      fetchReports();
    }, []);

    if (reportsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!reports) return null;

    const {
      totalOrders,
      totalSales,
      avgOrderValue,
      statusWiseOrders = [],
      paymentMethodBreakdown = [],
      paymentStatusBreakdown = [],
      orderTypeBreakdown = [],
      dailyRevenue = [],
      monthlyRevenue = [],
      recentOrders = [],
    } = reports;

    const statusMap  = arrayToMap(statusWiseOrders);
    const paidCount  = arrayToMap(paymentStatusBreakdown).paid ?? 0;
    const chartData  = view === "weekly" ? dailyRevenue : monthlyRevenue;


    const statusSegments = statusWiseOrders.map((s) => ({
      label: s._id,
      value: s.count,
      color: STATUS_PALETTE[s._id] ?? "#c0b8d8",
    }));

    const methodSegments = paymentMethodBreakdown.map((s) => ({
      label: s._id,
      value: s.count,
      color: PAYMENT_METHOD_PALETTE[s._id] ?? "#c0b8d8",
    }));

    const payStatusSegments = paymentStatusBreakdown.map((s) => ({
      label: s._id,
      value: s.count,
      color: PAYMENT_STATUS_PALETTE[s._id] ?? "#c0b8d8",
    }));

    const typeSegments = orderTypeBreakdown.map((s) => ({
      label: s._id,
      value: s.count,
      color: ORDER_TYPE_PALETTE[s._id] ?? "#c0b8d8",
    }));

    return (
      <div className="flex flex-col gap-6">
    
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-black">Order Reports</h2>
            <p className="text-xs text-gray-400 mt-0.5">Overview of all order activity</p>
          </div>
          <button
            onClick={() => fetchReports()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e0d9f5] text-xs font-medium text-primary hover:bg-secondary transition-colors"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>

      
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Orders"
            value={totalOrders}
            icon={ShoppingBag}
            color="purple"
            delay={0}
          />
          <StatCard
            label="Total Revenue"
            value={formatINR(totalSales)}
            sub={`₹${totalSales?.toLocaleString("en-IN")} total`}
            icon={IndianRupee}
            color="green"
            delay={0.05}
          />
          <StatCard
            label="Avg Order Value"
            value={formatINR(avgOrderValue)}
            icon={TrendingUp}
            color="amber"
            delay={0.1}
          />
          <StatCard
            label="Paid Orders"
            value={paidCount}
            sub={`${Math.round((paidCount / (totalOrders || 1)) * 100)}% of total`}
            icon={CreditCard}
            color="blue"
            delay={0.15}
          />
        </div>

      
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#ede8f8] p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart2 size={14} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-black">Revenue</h3>
            </div>
            <div className="flex rounded-xl overflow-hidden border border-[#e0d9f5]">
              {["weekly", "monthly"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    view === v ? "bg-primary text-white" : "text-[#9a9abf] hover:bg-secondary"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <BarChart data={chartData} />
        </motion.div>

      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <BreakdownCard title="Order Status"   icon={Package}    segments={statusSegments}    />
          <BreakdownCard title="Payment Method" icon={CreditCard} segments={methodSegments}    />
          <BreakdownCard title="Payment Status" icon={TrendingUp} segments={payStatusSegments} />
          <BreakdownCard title="Order Type"     icon={Truck}      segments={typeSegments}      />
        </div>

      
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="bg-white rounded-2xl border border-[#ede8f8] shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#ede8f8]">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingBag size={14} className="text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-black">Recent Orders</h3>
            <span className="ml-auto text-xs text-[#9a9abf]">Last 5</span>
          </div>
          <div className="px-2">
            <RecentOrders orders={recentOrders} />
          </div>
        </motion.div>
      </div>
    );
  }