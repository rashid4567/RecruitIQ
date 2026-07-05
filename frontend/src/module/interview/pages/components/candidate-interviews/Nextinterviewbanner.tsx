import React, { useEffect, useState } from "react";
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
  Lock,
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

const RESCHEDULE_LOCK_MINUTES = 15;
const TICK_INTERVAL_MS = 15_000;

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
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const online = inferMode(interview) === InterviewMode.ONLINE;
  const awaitingResponse = needsResponse(interview);
  const joinReady = canJoinNow(interview);
  const isJoining = joiningId === interview.id;

  const minutesUntilStart = interview.scheduledAt
    ? (new Date(interview.scheduledAt).getTime() - now) / 60_000
    : Infinity;

  const rescheduleEligible = canRequestReschedule(interview);
  const rescheduleLocked =
    rescheduleEligible && minutesUntilStart <= RESCHEDULE_LOCK_MINUTES;

  let joinHint: string | null = null;
  if (online && !awaitingResponse) {
    if (joinReady) {
      joinHint = "Ready to join";
    } else if (minutesUntilStart > RESCHEDULE_LOCK_MINUTES) {
      const mins = Math.round(minutesUntilStart - RESCHEDULE_LOCK_MINUTES);
      joinHint =
        mins >= 60 ? `Opens in ${Math.round(mins / 60)}h` : `Opens in ${mins}m`;
    } else if (minutesUntilStart <= 0) {
      joinHint = "In progress";
    }
  }

  return (
    <div
      onClick={() => onGoTo(interview)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onGoTo(interview);
      }}
      className="mb-6 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 p-5 text-white shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
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
            {joinHint && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  joinReady
                    ? "bg-emerald-400/90 text-emerald-950"
                    : "bg-white/10 text-blue-100"
                }`}
              >
                {joinReady && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-800 opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-800" />
                  </span>
                )}
                {joinHint}
              </span>
            )}
          </div>
          <p className="text-lg font-bold truncate">
            {interview.title || "Interview"}
          </p>
          <div className="flex items-center gap-3 text-sm text-blue-100 mt-1 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} /> {formatDateLabel(interview.scheduledAt!)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> {formatTime(interview.scheduledAt!)}
            </span>
            <span className="flex items-center gap-1.5">
              {online ? <Video size={13} /> : <MapPin size={13} />}
              {online ? "Online" : interview.location || "In-person"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {awaitingResponse ? (
            <button
              onClick={(e) => onOpenDecision(e, interview)}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <CheckCircle2 size={14} />
              Respond
            </button>
          ) : (
            <>
              {rescheduleEligible && !rescheduleLocked && (
                <button
                  onClick={(e) => onOpenReschedule(e, interview)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2.5 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors"
                >
                  <RefreshCw size={13} />
                  Reschedule
                </button>
              )}

              {rescheduleEligible && rescheduleLocked && (
                <span
                  onClick={(e) => e.stopPropagation()}
                  title={`Reschedule requests close ${RESCHEDULE_LOCK_MINUTES} minutes before the scheduled time.`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-2.5 rounded-lg bg-white/10 text-blue-100/80 cursor-not-allowed"
                >
                  <Lock size={12} />
                  Locked
                </span>
              )}

              {online && (
                <button
                  onClick={(e) => onJoin(e, interview)}
                  disabled={!joinReady || isJoining}
                  className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${
                    joinReady
                      ? "bg-white text-blue-700 hover:bg-blue-50"
                      : "bg-white/15 text-white/60 cursor-not-allowed"
                  }`}
                  title={
                    joinReady
                      ? "Join the interview"
                      : "Join opens 15 minutes before start"
                  }
                >
                  {isJoining ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ExternalLink size={14} />
                  )}
                  {isJoining ? "Joining…" : "Join interview"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
