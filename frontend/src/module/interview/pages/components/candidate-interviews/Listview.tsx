import React from "react";
import { Clock, Video, MapPin, ChevronRight, Hourglass } from "lucide-react";
import type { GetCandidateInterviewsResponse } from "@/module/interview/types/candidateInterview.types";
import { getResponseConfig, getStatusConfig } from "./Constants";
import { formatDayNumber, formatTime, formatWeekday, inferMode, needsResponse } from "./Utils";
import { InterviewMode } from "@/module/interview/types/interview.types";
import PaginationBar from "./Paginationbar";


export interface ListViewProps {
  items: GetCandidateInterviewsResponse[];
  onGoTo: (interview: GetCandidateInterviewsResponse) => void;
  onOpenDecision: (
    e: React.MouseEvent,
    interview: GetCandidateInterviewsResponse,
  ) => void;
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function ListView({
  items,
  onGoTo,
  onOpenDecision,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: ListViewProps) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-3">All Interviews</h2>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {items.map((interview) => {
          const statusCfg = getStatusConfig(interview);
          const responseCfg = getResponseConfig(interview);
          const mode = inferMode(interview);
          return (
            <div
              key={interview.id}
              onClick={() => onGoTo(interview)}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="shrink-0 w-12 text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">
                  {interview.scheduledAt
                    ? formatWeekday(interview.scheduledAt)
                    : "—"}
                </p>
                <p className="text-base font-bold text-slate-800">
                  {interview.scheduledAt
                    ? formatDayNumber(interview.scheduledAt)
                    : "—"}
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {interview.title || "Interview"}
                </p>
                {interview.rescheduleRequested && (
                  <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                    <Hourglass size={9} /> Reschedule requested
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                <Clock size={12} />{" "}
                {interview.scheduledAt ? formatTime(interview.scheduledAt) : "—"}
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                {mode === InterviewMode.ONLINE ? (
                  <Video size={11} />
                ) : (
                  <MapPin size={11} />
                )}
                {mode === InterviewMode.ONLINE ? "Online" : "In-person"}
              </span>
              {responseCfg && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold shrink-0 ${responseCfg.pill}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${responseCfg.dot}`} />
                  {responseCfg.label}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${statusCfg.pill}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
              {needsResponse(interview) && (
                <button
                  onClick={(e) => onOpenDecision(e, interview)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors shrink-0"
                >
                  Respond
                </button>
              )}
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            </div>
          );
        })}
      </div>
      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onChange={onPageChange}
      />
    </div>
  );
}