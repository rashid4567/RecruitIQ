"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Check,
  Calendar,
  Video,
  DownloadCloud,
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
} from "lucide-react";
import { useApplicationDetail } from "../../hooks/candidate/useApplicationDetail";
import { ApplicationStatus } from "../../../domain/entity/job-application.entity";
import { Sidebar } from "../component/my-applications/Sidebar";


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
        label: "Selected",
      };
    case ApplicationStatus.REJECTED:
      return {
        pill: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
        label: "Rejected",
      };
    case ApplicationStatus.WITHDRAWN:
      return {
        pill: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
        label: "Withdrawn",
      };
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return {
        pill: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
        label: "Interview Scheduled",
      };
    case ApplicationStatus.SHORTLISTED:
      return {
        pill: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
        label: "Shortlisted",
      };
    default:
      return {
        pill: "bg-blue-50 text-blue-600 border-blue-200",
        dot: "bg-blue-400",
        label: "Applied",
      };
  }
}


function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
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
      <span className="text-sm text-slate-500 shrink-0">{label}</span>
      <div className="text-sm font-medium text-slate-900 text-right">
        {children}
      </div>
    </div>
  );
}

export default function JobApplicationDetail() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { loading, error, applicationDetail, fetchApplicationDetail } =
    useApplicationDetail();
  const [copiedId, setCopiedId] = useState(false);
  const [expandedCover, setExpandedCover] = useState(false);
  const [expandedTips, setExpandedTips] = useState(false);

  useEffect(() => {
    if (applicationId) fetchApplicationDetail(applicationId);
  }, [applicationId, fetchApplicationDetail]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // ── loading ──────────────────────────────────────────────────────────────
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

  // ── error ────────────────────────────────────────────────────────────────
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

  // ── real data ────────────────────────────────────────────────────────────
  const { application, job } = applicationDetail;
  const appStatus = application.getStatus();
  const currentStep = statusToStep(appStatus);
  const statusCfg = getStatusConfig(appStatus);
  const interview = application.getInterview();

  const requiredSkills = job.requiredSkills ?? [];
  const preferredSkills = job.preferredSkills ?? [];
  const allSkills = [...new Set([...requiredSkills, ...preferredSkills])];

  const initials = job.title
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

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
      date:
        currentStep >= 1 ? formatDate(application.getUpdatedAt()) : undefined,
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
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 overflow-auto min-w-0">
        <div className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Applications
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span>Dashboard</span>
            <span>/</span>
            <span>My Applications</span>
            <span>/</span>
            <span className="text-slate-700 font-medium truncate max-w-45">
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

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-2xl font-bold text-white">
                  {initials}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                      {job.title}
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">
                      Applied on {formatDateShort(application.getAppliedAt())}
                    </p>
                  </div>
                  <span
                    className={`self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${statusCfg.pill}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                    />
                    {statusCfg.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                  {(job.location.city || job.location.country) && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {[
                        job.location.city,
                        job.location.state,
                        job.location.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                      {job.isRemote && (
                        <span className="text-blue-500 font-medium">
                          · Remote
                        </span>
                      )}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {job.jobType}
                  </span>
                  {job.department && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {job.department}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                icon: <DollarSign className="w-4 h-4 text-blue-500" />,
                label: "Salary",
                value: formatSalary(
                  job.salary.min,
                  job.salary.max,
                  job.salary.currency,
                ),
              },
              {
                icon: <Clock className="w-4 h-4 text-blue-500" />,
                label: "Experience",
                value: `${job.experienceMin}–${job.experienceMax} yrs`,
              },
              {
                icon: <Users className="w-4 h-4 text-blue-500" />,
                label: "Openings",
                value: `${job.positions} position${job.positions !== 1 ? "s" : ""}`,
              },
              {
                icon: <Calendar className="w-4 h-4 text-blue-500" />,
                label: "Posted",
                value: formatDateShort(job.postedOn),
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                  {icon}
                  {label}
                </div>
                <p className="text-slate-900 text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <SectionCard title="Application timeline">
            <div>
              {timelineSteps.map((step, i) => {
                const s = getStep(step.stepIndex);
                const isDone = s === "done";
                const isActive = s === "active";
                return (
                  <div key={step.stepIndex} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold transition-all ${
                          isDone
                            ? "bg-emerald-100 text-emerald-700"
                            : isActive
                              ? "bg-blue-100 text-blue-700 ring-2 ring-blue-300 ring-offset-2"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isDone ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          step.stepIndex + 1
                        )}
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div
                          className={`w-px flex-1 my-1.5 ${isDone ? "bg-emerald-200" : "bg-slate-100"}`}
                          style={{ minHeight: "2rem" }}
                        />
                      )}
                    </div>
                    <div
                      className={`pb-6 pt-1.5 flex-1 min-w-0 ${i === timelineSteps.length - 1 ? "pb-0" : ""}`}
                    >
                      <div
                        className={`flex items-center gap-2 mb-1 ${isActive ? "" : ""}`}
                      >
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
                        className={`text-xs ${isDone || isActive ? "text-slate-500" : "text-slate-300"}`}
                      >
                        {step.description}
                      </p>
                      {step.date && (
                        <p className="text-xs text-slate-400 mt-1">
                          {step.date}
                        </p>
                      )}
                      {step.note && (
                        <p className="text-xs text-blue-400 mt-1">
                          {step.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {interview && (
            <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
              <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
                <Calendar className="w-4 h-4 opacity-80" />
                Interview details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-blue-200 text-xs mb-1">Date & time</p>
                  <p className="text-white font-semibold text-sm">
                    {formatDate(interview.scheduledAt)}
                  </p>
                </div>
                {interview.location && (
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-blue-200 text-xs mb-1">Location</p>
                    <p className="text-white font-semibold text-sm">
                      {interview.location}
                    </p>
                  </div>
                )}
              </div>
              {interview.notes && (
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <p className="text-blue-200 text-xs mb-1">Recruiter notes</p>
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
                  className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition shadow-sm"
                >
                  <Video className="w-4 h-4" />
                  Join meeting
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
            </div>
          )}

          {application.isRejected() && application.getRejectionReason() && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-red-700 mb-2">
                Rejection feedback
              </h2>
              <p className="text-sm text-red-600 leading-relaxed">
                {application.getRejectionReason()}
              </p>
            </div>
          )}

          {(requiredSkills.length > 0 || preferredSkills.length > 0) && (
            <SectionCard title="Skills required">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requiredSkills.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3">
                      Required
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {requiredSkills.map((skill: string) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-medium"
                        >
                          <Check className="w-3 h-3" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {preferredSkills.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3">
                      Preferred
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {preferredSkills.map((skill: string) => (
                        <span
                          key={skill}
                          className="bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium"
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

          {job.description && (
            <SectionCard title="Job description">
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </SectionCard>
          )}

          {(job.responsibilities?.length > 0 ||
            job.requirements?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {job.responsibilities?.length > 0 && (
                <SectionCard title="Responsibilities">
                  <ul className="space-y-3">
                    {job.responsibilities.map((r: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >
                        <span className="text-blue-400 font-bold mt-0.5 shrink-0">
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
                  <ul className="space-y-3">
                    {job.requirements.map((r: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-600"
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

          <SectionCard title="Application details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <div>
                <InfoRow label="Application ID">
                  <span className="flex items-center gap-2 font-mono text-xs">
                    <span className="truncate max-w-35">
                      {application.getId()}
                    </span>
                    <button
                      onClick={() => handleCopyId(application.getId())}
                      className="p-1 hover:bg-slate-100 rounded transition shrink-0"
                      title="Copy"
                    >
                      {copiedId ? (
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                    {copiedId && (
                      <span className="text-[10px] text-emerald-500 font-medium">
                        Copied!
                      </span>
                    )}
                  </span>
                </InfoRow>
                <InfoRow label="Applied date">
                  {formatDateShort(application.getAppliedAt())}
                </InfoRow>
                <InfoRow label="Last updated">
                  {formatDate(application.getUpdatedAt())}
                </InfoRow>
              </div>
              <div>
                <InfoRow label="Status">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.pill}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                    />
                    {statusCfg.label}
                  </span>
                </InfoRow>
                {job.expiresAt && (
                  <InfoRow label="Job expires">
                    {formatDateShort(job.expiresAt)}
                  </InfoRow>
                )}
                {application.getCoverLetter() && (
                  <div className="py-3 border-b border-slate-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-500">
                        Cover letter
                      </span>
                      <button
                        onClick={() => setExpandedCover(!expandedCover)}
                        className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700 transition"
                      >
                        {expandedCover ? "Hide" : "View"}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${expandedCover ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    {expandedCover && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2 whitespace-pre-line">
                        {application.getCoverLetter()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <button
              onClick={() => setExpandedTips(!expandedTips)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <i
                  className="ti ti-bulb text-amber-500 text-base"
                  aria-hidden
                />
                Interview preparation tips
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${expandedTips ? "rotate-180" : ""}`}
              />
            </button>
            {expandedTips && (
              <div className="border-t border-slate-100 px-6 py-4 space-y-2.5">
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
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 pb-8">
            {!application.isWithdrawn() && !application.isSelected() && (
              <button className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition">
                Withdraw application
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition">
              <DownloadCloud className="w-4 h-4" />
              Download resume
            </button>
            <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition">
              Contact support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
