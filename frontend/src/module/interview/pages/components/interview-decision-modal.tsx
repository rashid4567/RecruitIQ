import { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  X,
  AlertCircle,
  Calendar,
  Clock,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useAcceptInterview } from "../../hooks/candidate/useAcceptInterview";
import { useRejectInterview } from "../../hooks/candidate/useRejectInterview";
import { CandidateResponseStatus } from "../../types/interview.types";
import type { CandidateResponseStatus as CandidateResponseStatusType } from "../../types/interview.types";

export interface InterviewDecisionTarget {
  id: string;
  title?: string;
  scheduledAt?: string;
  candidateResponseStatus?: CandidateResponseStatusType;
}

interface InterviewDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview?: InterviewDecisionTarget;
  onAccepted?: (interviewId: string) => void;
  onRejected?: (interviewId: string) => void;
}

type Step = "choose" | "decline-reason";

function formatScheduledAt(scheduledAt?: string): { date: string; time: string } {
  if (!scheduledAt) return { date: "—", time: "—" };
  const d = new Date(scheduledAt);
  return {
    date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function InterviewDecisionModal({
  isOpen,
  onClose,
  interview,
  onAccepted,
  onRejected,
}: InterviewDecisionModalProps) {
  const { submit: accept, loading: accepting, error: acceptError } = useAcceptInterview();
  const { submit: reject, loading: rejecting, error: rejectError } = useRejectInterview();
  const [step, setStep] = useState<Step>("choose");
  const [reason, setReason] = useState("");

  if (!isOpen || !interview) return null;

  const busy = accepting || rejecting;
  const { date, time } = formatScheduledAt(interview.scheduledAt);
  const alreadyResponded = interview.candidateResponseStatus !== CandidateResponseStatus.PENDING;

  function reset() {
    setStep("choose");
    setReason("");
  }

  function handleClose() {
    if (busy) return;
    reset();
    onClose();
  }

  async function handleAccept() {
    if (!interview?.id) return;
    const result = await accept(interview.id);
    if (result) {
      reset();
      onAccepted?.(interview.id);
    }
  }

  async function handleConfirmDecline() {
    if (!interview?.id) return;
    if (!reason.trim()) return;
    const result = await reject(interview.id, { reason: reason.trim() });
    if (result) {
      reset();
      onRejected?.(interview.id);
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CalendarClock size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {step === "choose" ? "Confirm Your Interview" : "Share a reason"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {step === "choose" ? "Let the recruiter know you're in" : "Helps the recruiter understand why"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={busy}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4">
          {alreadyResponded ? (
            <p className="text-sm text-slate-500">You&apos;ve already responded to this interview invite.</p>
          ) : (
            <>
              <p className="text-sm text-slate-600 mb-3">
                <span className="font-semibold text-slate-800">{interview.title || "Interview"}</span> — please
                confirm whether you can make it.
              </p>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2.5 mb-1">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Scheduled for</p>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    {date}
                    <span className="text-slate-300">·</span>
                    <Clock size={12} className="text-slate-400" />
                    {time}
                  </p>
                </div>
              </div>

              {step === "decline-reason" && (
                <div className="mt-3">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Why can&apos;t you make it? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="e.g. Scheduling conflict, no longer interested…"
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
                  />
                </div>
              )}

              {(acceptError || rejectError) && (
                <div className="mt-3 flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <AlertCircle size={13} className="shrink-0 mt-0.5" />
                  <span>{acceptError || rejectError}</span>
                </div>
              )}
            </>
          )}
        </div>

      
        {!alreadyResponded && (
          <div className="px-5 pb-5 flex items-center gap-2">
            {step === "choose" ? (
              <>
                <button
                  onClick={() => setStep("decline-reason")}
                  disabled={busy}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle size={14} />
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  disabled={busy}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {accepting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Accept
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep("choose")}
                  disabled={busy}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={14} />
                </button>
                <button
                  onClick={handleConfirmDecline}
                  disabled={busy || !reason.trim()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {rejecting ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                  Confirm Decline
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}