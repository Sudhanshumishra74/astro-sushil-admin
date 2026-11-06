/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Undo2 } from "lucide-react";
import AdminTable, { Badge, formatDate } from "../../components/common/Admintable";
import FormSelect from "../../components/common/FormSelect";
import { useReturnStore } from "../../store/useReturnStore";

const RETURN_STATUS_VARIANT = {
  requested: "warning",
  approved: "info",
  pickup_scheduled: "info",
  picked_up: "info",
  in_transit: "info",
  received: "warning",
  inspection_pending: "warning",
  approved_for_refund: "info",
  rejected: "danger",
  refunded: "success",
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  ...Object.keys(RETURN_STATUS_VARIANT).map((s) => ({ value: s, label: s.replace(/_/g, " ") })),
];

export default function ReturnsList() {
  const navigate = useNavigate();
  const { allReturns, allLoading, allTotal, allPage, allLimit, fetchAllReturns } = useReturnStore();
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchAllReturns({ page: 1, limit: allLimit, status });
  }, [status]);

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
          <p className="text-sm">{row.userName || "—"}</p>
          <p className="text-xs text-[#9a9abf]">{row.userEmail}</p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (row) => row.return?.items?.map((i) => `${i.name} × ${i.quantity}`).join(", "),
    },
    { key: "reason", label: "Reason", render: (row) => row.return?.reason || "—" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge label={row.return?.status} variant={RETURN_STATUS_VARIANT[row.return?.status] ?? "default"} />
      ),
    },
    {
      key: "refundAmount",
      label: "Refund",
      render: (row) => (row.return?.refundAmount != null ? `₹${row.return.refundAmount.toLocaleString("en-IN")}` : "—"),
    },
    { key: "requestedAt", label: "Requested", render: (row) => formatDate(row.return?.requestedAt) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <AdminTable
        title="Returns"
        subtitle={`${allTotal} total returns`}
        columns={columns}
        rows={allReturns}
        total={allTotal}
        page={allPage}
        limit={allLimit}
        loading={allLoading}
        onPageChange={(page) => fetchAllReturns({ page, limit: allLimit, status })}
        onView={(row) => navigate(`/orders/${row.orderId}?tab=returns`)}
        emptyIcon={<Undo2 size={28} />}
        emptyText="No return requests yet."
        filterSlot={
          <div className="w-full sm:w-56">
            <FormSelect
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={STATUS_OPTIONS}
            />
          </div>
        }
      />
    </div>
  );
}
