import React from "react";
import { MapPin, Clock, Banknote, Wifi, ChevronRight } from "lucide-react";
import type { JobPost } from "@/module/candidate/domain/entities/jobPost";
import { JOB_TYPE_CONFIG } from "../../types/jobTypes";

interface JobCardProps {
  job: JobPost;
  onApply: (job: JobPost) => void;
  style?: React.CSSProperties;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply, style }) => {
  const typeConfig = JOB_TYPE_CONFIG[job.jobType] ?? {
    bg: "bg-slate-50",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };

  return (
    <article
      style={style}
      onClick={() => onApply(job)}
      className="group relative bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-[15px] leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors duration-200 mb-1">
              {job.title}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {job.department}
            </p>
          </div>
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${typeConfig.bg} ${typeConfig.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${typeConfig.dot}`} />
            {job.jobTypeLabel()}
          </span>
        </div>

        {/* Meta */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.formatLocation()}</span>
            {job.isRemote && (
              <span className="flex items-center gap-1 text-indigo-500 font-medium shrink-0">
                <Wifi className="w-3 h-3" /> Remote
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.formatExperience()} experience</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <Banknote className="w-3.5 h-3.5 shrink-0" />
            <span>{job.formatSalary()}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
          {job.requiredSkills.slice(0, 3).map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="inline-flex items-center rounded-lg bg-slate-50 border border-slate-200 px-2 py-0.5 text-xs text-slate-600 font-medium"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 3 && (
            <span className="inline-flex items-center rounded-lg bg-slate-50 border border-slate-200 px-2 py-0.5 text-xs text-slate-400">
              +{job.requiredSkills.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <span className="text-xs text-slate-400">{job.postedAgo()}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group/btn"
          >
            Apply Now
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
