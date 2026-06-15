import React, { useState, useEffect, useCallback } from "react";
import {
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Award,
  Zap,
  AlertCircle,
  TrendingUp,
  Mail,
  Calendar,
  Star,
  BarChart2,
  Target,
  BookOpen,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
  UserX,
  CalendarPlus,
  Trophy,
  X,
  ChevronRight,
  Info,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useRecruiterApplicationDetails } from "../../hooks/recruiter/useRecruiterApplicationDetails";
import { useUpdateApplicationStatus } from "../../hooks/recruiter/useUpdateApplicationStatus";
import {
  ApplicationStatus,
  ApplicationRecommendation,
  type ApplicationAIAnalysis,
  type InterviewInfo,
} from "@/module/job-application/domain/entity/job-application.entity";
import Sidebar from "@/module/recruiter/presentation/pages/components/layout/Sidebar";
import Header from "@/pages/landing/sections/Header";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function fmt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function fmtFull(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type DS =
  | "Applied"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected"
  | "Withdrawn";

function mapStatus(s?: string): DS {
  switch (s) {
    case ApplicationStatus.SHORTLISTED:
      return "Shortlisted";
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return "Interview Scheduled";
    case ApplicationStatus.SELECTED:
      return "Selected";
    case ApplicationStatus.REJECTED:
      return "Rejected";
    case ApplicationStatus.WITHDRAWN:
      return "Withdrawn";
    default:
      return "Applied";
  }
}

const PIPELINE: DS[] = [
  "Applied",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
];

const SM: Record<
  DS,
  { color: string; bg: string; border: string; dot: string; ring: string }
> = {
  Applied: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
    ring: "ring-blue-200",
  },
  Shortlisted: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
  },
  "Interview Scheduled": {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    ring: "ring-amber-200",
  },
  Selected: {
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
    ring: "ring-violet-200",
  },
  Rejected: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    ring: "ring-red-200",
  },
  Withdrawn: {
    color: "text-slate-500",
    bg: "bg-slate-100",
    border: "border-slate-200",
    dot: "bg-slate-400",
    ring: "ring-slate-200",
  },
};

const RM: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    bar: string;
    fill: string;
    pct: number;
    Icon: React.ElementType;
  }
> = {
  [ApplicationRecommendation.STRONG_MATCH]: {
    label: "Strong Match",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    bar: "bg-emerald-100",
    fill: "bg-emerald-500",
    pct: 95,
    Icon: Trophy,
  },
  [ApplicationRecommendation.GOOD_MATCH]: {
    label: "Good Match",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    bar: "bg-blue-100",
    fill: "bg-blue-500",
    pct: 72,
    Icon: ShieldCheck,
  },
  [ApplicationRecommendation.PARTIAL_MATCH]: {
    label: "Partial Match",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    bar: "bg-amber-100",
    fill: "bg-amber-400",
    pct: 45,
    Icon: AlertCircle,
  },
  [ApplicationRecommendation.POOR_MATCH]: {
    label: "Poor Match",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    bar: "bg-red-100",
    fill: "bg-red-500",
    pct: 18,
    Icon: XCircle,
  },
};

interface ModalConfig {
  title: string;
  description: string;
  confirmLabel: string;
  confirmClass: string;
  Icon: React.ElementType;
  iconClass: string;
  requireReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
}

function ConfirmModal({
  config,
  onConfirm,
  onCancel,
  loading,
}: {
  config: ModalConfig;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState("");
  const canSubmit = !config.requireReason || reason.trim().length >= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top accent bar */}
        <div
          className={`h-1 w-full ${config.confirmClass.includes("red") ? "bg-red-500" : config.confirmClass.includes("blue") ? "bg-blue-500" : config.confirmClass.includes("emerald") ? "bg-emerald-500" : config.confirmClass.includes("amber") ? "bg-amber-400" : config.confirmClass.includes("violet") ? "bg-violet-500" : "bg-slate-400"}`}
        />

        <div className="p-6">
          {/* Icon + title */}
          <div className="flex items-start gap-4 mb-5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${config.iconClass}`}
            >
              <config.Icon className="w-5 h-5" />
            </div>
            <div className="pt-0.5">
              <h2 className="text-base font-bold text-slate-900">
                {config.title}
              </h2>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {config.description}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Rejection reason textarea */}
          {(config.reasonLabel || config.reasonPlaceholder) && (
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {config.reasonLabel}
              </label>

              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={config.reasonPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!canSubmit || loading}
              onClick={() => onConfirm(reason || undefined)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmClass}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                config.confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineTracker({
  current,
  isRejected,
  isWithdrawn,
}: {
  current: DS;
  isRejected: boolean;
  isWithdrawn: boolean;
}) {
  if (isRejected || isWithdrawn) {
    const s = SM[isRejected ? "Rejected" : "Withdrawn"];
    return (
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold ${s.bg} ${s.border} ${s.color}`}
      >
        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
        {isRejected ? "Rejected" : "Withdrawn"}
      </div>
    );
  }

  const currentIdx = PIPELINE.indexOf(current);

  return (
    <div className="flex items-center gap-1.5">
      {PIPELINE.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const s = SM[step];
        const label = step === "Interview Scheduled" ? "Interview" : step;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-200"
                    : active
                      ? `bg-white ${s.border} ring-4 ${s.ring}`
                      : "bg-white border-slate-200"
                }`}
              >
                {done ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : active ? (
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold whitespace-nowrap tracking-wide ${
                  active
                    ? s.color
                    : done
                      ? "text-emerald-600"
                      : "text-slate-300"
                }`}
              >
                {label.toUpperCase()}
              </span>
            </div>
            {i < PIPELINE.length - 1 && (
              <div
                className={`h-0.5 w-10 mb-4 rounded-full transition-colors duration-300 ${i < currentIdx ? "bg-emerald-300" : "bg-slate-200"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Ring({
  value,
  color,
  size = 84,
  sw = 7,
}: {
  value: number;
  color: string;
  size?: number;
  sw?: number;
}) {
  const r = (size - sw * 2) / 2;
  const c = 2 * Math.PI * r;
  const o = c - (Math.min(value, 100) / 100) * c;
  const cx = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
    >
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={sw}
      />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeDasharray={c}
        strokeDashoffset={o}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </svg>
  );
}

function ScoreTile({
  label,
  value,
  color,
  Icon,
}: {
  label: string;
  value: number;
  color: string;
  Icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
      <div className="relative" style={{ width: 84, height: 84 }}>
        <Ring value={value} color={color} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-slate-900 tabular-nums">
            {value}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-xs font-semibold text-slate-500">{label}</span>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  fill,
}: {
  label: string;
  value: number;
  fill: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-36 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${fill} transition-all duration-700`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-700 w-7 text-right tabular-nums">
        {value}
      </span>
    </div>
  );
}

function FeedbackColumn({
  title,
  items,
  accent,
  BgIcon,
  ItemIcon,
  emptyText,
}: {
  title: string;
  items: string[];
  accent: {
    bg: string;
    border: string;
    header: string;
    dot: string;
    chip: string;
    chipText: string;
  };
  BgIcon: React.ElementType;
  ItemIcon: React.ElementType;
  emptyText: string;
}) {
  return (
    <div
      className={`rounded-2xl border ${accent.border} ${accent.bg} p-5 flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BgIcon className={`w-4 h-4 ${accent.header}`} />
          <span
            className={`text-xs font-bold uppercase tracking-widest ${accent.header}`}
          >
            {title}
          </span>
        </div>
        {items.length > 0 && (
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${accent.chip} ${accent.chipText}`}
          >
            {items.length}
          </span>
        )}
      </div>
      {items.length > 0 ? (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <ItemIcon
                className={`w-3.5 h-3.5 ${accent.dot} mt-0.5 shrink-0`}
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-400 italic">{emptyText}</p>
      )}
    </div>
  );
}

function RecBanner({
  rec,
  analyzedAt,
}: {
  rec: (typeof RM)[string];
  analyzedAt: string;
}) {
  return (
    <div
      className={`rounded-2xl border-2 ${rec.border} ${rec.bg} overflow-hidden`}
    >
      <div className="px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl bg-white border ${rec.border} flex items-center justify-center shadow-sm ${rec.color}`}
          >
            <rec.Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              AI Recommendation
            </p>
            <p className={`text-xl font-bold mt-0.5 ${rec.color}`}>
              {rec.label}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyzed {fmtFull(analyzedAt)}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-3xl font-black tabular-nums ${rec.color}`}>
            {rec.pct}
            <span className="text-lg">%</span>
          </p>
          <p className="text-xs text-slate-400">match strength</p>
        </div>
      </div>
      <div className={`h-2 w-full ${rec.bar}`}>
        <div
          className={`h-full ${rec.fill} transition-all duration-1000`}
          style={{ width: `${rec.pct}%` }}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  Icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-slate-500" />
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="text-sm text-slate-400 italic text-center py-6">{text}</p>
  );
}

function InterviewPanel({ iv }: { iv: InterviewInfo }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
        <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Scheduled
          </p>
          <p className="text-sm font-semibold text-slate-900 mt-0.5">
            {fmtFull(iv.scheduledAt)}
          </p>
        </div>
      </div>
      {iv.location && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <Target className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Location
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              {iv.location}
            </p>
          </div>
        </div>
      )}
      {iv.meetingLink && (
        <a
          href={iv.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold shadow-sm shadow-blue-200"
        >
          <span>Join Meeting</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      )}
      {iv.notes && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">
            Notes
          </p>
          <p className="text-xs text-slate-700 leading-relaxed">{iv.notes}</p>
        </div>
      )}
    </div>
  );
}

function ActionBtn({
  label,
  sublabel,
  Icon,
  onClick,
  disabled,
  active,
  variant,
}: {
  label: string;
  sublabel: string;
  Icon: React.ElementType;
  onClick: () => void;
  disabled: boolean;
  active: boolean;
  variant: "blue" | "amber" | "emerald" | "red";
}) {
  const V = {
    blue: {
      btn: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100",
      activeBg: "bg-blue-700",
      check: "text-blue-200",
    },
    amber: {
      btn: "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200",
      activeBg: "bg-amber-100",
      check: "text-amber-400",
    },
    emerald: {
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-100",
      activeBg: "bg-emerald-700",
      check: "text-emerald-200",
    },
    red: {
      btn: "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200",
      activeBg: "bg-red-100",
      check: "text-red-400",
    },
  }[variant];

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
        ${active ? V.activeBg : V.btn}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <div className="flex-1 text-left">
        <p className="leading-none">{label}</p>
        <p className={`text-[10px] font-normal mt-0.5 opacity-70`}>
          {sublabel}
        </p>
      </div>
      {active ? (
        <CheckCircle className={`w-4 h-4 shrink-0 ${V.check}`} />
      ) : (
        !disabled && (
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
        )
      )}
    </button>
  );
}

type ModalAction = "shortlist" | "interview" | "select" | "reject" | null;

const MODAL_CONFIGS: Record<Exclude<ModalAction, null>, ModalConfig> = {
  shortlist: {
    title: "Shortlist this candidate?",
    description:
      "The candidate will be moved to the Shortlisted stage and may be notified of their progress.",
    confirmLabel: "Yes, shortlist",
    confirmClass: "bg-blue-600 hover:bg-blue-700",
    Icon: UserCheck,
    iconClass: "bg-blue-50 text-blue-600",
  },
  interview: {
    title: "Schedule an interview?",
    description:
      "The candidate's status will be updated to Interview Scheduled. You can coordinate timing separately.",
    confirmLabel: "Confirm scheduling",
    confirmClass: "bg-amber-500 hover:bg-amber-600",
    Icon: CalendarPlus,
    iconClass: "bg-amber-50 text-amber-600",
  },
  select: {
    title: "Mark as Selected?",
    description:
      "This will mark the candidate as the chosen applicant for this role. This action can be revisited.",
    confirmLabel: "Yes, select candidate",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700",
    Icon: Trophy,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  reject: {
    title: "Reject this candidate?",
    description: "The candidate will be removed from consideration.",
    confirmLabel: "Reject candidate",
    confirmClass: "bg-red-600 hover:bg-red-700",
    Icon: UserX,
    iconClass: "bg-red-50 text-red-600",
    requireReason: false,
    reasonLabel: "Reason for rejection (Optional)",
    reasonPlaceholder: "Optional feedback for the candidate",
  },
};

export type RecruiterApplicationStatus =
  | typeof ApplicationStatus.SHORTLISTED
  | typeof ApplicationStatus.INTERVIEW_SCHEDULED
  | typeof ApplicationStatus.SELECTED
  | typeof ApplicationStatus.REJECTED;

export interface UpdateApplicationStatusDTO {
  applicationId: string;
  status: RecruiterApplicationStatus;
  rejectionReason?: string;
}

const ACTION_TO_STATUS: Record<
  Exclude<ModalAction, null>,
  RecruiterApplicationStatus
> = {
  shortlist: ApplicationStatus.SHORTLISTED,
  interview: ApplicationStatus.INTERVIEW_SCHEDULED,
  select: ApplicationStatus.SELECTED,
  reject: ApplicationStatus.REJECTED,
};

export default function CandidateScorecardPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [modal, setModal] = useState<ModalAction>(null);

  const { loading, error, application, fetchApplicationDetails } =
    useRecruiterApplicationDetails();
  const { loading: statusLoading, updateStatus } = useUpdateApplicationStatus();

  useEffect(() => {
    if (applicationId) fetchApplicationDetails(applicationId);
  }, [applicationId, fetchApplicationDetails]);

  const handleConfirm = useCallback(
    async (reason?: string) => {
      if (!modal || !application?.applicationId) return;

      const ok = await updateStatus({
        applicationId: application.applicationId,
        status: ACTION_TO_STATUS[modal],
        rejectionReason: reason,
      });

      if (ok && applicationId) {
        await fetchApplicationDetails(applicationId);
        setModal(null);
      }
    },
    [modal, application, applicationId, updateStatus, fetchApplicationDetails],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 text-sm font-medium">
              Loading application…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-sm w-full p-8 bg-white rounded-2xl shadow-sm border border-slate-100 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900">
                Failed to load application
              </p>
              <p className="text-sm text-slate-500 mt-1">{error}</p>
            </div>
            <button
              onClick={() =>
                applicationId && fetchApplicationDetails(applicationId)
              }
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Empty text="No application data found." />
        </div>
      </div>
    );
  }

  const ds = mapStatus(application.status);
  const sm = SM[ds];
  const ai = application.aiAnalysis as ApplicationAIAnalysis | undefined;
  const interview = application.interview as InterviewInfo | undefined;
  const isRejected = application.status === ApplicationStatus.REJECTED;
  const isWithdrawn = application.status === ApplicationStatus.WITHDRAWN;
  const isClosed = isRejected || isWithdrawn;
  const rec = ai ? RM[ai.recommendation] : undefined;

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />

        {/* ── Hero Header ── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-8 py-7">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              {/* Identity block */}
              <div className="flex items-start gap-5">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-lg select-none">
                    {getInitials(application.candidateName ?? "U")}
                  </div>
                  <span
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${sm.dot} shadow-sm`}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {application.candidateName ?? "Unknown Candidate"}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sm.bg} ${sm.border} ${sm.color}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                      {ds}
                    </span>
                  </div>

                  <div className="flex items-center gap-5 flex-wrap">
                    {application.candidateEmail && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Mail className="w-3.5 h-3.5" />
                        {application.candidateEmail}
                      </span>
                    )}
                    {application.appliedAt && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        Applied {fmt(application.appliedAt)}
                      </span>
                    )}
                  </div>

                  <PipelineTracker
                    current={ds}
                    isRejected={isRejected}
                    isWithdrawn={isWithdrawn}
                  />
                </div>
              </div>

              {/* Top actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommendation banner */}
            {ai && rec && <RecBanner rec={rec} analyzedAt={ai.analyzedAt} />}

            {/* AI scores */}
            {ai && (
              <Section
                title="AI Evaluation Scores"
                subtitle="Across all assessment dimensions"
                Icon={Sparkles}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <ScoreTile
                    label="Overall"
                    value={ai.overallScore}
                    color="#3b82f6"
                    Icon={Star}
                  />
                  <ScoreTile
                    label="Skills"
                    value={ai.requiredSkillsScore}
                    color="#10b981"
                    Icon={Target}
                  />
                  <ScoreTile
                    label="Experience"
                    value={ai.experienceScore}
                    color="#f59e0b"
                    Icon={Award}
                  />
                  <ScoreTile
                    label="Education"
                    value={ai.educationScore}
                    color="#8b5cf6"
                    Icon={BookOpen}
                  />
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <ScoreBar
                    label="Required Skills"
                    value={ai.requiredSkillsScore}
                    fill="bg-blue-500"
                  />
                  <ScoreBar
                    label="Preferred Skills"
                    value={ai.preferredSkillsScore}
                    fill="bg-emerald-500"
                  />
                  <ScoreBar
                    label="Experience"
                    value={ai.experienceScore}
                    fill="bg-amber-400"
                  />
                  <ScoreBar
                    label="Requirements"
                    value={ai.requirementsScore}
                    fill="bg-violet-500"
                  />
                  <ScoreBar
                    label="Education"
                    value={ai.educationScore}
                    fill="bg-pink-500"
                  />
                </div>
              </Section>
            )}

            {/* AI Summary */}
            {ai?.summary && (
              <Section
                title="AI Summary"
                subtitle="Generated candidate evaluation"
                Icon={Zap}
              >
                <p className="text-sm text-slate-700 leading-relaxed">
                  {ai.summary}
                </p>
              </Section>
            )}

            {/* Feedback grid — all three columns always visible */}
            {ai && (
              <Section
                title="Detailed Feedback"
                subtitle="Strengths, gaps, and missing critical skills"
                Icon={BarChart2}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FeedbackColumn
                    title="Strengths"
                    items={ai.strengths}
                    BgIcon={TrendingUp}
                    ItemIcon={CheckCircle}
                    emptyText="No strengths identified."
                    accent={{
                      bg: "bg-emerald-50/60",
                      border: "border-emerald-100",
                      header: "text-emerald-700",
                      dot: "text-emerald-500",
                      chip: "bg-emerald-100",
                      chipText: "text-emerald-700",
                    }}
                  />
                  <FeedbackColumn
                    title="Gaps"
                    items={ai.gaps}
                    BgIcon={AlertCircle}
                    ItemIcon={XCircle}
                    emptyText="No gaps detected."
                    accent={{
                      bg: "bg-red-50/60",
                      border: "border-red-100",
                      header: "text-red-700",
                      dot: "text-red-400",
                      chip: "bg-red-100",
                      chipText: "text-red-700",
                    }}
                  />
                  <FeedbackColumn
                    title="Missing Skills"
                    items={ai.missingCriticalSkills}
                    BgIcon={Layers}
                    ItemIcon={AlertCircle}
                    emptyText="All critical skills present."
                    accent={{
                      bg: "bg-orange-50/60",
                      border: "border-orange-100",
                      header: "text-orange-700",
                      dot: "text-orange-400",
                      chip: "bg-orange-100",
                      chipText: "text-orange-700",
                    }}
                  />
                </div>
              </Section>
            )}

            {!ai && (
              <Section title="AI Analysis" Icon={Info}>
                <Empty text="AI analysis has not been run for this application yet." />
              </Section>
            )}

            {/* Cover letter */}
            {application.coverLetter && (
              <Section
                title="Cover Letter"
                subtitle="Submitted by the candidate"
                Icon={FileText}
              >
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {application.coverLetter}
                </p>
              </Section>
            )}

            {/* Rejection reason */}
            {isRejected && application.rejectionReason && (
              <Section title="Rejection Reason" Icon={XCircle}>
                <div className="px-4 py-3.5 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-sm text-red-700 leading-relaxed">
                    {application.rejectionReason}
                  </p>
                </div>
              </Section>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-5">
            {/* ── Recruiter Actions ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Recruiter Actions
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Move candidate through the pipeline
                </p>
              </div>
              <div className="p-4 space-y-2">
                <ActionBtn
                  label="Shortlist Candidate"
                  sublabel="Move to shortlist stage"
                  Icon={UserCheck}
                  variant="blue"
                  active={application.status === ApplicationStatus.SHORTLISTED}
                  disabled={
                    statusLoading ||
                    isClosed ||
                    application.status === ApplicationStatus.SHORTLISTED
                  }
                  onClick={() => setModal("shortlist")}
                />
                <ActionBtn
                  label="Schedule Interview"
                  sublabel="Mark interview as scheduled"
                  Icon={CalendarPlus}
                  variant="amber"
                  active={
                    application.status === ApplicationStatus.INTERVIEW_SCHEDULED
                  }
                  disabled={
                    statusLoading ||
                    isClosed ||
                    application.status === ApplicationStatus.INTERVIEW_SCHEDULED
                  }
                  onClick={() => setModal("interview")}
                />
                <ActionBtn
                  label="Mark as Selected"
                  sublabel="Choose this candidate for the role"
                  Icon={Trophy}
                  variant="emerald"
                  active={application.status === ApplicationStatus.SELECTED}
                  disabled={
                    statusLoading ||
                    isClosed ||
                    application.status === ApplicationStatus.SELECTED
                  }
                  onClick={() => setModal("select")}
                />

                <div className="pt-1">
                  <div className="border-t border-slate-100 mb-2" />
                  <ActionBtn
                    label="Reject Candidate"
                    sublabel="Remove from consideration"
                    Icon={UserX}
                    variant="red"
                    active={isRejected}
                    disabled={statusLoading || isClosed}
                    onClick={() => setModal("reject")}
                  />
                </div>

                {isClosed && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500">
                      This application is{" "}
                      {isRejected ? "rejected" : "withdrawn"} and no further
                      actions can be taken.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Interview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Interview Details
                </h3>
              </div>
              <div className="px-5 py-4">
                {interview ? (
                  <InterviewPanel iv={interview} />
                ) : (
                  <Empty text="No interview scheduled yet." />
                )}
              </div>
            </div>

            {/* Resume */}
            {application.resumeId && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-900">Resume</h3>
                </div>
                <div className="p-5">
                  <div className="h-20 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1.5 mb-4">
                    <FileText className="w-7 h-7 text-slate-200" />
                    <span className="text-xs text-slate-400 font-medium">
                      Resume on file
                    </span>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors">
                    <Download className="w-4 h-4" />
                    Download Resume
                  </button>
                </div>
              </div>
            )}

            {/* Application Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Application Info
                </h3>
              </div>
              <div className="px-5 py-4 space-y-3">
                {[
                  { label: "Applied on", value: fmt(application.appliedAt) },
                  { label: "Last updated", value: fmt(application.updatedAt) },
                  { label: "Current status", value: ds },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-slate-400">{label}</span>
                    <span
                      className={`text-xs font-bold ${label === "Current status" ? sm.color : "text-slate-700"}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {modal && (
        <ConfirmModal
          config={MODAL_CONFIGS[modal]}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
          loading={statusLoading}
        />
      )}
    </div>
  );
}
