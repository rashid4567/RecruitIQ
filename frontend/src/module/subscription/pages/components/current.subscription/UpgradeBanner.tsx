import { ArrowRight, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpgradeBanner() {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200 bg-linear-to-r from-blue-600 to-blue-700 overflow-hidden">
      <div className="px-6 py-8 md:flex md:items-center md:justify-between">
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Flame className="h-6 w-6" />
            Ready to scale?
          </h3>
          <p className="text-blue-100 max-w-sm">
            Upgrade to Enterprise for unlimited features, dedicated support, and
            advanced analytics for your recruitment needs.
          </p>
        </div>
        <button
          onClick={() => navigate("/recruiter/plans")}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold transition-colors whitespace-nowrap"
        >
          View Plans
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
