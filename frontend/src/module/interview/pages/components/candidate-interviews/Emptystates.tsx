import { Calendar, Search } from "lucide-react";

export function NoInterviewsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-2 text-slate-400 bg-white rounded-xl border border-slate-200">
      <Calendar size={36} className="text-slate-200" />
      <p className="text-sm font-semibold text-slate-500 mt-2">
        No interviews yet
      </p>
      <p className="text-xs text-slate-400">
        Once a recruiter schedules an interview, it'll show up here.
      </p>
    </div>
  );
}

export function NoResultsEmptyState({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-2 text-slate-400 bg-white rounded-xl border border-slate-200">
      <Search size={32} className="text-slate-200" />
      <p className="text-sm font-semibold text-slate-500 mt-2">
        No interviews match your search
      </p>
      <button
        onClick={onClearFilters}
        className="text-xs px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 font-medium mt-1"
      >
        Clear filters
      </button>
    </div>
  );
}