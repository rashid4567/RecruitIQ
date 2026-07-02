import React from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Hourglass,
  Loader2,
} from "lucide-react";
import type { GetCandidateInterviewsResponse } from "@/module/interview/types/candidateInterview.types"; 
import { InterviewMode } from "@/module/interview/types/interview.types"; 
import { getStatusConfig, getResponseConfig } from "./Constants";
import {
  formatDateLabel,
  formatRelative,
  formatTime,
  inferMode,
  canJoinNow,
  canRequestReschedule,
  needsResponse,
} from "./Utils";

export interface UpcomingInterviewsGridProps {
  interviews: GetCandidateInterviewsResponse[];
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

export default function UpcomingInterviewsGrid({
  interviews,
  joiningId,
  onGoTo,
  onOpenDecision,
  onOpenReschedule,
  onJoin,
}: UpcomingInterviewsGridProps) {
  if (interviews.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-slate-900">
          Upcoming Interviews
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          {interviews.length} scheduled
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {interviews.map((interview) => {
          const mode = inferMode(interview);
          const statusCfg = getStatusConfig(interview);
          const responseCfg = getResponseConfig(interview);
          const joinable = canJoinNow(interview);
          const pendingResponse = needsResponse(interview);
          return (
            <div
              key={interview.id}
              onClick={() => onGoTo(interview)}
              className="relative bg-white rounded-xl border border-slate-200 pl-4 pr-4 py-4 hover:shadow-md hover:border-slate-300 transition-all overflow-hidden cursor-pointer"
            >
              <span
                className={`absolute left-0 top-0 bottom-0 w-1 ${statusCfg.bar}`}
              />

              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {interview.title || "Interview"}
                </p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${statusCfg.pill}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                  {statusCfg.label}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-2.5">
                {responseCfg && (
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${responseCfg.pill}`}
                  >
                    <span className={`w-1 h-1 rounded-full ${responseCfg.dot}`} />
                    {responseCfg.label}
                  </span>
                )}
                {interview.rescheduleRequested && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                    <Hourglass size={9} /> Reschedule requested
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {formatDateLabel(interview.scheduledAt!)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {formatTime(interview.scheduledAt!)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                  {mode === InterviewMode.ONLINE ? (
                    <Video size={11} />
                  ) : (
                    <MapPin size={11} />
                  )}
                  {mode === InterviewMode.ONLINE
                    ? "Online"
                    : interview.location || "In-person"}
                </span>

                {pendingResponse ? (
                  <button
                    onClick={(e) => onOpenDecision(e, interview)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors"
                  >
                    <CheckCircle2 size={12} />
                    Respond
                  </button>
                ) : mode === InterviewMode.ONLINE && interview.meetingLink ? (
                  <button
                    onClick={(e) => onJoin(e, interview)}
                    disabled={!joinable || joiningId === interview.id}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                      joinable
                        ? "text-white bg-blue-600 hover:bg-blue-700"
                        : "text-slate-400 bg-slate-100 cursor-not-allowed"
                    }`}
                    title={
                      joinable
                        ? "Join the interview"
                        : "Join link opens 15 minutes before start"
                    }
                  >
                    {joiningId === interview.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <ExternalLink size={12} />
                    )}
                    Join
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    {formatRelative(interview.scheduledAt!)}
                  </span>
                )}
              </div>

              {!pendingResponse && canRequestReschedule(interview) && (
                <button
                  onClick={(e) => onOpenReschedule(e, interview)}
                  className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-2 py-1 rounded-md transition-colors"
                >
                  <RefreshCw size={10} /> Request reschedule
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}