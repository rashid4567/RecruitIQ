import React from "react";
import {
  MapPin,
  Clock,
  Banknote,
  Wifi,
  ChevronRight,
  Briefcase,
  Users,
  Eye,
} from "lucide-react";

import { Job } from "@/module/jobs/domain/entity/jobPost.entity";
import type { JobType } from "@/module/jobs/domain/dto/jobPost.dto";
// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatLocation(job: Job): string {
  if (job.isRemote && !job.location.city && !job.location.country)
    return "Remote";
  const parts = [
    job.location.city,
    job.location.state,
    job.location.country,
  ].filter(Boolean);
  return parts.join(", ") || "Location not specified";
}

function formatExperience(job: Job): string {
  if (job.experienceMin === 0 && job.experienceMax === 0) return "Any";
  if (job.experienceMax === 0) return `${job.experienceMin}+ yrs`;
  return `${job.experienceMin}–${job.experienceMax} yrs`;
}

function formatSalary(job: Job): string {
  if (!job.salary.min && !job.salary.max) return "Not disclosed";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: job.salary.currency || "INR",
      maximumFractionDigits: 0,
    }).format(n);
  if (!job.salary.max) return `${fmt(job.salary.min)}+`;
  return `${fmt(job.salary.min)} – ${fmt(job.salary.max)}`;
}

function jobTypeLabel(job: Job): string {
  const map: Record<JobType, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
  };
  return map[job.jobType] ?? job.jobType;
}

function postedAgo(job: Job): string {
  const base = job.postedOn ?? job.createdAt;
  if (!base) return "Recently posted";
  const diff = Math.floor((Date.now() - new Date(base).getTime()) / 86_400_000);
  if (diff === 0) return "Posted today";
  if (diff === 1) return "Posted yesterday";
  if (diff < 7) return `Posted ${diff}d ago`;
  if (diff < 30) return `Posted ${Math.floor(diff / 7)}w ago`;
  return `Posted ${Math.floor(diff / 30)}mo ago`;
}

// ─── Job type badge config (replaces external JOB_TYPE_CONFIG constant) ──────

const JOB_TYPE_CONFIG: Record<
  JobType,
  { bg: string; text: string; dot: string }
> = {
  "full-time": {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    dot: "bg-indigo-400",
  },
  "part-time": {
    bg: "bg-violet-50",
    text: "text-violet-600",
    dot: "bg-violet-400",
  },
  contract: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
  internship: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-400",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  style?: React.CSSProperties;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const JobCard: React.FC<JobCardProps> = ({ job, onApply, style }) => {
  const typeConfig = JOB_TYPE_CONFIG[job.jobType] ?? {
    bg: "bg-slate-50",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };

  const isUnavailable =
    job.status !== "active" || job.isBlocked || job.isDeleted;

  return (
    <article
      style={style}
      onClick={() => !isUnavailable && onApply(job)}
      className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col
        ${
          isUnavailable
            ? "border-slate-200 opacity-60 cursor-not-allowed"
            : "border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 cursor-pointer"
        }`}
    >
      {/* Top accent line */}
      {!isUnavailable && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* ── Header: title + job-type badge ── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-[15px] leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors duration-200 mb-1">
              {job.title}
            </h3>
            {job.department && (
              <p className="text-xs text-slate-400 font-medium">
                {job.department}
              </p>
            )}
          </div>

          <span
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${typeConfig.bg} ${typeConfig.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${typeConfig.dot}`} />
            {jobTypeLabel(job)}
          </span>
        </div>

        {/* ── Meta rows ── */}
        <div className="space-y-2 mb-4">
          {/* Location + Remote */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{formatLocation(job)}</span>
            {job.isRemote && (
              <span className="flex items-center gap-1 text-indigo-500 font-medium shrink-0">
                <Wifi className="w-3 h-3" /> Remote
              </span>
            )}
          </div>

          {/* Experience */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formatExperience(job)} experience</span>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <Banknote className="w-3.5 h-3.5 shrink-0" />
            <span>{formatSalary(job)}</span>
          </div>

          {/* Openings */}
          {job.positions > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {job.positions} opening{job.positions !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* ── Required Skills ── */}
        {job.requiredSkills.length > 0 && (
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
        )}

        {/* ── Footer: posted ago + stats + apply ── */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{postedAgo(job)}</span>
            {job.applicationsCount > 0 && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {job.applicationsCount.toLocaleString()}
              </span>
            )}
            {job.views > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {job.views.toLocaleString()}
              </span>
            )}
          </div>

          {isUnavailable ? (
            <span className="text-xs font-semibold text-slate-400">
              {job.isBlocked
                ? "Blocked"
                : job.status === "expired"
                  ? "Expired"
                  : job.status === "draft"
                    ? "Draft"
                    : "Unavailable"}
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(job);
              }}
              className="
      flex
      items-center
      gap-1
      text-xs
      font-bold
      text-indigo-600
      hover:text-indigo-800
      transition-colors
      group/btn
    "
            ></button>
          )}
        </div>
      </div>
    </article>
  );
};
