import type { GetCandidateInterviewsResponse } from "@/module/interview/types/candidateInterview.types";
import { Calendar, ChevronDown, ChevronRight } from "lucide-react";
import type { ExpandedState } from "./Types";
import { getResponseConfig, getStatusConfig } from "./Constants";
import { formatTime } from "./Utils";
import PaginationBar from "./Paginationbar";

export interface TimelineViewProps {
  groupedByDate: Record<string, GetCandidateInterviewsResponse[]>;
  expandedDates: ExpandedState;
  onToggleDate: (date: string) => void;
  onGoTo: (interview: GetCandidateInterviewsResponse) => void;
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function TimelineView({
  groupedByDate,
  expandedDates,
  onToggleDate,
  onGoTo,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: TimelineViewProps) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-3">
        Past & Completed Interviews
      </h2>
      <div className="space-y-2.5">
        {Object.entries(groupedByDate).map(([date, dateInterviews]) => (
          <div
            key={date}
            className="bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-all"
          >
            <button
              onClick={() => onToggleDate(date)}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-900 text-sm">
                  {date}
                </span>
                <span className="text-xs text-slate-400">
                  {dateInterviews.length} interview
                  {dateInterviews.length === 1 ? "" : "s"}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${expandedDates[date] ? "rotate-180" : ""}`}
              />
            </button>

            {expandedDates[date] && (
              <div className="border-t border-slate-200 bg-slate-50 rounded-b-xl">
                <div className="p-4 space-y-2.5">
                  {dateInterviews.map((interview) => {
                    const statusCfg = getStatusConfig(interview);
                    const responseCfg = getResponseConfig(interview);
                    return (
                      <div
                        key={interview.id}
                        onClick={() => onGoTo(interview)}
                        className="relative flex items-center justify-between p-3.5 pl-4 bg-white rounded-lg border border-slate-200 hover:shadow-sm hover:border-slate-300 transition-all overflow-hidden cursor-pointer"
                      >
                        <span
                          className={`absolute left-0 top-0 bottom-0 w-1 ${statusCfg.bar}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-slate-900 text-sm truncate">
                              {interview.title || "Interview"}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${statusCfg.pill}`}
                            >
                              <span
                                className={`w-1 h-1 rounded-full ${statusCfg.dot}`}
                              />
                              {statusCfg.label}
                            </span>
                            {responseCfg && (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${responseCfg.pill}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${responseCfg.dot}`}
                                />
                                {responseCfg.label}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatTime(interview.scheduledAt!)}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
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
