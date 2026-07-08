import {
  InterviewMode,
  InterviewStatus,
} from "@/module/interview/types/interview.types";

export const JOINABLE_WINDOW_MS = 15 * 60 * 1000;
export const DEFAULT_DURATION_MINUTES = 60;
export const ACTIVE_STATUSES: InterviewStatus[] = [
  InterviewStatus.SCHEDULED,
  InterviewStatus.RESCHEDULED,
  InterviewStatus.ONGOING,
];

export interface JoinableInterview {
  mode?: InterviewMode | string;
  interviewStatus?: InterviewStatus;
  status?: InterviewStatus;
  scheduledAt?: string;
  durationInMinutes?: number;
  interviewId?: string;
  roomId?: string;
}

function getStatus(interview: JoinableInterview): InterviewStatus | undefined {
  return interview.interviewStatus ?? interview.status;
}

function isOnlineInterview(interview: JoinableInterview): boolean {
  return interview.mode === InterviewMode.ONLINE || !!interview.roomId;
}

function getWindow(interview: JoinableInterview) {
  if (!interview.scheduledAt) {
    return null;
  }
  const start = new Date(interview.scheduledAt).getTime();
  const duration =
    (interview.durationInMinutes ?? DEFAULT_DURATION_MINUTES) * 60 * 1000;
  return {
    start,
    opensAt: start - JOINABLE_WINDOW_MS,
    end: start + duration,
  };
}

export function canJoinNow(interview: JoinableInterview): boolean {
  if (!isOnlineInterview(interview)) {
    return false;
  }
  const status = getStatus(interview);
  if (!status) {
    return false;
  }
  if (
    status === InterviewStatus.CANCELLED ||
    status === InterviewStatus.COMPLETED ||
    status === InterviewStatus.NO_SHOW
  ) {
    return false;
  }
  if (status === InterviewStatus.ONGOING) {
    return true;
  }
  if (!ACTIVE_STATUSES.includes(status)) {
    return false;
  }
  const window = getWindow(interview);
  if (!window) {
    return false;
  }
  const now = Date.now();
  return now >= window.opensAt && now <= window.end;
}

export function isJoinWindowClosed(interview: JoinableInterview): boolean {
  const status = getStatus(interview);
  if (status === InterviewStatus.ONGOING) {
    return false;
  }
  const window = getWindow(interview);
  if (!window) {
    return false;
  }
  return Date.now() > window.end;
}

export function getJoinCountdown(interview: JoinableInterview): string | null {
  const window = getWindow(interview);
  if (!window) {
    return null;
  }
  const remaining = window.opensAt - Date.now();
  if (remaining <= 0) {
    return null;
  }
  const totalMinutes = Math.ceil(remaining / 60000);
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${totalMinutes}m`;
}

export function isWithinModifiableWindow(
  interview: JoinableInterview,
): boolean {
  const window = getWindow(interview);
  if (!window) {
    return false;
  }
  return Date.now() < window.opensAt;
}
