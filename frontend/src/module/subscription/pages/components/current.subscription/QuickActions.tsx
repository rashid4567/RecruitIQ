import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button
          onClick={() => navigate("/recruiter/plans")}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all"
        >
          <span>Upgrade Plan</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
          <span>Manage Billing</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
          <span>Download Invoice</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
