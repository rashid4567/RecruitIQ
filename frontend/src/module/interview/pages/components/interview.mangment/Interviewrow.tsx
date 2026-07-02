import { useState, useRef, useEffect } from "react";
import { Clock, MapPin, MoreVertical, Video } from "lucide-react";
import type { RecruiterInterviewItem } from "@/module/interview/types/recruiterInterview.types";
import { InterviewStatus } from "@/module/interview/types/interview.types"; 
import {
  toInitials,
  candidateGradient,
  formatScheduledAt,
  isInterviewScheduled,
  isUpcomingInterview,
  canModifyInterview,
  hasPendingRescheduleRequest,
  getStatusConfig,
  isToday,
  STATUS_TRANSITIONS,
} from "./Interviewdashboard.helpers";

export default function InterviewRow({
  interview,
  onStatusChange,
  onOpenSchedule,
  onOpenReschedule,
  onOpenCancel,
  onApproveReschedule,
  onRejectReschedule,
}: {
  interview: RecruiterInterviewItem;
  onStatusChange: (id: string, status: InterviewStatus) => void;
  onOpenSchedule: (interview: RecruiterInterviewItem) => void;
  onOpenReschedule: (interview: RecruiterInterviewItem) => void;
  onOpenCancel: (interview: RecruiterInterviewItem) => void;
  onApproveReschedule: (interview: RecruiterInterviewItem) => void;
  onRejectReschedule: (interview: RecruiterInterviewItem) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { date, time } = formatScheduledAt(interview.scheduledAt);
  const linear = candidateGradient(interview.candidateId);
  const scheduled = isInterviewScheduled(interview);
  const upcoming = isUpcomingInterview(interview);
  const modifiable = canModifyInterview(interview);
  const pendingReschedule = hasPendingRescheduleRequest(interview);
  const statusCfg = getStatusConfig(interview);
  const transitions = STATUS_TRANSITIONS[interview.interviewStatus ?? ""] ?? [];
  const todayFlag = isToday(interview.scheduledAt);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const name = interview.candidateName || interview.candidateId;
  const initials = toInitials(name);
  const jobTitle = interview.jobTitle || interview.jobId;

  function handleRowClick() {
    if (!scheduled) onOpenSchedule(interview);
  }

  return (
    <tr
      onClick={handleRowClick}
      className={`transition-colors ${
        pendingReschedule
          ? "bg-rose-50/40 hover:bg-rose-50/60"
          : scheduled
            ? "hover:bg-blue-50/20"
            : "hover:bg-blue-50/40 cursor-pointer"
      }`}
    >
      {/* Date & Time */}
      <td className="px-5 py-4">
        {scheduled ? (
          <div className="flex items-start gap-2">
            {todayFlag && (
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 ring-2 ring-blue-100" />
            )}
            <div>
              <div className="text-sm font-semibold text-slate-800">{date}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <Clock size={11} />
                {time}
              </div>
              {todayFlag && (
                <span className="text-[10px] font-bold text-blue-600 mt-1 block">
                  TODAY
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-sm text-slate-300">—</span>
        )}
      </td>

      {/* Candidate */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          {interview.candidateProfileImage ? (
            <img
              src={interview.candidateProfileImage}
              alt={name}
              className="w-8 h-8 rounded-lg object-cover shadow-sm shrink-0"
            />
          ) : (
            <div
              className={`w-8 h-8 bg-linear-to-br ${linear} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0`}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800">{name}</div>
            <div className="text-xs text-slate-400">
              {interview.candidateEmail || "—"}
            </div>
          </div>
        </div>
      </td>

      {/* Position */}
      <td className="px-5 py-4">
        <div className="text-sm font-medium text-slate-700">{jobTitle}</div>
        {interview.title && (
          <div className="text-xs text-slate-400 mt-0.5">{interview.title}</div>
        )}
      </td>

      {/* Round */}
      <td className="px-5 py-4">
        {interview.round != null ? (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
            {interview.round}
          </span>
        ) : (
          <span className="text-slate-300 text-sm">—</span>
        )}
      </td>

      {/* Mode */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          {interview.meetingLink ? (
            <>
              <Video size={14} className="text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                Online
              </span>
            </>
          ) : interview.location ? (
            <>
              <MapPin size={14} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                {interview.location}
              </span>
            </>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap ${statusCfg.pill}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </span>
        {pendingReschedule && (
          <div className="text-[10px] text-rose-600 font-bold mt-1.5">
            ⚠ RESCHEDULE REQ
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2 relative">
          {modifiable && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReschedule(interview);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium transition-colors whitespace-nowrap"
                title="Reschedule interview"
              >
                Reschedule
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCancel(interview);
                }}
                className="px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors whitespace-nowrap"
                title="Cancel interview"
              >
                Cancel
              </button>
            </>
          )}

          {pendingReschedule && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApproveReschedule(interview);
                }}
                className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-medium transition-colors whitespace-nowrap"
                title="Approve reschedule request"
              >
                Approve
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRejectReschedule(interview);
                }}
                className="px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors whitespace-nowrap"
                title="Reject reschedule request"
              >
                Reject
              </button>
            </>
          )}

          {!scheduled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenSchedule(interview);
              }}
              className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium transition-colors whitespace-nowrap"
              title="Schedule interview"
            >
              Schedule
            </button>
          )}

          {transitions.length > 0 && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="More actions"
              >
                <MoreVertical size={14} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 z-40 w-40 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                  {transitions.map((t) => (
                    <button
                      key={t.status}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(interview.interviewId!, t.status);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}