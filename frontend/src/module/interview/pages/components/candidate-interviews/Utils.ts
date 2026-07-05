import type { GetCandidateInterviewsResponse } from "@/module/interview/types/candidateInterview.types";

import type { ModeFilter, StatusFilter } from "./Types";
import {
  CandidateResponseStatus,
  InterviewMode,
  InterviewStatus,
} from "@/module/interview/types/interview.types";

export const ITEMS_PER_PAGE = 6;
export const PAGE_WINDOW = 1;
export const JOINABLE_WINDOW_MS = 15 * 60 * 1000;

export const ACTIVE_STATUSES: string[] = [
  InterviewStatus.SCHEDULED,
  InterviewStatus.RESCHEDULED,
  InterviewStatus.ONGOING,
];
export const TERMINAL_STATUSES: string[] = [
  InterviewStatus.COMPLETED,
  InterviewStatus.CANCELLED,
  InterviewStatus.NO_SHOW,
];

export function normalizeToArray(
  result: unknown,
): GetCandidateInterviewsResponse[] {
  if (Array.isArray(result)) return result;
  if (result && typeof result === "object") {
    const maybe = result as {
      data?: unknown;
      items?: unknown;
      results?: unknown;
    };
    if (Array.isArray(maybe.data))
      return maybe.data as GetCandidateInterviewsResponse[];
    if (Array.isArray(maybe.items))
      return maybe.items as GetCandidateInterviewsResponse[];
    if (Array.isArray(maybe.results))
      return maybe.results as GetCandidateInterviewsResponse[];
  }
  return [];
}

export function inferMode(
  interview: GetCandidateInterviewsResponse,
): InterviewMode {
  if (interview.location) return InterviewMode.OFFLINE;
  return InterviewMode.ONLINE;
}

export function isScheduledInterview(
  interview: GetCandidateInterviewsResponse,
): boolean {
  return Boolean(interview.id && interview.scheduledAt);
}

export function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonthLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatDayNumber(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric" });
}

export function formatWeekday(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelative(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const minutes = Math.round(abs / 60000);
  const hours = Math.round(abs / 3600000);
  const days = Math.round(abs / 86400000);

  let label: string;
  if (minutes < 60) label = `${Math.max(minutes, 1)}m`;
  else if (hours < 24) label = `${hours}h`;
  else label = `${days}d`;

  return diffMs >= 0 ? `in ${label}` : `${label} ago`;
}

export function isUpcoming(interview: GetCandidateInterviewsResponse): boolean {
  if (!isScheduledInterview(interview) || !interview.scheduledAt) return false;
  if (interview.status === InterviewStatus.ONGOING) return true;
  if (!ACTIVE_STATUSES.includes(interview.status ?? "")) return false;
  return new Date(interview.scheduledAt).getTime() > Date.now();
}

export function isPast(interview: GetCandidateInterviewsResponse): boolean {
  if (!isScheduledInterview(interview) || !interview.scheduledAt) return false;
  if (TERMINAL_STATUSES.includes(interview.status ?? "")) return true;
  return new Date(interview.scheduledAt).getTime() <= Date.now();
}

export function canRequestReschedule(
  interview: GetCandidateInterviewsResponse,
): boolean {
  if (!isUpcoming(interview)) return false;
  if (interview.rescheduleRequested) return false;
  const modifiableStatuses: string[] = [
    InterviewStatus.SCHEDULED,
    InterviewStatus.RESCHEDULED,
  ];
  return modifiableStatuses.includes(interview.status ?? "");
}

export function needsResponse(
  interview: GetCandidateInterviewsResponse,
): boolean {
  return (
    isUpcoming(interview) &&
    interview.candidateResponseStatus === CandidateResponseStatus.PENDING
  );
}

export function canJoinNow(interview: GetCandidateInterviewsResponse): boolean {
  if (inferMode(interview) !== InterviewMode.ONLINE) return false;
  if (interview.status === InterviewStatus.ONGOING) return true;
  if (!ACTIVE_STATUSES.includes(interview.status ?? "")) return false;
  const start = new Date(interview.scheduledAt).getTime();
  const duration = (interview.durationInMinutes ?? 60) * 60 * 1000;
  const now = Date.now();
  return now >= start - JOINABLE_WINDOW_MS && now <= start + duration;
}

export function groupByDate(
  interviews: GetCandidateInterviewsResponse[],
): Record<string, GetCandidateInterviewsResponse[]> {
  const groups: Record<string, GetCandidateInterviewsResponse[]> = {};
  for (const interview of interviews) {
    if (!interview.scheduledAt) continue;
    const label = formatDateLabel(interview.scheduledAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(interview);
  }
  return groups;
}

export function groupByMonth(
  interviews: GetCandidateInterviewsResponse[],
): Record<string, GetCandidateInterviewsResponse[]> {
  const groups: Record<string, GetCandidateInterviewsResponse[]> = {};
  for (const interview of interviews) {
    if (!interview.scheduledAt) continue;
    const label = formatMonthLabel(interview.scheduledAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(interview);
  }
  return groups;
}

export function matchesFilters(
  interview: GetCandidateInterviewsResponse,
  search: string,
  status: StatusFilter,
  mode: ModeFilter,
): boolean {
  if (status !== "ALL" && interview.status !== status) return false;
  if (mode !== "ALL" && inferMode(interview) !== mode) return false;
  if (search.trim()) {
    const needle = search.trim().toLowerCase();
    const haystack = `${interview.title ?? ""}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export function buildPageSequence(
  current: number,
  total: number,
  window: number,
): (number | "ellipsis")[] {
  if (total <= 1) return [1];
  const pages = new Set<number>([1, total, current]);
  for (let i = 1; i <= window; i++) {
    if (current - i >= 1) pages.add(current - i);
    if (current + i <= total) pages.add(current + i);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(sorted[i]);
  }
  return result;
}
