import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  Eye,
  FileText,
  Shield,
  Hash,
  ExternalLink,
  CheckCircle2,
  Award,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Building2,
  Zap,
  Star,
  TrendingUp,
  Calendar,
  Globe,
  Lock,
  AlertTriangle,
  ArrowUpRight,
  Loader2,
  Upload,
  Trash2,
  Download,
  FileBadge,
  AlertCircle,
} from "lucide-react";
import type { JobStatus } from "@/module/jobs/types/jobPost.dto";
import { useResume } from "@/module/resume/hook/useResume";
import type { Job } from "@/module/jobs/types/job.types";

type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "freelance";



interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onApply: () => Promise<void>;
  applying: boolean;
  loading?: boolean;
}

function formatLocation(job: Job): string {
  if (job.isRemote && !job.location.city && !job.location.country)
    return "Remote";
  const parts = [
    job.location.city,
    job.location.state,
    job.location.country,
  ].filter(Boolean);
  const loc = parts.join(", ");
  return job.isRemote ? `${loc} · Remote` : loc || "Location not specified";
}

function formatExperience(job: Job): string {
  if (job.experienceMin === 0 && job.experienceMax === 0)
    return "Any experience";
  if (job.experienceMax === 0) return `${job.experienceMin}+ years`;
  return `${job.experienceMin}–${job.experienceMax} yrs`;
}

function jobTypeLabel(t: JobType): string {
  return (
    {
      "full-time": "Full-time",
      "part-time": "Part-time",
      contract: "Contract",
      internship: "Internship",
      freelance: "Freelance",
    }[t] ?? t
  );
}

function formatSalary(job: Job): string {
  const { min, max, currency } = job.salary;

  if (min == null && max == null) {
    return "Not disclosed";
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency ?? "INR",
      maximumFractionDigits: 0,
    }).format(n);

  if (max == null) {
    return `${fmt(min ?? 0)}+`;
  }

  if (min == null) {
    return `Up to ${fmt(max)}`;
  }

  return `${fmt(min)} – ${fmt(max)}`;
}

function postedAgo(job: Job): string {
  const base = job.postedOn ?? job.createdAt;
  if (!base) return "recently";
  const diff = Math.floor((Date.now() - new Date(base).getTime()) / 86_400_000);
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
}

function fmtDate(d?: Date): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ResumePanel() {
  const {
    resume,
    hasResume,
    isLoading,
    isUploading,
    uploadProgress,
    isDeleting,
    isDownloading,
    error,
    uploadResume,
    downloadResume,
    deleteResume,
    clearError,
  } = useResume();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadResume(file);
      e.target.value = "";
    },
    [uploadResume],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) uploadResume(file);
    },
    [uploadResume],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <FileBadge className="w-3.5 h-3.5 text-blue-400" />
        Resume
      </h3>

      {isLoading ? (
        <div className="flex flex-col gap-3 animate-pulse">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-8 bg-slate-100 rounded-lg" />
          <div className="h-20 bg-slate-100 rounded-xl" />
        </div>
      ) : hasResume ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-700 leading-tight">
                Resume uploaded
              </p>
              <p className="text-[11px] text-emerald-600 leading-snug mt-0.5 truncate">
                {resume?.getFileName?.() ?? "Your resume is ready"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={downloadResume}
              disabled={isDownloading}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {isDownloading ? "Downloading…" : "Download"}
            </button>
            <button
              onClick={deleteResume}
              disabled={isDeleting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              {isDeleting ? "Removing…" : "Remove"}
            </button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full text-[11px] text-slate-400 hover:text-blue-500 font-medium transition-colors text-center py-1 disabled:opacity-50"
          >
            Replace with a different file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-red-700 leading-tight">
                  Upload failed
                </p>
                <p className="text-[11px] text-red-500 leading-snug mt-0.5">
                  {error}
                </p>
              </div>
              <button
                onClick={clearError}
                className="ml-auto shrink-0 text-red-300 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!error && !isUploading && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-700 leading-tight">
                  No resume uploaded
                </p>
                <p className="text-[11px] text-amber-600 leading-snug mt-0.5">
                  Upload your resume before applying so recruiters can review
                  your profile.
                </p>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-3.5 py-3 space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin shrink-0" />
                <p className="text-xs font-semibold text-blue-700">
                  Uploading…
                </p>
                <span className="ml-auto text-[11px] text-blue-500 font-mono">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl px-4 py-5 flex flex-col items-center gap-2 transition-all
              ${
                isUploading
                  ? "border-blue-200 bg-blue-50/40 cursor-not-allowed"
                  : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer"
              }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors
                ${isUploading ? "bg-blue-100" : "bg-slate-100"}`}
            >
              <Upload
                className={`w-4 h-4 ${isUploading ? "text-blue-400" : "text-slate-400"}`}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-700">
                {isUploading ? "Uploading…" : "Drag & drop or click to upload"}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PDF, DOC, DOCX · max 5 MB
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse p-8">
      <div className="flex gap-4 mb-8">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl shrink-0" />
        <div className="flex-1">
          <div className="h-6 bg-slate-100 rounded-lg w-2/3 mb-2" />
          <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
          <div className="flex gap-2">
            {[80, 60, 90, 70].map((w, i) => (
              <div
                key={i}
                className="h-3 bg-slate-100 rounded"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-4 bg-slate-100 rounded w-36 mb-3" />
              <div className="space-y-2">
                {[100, 85, 70].map((w, j) => (
                  <div
                    key={j}
                    className="h-3 bg-slate-100 rounded"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-64 space-y-3">
          <div className="h-44 bg-slate-100 rounded-2xl" />
          <div className="h-56 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between py-4 text-left group"
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
          {icon && (
            <span className="text-slate-400 group-hover:text-blue-400 transition-colors">
              {icon}
            </span>
          )}
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-xs text-slate-600 font-medium transition-colors cursor-default">
      <span className="text-slate-400">{icon}</span>
      {label}
    </div>
  );
}

export default function JobDetailModal({
  job,
  onClose,
  onApply,
  applying,
  loading = false,
}: JobDetailModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 24);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const initials = job.title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const isExpiringSoon =
    job.expiresAt &&
    new Date(job.expiresAt).getTime() - Date.now() < 7 * 86_400_000;

  const hasAdminFlags =
    job.isBlocked || job.isDeleted || job.visibility === "hidden";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}
      onClick={handleBackdrop}
    >
      <div
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          maxHeight: "min(92vh, 860px)",
          animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95) translateY(12px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .fade-up { animation: fadeUp 0.3s ease both; }
          .fade-up-1 { animation-delay: 0.05s; }
          .fade-up-2 { animation-delay: 0.1s; }
          .fade-up-3 { animation-delay: 0.15s; }
        `}</style>

        <div
          className="shrink-0 flex items-center justify-between px-6 py-4 transition-all duration-200"
          style={{
            borderBottom: scrolled
              ? "1px solid #f1f5f9"
              : "1px solid transparent",
            boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
          }}
        >
          <nav className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">
              Jobs
            </span>
            <ChevronRight className="w-3 h-3" />
            {job.department && (
              <>
                <span className="hover:text-slate-600 cursor-pointer transition-colors">
                  {job.department}
                </span>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className="text-slate-700 font-semibold truncate max-w-40">
              {job.title}
            </span>
          </nav>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {loading ? (
            <Skeleton />
          ) : (
            <div className="flex flex-col lg:flex-row gap-0">
              <div className="flex-1 min-w-0 px-6 py-6 lg:border-r lg:border-slate-100">
                <div className="fade-up mb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-white font-black text-lg shadow-sm"
                      style={{
                        background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                      }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start gap-2 flex-wrap mb-0.5">
                        <h1 className="text-xl font-black text-slate-900 leading-tight tracking-tight">
                          {job.title}
                        </h1>
                        {job.isRemote && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-bold border border-blue-200 rounded-full mt-0.5">
                            <Globe className="w-2.5 h-2.5" /> Remote
                          </span>
                        )}
                      </div>
                      {job.department && (
                        <p className="text-sm text-slate-400 font-medium">
                          {job.department}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <StatPill
                      icon={<MapPin className="w-3.5 h-3.5" />}
                      label={formatLocation(job)}
                    />
                    <StatPill
                      icon={<Briefcase className="w-3.5 h-3.5" />}
                      label={jobTypeLabel(job.jobType)}
                    />
                    <StatPill
                      icon={<Building2 className="w-3.5 h-3.5" />}
                      label={formatExperience(job)}
                    />
                    <StatPill
                      icon={<DollarSign className="w-3.5 h-3.5" />}
                      label={formatSalary(job)}
                    />
                    <StatPill
                      icon={<Clock className="w-3.5 h-3.5" />}
                      label={`Posted ${postedAgo(job)}`}
                    />
                    {job.positions > 0 && (
                      <StatPill
                        icon={<Users className="w-3.5 h-3.5" />}
                        label={`${job.positions} opening${job.positions !== 1 ? "s" : ""}`}
                      />
                    )}
                    <StatPill
                      icon={<Eye className="w-3.5 h-3.5" />}
                      label={`${job.views.toLocaleString()} views`}
                    />
                    <StatPill
                      icon={<FileText className="w-3.5 h-3.5" />}
                      label={`${job.applicationsCount.toLocaleString()} applicants`}
                    />
                  </div>

                  {isExpiringSoon && job.expiresAt && (
                    <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-700 font-medium">
                        Applications close on{" "}
                        <span className="font-bold">
                          {new Date(job.expiresAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}
                        </span>{" "}
                        — apply soon
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={onApply}
                      disabled={applying}
                      className="relative inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                      style={{
                        background: applying
                          ? "#93c5fd"
                          : "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                        boxShadow: applying
                          ? "none"
                          : "0 4px 16px rgba(37,99,235,0.35)",
                      }}
                    >
                      {applying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Applying…
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Apply Now
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                        </>
                      )}
                    </button>

                    {job.externalLink && (
                      <a
                        href={job.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
                      >
                        View on site
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="fade-up fade-up-1 divide-y divide-slate-100 border-t border-slate-100">
                  {job.description && (
                    <Section
                      title="Job Description"
                      icon={<FileText className="w-4 h-4" />}
                      defaultOpen
                    >
                      <p className="text-sm text-slate-600 leading-[1.8] whitespace-pre-wrap">
                        {job.description}
                      </p>
                    </Section>
                  )}

                  {job.responsibilities.length > 0 && (
                    <Section
                      title="Key Responsibilities"
                      icon={<TrendingUp className="w-4 h-4" />}
                      defaultOpen
                    >
                      <ul className="space-y-2.5">
                        {job.responsibilities.map((r, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-600"
                          >
                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}

                  {job.requirements.length > 0 && (
                    <Section
                      title="Requirements"
                      icon={<Award className="w-4 h-4" />}
                      defaultOpen
                    >
                      <ul className="space-y-2.5">
                        {job.requirements.map((r, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-600"
                          >
                            <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-bold text-indigo-500">
                                {i + 1}
                              </span>
                            </div>
                            <span className="leading-relaxed">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}

                  {(job.requiredSkills.length > 0 ||
                    job.preferredSkills.length > 0) && (
                    <Section
                      title="Skills"
                      icon={<BookOpen className="w-4 h-4" />}
                      defaultOpen
                    >
                      {job.requiredSkills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                            Required
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {job.requiredSkills.map((s, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg"
                              >
                                <CheckCircle2 className="w-2.5 h-2.5" /> {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {job.preferredSkills.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                            Preferred
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {job.preferredSkills.map((s, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium rounded-lg"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Section>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-72 shrink-0 px-6 py-6 space-y-4 bg-slate-50/60 lg:bg-transparent">
                <div className="fade-up">
                  <ResumePanel />
                </div>

                <div className="fade-up fade-up-1 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Job Summary
                  </h3>
                  <div className="space-y-0">
                    {[
                      {
                        label: "Experience",
                        value: formatExperience(job),
                        icon: <Star className="w-3 h-3" />,
                      },
                      {
                        label: "Job type",
                        value: jobTypeLabel(job.jobType),
                        icon: <Briefcase className="w-3 h-3" />,
                      },
                      {
                        label: "Salary",
                        value: formatSalary(job),
                        icon: <DollarSign className="w-3 h-3" />,
                      },
                      {
                        label: "Location",
                        value: formatLocation(job),
                        icon: <MapPin className="w-3 h-3" />,
                      },
                      {
                        label: "Department",
                        value: job.department || "—",
                        icon: <Building2 className="w-3 h-3" />,
                      },
                      {
                        label: "Openings",
                        value: job.positions > 0 ? String(job.positions) : "—",
                        icon: <Users className="w-3 h-3" />,
                      },
                      {
                        label: "Applicants",
                        value: job.applicationsCount.toLocaleString(),
                        icon: <FileText className="w-3 h-3" />,
                      },
                      ...(job.postedOn
                        ? [
                            {
                              label: "Posted",
                              value: fmtDate(job.postedOn),
                              icon: <Calendar className="w-3 h-3" />,
                              accent: false,
                            },
                          ]
                        : []),
                      ...(job.expiresAt
                        ? [
                            {
                              label: "Deadline",
                              value: fmtDate(job.expiresAt),
                              icon: <Clock className="w-3 h-3" />,
                              accent: !!isExpiringSoon,
                            },
                          ]
                        : []),
                    ].map(({ label, value, icon, accent }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-50 last:border-0"
                      >
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
                          <span className="text-slate-300">{icon}</span>
                          {label}
                        </span>
                        <span
                          className={`text-[11px] font-semibold text-right max-w-[55%] leading-snug ${
                            accent ? "text-amber-600" : "text-slate-700"
                          }`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}

                    <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <Hash className="w-3 h-3" /> Job ID
                      </span>
                      <span
                        className="text-[10px] font-mono text-slate-300 truncate max-w-[55%]"
                        title={job.id}
                      >
                        {job.id}
                      </span>
                    </div>
                  </div>
                </div>

                {hasAdminFlags && (
                  <div className="fade-up fade-up-2 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <p className="text-xs font-bold text-red-600 mb-2.5 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Admin Flags
                    </p>
                    <ul className="space-y-1.5">
                      {job.isBlocked && (
                        <li className="flex items-center gap-2 text-xs text-red-500">
                          <Lock className="w-3 h-3" /> Blocked by admin
                        </li>
                      )}
                      {job.isDeleted && (
                        <li className="flex items-center gap-2 text-xs text-red-500">
                          <X className="w-3 h-3" /> Soft-deleted
                        </li>
                      )}
                      {job.visibility === "hidden" && (
                        <li className="flex items-center gap-2 text-xs text-red-500">
                          <Eye className="w-3 h-3" /> Hidden from candidates
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {!loading && (
          <div className="shrink-0 border-t border-slate-100 px-6 py-4 bg-white/80 backdrop-blur-sm flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {job.title}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {formatLocation(job)} · {jobTypeLabel(job.jobType)}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Close
              </button>
              <button
                onClick={onApply}
                disabled={applying}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: applying
                    ? "#93c5fd"
                    : "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                  boxShadow: applying
                    ? "none"
                    : "0 4px 14px rgba(37,99,235,0.3)",
                }}
              >
                {applying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {applying ? "Applying…" : "Apply Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
