import { MapPin, Briefcase, Calendar } from "lucide-react";
import type { Job } from "@/module/jobs/types/job.types";
import type { JobApplication } from "@/module/job-application/types/jobApplication.types";
import { getStatusConfig } from "./Statusconfig";
import { formatDateShort } from "./Formatters";

interface JobIdentityCardProps {
  job: Job;
  application: JobApplication;
  statusCfg: ReturnType<typeof getStatusConfig>;
}

export function JobIdentityCard({
  job,
  application,
  statusCfg,
}: JobIdentityCardProps) {
  const initials = job.title
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500" />

      <div className="p-5">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-base font-bold text-white tracking-tight">
              {initials}
            </span>
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h1 className="text-sm font-bold text-slate-900 leading-snug">
              {job.title}
            </h1>
            {job.department && (
              <p className="text-xs text-slate-400 mt-0.5">{job.department}</p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.pill}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`}
              />
              {statusCfg.label}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {statusCfg.progress}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${statusCfg.bar}`}
              style={{ width: `${statusCfg.progress}%` }}
            />
          </div>
        </div>
        <div className="space-y-1.5 text-xs text-slate-500">
          {(job.location?.city || job.location?.country) && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-350" />
              <span>
                {[job.location.city, job.location.state, job.location.country]
                  .filter(Boolean)
                  .join(", ")}
                {job.isRemote && (
                  <span className="ml-1.5 text-blue-500 font-semibold">
                    · Remote
                  </span>
                )}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 shrink-0 text-slate-350" />
            <span className="capitalize">{job.jobType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-350" />
            <span>Applied {formatDateShort(application.appliedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
