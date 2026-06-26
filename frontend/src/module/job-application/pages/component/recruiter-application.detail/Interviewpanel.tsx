import { Calendar, Target, ArrowRight, Clock } from "lucide-react";
import type { InterviewInfo } from "@/module/job-application/types/jobApplication.types";
import { fmtFull } from "./Indexs";
import { Empty } from "./Primitives";

export function InterviewPanel({ iv }: { iv: InterviewInfo }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
        <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Scheduled
          </p>
          <p className="text-sm font-semibold text-slate-900 mt-0.5">
            {fmtFull(iv.scheduledAt)}
          </p>
        </div>
      </div>

      {iv.location && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <Target className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Location
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              {iv.location}
            </p>
          </div>
        </div>
      )}

      {iv.meetingLink && (
        <a
          href={iv.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold shadow-sm shadow-blue-200"
        >
          <span>Join Meeting</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      )}

      {iv.notes && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">
            Notes
          </p>
          <p className="text-xs text-slate-700 leading-relaxed">{iv.notes}</p>
        </div>
      )}
    </div>
  );
}

export function InterviewCard({
  interview,
}: {
  interview: InterviewInfo | undefined;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <Clock className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-bold text-slate-900">Interview Details</h3>
      </div>
      <div className="px-5 py-4">
        {interview ? (
          <InterviewPanel iv={interview} />
        ) : (
          <Empty text="No interview scheduled yet." />
        )}
      </div>
    </div>
  );
}
