
import { Users, Calendar } from "lucide-react";
import { ApplicationStatus } from "@/module/job-application/domain/entity/job-application.entity";
import { ALL_STATUSES, STATUS_LABELS } from "./Status.constants";
import type { JobMeta } from "./Application.types";

interface JobHeaderProps {
  job: JobMeta;
  statusFilter: ApplicationStatus | "All";
  statusCounts: Partial<Record<ApplicationStatus | "All", number>>;
  loading: boolean;
  error: string | null;
  onStatusChange: (status: ApplicationStatus | "All") => void;
}

export function JobHeader({
  job,
  statusFilter,
  statusCounts,
  loading,
  error,
  onStatusChange,
}: JobHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-5 shrink-0">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h1>
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Users size={13} />
              {job.applications} total
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              Posted: {job.postedDate}
            </span>
          </div>
        </div>
        <button className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold px-4 py-2 rounded-lg text-sm transition">
          Close Job
        </button>
      </div>

      {!loading && !error && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onStatusChange("All")}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
              statusFilter === "All"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"
            }`}
          >
            All{" "}
            <span className="opacity-60 ml-0.5">({statusCounts.All ?? 0})</span>
          </button>

          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                statusFilter === s
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"
              }`}
            >
              {STATUS_LABELS[s]}{" "}
              <span className="opacity-60 ml-0.5">({statusCounts[s] ?? 0})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}