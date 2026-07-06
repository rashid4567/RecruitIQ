import { useMemo } from "react";
import { useCountdown } from "./Usecountdown";
import { InterviewStatus } from "../../types/interview.types";
import type { GetCandidateInterviewDetailsResponse } from "../../types/candidateInterview.types";

export type JoinButtonState =
  | "too-early"
  | "ready"
  | "live"
  | "joined"
  | "completed"
  | "unavailable";

interface UseJoinButtonStateResult {
  state: JoinButtonState;
  roomOpenCountdownLabel: string;
  roomOpensAt: Date | null;
}

const TERMINAL_STATUSES: ReadonlySet<InterviewStatus> = new Set([
  InterviewStatus.COMPLETED,
  InterviewStatus.CANCELLED,
  InterviewStatus.NO_SHOW,
]);

export function useJoinButtonState(
  details: GetCandidateInterviewDetailsResponse | null,
  joinWindowMinutes = 15,
): UseJoinButtonStateResult {
  const roomOpensAt = useMemo(() => {
    if (!details) return null;

    return new Date(
      new Date(details.scheduledAt).getTime() - joinWindowMinutes * 60 * 1000,
    );
  }, [details, joinWindowMinutes]);
  const countdown = useCountdown(roomOpensAt?.toISOString());

  let state: JoinButtonState = "unavailable";

  if (!details) {
    state = "unavailable";
  } else if (TERMINAL_STATUSES.has(details.status)) {
    state = "completed";
  } else if (details.candidateJoinedAt) {
    state = "joined";
  } else if (details.status === InterviewStatus.ONGOING) {
    state = "live";
  } else if (!countdown.hasStarted) {
    state = "too-early";
  } else {
    state = "ready";
  }

  return {
    state,
    roomOpenCountdownLabel: countdown.label,
    roomOpensAt,
  };
}
