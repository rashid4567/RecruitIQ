import { MapPin, Clock, MoreVertical, EyeOff, Eye } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { JobCardProps } from "../../../types/jobCard.types";
import { useJobActions } from "../../../hooks/jobPost/useJobActions";

const statusConfig = {
  Active:  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Paused:  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  Expired: { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500"     },
  Draft:   { bg: "bg-gray-50",    text: "text-gray-600",    dot: "bg-gray-400"    },
  Blocked: { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500"    },
};

export default function JobCard({
  job,
  onViewClick,
  onJobUpdated,
}: {
  job: JobCardProps;
  onViewClick: (job: JobCardProps) => void;
  onJobUpdated?: (updated: JobCardProps) => void;
}) {
  const status = statusConfig[job.status];
  const { toggleHide, loading } = useJobActions();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHidden = job.visibility === "hidden";
  const isBlocked = job.isBlocked;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
          {job.category}
        </span>
        <span className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {job.status}
        </span>
      </div>

      {/* Admin blocked banner */}
      {isBlocked && (
        <div className="mb-3 px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600 font-medium">
          ⚠️ This job has been blocked by admin
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {job.title}
      </h3>

      {/* Info */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{job.jobType}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{job.applications}</p>
          <p className="text-xs text-gray-500">Applications</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{job.shortlisted}</p>
          <p className="text-xs text-gray-500">Shortlisted</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {job.avgAiScore}%
          </p>
          <p className="text-xs text-gray-500">AI Score</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 relative" ref={dropdownRef}>
        <button
          onClick={() => onViewClick(job)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all"
        >
          Quick View
        </button>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-14 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {/* Hide / Unhide — disabled if admin blocked */}
            <button
              onClick={async () => {
                await toggleHide(job, onJobUpdated);
                setOpen(false);
              }}
              disabled={loading || isBlocked}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isHidden ? (
                <>
                  <Eye className="w-4 h-4 text-emerald-500" />
                  Unhide Job
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 text-amber-500" />
                  Hide Job
                </>
              )}
            </button>

            {/* Blocked reason */}
            {isBlocked && (
              <div className="px-4 py-2 text-xs text-rose-500 border-t border-gray-100">
                Blocked by admin — cannot change visibility
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}