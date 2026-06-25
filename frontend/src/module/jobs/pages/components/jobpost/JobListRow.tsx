import { MapPin, MoreVertical, Eye, EyeOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { JobCardProps } from "../../../types/jobCard.types";
import { useRecruiterJobActions } from "@/module/jobs/hooks/Recruiter-jobPost/useJobActions"; 
const statusConfig = {
  Active:  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Paused:  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  Expired: { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500"     },
  Draft:   { bg: "bg-gray-50",    text: "text-gray-600",    dot: "bg-gray-400"    },
  Blocked: { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500"    },
};

export default function JobListRow({
  job,
  onViewClick,
  onJobUpdated,
}: {
  job: JobCardProps;
  onViewClick: (job: JobCardProps) => void;
  onJobUpdated?: (updated: JobCardProps) => void;
}) {
  const status = statusConfig[job.status];
  const { toggleHide, loading } = useRecruiterJobActions();
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
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="py-5 px-6">
        <div>
          <p
            className="font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
            onClick={() => onViewClick(job)}
          >
            {job.title}
          </p>
          <p className="text-sm text-gray-500">{job.category}</p>
          {isBlocked && (
            <p className="text-xs text-rose-500 mt-0.5">⚠️ Blocked by admin</p>
          )}
        </div>
      </td>

      <td className="py-5 px-6">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          {job.location}
        </div>
      </td>

      <td className="py-5 px-6">
        <span className="text-sm font-medium text-gray-900">{job.applications}</span>
      </td>

      <td className="py-5 px-6">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full"
              style={{ width: `${job.avgAiScore}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-900">{job.avgAiScore}%</span>
        </div>
      </td>

      <td className="py-5 px-6">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 w-fit ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {job.status}
        </span>
      </td>

      <td className="py-5 px-6">
        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
          <button
            onClick={() => onViewClick(job)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View
          </button>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          {open && (
            <div className="absolute right-0 top-8 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
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

              {isBlocked && (
                <div className="px-4 py-2 text-xs text-rose-500 border-t border-gray-100">
                  Blocked by admin — cannot change visibility
                </div>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}