import React, { useState, useEffect, useRef } from "react";
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
  Sparkles,
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
} from "lucide-react";
import type { JobStatus } from "@/module/jobs/domain/dto/jobPost.dto";



type JobType = "full-time" | "part-time" | "contract" | "internship" | "freelance";
// type JobStatus = "draft" | "active" | "expired" | "closed";
type JobVisibility = "active" | "hidden";

interface LocationVO { city: string; state: string; country: string; }
interface SalaryVO { min: number; max: number; currency: string; }

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

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onApply: () => Promise<void>;
  applying: boolean;
  loading?: boolean;
  matchScore?: number;
}



function formatLocation(job: Job): string {
  if (job.isRemote && !job.location.city && !job.location.country) return "Remote";
  const parts = [job.location.city, job.location.state, job.location.country].filter(Boolean);
  const loc = parts.join(", ");
  return job.isRemote ? `${loc} · Remote` : loc || "Location not specified";
}

function formatExperience(job: Job): string {
  if (job.experienceMin === 0 && job.experienceMax === 0) return "Any experience";
  if (job.experienceMax === 0) return `${job.experienceMin}+ years`;
  return `${job.experienceMin}–${job.experienceMax} yrs`;
}

function jobTypeLabel(t: JobType): string {
  return { "full-time": "Full-time", "part-time": "Part-time", contract: "Contract", internship: "Internship", freelance: "Freelance" }[t] ?? t;
}

function formatSalary(job: Job): string {
  if (!job.salary.min && !job.salary.max) return "Not disclosed";
  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: job.salary.currency || "INR", maximumFractionDigits: 0 }).format(n);
  if (!job.salary.max) return `${fmt(job.salary.min)}+`;
  return `${fmt(job.salary.min)} – ${fmt(job.salary.max)}`;
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
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}


function MatchRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const [animated, setAnimated] = useState(false);

  useEffect(() => { const t = setTimeout(() => setAnimated(true), 120); return () => clearTimeout(t); }, []);

  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 75 ? "Strong match" : score >= 50 ? "Good match" : "Partial match";
  const bg = score >= 75 ? "#ecfdf5" : score >= 50 ? "#fffbeb" : "#fef2f2";
  const textColor = score >= 75 ? "#065f46" : score >= 50 ? "#92400e" : "#991b1b";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
  
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 32px ${color}30` }} />
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ}
            strokeDashoffset={animated ? offset : circ}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color }}>{score}%</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">match</span>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: bg, color: textColor }}>
        <Sparkles className="w-3 h-3" />
        {label}
      </span>
      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
        Based on your skills &amp; experience
      </p>
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
            {[80, 60, 90, 70].map((w, i) => <div key={i} className="h-3 bg-slate-100 rounded" style={{ width: w }} />)}
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i}>
              <div className="h-4 bg-slate-100 rounded w-36 mb-3" />
              <div className="space-y-2">{[100, 85, 70].map((w, j) => <div key={j} className="h-3 bg-slate-100 rounded" style={{ width: `${w}%` }} />)}</div>
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


function Section({ title, icon, children, defaultOpen = true }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex w-full items-center justify-between py-4 text-left group"
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
          {icon && <span className="text-slate-400 group-hover:text-blue-400 transition-colors">{icon}</span>}
          {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
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
  matchScore = 85,
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
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const initials = job.title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const isExpiringSoon = job.expiresAt && (new Date(job.expiresAt).getTime() - Date.now()) < 7 * 86_400_000;
  const hasAdminFlags = job.isBlocked || job.isDeleted || job.visibility === "hidden";

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
        onClick={e => e.stopPropagation()}
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
            borderBottom: scrolled ? "1px solid #f1f5f9" : "1px solid transparent",
            boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
          }}
        >
          <nav className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Jobs</span>
            <ChevronRight className="w-3 h-3" />
            {job.department && (
              <>
                <span className="hover:text-slate-600 cursor-pointer transition-colors">{job.department}</span>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className="text-slate-700 font-semibold truncate max-w-40">{job.title}</span>
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
          {loading ? <Skeleton /> : (
            <div className="flex flex-col lg:flex-row gap-0">

        
              <div className="flex-1 min-w-0 px-6 py-6 lg:border-r lg:border-slate-100">

                <div className="fade-up mb-6">
                  <div className="flex items-start gap-4 mb-4">
             
                    <div
                      className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-white font-black text-lg shadow-sm"
                      style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}
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
                        <p className="text-sm text-slate-400 font-medium">{job.department}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <StatPill icon={<MapPin className="w-3.5 h-3.5" />} label={formatLocation(job)} />
                    <StatPill icon={<Briefcase className="w-3.5 h-3.5" />} label={jobTypeLabel(job.jobType)} />
                    <StatPill icon={<Building2 className="w-3.5 h-3.5" />} label={formatExperience(job)} />
                    <StatPill icon={<DollarSign className="w-3.5 h-3.5" />} label={formatSalary(job)} />
                    <StatPill icon={<Clock className="w-3.5 h-3.5" />} label={`Posted ${postedAgo(job)}`} />
                    {job.positions > 0 && (
                      <StatPill icon={<Users className="w-3.5 h-3.5" />} label={`${job.positions} opening${job.positions !== 1 ? "s" : ""}`} />
                    )}
                    <StatPill icon={<Eye className="w-3.5 h-3.5" />} label={`${job.views.toLocaleString()} views`} />
                    <StatPill icon={<FileText className="w-3.5 h-3.5" />} label={`${job.applicationsCount.toLocaleString()} applicants`} />
                  </div>

                  {isExpiringSoon && job.expiresAt && (
                    <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-700 font-medium">
                        Applications close on{" "}
                        <span className="font-bold">
                          {new Date(job.expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
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
                        background: applying ? "#93c5fd" : "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                        boxShadow: applying ? "none" : "0 4px 16px rgba(37,99,235,0.35)",
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
                    <Section title="Job Description" icon={<FileText className="w-4 h-4" />} defaultOpen>
                      <p className="text-sm text-slate-600 leading-[1.8] whitespace-pre-wrap">{job.description}</p>
                    </Section>
                  )}

                  {job.responsibilities.length > 0 && (
                    <Section title="Key Responsibilities" icon={<TrendingUp className="w-4 h-4" />} defaultOpen>
                      <ul className="space-y-2.5">
                        {job.responsibilities.map((r, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}

                  {job.requirements.length > 0 && (
                    <Section title="Requirements" icon={<Award className="w-4 h-4" />} defaultOpen>
                      <ul className="space-y-2.5">
                        {job.requirements.map((r, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                            <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-bold text-indigo-500">{i + 1}</span>
                            </div>
                            <span className="leading-relaxed">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}

                  {(job.requiredSkills.length > 0 || job.preferredSkills.length > 0) && (
                    <Section title="Skills" icon={<BookOpen className="w-4 h-4" />} defaultOpen>
                      {job.requiredSkills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Required</p>
                          <div className="flex flex-wrap gap-1.5">
                            {job.requiredSkills.map((s, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg">
                                <CheckCircle2 className="w-2.5 h-2.5" /> {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {job.preferredSkills.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Preferred</p>
                          <div className="flex flex-wrap gap-1.5">
                            {job.preferredSkills.map((s, i) => (
                              <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium rounded-lg">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Section>
                  )}
                </div>
              </div>

        
              <div className="w-full lg:w-72 shrink-0 px-6 py-6 space-y-4 bg-slate-50/60 lg:bg-transparent">

                <div className="fade-up bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    AI Match Score
                  </h3>
                  <MatchRing score={matchScore} />
                </div>

                <div className="fade-up fade-up-1 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Job Summary
                  </h3>
                  <div className="space-y-0">
                    {[
                      { label: "Experience", value: formatExperience(job), icon: <Star className="w-3 h-3" /> },
                      { label: "Job type", value: jobTypeLabel(job.jobType), icon: <Briefcase className="w-3 h-3" /> },
                      { label: "Salary", value: formatSalary(job), icon: <DollarSign className="w-3 h-3" /> },
                      { label: "Location", value: formatLocation(job), icon: <MapPin className="w-3 h-3" /> },
                      { label: "Department", value: job.department || "—", icon: <Building2 className="w-3 h-3" /> },
                      { label: "Openings", value: job.positions > 0 ? String(job.positions) : "—", icon: <Users className="w-3 h-3" /> },
                      { label: "Applicants", value: job.applicationsCount.toLocaleString(), icon: <FileText className="w-3 h-3" /> },
                      ...(job.postedOn ? [{ label: "Posted", value: fmtDate(job.postedOn), icon: <Calendar className="w-3 h-3" /> }] : []),
                      ...(job.expiresAt ? [{ label: "Deadline", value: fmtDate(job.expiresAt), icon: <Clock className="w-3 h-3" />, accent: isExpiringSoon }] : []),
                    ].map(({ label, value, icon, accent }) => (
                      <div key={label} className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-50 last:border-0">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
                          <span className="text-slate-300">{icon}</span>
                          {label}
                        </span>
                        <span className={`text-[11px] font-semibold text-right max-w-[55%] leading-snug ${accent ? "text-amber-600" : "text-slate-700"}`}>
                          {value}
                        </span>
                      </div>
                    ))}

                  
                    <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <Hash className="w-3 h-3" /> Job ID
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 truncate max-w-[55%]" title={job.id}>
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
              <p className="text-sm font-bold text-slate-900 truncate">{job.title}</p>
              <p className="text-xs text-slate-400 truncate">{formatLocation(job)} · {jobTypeLabel(job.jobType)}</p>
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
                  background: applying ? "#93c5fd" : "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                  boxShadow: applying ? "none" : "0 4px 14px rgba(37,99,235,0.3)",
                }}
              >
                {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {applying ? "Applying…" : "Apply Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}