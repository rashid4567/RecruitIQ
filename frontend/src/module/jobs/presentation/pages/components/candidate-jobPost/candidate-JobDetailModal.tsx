import React, { useState } from "react";
import {
  X, ChevronRight, Briefcase, ChevronDown, MapPin, Building2,
  DollarSign, Clock, Users, Award, BookOpen, CheckCircle2,
  ExternalLink, Eye, FileText, Shield, Hash, Sparkles,
} from "lucide-react";
import { useApplyJob } from "@/module/job-application/presentation/hooks/useApplyJob";
import type { ApplyJobDTO } from "@/module/job-application/domain/repository/application.repository";

type JobType = "full-time" | "part-time" | "contract" | "internship" | "freelance";
type JobStatus = "draft" | "active" | "expired" | "closed";
type JobVisibility = "active" | "hidden";

interface LocationVO {
  city: string;
  state: string;
  country: string;
}

interface SalaryVO {
  min: number;
  max: number;
  currency: string;
}

export interface Job {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  location: LocationVO;
  isRemote: boolean;
  jobType: JobType;
  salary: SalaryVO;
  department: string;
  positions: number;
  visibility: JobVisibility;
  isBlocked: boolean;
  status: JobStatus;
  views: number;
  applicationsCount: number;
  isDeleted: boolean;
  postedOn?: Date;
  expiresAt?: Date;
  externalLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function formatLocation(job: Job): string {
  if (job.isRemote && !job.location.city && !job.location.country) return "Remote";
  const parts = [job.location.city, job.location.state, job.location.country].filter(Boolean);
  const loc = parts.join(", ");
  return job.isRemote ? `${loc} (Remote)` : loc || "Location not specified";
}

function formatExperience(job: Job): string {
  if (job.experienceMin === 0 && job.experienceMax === 0) return "Any experience";
  if (job.experienceMax === 0) return `${job.experienceMin}+ years`;
  return `${job.experienceMin}–${job.experienceMax} years`;
}

function jobTypeLabel(job: Job): string {
  const map: Record<JobType, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
    freelance: "Freelance",
  };
  return map[job.jobType] ?? job.jobType;
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

function postedAgo(job: Job): string {
  const base = job.postedOn ?? job.createdAt;
  if (!base) return "recently";
  const diff = Math.floor((Date.now() - new Date(base).getTime()) / 86_400_000);
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} week${Math.floor(diff / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diff / 30)} month${Math.floor(diff / 30) > 1 ? "s" : ""} ago`;
}

const Button: React.FC<{
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ children, variant = "default", size = "default", className = "", onClick, disabled = false }) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50",
    ghost: "hover:bg-gray-100 text-gray-600 disabled:opacity-50",
  };
  const sizes = { sm: "h-9 px-3 text-sm", default: "h-10 px-4 py-2", lg: "h-11 px-8 text-base" };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Collapsible: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 px-1 text-left hover:bg-gray-50 rounded transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="pb-4 pt-1">{children}</div>}
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse p-6">
    <div className="mb-6">
      <div className="h-7 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="flex flex-wrap gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-28" />
        ))}
      </div>
      <div className="h-10 bg-gray-200 rounded w-36" />
    </div>
    <div className="flex gap-8">
      <div className="flex-1 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-5 bg-gray-200 rounded w-40 mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
        ))}
      </div>
      <div className="w-72 space-y-4">
        <div className="h-40 bg-gray-200 rounded-lg" />
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
);

const MatchScoreDonut: React.FC<{ score: number }> = ({ score }) => {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>{score}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center">Based on your skills and experience</p>
    </div>
  );
};

const ApplyBanner: React.FC<{ success: boolean; error: string | null; onDismiss: () => void }> = ({
  success, error, onDismiss,
}) => {
  if (!success && !error) return null;
  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium mt-4 ${
        success
          ? "bg-green-50 border border-green-200 text-green-700"
          : "bg-red-50 border border-red-200 text-red-700"
      }`}
    >
      <span className="flex items-center gap-2">
        {success ? (
          <><CheckCircle2 className="w-4 h-4 shrink-0" />Application submitted successfully!</>
        ) : (
          <><Shield className="w-4 h-4 shrink-0" />{error}</>
        )}
      </span>
      <button onClick={onDismiss} className="shrink-0 hover:opacity-70 transition-opacity" aria-label="Dismiss">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface JobDetailModalProps {
  job: Job;
  applyPayload: ApplyJobDTO;
  onClose: () => void;
  onApplySuccess?: () => void;
  loading?: boolean;
  matchScore?: number;
}

export default function JobDetailModal({
  job,
  applyPayload,
  onClose,
  onApplySuccess,
  loading = false,
  matchScore = 85,
}: JobDetailModalProps) {
  const { loading: applying, error, success, apply, reset } = useApplyJob();

  if (!job) return null;

  const handleApply = async () => {
    const ok = await apply(applyPayload);
    if (ok) onApplySuccess?.();
  };

  const summaryRows: { label: string; value: React.ReactNode }[] = [
    { label: "Experience", value: formatExperience(job) },
    { label: "Job type", value: jobTypeLabel(job) },
    { label: "Salary range", value: formatSalary(job) },
    { label: "Location", value: formatLocation(job) },
    { label: "Department", value: job.department || "—" },
    { label: "Openings", value: job.positions > 0 ? String(job.positions) : "—" },
    { label: "Applications", value: job.applicationsCount.toLocaleString() },
    { label: "Views", value: job.views.toLocaleString() },
    { label: "Visibility", value: job.visibility },
    ...(job.postedOn
      ? [{ label: "Posted on", value: new Date(job.postedOn).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) }]
      : []),
    ...(job.expiresAt
      ? [{ label: "Apply before", value: <span className="text-red-500 font-medium">{new Date(job.expiresAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span> }]
      : []),
    ...(job.createdAt
      ? [{ label: "Created", value: new Date(job.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) }]
      : []),
    ...(job.updatedAt
      ? [{ label: "Last updated", value: new Date(job.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) }]
      : []),
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-auto overflow-hidden">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-blue-600">RecruitIQ</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-140px)]">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
              <span>Jobs</span>
              <ChevronRight className="w-3 h-3" />
              {job.department && (
                <>
                  <span>{job.department}</span>
                  <ChevronRight className="w-3 h-3" />
                </>
              )}
              <span className="text-gray-700 font-medium truncate">{job.title}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-8">

              {/* Left / Main */}
              <div className="flex-1 min-w-0">
                <div className="mb-5">
                  <div className="flex items-start gap-3 flex-wrap mb-1">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{job.title}</h1>
                    {job.isRemote && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 mt-1">
                        Remote
                      </span>
                    )}
                    {job.isBlocked && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 mt-1">
                        <Shield className="w-3 h-3" /> Blocked
                      </span>
                    )}
                  </div>
                  {job.department && <p className="text-sm text-gray-500 mb-3">{job.department}</p>}

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-500 mb-5">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 shrink-0" />{formatLocation(job)}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 shrink-0" />{formatExperience(job)}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 shrink-0" />{jobTypeLabel(job)}</span>
                    <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 shrink-0" />{formatSalary(job)}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 shrink-0" />Posted {postedAgo(job)}</span>
                    {job.positions > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 shrink-0" />{job.positions} opening{job.positions !== 1 ? "s" : ""}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 shrink-0" />{job.views.toLocaleString()} views</span>
                    <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 shrink-0" />{job.applicationsCount.toLocaleString()} applicants</span>
                  </div>

                  <Button size="lg" onClick={handleApply} disabled={applying || success} className="px-10">
                    {applying ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Applying…
                      </span>
                    ) : success ? (
                      <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Applied</span>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>

                  <ApplyBanner success={success} error={error} onDismiss={reset} />
                </div>

                <div className="space-y-0 divide-y divide-gray-100 border-t border-gray-100">
                  <Collapsible title="Job Description" defaultOpen>
                    {job.description ? (
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No description provided.</p>
                    )}
                  </Collapsible>

                  {job.responsibilities.length > 0 && (
                    <Collapsible title="Key Responsibilities" defaultOpen>
                      <ul className="space-y-2">
                        {job.responsibilities.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /><span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </Collapsible>
                  )}

                  {job.requirements.length > 0 && (
                    <Collapsible title="Requirements" defaultOpen>
                      <ul className="space-y-2">
                        {job.requirements.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Award className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /><span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </Collapsible>
                  )}

                  {job.requiredSkills.length > 0 && (
                    <Collapsible title="Required Skills" defaultOpen>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100">{s}</span>
                        ))}
                      </div>
                    </Collapsible>
                  )}

                  {job.preferredSkills.length > 0 && (
                    <Collapsible title="Preferred Skills" defaultOpen={false}>
                      <div className="flex flex-wrap gap-2">
                        {job.preferredSkills.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">{s}</span>
                        ))}
                      </div>
                    </Collapsible>
                  )}
                </div>

                {job.externalLink && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <a href={job.externalLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View on Company Website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Right / Sidebar */}
              <div className="w-full lg:w-72 shrink-0 space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />AI Match Score
                  </h3>
                  <MatchScoreDonut score={matchScore} />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Job Summary</h3>
                  <div className="space-y-2.5">
                    {summaryRows.map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center text-xs gap-2">
                        <span className="text-gray-400 shrink-0">{label}</span>
                        <span className="text-gray-800 font-medium text-right max-w-[55%] truncate">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-xs gap-2 pt-1 border-t border-gray-100">
                      <span className="text-gray-400 flex items-center gap-1 shrink-0">
                        <Hash className="w-3 h-3" /> Job ID
                      </span>
                      <span className="text-gray-300 font-mono truncate max-w-[55%]" title={job.id}>{job.id}</span>
                    </div>
                  </div>
                </div>

                {job.requiredSkills.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.slice(0, 8).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100">{s}</span>
                      ))}
                      {job.requiredSkills.length > 8 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">+{job.requiredSkills.length - 8} more</span>
                      )}
                    </div>
                  </div>
                )}

                {job.preferredSkills.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />Preferred Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {job.preferredSkills.slice(0, 6).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">{s}</span>
                      ))}
                      {job.preferredSkills.length > 6 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">+{job.preferredSkills.length - 6} more</span>
                      )}
                    </div>
                  </div>
                )}

                {(job.isBlocked || job.isDeleted || job.visibility === "hidden") && (
                  <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                    <p className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Admin Flags
                    </p>
                    <ul className="text-xs text-red-600 space-y-1">
                      {job.isBlocked && <li>• This job is blocked by admin</li>}
                      {job.isDeleted && <li>• This job has been soft-deleted</li>}
                      {job.visibility === "hidden" && <li>• Visibility is set to hidden</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}