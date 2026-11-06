import { Gem } from "lucide-react";

// Ported from the customer site's SwatchCard (Productdetailpage.jsx) so the
// admin's product view/customization screens read as the same visual
// language as what a shopper actually sees — same image-tile + active-border
// + label structure, just using the admin app's own color tokens (different
// Tailwind config from the frontend) instead of the frontend's. The
// hover-zoom preview is a shopping affordance, not part of the core visual
// identity, so it's deliberately left out here.
export default function AdminSwatchCard({ active, image, name, subtext }) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-20 shrink-0">
      <span
        className={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-secondary/40 flex items-center justify-center transition-all duration-200 ${
          active ? "border-primary shadow-sm ring-2 ring-primary/15" : "border-[#e5e5f0]"
        }`}
      >
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <Gem size={26} className="text-primary/70" aria-hidden="true" />
        )}
      </span>
      <span
        className={`text-xs text-center leading-tight ${active ? "text-primary font-semibold" : "text-[#6b6b8a]"}`}
      >
        {name}
      </span>
      {subtext && <span className="text-[10px] text-primary/70">{subtext}</span>}
    </div>
  );
}
