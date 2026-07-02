import React from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  CalendarClock,
  CheckCircle2,
  RefreshCw,
  Hourglass,
  Sparkles,
  Loader2,
} from "lucide-react";
import type { GetCandidateInterviewsResponse } from "@/module/interview/types/candidateInterview.types";

import {
  formatDateLabel,
  formatRelative,
  formatTime,
  inferMode,
  canJoinNow,
  canRequestReschedule,
  needsResponse,
} from "./Utils";
import {
  CandidateResponseStatus,
  InterviewMode,
} from "@/module/interview/types/interview.types";

export interface NextInterviewBannerProps {
  interview: GetCandidateInterviewsResponse;
  joiningId: string | null;
  onGoTo: (interview: GetCandidateInterviewsResponse) => void;
  onOpenDecision: (
    e: React.MouseEvent,
    interview: GetCandidateInterviewsResponse,
  ) => void;
  onOpenReschedule: (
    e: React.MouseEvent,
    interview: GetCandidateInterviewsResponse,
  ) => void;
  onJoin: (
    e: React.MouseEvent,
    interview: GetCandidateInterviewsResponse,
  ) => void;
}

export default function NextInterviewBanner({
  interview,
  joiningId,
  onGoTo,
  onOpenDecision,
  onOpenReschedule,
  onJoin,
}: NextInterviewBannerProps) {
  return (
    <div
      onClick={() => onGoTo(interview)}
      className="mb-6 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 p-5 text-white shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <Sparkles className="absolute -right-4 -top-4 w-28 h-28 text-white/10" />
      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide bg-white/15 px-2 py-0.5 rounded-full">
              <CalendarClock size={11} /> Next up
            </span>
            <span className="text-xs text-blue-100">
              {formatRelative(interview.scheduledAt!)}
            </span>
            {interview.candidateResponseStatus ===
              CandidateResponseStatus.PENDING && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-amber-400/90 text-amber-950 px-2 py-0.5 rounded-full">
                Awaiting your response
              </span>
            )}
            {interview.rescheduleRequested && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-white/15 px-2 py-0.5 rounded-full">
                <Hourglass size={9} /> Reschedule requested
              </span>
            )}
          </div>
          <p className="text-lg font-bold truncate">
            {interview.title || "Interview"}
          </p>
          <div className="flex items-center gap-3 text-sm text-blue-100 mt-1">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} /> {formatDateLabel(interview.scheduledAt!)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> {formatTime(interview.scheduledAt!)}
            </span>
            <span className="flex items-center gap-1.5">
              {inferMode(interview) === InterviewMode.ONLINE ? (
                <Video size={13} />
              ) : (
                <MapPin size={13} />
              )}
              {inferMode(interview) === InterviewMode.ONLINE
                ? "Online"
                : interview.location || "In-person"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {needsResponse(interview) ? (
            <button
              onClick={(e) => onOpenDecision(e, interview)}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <CheckCircle2 size={14} />
              Respond
            </button>
          ) : (
            <>
              {canRequestReschedule(interview) && (
                <button
                  onClick={(e) => onOpenReschedule(e, interview)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2.5 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors"
                >
                  <RefreshCw size={13} />
                  Reschedule
                </button>
              )}
              {inferMode(interview) === InterviewMode.ONLINE &&
                interview.meetingLink && (
                  <button
                    onClick={(e) => onJoin(e, interview)}
                    disabled={
                      !canJoinNow(interview) || joiningId === interview.id
                    }
                    className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${
                      canJoinNow(interview)
                        ? "bg-white text-blue-700 hover:bg-blue-50"
                        : "bg-white/15 text-white/60 cursor-not-allowed"
                    }`}
                    title={
                      canJoinNow(interview)
                        ? "Join the interview"
                        : "Join link opens 15 minutes before start"
                    }
                  >
                    {joiningId === interview.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <ExternalLink size={14} />
                    )}
                    Join interview
                  </button>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
