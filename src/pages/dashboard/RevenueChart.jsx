import { useEffect, useRef, useState } from "react";
import { BarChart2, Package, CalendarCheck, ScrollText } from "lucide-react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function RevenueChart({
  data = [],
  yearlyData = [],
  monthlyOrders = [],
  monthlyBookings = [],
  monthlyReportOrders = [],
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [view, setView] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const countFor = (arr, month) => arr.find((d) => d._id === month)?.count || 0;
  const revenueFor = (month) => data.find((d) => d._id === month)?.revenue || 0;

  const summary = {
    revenue: fmt(revenueFor(selectedMonth)),
    orders: countFor(monthlyOrders, selectedMonth),
    bookings: countFor(monthlyBookings, selectedMonth),
    reportOrders: countFor(monthlyReportOrders, selectedMonth),
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    let labels, values;

    if (view === "monthly") {
      labels = MONTHS;
      values = Array.from({ length: 12 }, (_, i) => {
        const found = data.find((d) => d._id === i + 1);
        return found?.revenue || 0;
      });
    } else {
      labels = yearlyData.map((d) => String(d.year));
      values = yearlyData.map((d) => d.revenue);
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Revenue (₹)",
            data: values,
            backgroundColor: values.map((v, i) => {
              if (view === "monthly" && i + 1 === selectedMonth) return "#D4AF37";
              return v > 0 ? "#424874" : "rgba(66,72,116,0.15)";
            }),
            hoverBackgroundColor: "#D4AF37",
            borderRadius: 6,
            borderSkipped: false,
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
        onClick: (evt, elements) => {
          if (view !== "monthly" || !elements.length) return;
          setSelectedMonth(elements[0].index + 1);
        },
        onHover: (evt, elements) => {
          if (evt.native?.target) {
            evt.native.target.style.cursor =
              view === "monthly" && elements.length ? "pointer" : "default";
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#100D42",
            titleColor: "rgba(255,255,255,0.7)",
            bodyColor: "#fff",
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) =>
                ` ₹${Number(ctx.raw).toLocaleString("en-IN")}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { font: { size: 10 }, color: "rgba(66,72,116,0.45)" },
          },
          y: {
            grid: { color: "rgba(0,0,0,0.04)" },
            border: { display: false },
            ticks: {
              font: { size: 10 },
              color: "rgba(66,72,116,0.45)",
              callback: (v) =>
                v >= 100000
                  ? `₹${(v / 100000).toFixed(1)}L`
                  : v >= 1000
                  ? `₹${(v / 1000).toFixed(0)}k`
                  : `₹${v}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, yearlyData, view, selectedMonth]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-primary/8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-primary text-base flex items-center gap-1.5">
          <BarChart2 size={15} color="#424874" strokeWidth={2} />
          Revenue Overview
        </h2>

        <div className="flex gap-0.5 bg-primary/5 rounded-lg p-0.5">
          <button
            onClick={() => setView("monthly")}
            className={`text-xs px-3 py-1 rounded-md transition-all cursor-pointer ${
              view === "monthly"
                ? "bg-white shadow text-primary font-semibold"
                : "text-primary/50 hover:text-primary/70"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setView("yearly")}
            className={`text-xs px-3 py-1 rounded-md transition-all cursor-pointer ${
              view === "yearly"
                ? "bg-white shadow text-primary font-semibold"
                : "text-primary/50 hover:text-primary/70"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {view === "monthly" && (
        <>
          <p className="text-[11px] text-primary/40 mb-2 -mt-1">
            Showing overview for{" "}
            <span className="font-semibold text-primary/70">
              {MONTH_NAMES[selectedMonth - 1]}
            </span>{" "}
            &middot; click a bar to select a different month
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs bg-primary/5 rounded-lg px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-gold inline-block" />
            <span className="text-primary/50">Revenue</span>
            <span className="font-semibold text-primary">{summary.revenue}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-primary/5 rounded-lg px-3 py-1.5">
            <Package size={12} color="#424874" strokeWidth={2} />
            <span className="text-primary/50">Orders</span>
            <span className="font-semibold text-primary">{summary.orders}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-primary/5 rounded-lg px-3 py-1.5">
            <CalendarCheck size={12} color="#16a34a" strokeWidth={2} />
            <span className="text-primary/50">Bookings</span>
            <span className="font-semibold text-primary">{summary.bookings}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-primary/5 rounded-lg px-3 py-1.5">
            <ScrollText size={12} color="#dc2626" strokeWidth={2} />
            <span className="text-primary/50">Report Orders</span>
            <span className="font-semibold text-primary">{summary.reportOrders}</span>
          </div>
          </div>
        </>
      )}

      <div style={{ height: "280px" }}>
        <canvas ref={canvasRef} />
      </div>

      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5 text-[10.5px] text-primary/55">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          Revenue
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] text-primary/55">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: "#D4AF37" }}
          />
          Hover bar to see amount
        </div>
      </div>
    </div>
  );
}
