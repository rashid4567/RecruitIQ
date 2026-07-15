import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useRecruiterHiringDecisionDetails } from "@/module/interview/hooks/recruiter/useRecruiterHiringDecisionDetails";
import { useUpdateApplicationStatus } from "@/module/job-application/hooks/recruiter/useUpdateApplicationStatus";
import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";
import type {
  HiringDecisionResume,
  HiringDecisionInterview,
} from "@/module/interview/types/recruiterInterview.types";

import EmploymentOfferModal from "../../offer-letter/page/create-letter.modal";

import Sidebar from "@/module/recruiter/pages/components/layout/Sidebar";
type Recommendation = "STRONG_MATCH" | "PARTIAL_MATCH" | "NO_MATCH";

interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string | null;
  done: boolean;
  current?: boolean;
}

type RejectReason =
  | "TECHNICAL_SKILLS"
  | "COMMUNICATION"
  | "EXPERIENCE"
  | "SALARY"
  | "BEHAVIOUR"
  | "POSITION_FILLED"
  | "OTHER";

const REJECT_REASONS: { value: RejectReason; label: string }[] = [
  { value: "TECHNICAL_SKILLS", label: "Technical skills" },
  { value: "COMMUNICATION", label: "Communication" },
  { value: "EXPERIENCE", label: "Experience" },
  { value: "SALARY", label: "Salary expectations" },
  { value: "BEHAVIOUR", label: "Behaviour" },
  { value: "POSITION_FILLED", label: "Position filled" },
  { value: "OTHER", label: "Other" },
];

function fmtDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function fmtDateTime(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function titleCase(value?: string | null) {
  if (!value) return "—";
  return String(value)
    .toLowerCase()
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function buildTimeline(
  application: {
    appliedAt: string;
    analysisStatus: string;
    updatedAt: string;
    status: string;
  },
  interview: HiringDecisionInterview | undefined,
): TimelineEvent[] {
  const decided =
    application.status === ApplicationStatus.SELECTED ||
    application.status === ApplicationStatus.REJECTED;

  return [
    {
      id: "applied",
      label: "Application submitted",
      timestamp: fmtDate(application.appliedAt),
      done: true,
    },
    {
      id: "analysis",
      label: "AI analysis completed",
      timestamp:
        application.analysisStatus === "COMPLETED"
          ? fmtDate(application.updatedAt)
          : null,
      done: application.analysisStatus === "COMPLETED",
    },
    {
      id: "interview",
      label:
        interview?.status?.toUpperCase() === "COMPLETED"
          ? "Interview completed"
          : "Interview scheduled",
      timestamp: interview?.endedAt
        ? fmtDate(interview.endedAt)
        : interview?.startedAt
          ? fmtDate(interview.startedAt)
          : null,
      done: Boolean(interview),
    },
    {
      id: "decision",
      label:
        application.status === ApplicationStatus.SELECTED
          ? "Candidate selected"
          : application.status === ApplicationStatus.REJECTED
            ? "Candidate rejected"
            : "Decision pending",
      timestamp: decided ? fmtDate(application.updatedAt) : null,
      done: decided,
      current: !decided,
    },
  ];
}

function Icon({
  path,
  className = "w-4 h-4",
}: {
  path: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
}

const CheckIcon = (p: { className?: string }) => (
  <Icon className={p.className} path={<polyline points="20 6 9 17 4 12" />} />
);
const XIcon = (p: { className?: string }) => (
  <Icon
    className={p.className}
    path={
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    }
  />
);
const AlertIcon = (p: { className?: string }) => (
  <Icon
    className={p.className}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12" y2="13" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    }
  />
);
const FileIcon = (p: { className?: string }) => (
  <Icon
    className={p.className}
    path={
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </>
    }
  />
);
const EyeIcon = (p: { className?: string }) => (
  <Icon
    className={p.className}
    path={
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    }
  />
);
const ExternalLinkIcon = (p: { className?: string }) => (
  <Icon
    className={p.className}
    path={
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    }
  />
);
const MailIcon = (p: { className?: string }) => (
  <Icon
    className={p.className}
    path={
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <polyline points="3 7 12 13 21 7" />
      </>
    }
  />
);
const CopyIcon = (p: { className?: string }) => (
  <Icon
    className={p.className}
    path={
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    }
  />
);
const CalendarIcon = (p: { className?: string }) => (
  <Icon
    className={p.className}
    path={
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    }
  />
);
const ClockIcon = (p: { className?: string }) => (
  <Icon
    className={p.className}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 16 14" />
      </>
    }
  />
);
const MapPinIcon = (p: { className?: string }) => (
  <Icon
    className={p.className}
    path={
      <>
        <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    }
  />
);
const VideoIcon = (p: { className?: string }) => (
  <Icon
    className={p.className}
    path={
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </>
    }
  />
);
const SpinnerIcon = (p: { className?: string }) => (
  <svg
    className={`animate-spin ${p.className ?? "w-4 h-4"}`}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

function StatusBadge({ status }: { status: string }) {
  const className =
    status === ApplicationStatus.SELECTED
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === ApplicationStatus.REJECTED
        ? "bg-red-50 text-red-700 border-red-200"
        : status === ApplicationStatus.SHORTLISTED ||
            status === ApplicationStatus.INTERVIEW_SCHEDULED
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {titleCase(status)}
    </span>
  );
}

function RecommendationBadge({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const map: Record<
    Recommendation,
    {
      label: string;
      sub: string;
      className: string;
      dot: string;
    }
  > = {
    STRONG_MATCH: {
      label: "Strong match",
      sub: "Ready to move forward",
      className: "bg-emerald-50 border-emerald-200 text-emerald-800",
      dot: "bg-emerald-500",
    },
    PARTIAL_MATCH: {
      label: "Partial match",
      sub: "Needs manual review",
      className: "bg-amber-50 border-amber-200 text-amber-800",
      dot: "bg-amber-500",
    },
    NO_MATCH: {
      label: "Not recommended",
      sub: "Falls short of requirements",
      className: "bg-red-50 border-red-200 text-red-800",
      dot: "bg-red-500",
    },
  };

  const m = map[recommendation] ?? {
    label: "Unknown",
    sub: "No recommendation available.",
    className: "bg-slate-50 border-slate-200 text-slate-700",
    dot: "bg-slate-400",
  };

  return (
    <div className={`rounded-xl border px-4 py-3 ${m.className}`}>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${m.dot}`} />
        <span className="text-sm font-bold">{m.label}</span>
      </div>
      <p className="text-xs mt-0.5 opacity-80">{m.sub}</p>
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 70)
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-700",
      stroke: "#10b981",
    };
  if (score >= 40)
    return { bar: "bg-amber-500", text: "text-amber-700", stroke: "#f59e0b" };
  return { bar: "bg-red-500", text: "text-red-700", stroke: "#ef4444" };
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const c = scoreColor(score);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={`text-sm font-bold ${c.text}`}>{score}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-500`}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const c = scoreColor(score);
  const circumference = 2 * Math.PI * 42;
  const offset =
    circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={c.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${c.text}`}>{score}%</span>
        <span className="text-[11px] text-slate-500 font-medium">overall</span>
      </div>
    </div>
  );
}

function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2">
      {message}
    </div>
  );
}

function CandidateOverviewCard({
  candidateName,
  candidateEmail,
  candidateProfileImage,
  status,
  applicationNumber,
  position,
  appliedDate,
  onCopyEmail,
}: {
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  status: string;
  applicationNumber: string;
  position: string;
  appliedDate: string;
  onCopyEmail: () => void;
}) {
  return (
    <Card title="Candidate overview">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
        {candidateProfileImage ? (
          <img
            src={candidateProfileImage}
            alt={candidateName}
            className="w-14 h-14 rounded-full object-cover shrink-0 shadow-md shadow-indigo-100"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md shadow-indigo-100">
            {initials(candidateName)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-slate-900 text-lg truncate">
            {candidateName}
          </p>
          <button
            onClick={onCopyEmail}
            className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 truncate group transition-colors"
            title="Copy email"
          >
            <MailIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{candidateEmail}</span>
            <CopyIcon className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
          </button>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 pt-5 border-t border-slate-100">
        <Field label="Application number" value={applicationNumber} />
        <Field label="Position" value={position} />
        <Field label="Applied" value={appliedDate} />
      </div>
    </Card>
  );
}

function AiEvaluationCard({
  overallScore,
  recommendation,
  requiredSkillsScore,
  preferredSkillsScore,
  experienceScore,
  educationScore,
  requirementsScore,
}: {
  overallScore: number;
  recommendation: Recommendation;
  requiredSkillsScore: number;
  preferredSkillsScore: number;
  experienceScore: number;
  educationScore: number;
  requirementsScore: number;
}) {
  return (
    <Card title="AI evaluation">
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <ScoreGauge score={overallScore} />
        <div className="flex-1 flex flex-col justify-center gap-3">
          <RecommendationBadge recommendation={recommendation} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-5 border-t border-slate-100">
        <ScoreBar label="Required skills" score={requiredSkillsScore} />
        <ScoreBar label="Preferred skills" score={preferredSkillsScore} />
        <ScoreBar label="Experience" score={experienceScore} />
        <ScoreBar label="Education" score={educationScore} />
        <ScoreBar label="Overall requirements" score={requirementsScore} />
      </div>
    </Card>
  );
}

function AnalysisPendingCard({ analysisStatus }: { analysisStatus: string }) {
  const failed = analysisStatus?.toUpperCase() === "FAILED";
  return (
    <Card title="AI evaluation">
      <div className="flex flex-col items-center text-center py-6">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center mb-3 ${
            failed ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"
          }`}
        >
          {failed ? (
            <AlertIcon className="w-5 h-5" />
          ) : (
            <SpinnerIcon className="w-5 h-5" />
          )}
        </div>
        <p className="text-sm font-semibold text-slate-800">
          {failed ? "AI analysis failed" : "AI analysis is still running"}
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          {failed
            ? "We couldn't score this application automatically. You can still review it manually below."
            : "Scores and recommendations will appear here as soon as it finishes."}
        </p>
      </div>
    </Card>
  );
}

function StrengthsGapsCard({
  strengths,
  gaps,
}: {
  strengths: string[];
  gaps: string[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Card title="Strengths">
        {strengths.length === 0 ? (
          <p className="text-sm text-slate-400">No strengths recorded.</p>
        ) : (
          <ul className="space-y-2.5">
            {strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckIcon className="w-2.5 h-2.5" />
                </span>
                {s}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Areas for improvement">
        {gaps.length === 0 ? (
          <p className="text-sm text-slate-400">No gaps recorded.</p>
        ) : (
          <ul className="space-y-2.5">
            {gaps.map((g, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-0.5 w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <AlertIcon className="w-2.5 h-2.5" />
                </span>
                {g}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function AiSummaryCard({ summary }: { summary: string }) {
  if (!summary) return null;
  return (
    <Card title="AI summary">
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
        {summary}
      </p>
    </Card>
  );
}

function InterviewStatusPill({ status }: { status?: string }) {
  const s = (status ?? "").toUpperCase();
  const className =
    s === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700"
      : s === "CANCELLED"
        ? "bg-red-50 text-red-700"
        : s === "IN_PROGRESS"
          ? "bg-indigo-50 text-indigo-700"
          : "bg-amber-50 text-amber-700";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${className}`}
    >
      {titleCase(status ?? "unknown")}
    </span>
  );
}

function InterviewDetailsCard({
  interview,
}: {
  interview: HiringDecisionInterview | undefined;
}) {
  if (!interview) {
    return (
      <Card title="Interview details">
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            No interview scheduled
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Schedule one from the application list before making a final
            decision.
          </p>
        </div>
      </Card>
    );
  }

  const isVideoCall = interview.mode?.toUpperCase() !== "IN_PERSON";

  return (
    <>
      <Card
        title="Interview details"
        action={<InterviewStatusPill status={interview.status} />}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
          <Field
            label="Round"
            value={
              interview.round
                ? `Round ${interview.round}`
                : titleCase(interview.title)
            }
          />
          <Field
            label="Mode"
            value={
              <span className="inline-flex items-center gap-1.5">
                {isVideoCall ? (
                  <VideoIcon className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <MapPinIcon className="w-3.5 h-3.5 text-slate-400" />
                )}
                {titleCase(interview.mode)}
              </span>
            }
          />
          <Field
            label="Duration"
            value={`${interview.durationInMinutes} minutes`}
          />
          <Field
            label="Candidate response"
            value={titleCase(interview.candidateResponseStatus)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-4 border-t border-slate-100">
          <Field
            label="Scheduled for"
            value={
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                {fmtDateTime(interview.scheduledAt)}
              </span>
            }
          />
          <Field
            label="Started"
            value={
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                {interview.startedAt ? fmtDateTime(interview.startedAt) : "—"}
              </span>
            }
          />
          <Field
            label="Ended"
            value={interview.endedAt ? fmtDateTime(interview.endedAt) : "—"}
          />
          <Field label="Location" value={interview.location ?? "—"} />
        </div>

        {interview.description && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1.5">
              Description
            </p>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {interview.description}
            </p>
          </div>
        )}

        {interview.status?.toUpperCase() === "CANCELLED" && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3">
              <XIcon className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold">Interview cancelled</p>
            </div>
          </div>
        )}
      </Card>

      <Card title="Interview notes">
        {interview.notes ? (
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-100 rounded-lg p-4">
            {interview.notes}
          </p>
        ) : (
          <p className="text-sm text-slate-400">
            No notes were recorded for this interview.
          </p>
        )}
      </Card>
    </>
  );
}

function ResumePreviewModal({
  resume,
  onClose,
}: {
  resume: HiringDecisionResume;
  onClose: () => void;
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-8"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-3xl h-full max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <FileIcon className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {resume.fileName}
              </h2>
              <p className="text-xs text-slate-400">
                Uploaded {fmtDate(resume.uploadedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={resume.previewUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-2 py-1"
            >
              <ExternalLinkIcon className="w-4 h-4" />
              Open in new tab
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close resume preview"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-50 relative overflow-hidden">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
              <SpinnerIcon className="w-6 h-6" />
              <p className="text-sm font-medium">Loading resume…</p>
            </div>
          )}
          {resume.previewUrl ? (
            <iframe
              title="Resume preview"
              src={resume.previewUrl}
              className="w-full h-full border-0"
              onLoad={() => setIframeLoaded(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-8">
              <FileIcon className="w-6 h-6 text-slate-400" />
              <p className="text-sm text-slate-600">
                No preview is available for this file yet.
              </p>
            </div>
          )}
        </div>

        {resume.parsedData && (
          <div className="border-t border-slate-100 px-5 py-3 flex flex-wrap gap-1.5 shrink-0 max-h-24 overflow-y-auto">
            {resume.parsedData.skills.slice(0, 14).map((skill) => (
              <span
                key={skill}
                className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-1"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function parseStatusPill(status: HiringDecisionResume["parseStatus"]) {
  const map: Record<HiringDecisionResume["parseStatus"], string> = {
    PENDING: "bg-slate-100 text-slate-600",
    PROCESSING: "bg-indigo-50 text-indigo-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    FAILED: "bg-red-50 text-red-700",
  };
  return map[status];
}

function ResumeCard({
  resume,
  onPreview,
}: {
  resume: HiringDecisionResume;
  onPreview: () => void;
}) {
  return (
    <Card title="Resume">
      <div className="flex items-center justify-between gap-4 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <FileIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {resume.fileName}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>Uploaded {fmtDate(resume.uploadedAt)}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full font-semibold ${parseStatusPill(resume.parseStatus)}`}
              >
                {titleCase(resume.parseStatus)}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={onPreview}
          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 shrink-0 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
          Preview
        </button>
      </div>

      {resume.parsedData?.totalExperienceYears != null && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 pt-4 mt-4 border-t border-slate-100">
          <Field
            label="Experience"
            value={`${resume.parsedData.totalExperienceYears} yrs`}
          />
          <Field
            label="Current role"
            value={resume.parsedData.currentRole ?? "—"}
          />
          <Field
            label="Current company"
            value={resume.parsedData.currentCompany ?? "—"}
          />
        </div>
      )}
    </Card>
  );
}

function ActivityTimelineCard({ timeline }: { timeline: TimelineEvent[] }) {
  if (timeline.length === 0) return null;
  return (
    <Card title="Activity timeline">
      <ol className="space-y-0">
        {timeline.map((event, i) => (
          <li key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={
                  "w-3 h-3 rounded-full shrink-0 mt-1 " +
                  (event.done
                    ? "bg-indigo-600"
                    : event.current
                      ? "bg-indigo-200 ring-4 ring-indigo-50"
                      : "bg-slate-200")
                }
              />
              {i < timeline.length - 1 && (
                <span className="w-px flex-1 bg-slate-200 my-1" />
              )}
            </div>
            <div className={`pb-5 ${i === timeline.length - 1 ? "pb-0" : ""}`}>
              <p
                className={
                  "text-sm font-semibold " +
                  (event.done ? "text-slate-900" : "text-slate-400")
                }
              >
                {event.label}
              </p>
              {event.timestamp && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {event.timestamp}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function SelectConfirmModal({
  candidateName,
  applicationNumber,
  onCancel,
  onConfirm,
}: {
  candidateName: string;
  applicationNumber: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-md">
        <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
          <CheckIcon className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Select candidate
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          {candidateName} · {applicationNumber}
        </p>
        <p className="text-sm text-slate-600 mb-4">
          To complete the selection, you'll prepare and send an employment offer
          next — there's no way to select a candidate without one.
        </p>
        <ul className="space-y-2 mb-6">
          {[
            "Prepare an employment offer",
            "Candidate status will change to Selected",
            "Candidate will be notified by email with the offer",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <CheckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function RejectModal({
  candidateName,
  applicationNumber,
  submitting,
  onCancel,
  onConfirm,
}: {
  candidateName: string;
  applicationNumber: string;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: (payload: { reason: RejectReason; notes: string }) => void;
}) {
  const [step, setStep] = useState<"reason" | "confirm">("reason");
  const [reason, setReason] = useState<RejectReason | "">("");
  const [notes, setNotes] = useState("");

  const reasonLabel = REJECT_REASONS.find((r) => r.value === reason)?.label;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-md">
        <div className="w-11 h-11 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4">
          <XIcon className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Reject candidate
        </h2>
        <p className="text-sm text-slate-600 mb-5">
          {candidateName} · {applicationNumber}
        </p>

        {step === "reason" ? (
          <>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as RejectReason | "")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a reason</option>
              {REJECT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Additional notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Anything else worth recording for the team"
              className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => reason && setStep("confirm")}
                disabled={!reason}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600 mb-4">
              You're about to reject this candidate for{" "}
              <span className="font-semibold text-slate-900">
                {reasonLabel}
              </span>
              . This will update the application status and notify the candidate
              by email. This can't be easily undone.
            </p>
            {notes && (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mb-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">
                  Notes
                </p>
                <p className="text-sm text-slate-700 whitespace-pre-line">
                  {notes}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setStep("reason")}
                disabled={submitting}
                className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={() => reason && onConfirm({ reason, notes })}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {submitting && <SpinnerIcon className="w-3.5 h-3.5" />}
                {submitting ? "Rejecting…" : "Confirm rejection"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DecisionFooter({
  applicationNumber,
  overallScore,
  disabled,
  onReject,
  onSelect,
}: {
  applicationNumber: string;
  overallScore?: number;
  disabled: boolean;
  onReject: () => void;
  onSelect: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-20 bg-white border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      <div className="px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <div className="min-w-0">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
              Application
            </p>
            <p className="text-sm font-bold text-slate-900 truncate">
              {applicationNumber}
            </p>
          </div>
          {overallScore != null && (
            <div className="hidden sm:block">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                AI score
              </p>
              <p
                className={`text-sm font-bold ${scoreColor(overallScore).text}`}
              >
                {overallScore}%
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onReject}
            disabled={disabled}
            className="px-5 py-2.5 text-sm font-semibold text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject
          </button>
          <button
            onClick={onSelect}
            disabled={disabled}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200/70 rounded-md ${className}`} />
  );
}

function LoadingState() {
  return (
    <div className="flex-1 px-8 py-8 space-y-6">
      <SkeletonBlock className="h-6 w-64" />
      <SkeletonBlock className="h-40 w-full rounded-2xl" />
      <SkeletonBlock className="h-56 w-full rounded-2xl" />
      <SkeletonBlock className="h-40 w-full rounded-2xl" />
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-md text-center px-8">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-5">
          <AlertIcon className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Couldn't load this application
        </h1>
        <p className="text-slate-600 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

const DASHBOARD_ROUTE = "/recruiter/interviews";


type ModalState = "select" | "offer" | "reject" | null;

export default function RecruiterHiringDecisionPage() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();

  const { loading, error, decision, refetch } =
    useRecruiterHiringDecisionDetails(interviewId);
  const { loading: submitting, updateStatus } = useUpdateApplicationStatus();

  const [modal, setModal] = useState<ModalState>(null);
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const timeline = useMemo(
    () =>
      decision ? buildTimeline(decision.application, decision.interview) : [],
    [decision],
  );

  const decisionAlreadyMade = useMemo(
    () =>
      decision?.application.status === ApplicationStatus.SELECTED ||
      decision?.application.status === ApplicationStatus.REJECTED,
    [decision],
  );

  const handleCopyEmail = useCallback(() => {
    if (!decision) return;
    navigator.clipboard?.writeText(decision.application.candidateEmail);
    setToast("Email copied to clipboard");
  }, [decision]);

  // Reject still goes straight through updateStatus — only Select requires
  // the mandatory offer flow.
  const handleReject = useCallback(
    async (payload: { reason: RejectReason; notes: string }) => {
      if (!decision) return;
      const reasonLabel = REJECT_REASONS.find(
        (r) => r.value === payload.reason,
      )?.label;
      const rejectionReason =
        [reasonLabel, payload.notes.trim()].filter(Boolean).join(" — ") ||
        undefined;

      const ok = await updateStatus({
        applicationId: decision.application.applicationId,
        status: ApplicationStatus.REJECTED,
        rejectionReason,
      });
      if (ok) {
        setModal(null);
        navigate(DASHBOARD_ROUTE);
      }
    },
    [decision, updateStatus, navigate],
  );

  // The offer modal only tells us it succeeded — everything that happens
  // next (toast, refresh, navigation) is this page's call, not the modal's.
  // The modal also calls its own onClose() right after onSent, which sets
  // modal back to null; we don't duplicate that here.
  const handleOfferSent = useCallback(async () => {
    setToast("Candidate selected — offer sent");
    await refetch();
    navigate(DASHBOARD_ROUTE);
  }, [refetch, navigate]);

  const retry = useCallback(() => void refetch(), [refetch]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {loading && !decision && <LoadingState />}
        {error && !decision && <ErrorState message={error} onRetry={retry} />}

        {decision && (
          <>
            <div className="flex-1">
              <div className="px-8 pt-8 pb-4">
                <button
                  onClick={() => navigate(DASHBOARD_ROUTE)}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3"
                >
                  ← Back
                </button>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">
                    Hiring decision
                  </h1>
                  <StatusBadge status={decision.application.status} />
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {decision.application.candidateName} · {decision.job.title} ·{" "}
                  {decision.application.applicationNumber}
                </p>
              </div>

              <div className="px-8 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <CandidateOverviewCard
                    candidateName={decision.application.candidateName}
                    candidateEmail={decision.application.candidateEmail}
                    candidateProfileImage={
                      decision.application.candidateProfileImage
                    }
                    status={decision.application.status}
                    applicationNumber={decision.application.applicationNumber}
                    position={decision.job.title}
                    appliedDate={fmtDate(decision.application.appliedAt)}
                    onCopyEmail={handleCopyEmail}
                  />

                  {decision.application.aiAnalysis ? (
                    <>
                      <AiEvaluationCard
                        overallScore={
                          decision.application.aiAnalysis.overallScore
                        }
                        recommendation={
                          decision.application.aiAnalysis
                            .recommendation as Recommendation
                        }
                        requiredSkillsScore={
                          decision.application.aiAnalysis.requiredSkillsScore
                        }
                        preferredSkillsScore={
                          decision.application.aiAnalysis.preferredSkillsScore
                        }
                        experienceScore={
                          decision.application.aiAnalysis.experienceScore
                        }
                        educationScore={
                          decision.application.aiAnalysis.educationScore
                        }
                        requirementsScore={
                          decision.application.aiAnalysis.requirementsScore
                        }
                      />
                      <StrengthsGapsCard
                        strengths={decision.application.aiAnalysis.strengths}
                        gaps={decision.application.aiAnalysis.gaps}
                      />
                      <AiSummaryCard
                        summary={decision.application.aiAnalysis.summary}
                      />
                    </>
                  ) : (
                    <AnalysisPendingCard
                      analysisStatus={decision.application.analysisStatus}
                    />
                  )}

                  <InterviewDetailsCard interview={decision.interview} />

                  <ResumeCard
                    resume={decision.resume}
                    onPreview={() => setResumePreviewOpen(true)}
                  />
                </div>

                <div className="space-y-6 lg:sticky lg:top-8">
                  <ActivityTimelineCard timeline={timeline} />
                  {decisionAlreadyMade && (
                    <Card>
                      <p className="text-sm text-slate-600">
                        {decision.application.status ===
                        ApplicationStatus.REJECTED
                          ? "This candidate was rejected."
                          : "This candidate was selected."}
                        {decision.application.rejectionReason && (
                          <>
                            {" "}
                            Reason:{" "}
                            <span className="font-semibold">
                              {decision.application.rejectionReason}
                            </span>
                          </>
                        )}
                      </p>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            <DecisionFooter
              applicationNumber={decision.application.applicationNumber}
              overallScore={decision.application.aiAnalysis?.overallScore}
              disabled={submitting || decisionAlreadyMade}
              onReject={() => setModal("reject")}
              onSelect={() => setModal("select")}
            />
          </>
        )}
      </div>

      
      {modal === "select" && decision && (
        <SelectConfirmModal
          candidateName={decision.application.candidateName}
          applicationNumber={decision.application.applicationNumber}
          onCancel={() => setModal(null)}
          onConfirm={() => setModal("offer")}
        />
      )}

      {modal === "offer" && decision && (
        <EmploymentOfferModal
          candidate={{
            id: decision.application.applicationId,
            name: decision.application.candidateName,
            role: decision.job.title,
            appId: decision.application.applicationNumber,
            applicationId: decision.application.applicationId,
            aiScore: decision.application.aiAnalysis?.overallScore ?? 0,
          }}
          job={{
            id: decision.job.jobId,
            company: decision.job.companyName,
            title: decision.job.title,
            department: decision.job.department ?? "",
            location: decision.job.location,
          
          }}
          onClose={() => setModal(null)}
          onSent={handleOfferSent}
        />
      )}

      {modal === "reject" && decision && (
        <RejectModal
          candidateName={decision.application.candidateName}
          applicationNumber={decision.application.applicationNumber}
          submitting={submitting}
          onCancel={() => setModal(null)}
          onConfirm={handleReject}
        />
      )}
      {resumePreviewOpen && decision && (
        <ResumePreviewModal
          resume={decision.resume}
          onClose={() => setResumePreviewOpen(false)}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
