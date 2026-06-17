import { ApplicationStatus } from "../../../../domain/entity/job-application.entity";

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const timeAgo = (iso: string): string => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

export const formatInterview = (iso?: string): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export type StatusCfg = {
  label: string;
  dot: string;
  pill: string;
  text: string;
};

export const STATUS_CFG: Record<ApplicationStatus, StatusCfg> = {
  [ApplicationStatus.APPLIED]: {
    label: "Applied",
    dot: "bg-sky-400",
    pill: "bg-sky-50 border border-sky-200",
    text: "text-sky-700",
  },
  [ApplicationStatus.SHORTLISTED]: {
    label: "Shortlisted",
    dot: "bg-violet-400",
    pill: "bg-violet-50 border border-violet-200",
    text: "text-violet-700",
  },
  [ApplicationStatus.INTERVIEW_SCHEDULED]: {
    label: "Interview Scheduled",
    dot: "bg-blue-500",
    pill: "bg-blue-50 border border-blue-200",
    text: "text-blue-700",
  },
  [ApplicationStatus.SELECTED]: {
    label: "Offer Extended",
    dot: "bg-emerald-400",
    pill: "bg-emerald-50 border border-emerald-200",
    text: "text-emerald-700",
  },
  [ApplicationStatus.REJECTED]: {
    label: "Rejected",
    dot: "bg-red-400",
    pill: "bg-red-50 border border-red-200",
    text: "text-red-600",
  },
  [ApplicationStatus.WITHDRAWN]: {
    label: "Withdrawn",
    dot: "bg-gray-300",
    pill: "bg-gray-100 border border-gray-200",
    text: "text-gray-400",
  },
};

export const canWithdraw = (s: ApplicationStatus): boolean =>
  s === ApplicationStatus.APPLIED ||
  s === ApplicationStatus.SHORTLISTED ||
  s === ApplicationStatus.INTERVIEW_SCHEDULED;
