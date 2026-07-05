import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Video,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Circle,
  PlayCircle,
  XCircle,
} from "lucide-react";
import type {
  RecruiterInterviewItem,
  GetRecruiterInterviewDetailsResponse,
} from "@/module/interview/types/recruiterInterview.types";
import { InterviewStatus } from "@/module/interview/types/interview.types";
import { useRecruiterInterviewDetails } from "@/module/interview/hooks/recruiter/useRecruiterInterviewDetails";
import {
  toInitials,
  candidateGradient,
  formatScheduledAt,
  canModifyInterview,
  hasPendingRescheduleRequest,
  getStatusConfig,
} from "./Interviewdashboard.helpers";

interface RecruiterInterviewDetailModalProps {
  interview: RecruiterInterviewItem | null;
  onClose: () => void;
  onReschedule: (interview: RecruiterInterviewItem) => void;
  onCancel: (interview: RecruiterInterviewItem) => void;
  onApproveReschedule: (interview: RecruiterInterviewItem) => void;
  onRejectReschedule: (interview: RecruiterInterviewItem) => void;
  onStartInterview: (interview: RecruiterInterviewItem) => void;
  onJoinInterview: (interview: RecruiterInterviewItem) => void;
  startLoading?: boolean;
  startError?: string | null;
}

export default function RecruiterInterviewDetailModal({
  interview,
  onClose,
  onReschedule,
  onCancel,
  onApproveReschedule,
  onRejectReschedule,
  onStartInterview,
  onJoinInterview,
  startLoading,
  startError,
}: RecruiterInterviewDetailModalProps) {
  const { getDetails, loading, error } = useRecruiterInterviewDetails();
  const [details, setDetails] = useState<GetRecruiterInterviewDetailsResponse | null>(
    null,
  );

  useEffect(() => {
    if (!interview?.interviewId) {
      setDetails(null);
      return;
    }
    let cancelled = false;
    getDetails(interview.interviewId).then((res) => {
      if (!cancelled) setDetails(res);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview?.interviewId]);

  if (!interview) return null;

  const { date, time } = formatScheduledAt(interview.scheduledAt);
  const statusCfg = getStatusConfig(interview);
  const modifiable = canModifyInterview(interview);
  const pendingReschedule = hasPendingRescheduleRequest(interview);
  const name = interview.candidateName || interview.candidateId;
  const initials = toInitials(name);
  const gradient = candidateGradient(interview.candidateId);

  const isOngoing = interview.interviewStatus === InterviewStatus.ONGOING;
  const isStartable =
    interview.mode === "ONLINE" &&
    (interview.interviewStatus === InterviewStatus.SCHEDULED ||
      interview.interviewStatus === InterviewStatus.RESCHEDULED);
  const isCancelled = interview.interviewStatus === InterviewStatus.CANCELLED;
  const showTimeline =
    !loading &&
    details &&
    (interview.interviewStatus === InterviewStatus.ONGOING ||
      interview.interviewStatus === InterviewStatus.COMPLETED);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-start justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            {interview.candidateProfileImage ? (
              <img
                src={interview.candidateProfileImage}
                alt={name}
                className="w-11 h-11 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div
                className={`w-11 h-11 bg-linear-to-br ${gradient} rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm`}
              >
                {initials}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-slate-900">{name}</h2>
              <p className="text-xs text-slate-500">
                {interview.jobTitle || interview.jobId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {interview.title || "Interview"}
              </h3>
              <p className="text-sm text-slate-500">Round {interview.round ?? "—"}</p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1.5 ${statusCfg.pill}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
          </div>

          {/* Pending reschedule banner */}
          {pendingReschedule && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Reschedule requested
                </p>
                {details?.requestedReason && (
                  <p className="text-xs text-amber-700 mt-0.5">
                    "{details.requestedReason}"
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => onRejectReschedule(interview)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 text-xs font-semibold transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => onApproveReschedule(interview)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          )}

          {/* Core info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm bg-slate-50 rounded-xl p-4 border border-slate-100">
            <InfoField icon={<Calendar className="w-3.5 h-3.5" />} label="Date" value={date} />
            <InfoField
              icon={<Clock className="w-3.5 h-3.5" />}
              label="Time"
              value={`${time} · ${interview.durationInMinutes ?? "—"} min`}
            />
            <InfoField
              icon={
                interview.mode === "ONLINE" ? (
                  <Video className="w-3.5 h-3.5" />
                ) : (
                  <MapPin className="w-3.5 h-3.5" />
                )
              }
              label="Mode"
              value={
                interview.mode === "ONLINE"
                  ? "Online"
                  : interview.location || "In person"
              }
            />
            <InfoField
              icon={<Mail className="w-3.5 h-3.5" />}
              label="Candidate email"
              value={interview.candidateEmail || "—"}
            />
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading more details...
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {details?.description && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Description
              </p>
              <p className="text-sm text-slate-700">{details.description}</p>
            </div>
          )}

          {showTimeline && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                Timeline
              </p>
              <div className="space-y-2.5">
                <TimelineRow
                  label="Interview started"
                  done={!!details?.startedAt}
                  timestamp={details?.startedAt}
                />
                <TimelineRow
                  label="Recruiter joined"
                  done={!!details?.recruiterJoinedAt}
                  timestamp={details?.recruiterJoinedAt}
                />
                <TimelineRow
                  label="Candidate joined"
                  done={!!details?.candidateJoinedAt}
                  timestamp={details?.candidateJoinedAt}
                />
                <TimelineRow
                  label="Interview ended"
                  done={!!details?.endedAt}
                  timestamp={details?.endedAt}
                />
              </div>
            </div>
          )}

          {isCancelled && details && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-800 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Cancelled
              </p>
              {details.cancelledReason && (
                <p className="text-sm text-red-700 mt-1">"{details.cancelledReason}"</p>
              )}
            </div>
          )}

          {details?.notes && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Notes
              </p>
              <p className="text-sm text-slate-700">{details.notes}</p>
            </div>
          )}

          {startError && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4" />
              {startError}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex flex-wrap gap-2 justify-end rounded-b-2xl">
          {modifiable && (
            <>
              <button
                onClick={() => onReschedule(interview)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
              >
                Reschedule
              </button>
              <button
                onClick={() => onCancel(interview)}
                className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition-colors"
              >
                Cancel interview
              </button>
            </>
          )}

          {isOngoing && (
            <button
              onClick={() => onJoinInterview(interview)}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              Join meeting
            </button>
          )}

          {!isOngoing && isStartable && (
            <button
              onClick={() => onStartInterview(interview)}
              disabled={startLoading}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-bold transition-colors flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              {startLoading ? "Starting..." : "Start interview"}
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-indigo-600 mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function TimelineRow({
  label,
  done,
  timestamp,
}: {
  label: string;
  done: boolean;
  timestamp?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
      )}
      <span className={`text-sm ${done ? "text-slate-800 font-medium" : "text-slate-400"}`}>
        {label}
      </span>
      {done && timestamp && (
        <span className="text-xs text-slate-400 ml-auto">
          {new Date(timestamp).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </div>
  );
}