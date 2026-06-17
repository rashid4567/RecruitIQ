import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  MoreHorizontal,
} from "lucide-react";

interface ApplicationHeaderProps {
  jobTitle: string;
  companyName?: string;
}

export function ApplicationHeader({
  jobTitle,
  companyName,
}: ApplicationHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-100 shrink-0 z-20">
      <div className="px-6 h-14 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all group shrink-0"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        </button>
        <nav className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap hidden sm:block"
          >
            Dashboard
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:block" />
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap hidden sm:block"
          >
            My Applications
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:block" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-800 font-semibold text-sm truncate">
              {jobTitle}
            </span>
            {companyName && (
              <>
                <span className="text-slate-200 hidden sm:block">·</span>
                <span className="text-slate-400 text-xs truncate hidden sm:block">
                  {companyName}
                </span>
              </>
            )}
          </div>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-header: status strip */}
      <div className="px-6 pb-3 flex items-center gap-6 border-t border-slate-50">
        <StepStrip />
      </div>
    </header>
  );
}

function StepStrip() {
  return (
    <div className="flex items-center gap-1 text-xs text-slate-400 pt-2">
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
        Application in review
      </span>
    </div>
  );
}
