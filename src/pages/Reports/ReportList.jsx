/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReportStore } from "../../store/useReportStore";
import { Edit, Trash2 } from "lucide-react";

export default function ReportList() {
  const navigate = useNavigate();
  const { reports, loading, fetchReports, deleteReport } = useReportStore();
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteReport(id);
    setDeletingId(null);
    setConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-secondary ">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-xl  text-[#1a1a2e]">Reports</h1>
        </div>
        {import.meta.env.DEV && (
          <button
            onClick={() => navigate("/pdfreports/add")}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium tracking-wide hover:bg-[#3b3f63] transition-colors shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Report
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-white border border-primary/20 flex items-center justify-center mb-4">
            <svg
              className="w-7 h-7 text-primary/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-3-3v6M4.5 19.5l15-15M19.5 4.5l-15 15"
              />
            </svg>
          </div>
          <p className="font-heading text-xl text-[#1a1a2e] mb-1">
            No Reports Yet
          </p>
          <p className="text-[#555570] text-sm">
            {import.meta.env.DEV
              ? 'Click "Add Report" to create your first one.'
              : "Reports can be added from the development environment."}
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && reports.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary/5 border-b border-primary/10">
                  <th className="text-left px-5 py-4 text-primary font-semibold tracking-wide text-xs uppercase">
                    Cover
                  </th>
                  <th className="text-left px-5 py-4 text-primary font-semibold tracking-wide text-xs uppercase">
                    Name
                  </th>
                  <th className="text-left px-5 py-4 text-primary font-semibold tracking-wide text-xs uppercase">
                    Slug
                  </th>
                  <th className="text-left px-5 py-4 text-primary font-semibold tracking-wide text-xs uppercase">
                    Price
                  </th>
                  <th className="text-left px-5 py-4 text-primary font-semibold tracking-wide text-xs uppercase">
                    Sale
                  </th>
                  <th className="text-left px-5 py-4 text-primary font-semibold tracking-wide text-xs uppercase">
                    Status
                  </th>
                  <th className="text-left px-5 py-4 text-primary font-semibold tracking-wide text-xs uppercase">
                    Premium
                  </th>
                  <th className="text-right px-5 py-4 text-primary font-semibold tracking-wide text-xs uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, i) => (
                  <tr
                    key={report._id}
                    className={`border-b border-primary/5 hover:bg-secondary/60 transition-colors ${i % 2 === 0 ? "" : "bg-primary/2"}`}
                  >
                    {/* Cover */}
                    <td className="px-5 py-3">
                      {report.coverImage ? (
                        <img
                          src={report.coverImage}
                          alt={report.name}
                          className="w-10 h-14 object-cover rounded-md border border-primary/10"
                        />
                      ) : (
                        <div className="w-10 h-14 rounded-md bg-secondary border border-primary/10 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-primary/30"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909"
                            />
                          </svg>
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-3">
                      <p className="font-heading text-[#1a1a2e] font-semibold text-[15px] leading-tight">
                        {report.name}
                      </p>
                      {report.shortDescription && (
                        <p className="text-[#888899] text-xs mt-0.5 line-clamp-1 max-w-45">
                          {report.shortDescription}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-3">
                      <span className="font-mono text-xs bg-secondary text-primary px-2 py-1 rounded">
                        {report.slug}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-[#555570]">
                      <span className="line-through text-xs">
                        ₹{report.originalPrice}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <span className="text-gold font-bold text-sm">
                        ₹{report.salePrice}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${report.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${report.isActive ? "bg-emerald-500" : "bg-red-500"}`}
                        />
                        {report.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${report.isPremium ? "bg-gold/10 text-gold" : "bg-gray-100 text-gray-500"}`}
                      >
                        {report.isPremium ? "✦ Premium" : "Free"}
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {import.meta.env.DEV && (
                          <button
                            onClick={() =>
                              navigate(`/pdfreports/edit/${report._id}`)
                            }
                            className="p-2  cursor-pointer rounded-lg bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
                            title="Edit"
                          >

                           <Edit size={16}/>
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmId(report._id)}
                          className="p-2 cursor-pointer rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                          title="Delete"
                        >
                         <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-primary/5 bg-primary/2">
            <p className="text-xs text-[#888899]">
              {reports.length} report{reports.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-7 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-[#1a1a2e] text-center mb-2">
              Delete Report?
            </h3>
            <p className="text-[#555570] text-sm text-center mb-6">
              This action cannot be undone. The report will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-primary/20 text-primary text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deletingId === confirmId ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
