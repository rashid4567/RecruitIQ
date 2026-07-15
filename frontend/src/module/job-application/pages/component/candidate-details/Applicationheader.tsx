import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ApplicationHeaderProps {
  jobTitle: string;
}

export function ApplicationHeader({
  jobTitle,
}: ApplicationHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-4 mb-6 px-4 sm:px-6">
      <div className="flex items-center gap-3">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Breadcrumb */}
        <div className="min-w-0 flex-1">

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
            <button
              onClick={() => navigate("/")}
              className="hover:text-slate-700 transition"
            >
              Dashboard
            </button>

            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />

            <button
              onClick={() => navigate(-1)}
              className="hover:text-slate-700 transition"
            >
              My Applications
            </button>

            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />

            <span className="truncate font-medium text-slate-900">
              {jobTitle}
            </span>
          </div>

          {/* Mobile */}
          <div className="sm:hidden">
            <h1 className="truncate text-base font-semibold text-slate-900">
              {jobTitle}
            </h1>
          </div>
        </div>

      </div>
    </div>
  );
}