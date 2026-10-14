import { ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../../hooks/usePermission";

export default function AccessDenied() {
  const navigate = useNavigate();
  const { role } = usePermission();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-primary/10 rounded-2xl p-8 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
          <ShieldOff size={26} className="text-red-500" />
        </div>

        <h1 className="font-heading text-xl font-bold text-black">Access Denied</h1>

        <p className="text-sm text-black/60 font-body leading-relaxed">
          You don't have permission to view this page. If you think this is a mistake, ask a
          Super Admin to update your role.
        </p>

        {role?.name && (
          <p className="text-xs text-black/40 font-body">
            Your current role: <span className="font-semibold text-black/60">{role.name}</span>
          </p>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-black/70 border border-black/10 hover:bg-secondary transition-colors"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
