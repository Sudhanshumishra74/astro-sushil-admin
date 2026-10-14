import { Star, ExternalLink, Package } from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function TopProducts({ products = [], loading }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-5 border border-primary/8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-primary text-base flex items-center gap-1.5">
          <Star size={15} color="#D4AF37" strokeWidth={2} />
          Top Products
        </h2>

        <span
          onClick={() => navigate("/products")}
          className="text-xs text-gold cursor-pointer font-medium flex items-center gap-1"
        >
          <ExternalLink size={11} />
          View all
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-[#9a9abf]">
          <Package size={26} />
          <p className="text-xs">No products found.</p>
        </div>
      ) : (
        products.map((p, idx) => (
          <div
            key={p._id}
            className="flex items-center gap-3 py-3 border-b border-primary/5 last:border-none"
          >
            <span className="font-heading text-lg text-primary/20 w-6">
              {idx + 1}
            </span>

           <div className="flex-1 w-0">
  <div className="text-sm font-medium text-black truncate whitespace-nowrap overflow-hidden">
    {p.name}
  </div>

  <div className="text-[11px] text-primary/40 mt-1">
    Sold: {p.totalSold}
  </div>
</div>

            <div className="text-right">
              <div className="font-heading text-[15px] text-primary">
                ₹{Number(p.revenue).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
