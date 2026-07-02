import { CandidateResponseStatus, InterviewStatus } from "@/module/interview/types/interview.types";
import type { StatusConfig } from "./Types";
import type { GetCandidateInterviewsResponse } from "@/module/interview/types/candidateInterview.types";


export const STATUS_CONFIG: Record<string, StatusConfig> = {
  [InterviewStatus.SCHEDULED]: {
    label: "Scheduled",
    pill: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
  },
  [InterviewStatus.RESCHEDULED]: {
    label: "Rescheduled",
    pill: "bg-violet-50 text-violet-700 border border-violet-200",
    dot: "bg-violet-500",
    bar: "bg-violet-500",
  },
  [InterviewStatus.ONGOING]: {
    label: "Live now",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  [InterviewStatus.COMPLETED]: {
    label: "Completed",
    pill: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
    bar: "bg-slate-400",
  },
  [InterviewStatus.CANCELLED]: {
    label: "Cancelled",
    pill: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    bar: "bg-red-500",
  },
  [InterviewStatus.NO_SHOW]: {
    label: "No Show",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
};

export const DEFAULT_STATUS_CONFIG: StatusConfig = {
  label: "Pending",
  pill: "bg-slate-50 text-slate-500 border border-slate-200",
  dot: "bg-slate-300",
  bar: "bg-slate-300",
};

export function getStatusConfig(
  interview: GetCandidateInterviewsResponse,
): StatusConfig {
  return STATUS_CONFIG[interview.status ?? ""] ?? DEFAULT_STATUS_CONFIG;
}


export const RESPONSE_CONFIG: Record<string, StatusConfig> = {
  [CandidateResponseStatus.PENDING]: {
    label: "Awaiting your response",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  [CandidateResponseStatus.ACCEPTED]: {
    label: "You accepted",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  [CandidateResponseStatus.DECLINED]: {
    label: "You declined",
    pill: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    bar: "bg-red-500",
  },
};

export function getResponseConfig(
  interview: GetCandidateInterviewsResponse,
): StatusConfig | null {
  return RESPONSE_CONFIG[interview.candidateResponseStatus ?? ""] ?? null;
}