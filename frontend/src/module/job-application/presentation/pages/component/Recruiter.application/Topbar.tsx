import { Bell, Plus, RefreshCw, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function TopBar({ onRefresh, isRefreshing = false }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
   
      <div className="flex items-center gap-1.5 text-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-700 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition font-medium"
        >
          <ChevronLeft size={15} />
          Back
        </button>
        <span className="text-slate-300">/</span>
        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition font-medium"
        >
          Manage Jobs
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold px-2">Applications</span>
      </div>


      <div className="flex items-center gap-2">
     
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh applications"
          className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            size={14}
            className={isRefreshing ? "animate-spin" : ""}
          />
          {isRefreshing ? "Refreshing…" : "Refresh"}
        </button>


        <button
          onClick={() => navigate("/recruiter/job-editor")}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition shadow-sm"
        >
          <Plus size={15} />
          Create New Job
        </button>


        <button className="relative text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}