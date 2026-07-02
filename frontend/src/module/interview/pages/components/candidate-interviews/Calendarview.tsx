import type { GetCandidateInterviewsResponse } from "@/module/interview/types/candidateInterview.types";
import { getStatusConfig } from "./Constants";
import { formatDayNumber, formatTime, formatWeekday } from "./Utils";
import PaginationBar from "./Paginationbar";

export interface CalendarViewProps {
  groupedByMonth: Record<string, GetCandidateInterviewsResponse[]>;
  onGoTo: (interview: GetCandidateInterviewsResponse) => void;
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function CalendarView({
  groupedByMonth,
  onGoTo,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: CalendarViewProps) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-3">
        Interviews by Month
      </h2>
      <div className="space-y-4">
        {Object.entries(groupedByMonth)
          .sort(
            (a, b) =>
              new Date(b[1][0].scheduledAt!).getTime() -
              new Date(a[1][0].scheduledAt!).getTime(),
          )
          .map(([month, monthInterviews]) => (
            <div
              key={month}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <h3 className="text-sm font-bold text-slate-900 mb-3.5">
                {month}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {monthInterviews
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(a.scheduledAt!).getTime() -
                      new Date(b.scheduledAt!).getTime(),
                  )
                  .map((interview) => {
                    const statusCfg = getStatusConfig(interview);
                    return (
                      <div
                        key={interview.id}
                        onClick={() => onGoTo(interview)}
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer"
                      >
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex flex-col items-center justify-center">
                          <span className="text-[8px] font-bold text-blue-500 uppercase leading-none">
                            {formatWeekday(interview.scheduledAt!)}
                          </span>
                          <span className="text-sm font-bold text-blue-700 leading-none mt-0.5">
                            {formatDayNumber(interview.scheduledAt!)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {interview.title || "Interview"}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                            />
                            <p className="text-xs text-slate-400">
                              {statusCfg.label} · {formatTime(interview.scheduledAt!)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
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