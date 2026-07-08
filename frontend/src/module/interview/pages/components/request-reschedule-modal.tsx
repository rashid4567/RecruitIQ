import { useState } from "react";
import {
  RefreshCw,
  X,
  AlertCircle,
  Calendar,
  Clock,
  Loader2,
  Send,
} from "lucide-react";
import { useRequestInterviewReschedule } from "../../hooks/candidate/useRequestInterviewReschedule";

export interface RescheduleRequestTarget {
  id: string;
  scheduledAt?: string;
  rescheduleRequested?: boolean;
}

interface RequestRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview?: RescheduleRequestTarget;
  onRequested?: (interviewId: string) => void;
}

function formatScheduledAt(scheduledAt?: string): {
  date: string;
  time: string;
} {
  if (!scheduledAt) return { date: "—", time: "—" };
  const d = new Date(scheduledAt);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function RequestRescheduleModal({
  isOpen,
  onClose,
  interview,
  onRequested,
}: RequestRescheduleModalProps) {
  const { submit, loading, error } = useRequestInterviewReschedule();
  const [reason, setReason] = useState("");

  if (!isOpen || !interview) return null;

  const { date, time } = formatScheduledAt(interview.scheduledAt);
  const alreadyRequested = interview.rescheduleRequested;

  function handleClose() {
    if (loading) return;
    setReason("");
    onClose();
  }

  async function handleSubmit() {
    if (!interview?.id || !reason.trim()) return;
    const result = await submit(interview.id, { reason: reason.trim() });
    if (result) {
      setReason("");
      onRequested?.(interview.id);
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
            <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <RefreshCw size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Request Reschedule
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ask the recruiter for a new time
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4">
          {alreadyRequested ? (
            <p className="text-sm text-slate-500">
              You&apos;ve already asked to reschedule this interview. The
              recruiter will follow up once they&apos;ve reviewed it.
            </p>
          ) : (
            <>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2.5 mb-3">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">
                    Currently scheduled for
                  </p>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    {date}
                    <span className="text-slate-300">·</span>
                    <Clock size={12} className="text-slate-400" />
                    {time}
                  </p>
                </div>
              </div>

              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                Why do you need to reschedule?{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="e.g. I have a conflict at that time…"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition resize-none"
              />

              {error && (
                <div className="mt-3 flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <AlertCircle size={13} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-5 pb-5 flex items-center gap-2">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {alreadyRequested ? "Close" : "Cancel"}
          </button>
          {!alreadyRequested && (
            <button
              onClick={handleSubmit}
              disabled={loading || !reason.trim()}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Send Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
