import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  UserCheck,
  XCircle,
  AlertTriangle,
  X,
  ShieldAlert,
} from "lucide-react";
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
  onCloseJob: () => void;
  closingJob: boolean;
}

const STATUS_DOT: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: "bg-blue-500",
  [ApplicationStatus.SHORTLISTED]: "bg-amber-400",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "bg-violet-500",
  [ApplicationStatus.SELECTED]: "bg-emerald-500",
  [ApplicationStatus.REJECTED]: "bg-red-400",
  [ApplicationStatus.WITHDRAWN]: "bg-slate-400",
};

// Statuses that are still "in play" — closing the job will auto-reject these.
const AT_RISK_STATUSES: ApplicationStatus[] = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.INTERVIEW_SCHEDULED,
];

function StatChip({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-2.5 pr-5 border-r border-slate-200 last:border-r-0 last:pr-0">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tone}`}
      >
        {icon}
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold text-slate-800 tabular-nums">
          {value}
        </p>
        <p className="text-[0.7rem] text-slate-400 font-medium whitespace-nowrap">
          {label}
        </p>
      </div>
    </div>
  );
}

function CloseJobModal({
  job,
  statusCounts,
  closingJob,
  onConfirm,
  onCancel,
}: {
  job: JobMeta;
  statusCounts: Partial<Record<ApplicationStatus | "All", number>>;
  closingJob: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !closingJob) onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel, closingJob]);

  const atRiskBreakdown = AT_RISK_STATUSES.map((s) => ({
    status: s,
    count: statusCounts[s] ?? 0,
  })).filter((s) => s.count > 0);

  const atRiskTotal = atRiskBreakdown.reduce((sum, s) => sum + s.count, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="close-job-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-150"
        onClick={() => !closingJob && onCancel()}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onCancel}
          disabled={closingJob}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors disabled:opacity-40"
        >
          <X size={18} />
        </button>

        <div className="px-6 pt-6 pb-5">
          <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <ShieldAlert size={20} className="text-red-500" />
          </div>

          <h2
            id="close-job-title"
            className="text-base font-bold text-slate-900 mb-1.5"
          >
            Close "{job.title}"?
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            This job will stop accepting new applications. Any candidate not
            already marked{" "}
            <span className="font-semibold text-emerald-600">Selected</span>{" "}
            or{" "}
            <span className="font-semibold text-slate-500">Rejected</span>{" "}
            will be automatically rejected.
          </p>

          {atRiskTotal > 0 ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-2.5">
                <AlertTriangle size={13} />
                {atRiskTotal} candidate{atRiskTotal !== 1 ? "s" : ""} will be
                rejected
              </p>
              <ul className="space-y-1.5">
                {atRiskBreakdown.map(({ status, count }) => (
                  <li
                    key={status}
                    className="flex items-center justify-between text-xs text-amber-900"
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`}
                      />
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="font-bold tabular-nums">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
              No pending candidates will be affected — everyone has already
              been selected, rejected, or withdrew.
            </div>
          )}

          <p className="mt-3 text-xs text-slate-400">
            This action can't be undone.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onCancel}
            disabled={closingJob}
            className="flex-1 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            Keep it open
          </button>
          <button
            onClick={onConfirm}
            disabled={closingJob}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {closingJob ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Closing…
              </>
            ) : (
              <>
                <XCircle size={14} />
                Yes, close job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function JobHeader({
  job,
  statusFilter,
  statusCounts,
  loading,
  error,
  onStatusChange,
  onCloseJob,
  closingJob,
}: JobHeaderProps) {
  const [showCloseModal, setShowCloseModal] = useState(false);

  const total = statusCounts.All ?? 0;
  const selected = statusCounts[ApplicationStatus.SELECTED] ?? 0;
  const shortlisted = statusCounts[ApplicationStatus.SHORTLISTED] ?? 0;

  useEffect(() => {
    if (!closingJob) setShowCloseModal((open) => (open ? false : open));
   
  }, [closingJob]);

  return (
    <div className="bg-white border-b border-slate-200 px-6 pt-6 pb-0 shrink-0">
      <div className="flex items-start justify-between gap-6 mb-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-3">
            <h1 className="text-xl font-bold text-slate-900 leading-tight truncate">
              {job.title}
            </h1>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
              <Calendar size={11} className="text-slate-400" />
              {job.postedDate}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-8 rounded bg-slate-100 animate-pulse" />
                    <div className="h-2.5 w-14 rounded bg-slate-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center gap-1.5 text-sm text-red-500">
              <AlertTriangle size={14} />
              Couldn't load job stats
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <StatChip
                icon={<Users size={15} className="text-blue-600" />}
                tone="bg-blue-50"
                label="applicants"
                value={total}
              />
              <StatChip
                icon={<UserCheck size={15} className="text-emerald-600" />}
                tone="bg-emerald-50"
                label="selected"
                value={selected}
              />
              <StatChip
                icon={<TrendingUp size={15} className="text-amber-600" />}
                tone="bg-amber-50"
                label="shortlisted"
                value={shortlisted}
              />
            </div>
          )}
        </div>

        <button
          onClick={() => setShowCloseModal(true)}
          disabled={closingJob || loading}
          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold px-4 py-2 rounded-lg text-sm transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircle size={14} />
          Close job
        </button>
      </div>

      {!loading && !error && (
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none -mb-px">
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

      {loading && (
        <div className="flex items-center gap-6 pb-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-4 w-16 rounded bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {showCloseModal && (
        <CloseJobModal
          job={job}
          statusCounts={statusCounts}
          closingJob={closingJob}
          onConfirm={onCloseJob}
          onCancel={() => setShowCloseModal(false)}
        />
      )}
    </div>
  );
}