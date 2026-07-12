import React, { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  UserCheck,
  CalendarPlus,
  Trophy,
  UserX,
  Info,
  PartyPopper,
  AlertTriangle,
  Lock,
  ArrowRight,
} from "lucide-react";
import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";
import type { ModalAction } from "./Index";
import { InterviewStatus } from "@/module/interview/types/interview.types";

type Variant = "blue" | "amber" | "purple" | "red";

type VariantStyle = {
  cardBorder: string;
  cardBorderActive: string;
  iconBg: string;
  iconText: string;
  btn: string;
  chip: string;
};

const VARIANT_STYLES: Record<Variant, VariantStyle> = {
  blue: {
    cardBorder: "border-slate-100 hover:border-blue-200",
    cardBorderActive: "border-blue-200 bg-blue-50/40",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    btn: "bg-blue-600 hover:bg-blue-700 text-white",
    chip: "bg-blue-50 text-blue-700",
  },
  amber: {
    cardBorder: "border-slate-100 hover:border-amber-200",
    cardBorderActive: "border-amber-200 bg-amber-50/40",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    btn: "bg-amber-600 hover:bg-amber-700 text-white",
    chip: "bg-amber-50 text-amber-700",
  },
  purple: {
    cardBorder: "border-slate-100 hover:border-purple-200",
    cardBorderActive: "border-purple-200 bg-purple-50/40",
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
    btn: "bg-purple-600 hover:bg-purple-700 text-white",
    chip: "bg-purple-50 text-purple-700",
  },
  red: {
    cardBorder: "border-slate-100 hover:border-red-200",
    cardBorderActive: "border-red-200 bg-red-50/40",
    iconBg: "bg-red-50",
    iconText: "text-red-600",
    btn: "bg-red-600 hover:bg-red-700 text-white",
    chip: "bg-red-50 text-red-700",
  },
};

export function ActionCard({
  label,
  description,
  buttonLabel,
  Icon,
  onClick,
  disabled,
  disabledReason,
  active,
  activeLabel,
  variant,
}: {
  label: string;
  description: string;
  buttonLabel: string;
  Icon: React.ElementType;
  onClick: () => void;
  disabled: boolean;
  disabledReason?: string;
  active: boolean;
  activeLabel?: string;
  variant: Variant;
}) {
  const V = VARIANT_STYLES[variant];

  return (
    <div
      className={`group relative rounded-xl border p-4 transition-all duration-150
        ${active ? V.cardBorderActive : `bg-white ${V.cardBorder}`}
        ${disabled ? "opacity-60" : "hover:shadow-md hover:-translate-y-0.5"}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-transform
            ${disabled ? "bg-slate-100" : V.iconBg}
            ${!disabled && "group-hover:rotate-3"}`}
        >
          {disabled ? (
            <Lock className="w-4 h-4 text-slate-400" />
          ) : (
            <Icon className={`w-4 h-4 ${V.iconText}`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900">{label}</p>
            {active && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${V.chip}`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {activeLabel ?? "Done"}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            {disabled && disabledReason ? disabledReason : description}
          </p>
        </div>
      </div>

      {!active && (
        <div className="mt-3 flex justify-end">
          <button
            disabled={disabled}
            onClick={onClick}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
              ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : V.btn}`}
          >
            {buttonLabel}
            {!disabled && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
}

const STAGE_LABEL: Record<string, string> = {
  [ApplicationStatus.APPLIED]: "Applied",
  [ApplicationStatus.SHORTLISTED]: "Shortlisted",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "Interview Scheduled",
  [ApplicationStatus.SELECTED]: "Selected",
};

const STAGE_NEXT_STEP: Record<string, string> = {
  [ApplicationStatus.APPLIED]: "Shortlist the candidate to move them forward.",
  [ApplicationStatus.SHORTLISTED]: "Schedule an interview to continue.",
  [ApplicationStatus.SELECTED]: "Offer created — nothing more to do here.",
};

function CurrentStageBadge({
  status,
  interviewCompleted,
}: {
  status: string | undefined;
  interviewCompleted: boolean;
}) {
  const interviewScheduledNotDone =
    status === ApplicationStatus.INTERVIEW_SCHEDULED && !interviewCompleted;
  const interviewScheduledAndDone =
    status === ApplicationStatus.INTERVIEW_SCHEDULED && interviewCompleted;

  const label = interviewScheduledAndDone
    ? "Interview Completed"
    : status
      ? (STAGE_LABEL[status] ?? status)
      : "Applied";

  const nextStep = interviewScheduledAndDone
    ? "Ready for hiring decision."
    : interviewScheduledNotDone
      ? "Waiting on the interview to happen."
      : status
        ? STAGE_NEXT_STEP[status]
        : STAGE_NEXT_STEP[ApplicationStatus.APPLIED];

  const badgeColor = interviewScheduledAndDone
    ? "bg-purple-100 text-purple-700"
    : status === ApplicationStatus.SELECTED
      ? "bg-emerald-100 text-emerald-700"
      : status === ApplicationStatus.INTERVIEW_SCHEDULED
        ? "bg-amber-100 text-amber-700"
        : status === ApplicationStatus.SHORTLISTED
          ? "bg-blue-100 text-blue-700"
          : "bg-slate-100 text-slate-700";

  return (
    <div className="px-5 pt-4">
      <span className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
        Current Stage
      </span>
      <div className="flex items-center gap-2 mt-1.5">
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor}`}
        >
          {label}
        </span>
        {nextStep && (
          <span className="text-[11px] text-slate-400">{nextStep}</span>
        )}
      </div>
    </div>
  );
}

function CandidateProgress({
  status,
  interviewCompleted,
}: {
  status: string | undefined;
  interviewCompleted: boolean;
}) {
  const steps = [
    { key: "applied", label: "Applied", done: true },
    {
      key: "shortlisted",
      label: "Shortlisted",
      done:
        status === ApplicationStatus.SHORTLISTED ||
        status === ApplicationStatus.INTERVIEW_SCHEDULED ||
        status === ApplicationStatus.SELECTED,
    },
    {
      key: "interview_scheduled",
      label: "Interview",
      done:
        status === ApplicationStatus.INTERVIEW_SCHEDULED ||
        status === ApplicationStatus.SELECTED,
    },
    {
      key: "hiring_decision",
      label: "Decision",
      done: status === ApplicationStatus.SELECTED,
    },
    {
      key: "offer_sent",
      label: "Offer",
      done: status === ApplicationStatus.SELECTED,
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const fillPercent =
    steps.length > 1 ? ((doneCount - 1) / (steps.length - 1)) * 100 : 0;

  return (
    <div className="px-5 py-5 border-b border-slate-100">
      <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-4">
        Candidate Progress
      </p>
      <div className="relative">
        {/* track */}
        <div className="absolute top-2 left-2 right-2 h-0.5 bg-slate-100" />
        <div
          className="absolute top-2 left-2 h-0.5 bg-emerald-400 transition-all duration-500"
          style={{ width: `calc(${Math.max(fillPercent, 0)}% - 16px)` }}
        />
        <div className="relative flex justify-between">
          {steps.map((s) => (
            <div
              key={s.key}
              className="flex flex-col items-center gap-1.5 w-0 flex-1"
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                  ${
                    s.done
                      ? "bg-emerald-400 border-emerald-400"
                      : "bg-white border-slate-200"
                  }`}
              >
                {s.done && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white -m-0.5" />
                )}
              </div>
              <span
                className={`text-[10px] text-center leading-tight ${
                  s.done ? "text-slate-700 font-semibold" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {interviewCompleted &&
        status === ApplicationStatus.INTERVIEW_SCHEDULED && (
          <p className="text-[10px] text-purple-600 font-medium text-center mt-2">
            Interview completed — decision pending
          </p>
        )}
    </div>
  );
}

function NextActionBanner({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="mx-4 mt-4 rounded-xl bg-linear-to-br from-purple-50 to-purple-50/40 border border-purple-100 p-4">
      <div className="flex items-center gap-2">
        <PartyPopper className="w-4 h-4 text-purple-500" />
        <p className="text-xs font-bold text-purple-800">
          Interview Successfully Completed
        </p>
      </div>
      <p className="text-[11px] text-purple-700 mt-1.5 leading-snug">
        Feedback has been saved. Review the outcome and decide whether to send
        an offer or reject the candidate.
      </p>
      <button
        onClick={onContinue}
        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors"
      >
        Proceed to Hiring Decision
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

type ConfirmRequest = {
  title: string;
  message: string;
  confirmLabel: string;
  variant: Variant;
  onConfirm: () => void;
};

function ConfirmDialog({
  request,
  onCancel,
}: {
  request: ConfirmRequest;
  onCancel: () => void;
}) {
  const confirmBtnClass =
    request.variant === "red"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : request.variant === "purple"
        ? "bg-purple-600 hover:bg-purple-700 text-white"
        : request.variant === "amber"
          ? "bg-amber-600 hover:bg-amber-700 text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
              request.variant === "red" ? "bg-red-50" : "bg-slate-100"
            }`}
          >
            <AlertTriangle
              className={`w-4.5 h-4.5 ${
                request.variant === "red" ? "text-red-500" : "text-slate-500"
              }`}
            />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">
              {request.title}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed whitespace-pre-line">
              {request.message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              request.onConfirm();
              onCancel();
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${confirmBtnClass}`}
          >
            {request.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RecruiterActionsPanel({
  status,
  statusLoading,
  isClosed,
  isRejected,
  interviewId,
  interviewStatus,
  onAction,
  onNavigateToHiringDecision,
}: {
  status: string | undefined;
  statusLoading: boolean;
  isClosed: boolean;
  isRejected: boolean;
  isWithdrawn: boolean;
  interviewId: string | undefined;
  interviewStatus: InterviewStatus | undefined;
  onAction: (action: ModalAction) => void;
  onNavigateToHiringDecision: (interviewId: string) => void;
}) {
  const interviewCompleted = interviewStatus === InterviewStatus.COMPLETED;
  const alreadySelected = status === ApplicationStatus.SELECTED;

  const hiringDecisionDisabled =
    statusLoading || isClosed || alreadySelected || !interviewCompleted;

  const hiringDecisionReason = !interviewCompleted
    ? "Available after the interview is completed."
    : undefined;

  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(
    null,
  );

  const requestConfirm = (request: ConfirmRequest) =>
    setConfirmRequest(request);

  const goToHiringDecision = () => {
    if (!interviewId) return;
    requestConfirm({
      title: "Proceed to hiring decision?",
      message:
        "The interview has been completed.\n\nYou'll review the interview outcome and decide whether to send an offer or reject the candidate. No status changes yet.",
      confirmLabel: "Continue",
      variant: "purple",
      onConfirm: () => onNavigateToHiringDecision(interviewId),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">
          Recruitment Workflow
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Move candidate through the pipeline
        </p>
      </div>

      <CurrentStageBadge
        status={status}
        interviewCompleted={interviewCompleted}
      />
      <CandidateProgress
        status={status}
        interviewCompleted={interviewCompleted}
      />

      {interviewCompleted && !alreadySelected && !isClosed && (
        <NextActionBanner onContinue={goToHiringDecision} />
      )}

      <div className="p-4 space-y-2.5">
        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold px-1">
          Quick Actions
        </p>

        <ActionCard
          label="Shortlist Candidate"
          description="Move this candidate into the shortlist stage."
          buttonLabel="Shortlist"
          Icon={UserCheck}
          variant="blue"
          active={status === ApplicationStatus.SHORTLISTED}
          disabled={
            statusLoading ||
            isClosed ||
            status === ApplicationStatus.SHORTLISTED
          }
          onClick={() =>
            requestConfirm({
              title: "Shortlist this candidate?",
              message:
                "The candidate will move to the shortlist stage and be visible as shortlisted in the pipeline.",
              confirmLabel: "Shortlist",
              variant: "blue",
              onConfirm: () => onAction("shortlist"),
            })
          }
        />

        <ActionCard
          label="Schedule Interview"
          description="Arrange an interview session with the candidate."
          buttonLabel="Schedule"
          Icon={CalendarPlus}
          variant="amber"
          active={status === ApplicationStatus.INTERVIEW_SCHEDULED}
          activeLabel={interviewCompleted ? "Completed" : "Scheduled"}
          disabled={
            statusLoading ||
            isClosed ||
            status === ApplicationStatus.INTERVIEW_SCHEDULED
          }
          onClick={() =>
            requestConfirm({
              title: "Mark interview as scheduled?",
              message:
                "This updates the application status to Interview Scheduled. Make sure the interview has actually been arranged before confirming.",
              confirmLabel: "Confirm",
              variant: "amber",
              onConfirm: () => onAction("interview"),
            })
          }
        />
        <ActionCard
          label="Hiring Decision"
          description={
            alreadySelected
              ? "Candidate has already been selected."
              : interviewCompleted
                ? "Review interview feedback and continue to offer creation."
                : "Complete the interview first."
          }
          buttonLabel="Continue"
          Icon={Trophy}
          variant="purple"
          active={alreadySelected}
          activeLabel="Selected"
          disabled={hiringDecisionDisabled}
          disabledReason={hiringDecisionReason}
          onClick={goToHiringDecision}
        />

        <div className="pt-1">
          <div className="border-t border-slate-100 mb-2.5" />
          <ActionCard
            label="Reject Candidate"
            description="Remove this candidate from the pipeline. This can't be easily undone."
            buttonLabel="Reject"
            Icon={UserX}
            variant="red"
            active={isRejected}
            activeLabel="Rejected"
            disabled={statusLoading || isClosed}
            onClick={() =>
              requestConfirm({
                title: "Reject this candidate?",
                message:
                  "The candidate will be removed from the pipeline. This action can't be easily undone.",
                confirmLabel: "Reject Candidate",
                variant: "red",
                onConfirm: () => onAction("reject"),
              })
            }
          />
        </div>

        {!interviewCompleted && !alreadySelected && !isClosed && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500">
              Interview pending — complete the interview before a hiring
              decision can be made.
            </p>
          </div>
        )}

        {isClosed && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500">
              This application is {isRejected ? "rejected" : "withdrawn"} and no
              further actions can be taken.
            </p>
          </div>
        )}
      </div>

      {confirmRequest && (
        <ConfirmDialog
          request={confirmRequest}
          onCancel={() => setConfirmRequest(null)}
        />
      )}
    </div>
  );
}

export { ActionCard as ActionBtn };
