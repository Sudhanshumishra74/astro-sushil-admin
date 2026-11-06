/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import AdminTable, { Badge, formatDate } from "../../components/common/Admintable";
import { useShipmentStore } from "../../store/useShipmentStore";

function shipmentStatusVariant(status) {
  if (!status) return "default";
  if (["delivered", "fulfilled", "self_fulfilled"].includes(status)) return "success";
  if (
    status.startsWith("rto") ||
    ["cancelled", "lost", "damaged", "destroyed", "qc_failed", "undelivered", "untraceable", "failed"].includes(
      status,
    )
  ) {
    return "danger";
  }
  if (["pending", "awaiting_manual_fulfillment"].includes(status)) return "warning";
  return "info";
}

// This global list is Shiprocket/self-fulfilled only.
export default function ShipmentsList() {
  const navigate = useNavigate();
  const { allShipments, allLoading, allTotal, allPage, allLimit, fetchAllShipments } = useShipmentStore();

  useEffect(() => {
    fetchAllShipments({ page: 1, limit: allLimit, fulfillmentType: "self" });
  }, []);

  const columns = [
    {
      key: "orderId",
      label: "Order",
      render: (row) => <span className="font-mono text-xs">#{row.orderId?.slice(-8).toUpperCase()}</span>,
    },
    {
      key: "customer",
      label: "Customer",
      render: (row) => (
        <div>
          <p className="text-sm">{row.customer?.name || "—"}</p>
          <p className="text-xs text-[#9a9abf]">{row.customer?.email}</p>
        </div>
      ),
    },
    { key: "courier", label: "Courier", render: (row) => row.shipment?.courier || "—" },
    { key: "awb", label: "AWB", render: (row) => row.shipment?.awb || "—" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge label={row.shipment?.status} variant={shipmentStatusVariant(row.shipment?.status)} />
      ),
    },
    { key: "createdAt", label: "Created", render: (row) => formatDate(row.shipment?.createdAt) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AdminTable
        title="Shipments (Shiprocket)"
        subtitle={`${allTotal} total self-fulfilled shipments`}
        columns={columns}
        rows={allShipments}
        total={allTotal}
        page={allPage}
        limit={allLimit}
        loading={allLoading}
        onPageChange={(page) => fetchAllShipments({ page, limit: allLimit, fulfillmentType: "self" })}
        onView={(row) => navigate(`/orders/${row.orderId}?tab=shipments`)}
        emptyIcon={<Truck size={28} />}
        emptyText="No Shiprocket shipments yet."
      />
    </div>
  );
}
