import { AlertCircle, CheckCircle2, XCircle, Hourglass } from "lucide-react";
import type { GetCandidateInterviewDetailsResponse } from "@/module/interview/types/candidateInterview.types"; 
import { CandidateResponseStatus, InterviewStatus } from "@/module/interview/types/interview.types"; 

interface StatusBannerProps {
  details: GetCandidateInterviewDetailsResponse;
  pendingResponse: boolean;
  onRespond: () => void;
}

export default function StatusBanner({
  details,
  pendingResponse,
  onRespond,
}: StatusBannerProps) {
  if (pendingResponse) {
    return (
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-amber-700">
            This interview needs your response
          </p>
          <p className="text-sm text-amber-700 mt-0.5">
            Let the recruiter know if you can make it.
          </p>
        </div>
        <button
          onClick={onRespond}
          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors"
        >
          Respond
        </button>
      </div>
    );
  }

  if (details.status === InterviewStatus.CANCELLED) {
    return (
      <div className="bg-red-50 rounded-2xl border border-red-200 p-5 flex gap-3">
        <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-red-700">
            🔴 This interview was cancelled
          </p>
          {details.cancelledReason && (
            <p className="text-sm text-red-700 mt-0.5">
              {details.cancelledReason}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (details.rescheduleRequested) {
    return (
      <div className="bg-violet-50 rounded-2xl border border-violet-200 p-5 flex gap-3">
        <Hourglass size={18} className="text-violet-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-violet-700">
            Reschedule request sent
          </p>
          <p className="text-sm text-violet-700 mt-0.5">
            Waiting on the recruiter to review.
          </p>
        </div>
      </div>
    );
  }

  if (details.candidateResponseStatus === CandidateResponseStatus.ACCEPTED) {
    return (
      <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 flex items-center gap-3">
        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
        <p className="text-sm font-semibold text-emerald-700">
          🟢 You're all set — we'll remind you before the interview.
        </p>
      </div>
    );
  }

  return null;
}