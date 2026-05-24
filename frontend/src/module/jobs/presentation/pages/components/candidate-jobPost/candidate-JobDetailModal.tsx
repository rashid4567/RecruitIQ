import React, { useState } from "react";
import {
  X,
  ChevronRight,
  Briefcase,
  ChevronDown,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  Shield,
  Hash,
} from "lucide-react";

// ─── Types (inlined from Job entity / DTOs) ──────────────────────────────────

type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "freelance";
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

// ─── Helpers (mirrors Job entity methods) ────────────────────────────────────

function formatLocation(job: Job): string {
  if (job.isRemote && !job.location.city && !job.location.country)
    return "Remote";
  const parts = [
    job.location.city,
    job.location.state,
    job.location.country,
  ].filter(Boolean);
  const loc = parts.join(", ");
  return job.isRemote ? `${loc} (Remote)` : loc || "Location not specified";
}

function formatExperience(job: Job): string {
  if (job.experienceMin === 0 && job.experienceMax === 0)
    return "Any experience";
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
  if (diff < 30)
    return `${Math.floor(diff / 7)} week${Math.floor(diff / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diff / 30)} month${Math.floor(diff / 30) > 1 ? "s" : ""} ago`;
}

function statusColor(status: JobStatus) {
  const map: Record<JobStatus, string> = {
    active: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    expired: "bg-red-100 text-red-700",
    closed: "bg-gray-100 text-gray-600",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const Button: React.FC<{
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled = false,
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50",
    ghost: "hover:bg-gray-100 text-gray-600 disabled:opacity-50",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8",
  };
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
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-left hover:bg-gray-50 px-2 -mx-2 rounded transition-colors"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="pb-4 pt-2">{children}</div>}
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="mb-6">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-24" />
        ))}
      </div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-b border-gray-200 pb-4">
          <div className="h-5 bg-gray-200 rounded w-40 mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onApply: () => void | Promise<void>;
  applying?: boolean;
  loading?: boolean;
  /** Optional: pass a 0–100 AI match score */
  matchScore?: number;
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function JobDetailModal({
  job,
  onClose,
  onApply,
  applying = false,
  loading = false,
  matchScore = 85,
}: JobDetailModalProps) {
  if (!job) return null;

  const circumference = 2 * Math.PI * 40; // r=40
  const offset = circumference - (matchScore / 100) * circumference;

  const scoreColor =
    matchScore >= 75 ? "#22c55e" : matchScore >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-auto">
        {/* ── Header ── */}
        <div className="border-b border-gray-200 p-4 sticky top-0 bg-white rounded-t-lg z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-blue-500">
                RecruitIQ
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Breadcrumb */}
              <div className="mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-gray-500">jobs</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  {job.department && (
                    <>
                      <span className="text-gray-500">{job.department}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </>
                  )}
                  <span className="text-gray-900 font-medium">{job.title}</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* ── Left column ── */}
                <div className="flex-1">
                  {/* Title + meta */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h1 className="text-2xl font-bold text-gray-900">
                            {job.title}
                          </h1>
                          {/* Status badge */}
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor(job.status)}`}
                          >
                            {job.status}
                          </span>
                          {job.isBlocked && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> Blocked
                            </span>
                          )}
                          {job.isRemote && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                              Remote
                            </span>
                          )}
                        </div>
                        {job.department && (
                          <p className="text-gray-600 mb-3">{job.department}</p>
                        )}

                        {/* Meta row */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{formatLocation(job)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            <span>{formatExperience(job)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4" />
                            <span>{jobTypeLabel(job)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatSalary(job)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>Posted {postedAgo(job)}</span>
                          </div>
                          {job.positions > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              <span>
                                {job.positions} opening
                                {job.positions !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            <span>{job.views.toLocaleString()} views</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-4 h-4" />
                            <span>
                              {job.applicationsCount.toLocaleString()}{" "}
                              applicants
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 shadow-md hover:shadow-lg transition-all"
                        onClick={onApply}
                        disabled={
                          applying || job.status !== "active" || job.isBlocked
                        }
                      >
                        {applying ? "Applying…" : "Apply Now"}
                      </Button>
                    </div>
                  </div>

                  {/* Collapsible sections */}
                  <div className="space-y-1">
                    <Collapsible title="Job Description" defaultOpen>
                      {job.description ? (
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                          {job.description}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-sm italic">
                          No description available for this position.
                        </p>
                      )}
                    </Collapsible>

                    {job.responsibilities.length > 0 && (
                      <Collapsible title="Key Responsibilities" defaultOpen>
                        <ul className="space-y-2">
                          {job.responsibilities.map((resp, idx) => (
                            <li
                              key={idx}
                              className="flex gap-2 text-sm text-gray-600"
                            >
                              <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </Collapsible>
                    )}

                    {job.requirements.length > 0 && (
                      <Collapsible title="Requirements" defaultOpen>
                        <ul className="space-y-2">
                          {job.requirements.map((req, idx) => (
                            <li
                              key={idx}
                              className="flex gap-2 text-sm text-gray-600"
                            >
                              <Award className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </Collapsible>
                    )}

                    {job.requiredSkills.length > 0 && (
                      <Collapsible title="Required Skills" defaultOpen>
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </Collapsible>
                    )}

                    {job.preferredSkills.length > 0 && (
                      <Collapsible title="Preferred Skills">
                        <div className="flex flex-wrap gap-2">
                          {job.preferredSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </Collapsible>
                    )}
                  </div>

                  {/* External link */}
                  {job.externalLink && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <a
                        href={job.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View on Company Website
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>

                {/* ── Right column ── */}
                <div className="w-full lg:w-80 space-y-5">
                  {/* AI Match Score */}
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-500" />
                      AI Match Score
                    </h3>
                    <div className="flex justify-center mb-3">
                      <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke={scoreColor}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-xl font-bold"
                            style={{ color: scoreColor }}
                          >
                            {matchScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Based on your skills and experience
                    </p>
                  </div>

                  {/* Job Summary — all Job fields */}
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-md font-semibold text-gray-900 mb-3">
                      Job Summary
                    </h3>
                    <div className="space-y-2.5">
                      {[
                        { label: "Experience", value: formatExperience(job) },
                        { label: "Job Type", value: jobTypeLabel(job) },
                        { label: "Salary Range", value: formatSalary(job) },
                        { label: "Location", value: formatLocation(job) },
                        { label: "Department", value: job.department || "—" },
                        {
                          label: "Openings",
                          value: job.positions > 0 ? `${job.positions}` : "—",
                        },
                        {
                          label: "Applications",
                          value: job.applicationsCount.toLocaleString(),
                        },
                        { label: "Views", value: job.views.toLocaleString() },
                        { label: "Status", value: job.status },
                        { label: "Visibility", value: job.visibility },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-500">{label}</span>
                          <span className="text-gray-900 font-medium text-right max-w-[55%]">
                            {value}
                          </span>
                        </div>
                      ))}

                      {job.postedOn && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Posted On</span>
                          <span className="text-gray-900 font-medium">
                            {new Date(job.postedOn).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}

                      {job.expiresAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Apply Before</span>
                          <span className="text-red-500 font-medium">
                            {new Date(job.expiresAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}

                      {job.createdAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Created</span>
                          <span className="text-gray-900 font-medium">
                            {new Date(job.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}

                      {job.updatedAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Last Updated</span>
                          <span className="text-gray-900 font-medium">
                            {new Date(job.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}

                      {/* ID (for recruiter/admin context) */}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Hash className="w-3 h-3" /> Job ID
                        </span>
                        <span
                          className="text-gray-400 font-mono text-xs truncate max-w-[60%]"
                          title={job.id}
                        >
                          {job.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Required Skills sidebar card */}
                  {job.requiredSkills.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                      <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.slice(0, 8).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills.length > 8 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{job.requiredSkills.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Preferred Skills sidebar card */}
                  {job.preferredSkills.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                      <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-gray-400" />
                        Preferred Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.preferredSkills.slice(0, 6).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.preferredSkills.length > 6 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{job.preferredSkills.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Flags */}
                  {(job.isBlocked ||
                    job.isDeleted ||
                    job.visibility === "hidden") && (
                    <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                      <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                        <Shield className="w-4 h-4" /> Admin Flags
                      </p>
                      <ul className="text-xs text-red-600 space-y-1">
                        {job.isBlocked && (
                          <li>• This job is blocked by admin</li>
                        )}
                        {job.isDeleted && (
                          <li>• This job has been soft-deleted</li>
                        )}
                        {job.visibility === "hidden" && (
                          <li>• Visibility is set to hidden</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
