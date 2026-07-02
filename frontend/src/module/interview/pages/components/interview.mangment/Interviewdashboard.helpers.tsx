import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Play, UserX, CheckCircle2 } from "lucide-react";
import type { RecruiterInterviewItem } from "@/module/interview/types/recruiterInterview.types";
import { InterviewStatus } from "@/module/interview/types/interview.types";
import type {
  Tab,
  StatusFilter,
  ModeFilter,
  StatusConfig,
} from "./Interviewdashboard.types";

export const ITEMS_PER_PAGE = 8;
export const SEARCH_DEBOUNCE_MS = 300;

export function toInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}

export const CANDIDATE_GRADIENTS = [
  "from-orange-500 to-orange-600",
  "from-purple-500 to-purple-600",
  "from-blue-500 to-blue-600",
  "from-green-500 to-green-600",
  "from-cyan-500 to-cyan-600",
  "from-pink-500 to-pink-600",
  "from-indigo-500 to-indigo-600",
  "from-teal-500 to-teal-600",
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++)
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function candidateGradient(id: string) {
  return CANDIDATE_GRADIENTS[hashString(id) % CANDIDATE_GRADIENTS.length];
}

export function formatScheduledAt(scheduledAt?: string): {
  date: string;
  time: string;
} {
  if (!scheduledAt) return { date: "—", time: "—" };
  const d = new Date(scheduledAt);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

export function formatFullDateTime(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isToday(scheduledAt?: string): boolean {
  if (!scheduledAt) return false;
  return new Date(scheduledAt).toDateString() === new Date().toDateString();
}

export function isInterviewScheduled(interview: RecruiterInterviewItem): boolean {
  return Boolean(interview.interviewId && interview.scheduledAt);
}

export function isUpcomingInterview(interview: RecruiterInterviewItem): boolean {
  if (!isInterviewScheduled(interview)) return false;
  if (!interview.scheduledAt) return false;
  const activeStatuses: string[] = [
    InterviewStatus.SCHEDULED,
    InterviewStatus.RESCHEDULED,
  ];
  return (
    new Date(interview.scheduledAt) > new Date() &&
    activeStatuses.includes(interview.interviewStatus ?? "")
  );
}

export function canModifyInterview(interview: RecruiterInterviewItem): boolean {
  if (!isInterviewScheduled(interview)) return false;
  const modifiableStatuses: string[] = [
    InterviewStatus.SCHEDULED,
    InterviewStatus.RESCHEDULED,
  ];
  return modifiableStatuses.includes(interview.interviewStatus ?? "");
}

export function hasPendingRescheduleRequest(
  interview: RecruiterInterviewItem,
): boolean {
  return (
    Boolean(interview.rescheduleRequested) && canModifyInterview(interview)
  );
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  [InterviewStatus.SCHEDULED]: {
    label: "Scheduled",
    pill: "bg-blue-50 text-blue-700 border border-blue-200",
    bgIcon: "bg-blue-100",
    dot: "bg-blue-500",
  },
  [InterviewStatus.RESCHEDULED]: {
    label: "Rescheduled",
    pill: "bg-violet-50 text-violet-700 border border-violet-200",
    bgIcon: "bg-violet-100",
    dot: "bg-violet-500",
  },
  [InterviewStatus.ONGOING]: {
    label: "Ongoing",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    bgIcon: "bg-emerald-100",
    dot: "bg-emerald-500",
  },
  [InterviewStatus.COMPLETED]: {
    label: "Completed",
    pill: "bg-slate-100 text-slate-600 border border-slate-200",
    bgIcon: "bg-slate-100",
    dot: "bg-slate-400",
  },
  [InterviewStatus.CANCELLED]: {
    label: "Cancelled",
    pill: "bg-red-50 text-red-700 border border-red-200",
    bgIcon: "bg-red-100",
    dot: "bg-red-500",
  },
  [InterviewStatus.NO_SHOW]: {
    label: "No Show",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    bgIcon: "bg-amber-100",
    dot: "bg-amber-500",
  },
};

export const NOT_SCHEDULED_CONFIG: StatusConfig = {
  label: "Not Scheduled",
  pill: "bg-slate-50 text-slate-500 border border-slate-200 border-dashed",
  bgIcon: "bg-slate-100",
  dot: "bg-slate-300",
};

export function getStatusConfig(interview: RecruiterInterviewItem): StatusConfig {
  if (!isInterviewScheduled(interview)) return NOT_SCHEDULED_CONFIG;
  return (
    STATUS_CONFIG[interview.interviewStatus ?? ""] ?? {
      label: "Pending",
      pill: "bg-slate-50 text-slate-500 border border-slate-200",
      bgIcon: "bg-slate-100",
      dot: "bg-slate-300",
    }
  );
}

export const STATUS_TRANSITIONS: Record<
  string,
  { status: InterviewStatus; label: string; icon: ReactNode }[]
> = {
  [InterviewStatus.SCHEDULED]: [
    {
      status: InterviewStatus.ONGOING,
      label: "Mark as Ongoing",
      icon: <Play size={13} />,
    },
    {
      status: InterviewStatus.NO_SHOW,
      label: "Mark No-Show",
      icon: <UserX size={13} />,
    },
  ],
  [InterviewStatus.RESCHEDULED]: [
    {
      status: InterviewStatus.ONGOING,
      label: "Mark as Ongoing",
      icon: <Play size={13} />,
    },
    {
      status: InterviewStatus.NO_SHOW,
      label: "Mark No-Show",
      icon: <UserX size={13} />,
    },
  ],
  [InterviewStatus.ONGOING]: [
    {
      status: InterviewStatus.COMPLETED,
      label: "Mark Completed",
      icon: <CheckCircle2 size={13} />,
    },
    {
      status: InterviewStatus.NO_SHOW,
      label: "Mark No-Show",
      icon: <UserX size={13} />,
    },
  ],
  [InterviewStatus.COMPLETED]: [],
  [InterviewStatus.CANCELLED]: [],
  [InterviewStatus.NO_SHOW]: [],
};

export function filterByTab(
  interviews: RecruiterInterviewItem[],
  tab: Tab,
): RecruiterInterviewItem[] {
  const now = new Date();
  switch (tab) {
    case "upcoming":
      return interviews.filter(
        (i) => i.scheduledAt && new Date(i.scheduledAt) > now,
      );
    case "today":
      return interviews.filter((i) => isToday(i.scheduledAt));
    case "reschedule":
      return interviews.filter((i) => hasPendingRescheduleRequest(i));
    default:
      return interviews;
  }
}

export const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "not_scheduled", label: "Not Scheduled" },
  { value: InterviewStatus.SCHEDULED, label: "Scheduled" },
  { value: InterviewStatus.RESCHEDULED, label: "Rescheduled" },
  { value: InterviewStatus.ONGOING, label: "Ongoing" },
  { value: InterviewStatus.COMPLETED, label: "Completed" },
  { value: InterviewStatus.CANCELLED, label: "Cancelled" },
  { value: InterviewStatus.NO_SHOW, label: "No Show" },
];

export const MODE_FILTER_OPTIONS: { value: ModeFilter; label: string }[] = [
  { value: "all", label: "All Modes" },
  { value: "online", label: "Online" },
  { value: "in_person", label: "In-Person" },
];

export function filterByStatus(
  interviews: RecruiterInterviewItem[],
  status: StatusFilter,
): RecruiterInterviewItem[] {
  if (status === "all") return interviews;
  if (status === "not_scheduled")
    return interviews.filter((i) => !isInterviewScheduled(i));
  return interviews.filter(
    (i) => isInterviewScheduled(i) && i.interviewStatus === status,
  );
}

export function filterByMode(
  interviews: RecruiterInterviewItem[],
  mode: ModeFilter,
): RecruiterInterviewItem[] {
  if (mode === "all") return interviews;
  if (mode === "online")
    return interviews.filter((i) => Boolean(i.meetingLink));
  return interviews.filter((i) => !i.meetingLink && Boolean(i.location));
}

export function filterBySearch(
  interviews: RecruiterInterviewItem[],
  query: string,
): RecruiterInterviewItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return interviews;
  return interviews.filter((i) => {
    const candidate = (i.candidateName || "").toLowerCase();
    const email = (i.candidateEmail || "").toLowerCase();
    const job = (i.jobTitle || "").toLowerCase();
    const title = (i.title || "").toLowerCase();
    return (
      candidate.includes(q) ||
      email.includes(q) ||
      job.includes(q) ||
      title.includes(q)
    );
  });
}

export function deriveStats(interviews: RecruiterInterviewItem[]) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayCount = interviews.filter((i) => isToday(i.scheduledAt)).length;
  const thisWeek = interviews.filter(
    (i) => i.scheduledAt && new Date(i.scheduledAt) >= weekAgo,
  ).length;
  const completedThisMonth = interviews.filter(
    (i) =>
      i.interviewStatus === InterviewStatus.COMPLETED &&
      i.scheduledAt &&
      new Date(i.scheduledAt) >= monthStart,
  ).length;
  const pendingFeedback = interviews.filter(
    (i) => i.interviewStatus === InterviewStatus.COMPLETED,
  ).length;
  const pendingReschedules = interviews.filter((i) =>
    hasPendingRescheduleRequest(i),
  ).length;

  const upcoming = interviews
    .filter((i) => i.scheduledAt && new Date(i.scheduledAt) > now)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime(),
    );

  const nextInterview = upcoming[0]?.scheduledAt
    ? new Date(upcoming[0].scheduledAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return {
    todayCount,
    thisWeek,
    completedThisMonth,
    pendingFeedback,
    pendingReschedules,
    nextInterview,
  };
}