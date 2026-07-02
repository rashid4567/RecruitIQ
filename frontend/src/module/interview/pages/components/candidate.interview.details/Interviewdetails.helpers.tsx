import {
  Calendar,
  Circle,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { GetCandidateInterviewDetailsResponse } from "@/module/interview/types/candidateInterview.types";

import type { StatusConfig } from "./Interviewdetails.types";
import { CandidateResponseStatus, InterviewMode, InterviewStatus } from "@/module/interview/types/interview.types";

export function formatDateLabel(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDuration(minutes?: number): string {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

function escapeIcs(text: string): string {
  return text.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
}

function toIcsTimestamp(d: Date): string {
  return `${d.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

export function buildIcsContent(
  details: GetCandidateInterviewDetailsResponse,
): string {
  const start = new Date(details.scheduledAt);
  const end = new Date(start.getTime() + details.durationInMinutes * 60000);
  const locationOrLink =
    details.mode === InterviewMode.ONLINE
      ? (details.meetingLink ?? "")
      : (details.location ?? "");
  const descriptionParts = [
    details.description ?? "",
    details.mode === InterviewMode.ONLINE && details.meetingLink
      ? `Meeting link: ${details.meetingLink}`
      : "",
  ].filter(Boolean);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RecruitIQ//Interview//EN",
    "BEGIN:VEVENT",
    `UID:${details.id}@recruitiq`,
    `DTSTAMP:${toIcsTimestamp(new Date())}`,
    `DTSTART:${toIcsTimestamp(start)}`,
    `DTEND:${toIcsTimestamp(end)}`,
    `SUMMARY:${escapeIcs(details.title)}`,
    descriptionParts.length
      ? `DESCRIPTION:${escapeIcs(descriptionParts.join("\n"))}`
      : "",
    locationOrLink ? `LOCATION:${escapeIcs(locationOrLink)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.filter(Boolean).join("\r\n");
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  [InterviewStatus.SCHEDULED]: {
    label: "Scheduled",
    pill: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    dot: "bg-indigo-500",
    ring: "ring-indigo-100",
    icon: <Calendar size={12} />,
  },
  [InterviewStatus.RESCHEDULED]: {
    label: "Rescheduled",
    pill: "bg-violet-50 text-violet-700 border border-violet-200",
    dot: "bg-violet-500",
    ring: "ring-violet-100",
    icon: <Calendar size={12} />,
  },
  [InterviewStatus.ONGOING]: {
    label: "Live now",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    ring: "ring-emerald-100",
    icon: <Circle size={10} />,
  },
  [InterviewStatus.COMPLETED]: {
    label: "Completed",
    pill: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
    ring: "ring-slate-100",
    icon: <CheckCircle2 size={12} />,
  },
  [InterviewStatus.CANCELLED]: {
    label: "Cancelled",
    pill: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    ring: "ring-red-100",
    icon: <XCircle size={12} />,
  },
  [InterviewStatus.NO_SHOW]: {
    label: "No show",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    ring: "ring-amber-100",
    icon: <AlertCircle size={12} />,
  },
};

export function getStatusConfig(status?: InterviewStatus): StatusConfig {
  return (
    STATUS_CONFIG[status ?? ""] ?? {
      label: "Pending",
      pill: "bg-slate-50 text-slate-500 border border-slate-200",
      dot: "bg-slate-300",
      ring: "ring-slate-100",
      icon: <Circle size={10} />,
    }
  );
}


export const RESPONSE_CONFIG: Record<
  string,
  { label: string; pill: string; dot: string }
> = {
  [CandidateResponseStatus.PENDING]: {
    label: "Awaiting your response",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  [CandidateResponseStatus.ACCEPTED]: {
    label: "You accepted",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  [CandidateResponseStatus.DECLINED]: {
    label: "You declined",
    pill: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
  },
};

export function getResponseConfig(status?: string) {
  return RESPONSE_CONFIG[status ?? ""] ?? null;
}

export const ACTIVE_STATUSES: string[] = [
  InterviewStatus.SCHEDULED,
  InterviewStatus.RESCHEDULED,
  InterviewStatus.ONGOING,
];
export const MODIFIABLE_STATUSES: string[] = [
  InterviewStatus.SCHEDULED,
  InterviewStatus.RESCHEDULED,
];
export const JOINABLE_WINDOW_MS = 15 * 60 * 1000;

export function canJoinNow(
  details: GetCandidateInterviewDetailsResponse,
  now: number,
): boolean {
  if (details.mode !== InterviewMode.ONLINE || !details.meetingLink)
    return false;
  if (details.status === InterviewStatus.ONGOING) return true;
  if (!ACTIVE_STATUSES.includes(details.status)) return false;
  const start = new Date(details.scheduledAt).getTime();
  const duration = details.durationInMinutes * 60 * 1000;
  return now >= start - JOINABLE_WINDOW_MS && now <= start + duration;
}

export function getCountdownLabel(
  details: GetCandidateInterviewDetailsResponse,
  now: number,
): string | null {
  if (!ACTIVE_STATUSES.includes(details.status)) return null;
  if (details.status === InterviewStatus.ONGOING) return "Live now";

  const start = new Date(details.scheduledAt).getTime();
  const diffMs = start - now;

  if (diffMs <= 0) {
    const end = start + details.durationInMinutes * 60 * 1000;
    return now <= end ? "In progress" : null;
  }

  const totalMinutes = Math.round(diffMs / 60000);
  if (totalMinutes < 1) return "Starting now";
  if (totalMinutes < 60) return `Starts in ${totalMinutes}m`;

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours < 24) return `Starts in ${hours}h${mins ? ` ${mins}m` : ""}`;

  const days = Math.floor(hours / 24);
  return `Starts in ${days}d`;
}


export function needsResponse(
  details: GetCandidateInterviewDetailsResponse,
): boolean {
  return (
    ACTIVE_STATUSES.includes(details.status) &&
    details.candidateResponseStatus === CandidateResponseStatus.PENDING
  );
}

export function canRequestReschedule(
  details: GetCandidateInterviewDetailsResponse,
): boolean {
  if (typeof details.canReschedule === "boolean") return details.canReschedule;
  if (details.rescheduleRequested) return false;
  return MODIFIABLE_STATUSES.includes(details.status);
}