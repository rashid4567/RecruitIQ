import { useEffect } from "react";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import type { RecruiterInterviewItem } from "@/module/interview/types/recruiterInterview.types";
import type { RescheduleDecision } from "../../../types/Interviewdashboard.types";
import {
  toInitials,
  candidateGradient,
  formatFullDateTime,
} from "./Interviewdashboard.helpers";

export default function RescheduleDecisionModal({
  isOpen,
  decision,
  interview,
  loading,
  error,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  decision: RescheduleDecision;
  interview?: RecruiterInterviewItem;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen || !interview) return null;

  const isApprove = decision === "approve";
  const name = interview.candidateName || interview.candidateId;
  const initials = toInitials(name);
  const linear = candidateGradient(interview.candidateId);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div
          className={`h-1 w-full ${isApprove ? "bg-emerald-500" : "bg-red-500"}`}
        />

        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-lg ${
                isApprove
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {isApprove ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isApprove ? "Approve Reschedule?" : "Reject Reschedule?"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isApprove
                  ? "Approve candidate's request"
                  : "Keep original time"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 pb-3">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg p-3">
            {interview.candidateProfileImage ? (
              <img
                src={interview.candidateProfileImage}
                alt={name}
                className="w-10 h-10 rounded-lg object-cover shadow-sm shrink-0"
              />
            ) : (
              <div
                className={`w-10 h-10 bg-linear-to-br ${linear} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0`}
              >
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-800 truncate">
                {name}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {interview.jobTitle || interview.jobId}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-3">
          <div className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
            <CalendarClock
              size={14}
              className="text-amber-600 shrink-0 mt-0.5"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                Currently Scheduled
              </p>
              <p className="text-xs font-semibold text-amber-900">
                {formatFullDateTime(interview.scheduledAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-3">
          <p className="text-sm text-slate-600">
            {isApprove ? (
              <>You'll pick a new time after confirming this approval.</>
            ) : (
              <>
                The interview stays at its current time, and the candidate will
                be notified.
              </>
            )}
          </p>
        </div>

        {error && (
          <div className="mx-6 mb-3 flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg p-3 text-red-600">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <p className="text-xs">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60 ${
              isApprove
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Wait…" : isApprove ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}