import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Check,
  Calendar,
  Video,
  AlertCircle,
  Share2,
  ChevronDown,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Clock,
  Copy,
  CheckCheck,
  ExternalLink,
  Download,
  Loader2,
  X,
  FileText,
  Lightbulb,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { useApplicationDetail } from "../../hooks/candidate/useApplicationDetail";
import { useDownloadResume } from "@/module/resume/presentation/hook/useDownloadResume"; 
import { ApplicationStatus, JobApplication } from "../../../domain/entity/job-application.entity";
import { Sidebar } from "../component/my-applications/Sidebar";
import type { Job } from "@/module/jobs/domain/entity/jobPost.entity";

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(dateStr?: string | Date): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSalary(min: number, max: number, currency: string): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  return `${fmt(min)} – ${fmt(max)}`;
}

function statusToStep(status: ApplicationStatus): number {
  switch (status) {
    case ApplicationStatus.APPLIED:
      return 0;
    case ApplicationStatus.SHORTLISTED:
      return 1;
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return 2;
    case ApplicationStatus.SELECTED:
    case ApplicationStatus.REJECTED:
    case ApplicationStatus.WITHDRAWN:
      return 3;
    default:
      return 0;
  }
}

function getStatusConfig(status: ApplicationStatus) {
  switch (status) {
    case ApplicationStatus.SELECTED:
      return {
        pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
        bar: "bg-emerald-500",
        label: "Selected",
        progress: 100,
      };
    case ApplicationStatus.REJECTED:
      return {
        pill: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
        bar: "bg-red-400",
        label: "Rejected",
        progress: 100,
      };
    case ApplicationStatus.WITHDRAWN:
      return {
        pill: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
        bar: "bg-slate-300",
        label: "Withdrawn",
        progress: 100,
      };
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return {
        pill: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
        bar: "bg-blue-500",
        label: "Interview Scheduled",
        progress: 75,
      };
    case ApplicationStatus.SHORTLISTED:
      return {
        pill: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
        bar: "bg-amber-400",
        label: "Shortlisted",
        progress: 50,
      };
    default:
      return {
        pill: "bg-blue-50 text-blue-600 border-blue-200",
        dot: "bg-blue-400",
        bar: "bg-blue-400",
        label: "Applied",
        progress: 25,
      };
  }
}

// ─── sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  children,
  defaultOpen = true,
  collapsible = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <button
        className={`w-full flex items-center justify-between px-6 py-4 ${collapsible ? "hover:bg-slate-50 cursor-pointer" : "cursor-default"} transition-colors`}
        onClick={() => collapsible && setOpen((p) => !p)}
        disabled={!collapsible}
      >
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          {title}
        </h2>
        {collapsible && (
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-slate-50">{children}</div>
      )}
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-400 shrink-0 pt-0.5">{label}</span>
      <div className="text-sm font-medium text-slate-800 text-right">
        {children}
      </div>
    </div>
  );
}

// ─── Withdraw Confirmation Modal ───────────────────────────────────────────────

function WithdrawModal({
  jobTitle,
  onConfirm,
  onCancel,
  loading,
}: {
  jobTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-lg transition"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Withdraw application?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              This action cannot be undone
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          You're about to withdraw your application for{" "}
          <span className="font-semibold text-slate-800">{jobTitle}</span>. You
          won't be able to re-apply for this position after withdrawing.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
          >
            Keep application
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Yes, withdraw"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Left panel ───────────────────────────────────────────────────────────────

function LeftPanel({
  job,
  application,
  statusCfg,
  currentStep,
  onWithdraw,
  downloadResume,
  downloadLoading,
}: {
  job: Job;
  application: JobApplication;
  statusCfg: ReturnType<typeof getStatusConfig>;
  currentStep: number;
  onWithdraw: () => void;
  downloadResume: (resumeId: string) => Promise<boolean>;
  downloadLoading: boolean;
}) {
  const [copiedId, setCopiedId] = useState(false);
  const handleCopyId = () => {
    navigator.clipboard.writeText(application.getId());
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const initials = job.title
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const stats = [
    {
      icon: <DollarSign className="w-3.5 h-3.5" />,
      label: "Salary",
      value: formatSalary(job.salary.min, job.salary.max, job.salary.currency),
    },
    {
      icon: <Clock className="w-3.5 h-3.5" />,
      label: "Experience",
      value: `${job.experienceMin}–${job.experienceMax} yrs`,
    },
    {
      icon: <Users className="w-3.5 h-3.5" />,
      label: "Openings",
      value: `${job.positions} position${job.positions !== 1 ? "s" : ""}`,
    },
    {
      icon: <Calendar className="w-3.5 h-3.5" />,
      label: "Posted",
      value: formatDateShort(job.postedOn),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Job identity card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-xl font-bold text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-slate-900 leading-snug">
              {job.title}
            </h1>
            {job.department && (
              <p className="text-xs text-slate-400 mt-0.5">{job.department}</p>
            )}
          </div>
        </div>

        {/* Status pill + progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.pill}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
            <span className="text-xs text-slate-400">
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

        {/* Meta */}
        <div className="space-y-2 text-xs text-slate-500">
          {(job.location.city || job.location.country) && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>
                {[job.location.city, job.location.state, job.location.country]
                  .filter(Boolean)
                  .join(", ")}
                {job.isRemote && (
                  <span className="ml-1 text-blue-500 font-medium">
                    · Remote
                  </span>
                )}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>{job.jobType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>Applied {formatDateShort(application.getAppliedAt())}</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map(({ icon, label, value }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1.5">
              {icon}
              {label}
            </div>
            <p className="text-slate-900 text-xs font-semibold leading-snug">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Application meta */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Application info
        </h3>
        <div className="space-y-0">
          <InfoRow label="App ID">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="truncate max-w-[90px]">
                {application.getId()}
              </span>
              <button
                onClick={handleCopyId}
                className="p-1 hover:bg-slate-100 rounded transition shrink-0"
              >
                {copiedId ? (
                  <CheckCheck className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>
            </span>
          </InfoRow>
          <InfoRow label="Applied">
            {formatDateShort(application.getAppliedAt())}
          </InfoRow>
          <InfoRow label="Updated">
            {formatDate(application.getUpdatedAt())}
          </InfoRow>
          {job.expiresAt && (
            <InfoRow label="Expires">{formatDateShort(job.expiresAt)}</InfoRow>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
         onClick={() => downloadResume(application.getResumeId())}
          disabled={downloadLoading}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
        >
          {downloadLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Download resume
        </button>

        <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition">
          <MessageSquare className="w-4 h-4" />
          Contact support
        </button>

        {!application.isWithdrawn() && !application.isSelected() && (
          <button
            onClick={onWithdraw}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition"
          >
            <X className="w-4 h-4" />
            Withdraw application
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline({
  timelineSteps,
  getStep,
}: {
  timelineSteps: any[];
  getStep: (si: number) => string;
}) {
  return (
    <div className="pt-4">
      {timelineSteps.map((step, i) => {
        const s = getStep(step.stepIndex);
        const isDone = s === "done";
        const isActive = s === "active";
        return (
          <div key={step.stepIndex} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                  isDone
                    ? "bg-emerald-100 text-emerald-700"
                    : isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : step.stepIndex + 1}
              </div>
              {i < timelineSteps.length - 1 && (
                <div
                  className={`w-px flex-1 my-1 ${isDone ? "bg-emerald-200" : "bg-slate-100"}`}
                  style={{ minHeight: "2rem" }}
                />
              )}
            </div>
            <div
              className={`pb-6 pt-1 flex-1 min-w-0 ${i === timelineSteps.length - 1 ? "pb-0" : ""}`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <h3
                  className={`text-sm font-semibold ${isDone ? "text-slate-700" : isActive ? "text-blue-700" : "text-slate-400"}`}
                >
                  {step.title}
                </h3>
                {isActive && (
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <p
                className={`text-xs leading-relaxed ${isDone || isActive ? "text-slate-500" : "text-slate-300"}`}
              >
                {step.description}
              </p>
              {step.date && (
                <p className="text-[11px] text-slate-400 mt-1">{step.date}</p>
              )}
              {step.note && (
                <p className="text-[11px] text-blue-400 mt-1">{step.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function JobApplicationDetail() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { loading, error, applicationDetail, fetchApplicationDetail } =
    useApplicationDetail();
  const { downloadResume, loading: downloadLoading } = useDownloadResume();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [expandedCover, setExpandedCover] = useState(false);

  useEffect(() => {
    if (applicationId) fetchApplicationDetail(applicationId);
  }, [applicationId, fetchApplicationDetail]);

  const handleWithdrawConfirm = useCallback(async () => {
    setWithdrawLoading(true);
    try {
      // TODO: wire to withdraw use case
      // await WithdrawApplicationUC.execute(applicationId!);
      await new Promise((r) => setTimeout(r, 800)); // placeholder
      setShowWithdrawModal(false);
      navigate(-1);
    } finally {
      setWithdrawLoading(false);
    }
  }, [navigate]);

  // ── loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading application…</p>
        </div>
      </div>
    );
  }

  // ── error ──────────────────────────────────────────────────────────────────
  if (error || !applicationDetail) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-slate-700 font-medium">
            {error ?? "Application not found"}
          </p>
          <button
            onClick={() =>
              applicationId && fetchApplicationDetail(applicationId)
            }
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { application, job } = applicationDetail;
  const appStatus = application.getStatus();
  const currentStep = statusToStep(appStatus);
  const statusCfg = getStatusConfig(appStatus);
  const interview = application.getInterview();

  const requiredSkills: string[] = job.requiredSkills ?? [];
  const preferredSkills: string[] = job.preferredSkills ?? [];
  const allSkills = [...new Set([...requiredSkills, ...preferredSkills])];

  const timelineSteps = [
    {
      stepIndex: 0,
      title: "Application submitted",
      description: "Your application was successfully received.",
      date: formatDate(application.getAppliedAt()),
    },
    {
      stepIndex: 1,
      title: "Application shortlisted",
      description: "Your profile has been shortlisted by the recruiter.",
      date: currentStep >= 1 ? formatDate(application.getUpdatedAt()) : undefined,
    },
    {
      stepIndex: 2,
      title: "Interview scheduled",
      description: interview
        ? `Scheduled for ${formatDate(interview.scheduledAt)}`
        : "Awaiting interview scheduling.",
      date: interview ? formatDate(interview.scheduledAt) : undefined,
      note:
        appStatus === ApplicationStatus.SHORTLISTED
          ? "Estimated 2–3 business days"
          : undefined,
    },
    {
      stepIndex: 3,
      title: "Final decision",
      description:
        appStatus === ApplicationStatus.SELECTED
          ? "Congratulations! You have been selected."
          : appStatus === ApplicationStatus.REJECTED
            ? `Not selected.${application.getRejectionReason() ? ` ${application.getRejectionReason()}` : ""}`
            : "The final outcome of your application.",
    },
  ];

  const getStep = (si: number) => {
    if (si < currentStep) return "done";
    if (si === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top nav */}
        <div className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between shrink-0 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span>My Applications</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700 font-medium truncate max-w-48">
              {job.title}
            </span>
          </div>

          <button
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            title="Share"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Split body */}
        <div className="flex-1 overflow-hidden flex">
          {/* ── Left sticky panel ── */}
          <div className="w-80 shrink-0 overflow-y-auto border-r border-slate-100 p-5 hidden lg:block bg-slate-50">
            <LeftPanel
              job={job}
              application={application}
              statusCfg={statusCfg}
              currentStep={currentStep}
              onWithdraw={() => setShowWithdrawModal(true)}
              downloadResume={downloadResume}
              downloadLoading={downloadLoading}
            />
          </div>

          {/* ── Right scrollable content ── */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 py-6 space-y-5">

              {/* Mobile-only job header */}
              <div className="lg:hidden bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <LeftPanel
                  job={job}
                  application={application}
                  statusCfg={statusCfg}
                  currentStep={currentStep}
                  onWithdraw={() => setShowWithdrawModal(true)}
                  downloadResume={downloadResume}
                  downloadLoading={downloadLoading}
                />
              </div>

              {/* Timeline */}
              <SectionCard
                title="Application timeline"
                icon={<TrendingUp className="w-4 h-4" />}
              >
                <Timeline timelineSteps={timelineSteps} getStep={getStep} />
              </SectionCard>

              {/* Interview card */}
              {interview && (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-sm">
                  <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 opacity-80" />
                    Interview details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/10 rounded-xl p-3.5">
                      <p className="text-blue-200 text-xs mb-1">Date & time</p>
                      <p className="text-white font-semibold text-sm">
                        {formatDate(interview.scheduledAt)}
                      </p>
                    </div>
                    {interview.location && (
                      <div className="bg-white/10 rounded-xl p-3.5">
                        <p className="text-blue-200 text-xs mb-1">Location</p>
                        <p className="text-white font-semibold text-sm">
                          {interview.location}
                        </p>
                      </div>
                    )}
                  </div>
                  {interview.notes && (
                    <div className="bg-white/10 rounded-xl p-3.5 mb-4">
                      <p className="text-blue-200 text-xs mb-1">
                        Recruiter notes
                      </p>
                      <p className="text-white text-sm leading-relaxed">
                        {interview.notes}
                      </p>
                    </div>
                  )}
                  {interview.meetingLink && (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-blue-50 transition shadow-sm"
                    >
                      <Video className="w-4 h-4" />
                      Join meeting
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  )}
                </div>
              )}

              {/* Rejection feedback */}
              {application.isRejected() && application.getRejectionReason() && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Rejection feedback
                  </h2>
                  <p className="text-sm text-red-600 leading-relaxed">
                    {application.getRejectionReason()}
                  </p>
                </div>
              )}

              {/* Skills */}
              {(requiredSkills.length > 0 || preferredSkills.length > 0) && (
                <SectionCard
                  title="Skills required"
                  icon={<Check className="w-4 h-4" />}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                    {requiredSkills.length > 0 && (
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-3">
                          Required
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {requiredSkills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-medium"
                            >
                              <Check className="w-2.5 h-2.5" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {preferredSkills.length > 0 && (
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-3">
                          Preferred
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {preferredSkills.map((skill) => (
                            <span
                              key={skill}
                              className="bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}

              {/* Job description */}
              {job.description && (
                <SectionCard
                  title="Job description"
                  icon={<FileText className="w-4 h-4" />}
                  collapsible
                >
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line pt-4">
                    {job.description}
                  </p>
                </SectionCard>
              )}

              {/* Responsibilities + Requirements */}
              {(job.responsibilities?.length > 0 ||
                job.requirements?.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.responsibilities?.length > 0 && (
                    <SectionCard title="Responsibilities">
                      <ul className="space-y-2.5 pt-4">
                        {job.responsibilities.map((r: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-slate-600"
                          >
                            <span className="text-blue-400 font-bold mt-0.5 shrink-0 text-base leading-none">
                              →
                            </span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                  )}
                  {job.requirements?.length > 0 && (
                    <SectionCard title="Requirements">
                      <ul className="space-y-2.5 pt-4">
                        {job.requirements.map((r: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-slate-600"
                          >
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                  )}
                </div>
              )}

              {/* Cover letter */}
              {application.getCoverLetter() && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedCover((p) => !p)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Cover letter
                    </h2>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${expandedCover ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedCover && (
                    <div className="border-t border-slate-50 px-6 pb-6 pt-4">
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {application.getCoverLetter()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Interview tips */}
              <SectionCard
                title="Interview preparation tips"
                icon={<Lightbulb className="w-4 h-4" />}
                collapsible
                defaultOpen={false}
              >
                <div className="space-y-2.5 pt-4">
                  {allSkills.length > 0 && (
                    <p className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                      Review concepts related to:{" "}
                      <span className="font-medium text-slate-700">
                        {allSkills.slice(0, 5).join(", ")}
                      </span>
                    </p>
                  )}
                  {[
                    "Prepare concrete examples of your past projects and measurable outcomes",
                    "Practice explaining your problem-solving approach and technical decisions",
                    "Research the company's products, mission, and recent news",
                    "Prepare thoughtful questions to ask the interviewer",
                  ].map((tip, i) => (
                    <p
                      key={i}
                      className="text-sm text-slate-600 flex items-start gap-2"
                    >
                      <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                      {tip}
                    </p>
                  ))}
                </div>
              </SectionCard>

              {/* Bottom spacer */}
              <div className="pb-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw confirmation modal */}
      {showWithdrawModal && (
        <WithdrawModal
          jobTitle={job.title}
          onConfirm={handleWithdrawConfirm}
          onCancel={() => setShowWithdrawModal(false)}
          loading={withdrawLoading}
        />
      )}
    </div>
  );
}