import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useCountdown } from "@/module/interview/hooks/common/Usecountdown";
import { useJoinButtonState } from "@/module/interview/hooks/common/Usejoinbuttonstate";
import type { GetCandidateInterviewDetailsResponse } from "@/module/interview/types/candidateInterview.types";
import {
  formatShortDate,
  formatTime,
  formatDuration,
} from "./Interviewdetails.helpers";

interface InterviewHeroProps {
  details: GetCandidateInterviewDetailsResponse;
  isOnline: boolean;
  joining: boolean;
  onJoin: () => void;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function InterviewHero({
  details,
  isOnline,
  joining,
  onJoin,
}: InterviewHeroProps) {
  const { state } = useJoinButtonState(details);
  const scheduleCountdown = useCountdown(
    state === "too-early" ? details.scheduledAt : undefined,
    details.durationInMinutes,
  );
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {state === "live" && (
        <span className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />
      )}

      <div className="p-6 sm:p-8">
        <p className="text-sm font-medium text-slate-400 mb-1">
          👋 {getGreeting()}
        </p>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          {details.title}
        </h1>

        <p className="text-sm text-slate-500 mt-1">Round {details.round}</p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} /> {formatShortDate(details.scheduledAt)}
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {formatTime(details.scheduledAt)} ·{" "}
            {formatDuration(details.durationInMinutes)}
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1">
            {isOnline ? <Video size={12} /> : <MapPin size={12} />}
            {isOnline ? "Online" : details.location || "In-person"}
          </span>
        </div>

        {isOnline && (
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 px-5 py-5">
            {state === "too-early" && (
              <>
                <p className="text-xs font-semibold text-slate-500 mb-2">
                  🟡 Room opens in
                </p>
                <p className="text-3xl font-bold tabular-nums text-slate-800 mb-4">
                  {scheduleCountdown.label}
                </p>
                <button
                  disabled
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg bg-slate-200 text-slate-400 cursor-not-allowed"
                >
                  Join interview
                </button>
              </>
            )}

            {state === "ready" && (
              <>
                <p className="text-xs font-semibold text-emerald-600 mb-2">
                  🟢 Room is ready
                </p>
                <button
                  onClick={onJoin}
                  disabled={joining}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-sm shadow-indigo-200 transition-all"
                >
                  {joining ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ExternalLink size={16} />
                  )}
                  Join interview
                </button>
              </>
            )}

            {state === "live" && (
              <>
                <p className="text-xs font-semibold text-emerald-600 mb-2 inline-flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Live now
                </p>
                <button
                  onClick={onJoin}
                  disabled={joining}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-sm shadow-indigo-200 transition-all"
                >
                  {joining ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ExternalLink size={16} />
                  )}
                  Join now
                </button>
              </>
            )}

            {state === "joined" && (
              <p className="text-sm font-semibold text-emerald-700">
                ✓ You joined at {formatTime(details.candidateJoinedAt!)}
              </p>
            )}

            {state === "completed" && (
              <p className="text-sm font-medium text-slate-500">
                This interview has ended.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
