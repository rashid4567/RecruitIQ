import { Users, Calendar, TrendingUp, XCircle } from "lucide-react";
import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";
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

const STATUS_DOT: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: "bg-blue-500",
  [ApplicationStatus.SHORTLISTED]: "bg-amber-400",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "bg-violet-500",
  [ApplicationStatus.SELECTED]: "bg-emerald-500",
  [ApplicationStatus.REJECTED]: "bg-red-400",
  [ApplicationStatus.WITHDRAWN]: "bg-slate-400",
};

export function JobHeader({
  job,
  statusFilter,
  statusCounts,
  loading,
  error,
  onStatusChange,
}: JobHeaderProps) {
  const total = statusCounts.All ?? 0;
const selected =
  statusCounts[ApplicationStatus.SELECTED] ?? 0;

const shortlisted =
  statusCounts[ApplicationStatus.SHORTLISTED] ?? 0;

  return (
    <div className="bg-white border-b border-slate-200 px-6 pt-5 pb-0 shrink-0">
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 min-w-0">
          <h1 className="text-[1.35rem] font-bold text-slate-900 leading-tight mb-1.5 truncate">
            {job.title}
          </h1>
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Users size={13} className="text-slate-400" />
              <strong className="text-slate-700 font-semibold">{total}</strong>
              &nbsp;applicants
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-slate-400" />
              Posted:&nbsp;
              <strong className="text-slate-700 font-semibold">
                {job.postedDate}
              </strong>
            </span>
            {total > 0 && (
              <span className="flex items-center gap-1.5">
                <TrendingUp size={13} className="text-emerald-500" />
                <span className="text-emerald-600 font-semibold">
                  {selected}
                </span>
                &nbsp;selected&nbsp;·&nbsp;
                <span className="text-amber-600 font-semibold">
                  {shortlisted}
                </span>
                &nbsp;shortlisted
              </span>
            )}
          </div>
        </div>

        <button className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold px-4 py-2 rounded-lg text-sm transition shrink-0 ml-6">
          <XCircle size={14} />
          Close Job
        </button>
      </div>

      {!loading && !error && (
        <div className="flex items-center gap-1 overflow-x-auto pb-0 scrollbar-none">
          {/* All tab */}
          <button
            onClick={() => onStatusChange("All")}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 text-[0.8rem] font-semibold whitespace-nowrap border-b-2 transition-colors ${
              statusFilter === "All"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            All
            <span
              className={`text-[0.7rem] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                statusFilter === "All"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {statusCounts.All ?? 0}
            </span>
          </button>

          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`relative flex items-center gap-1.5 px-4 py-2.5 text-[0.8rem] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                statusFilter === s
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[s]}`}
              />
              {STATUS_LABELS[s]}
              <span
                className={`text-[0.7rem] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                  statusFilter === s
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {statusCounts[s] ?? 0}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
