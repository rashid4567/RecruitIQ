import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";

export const STATUS_LABELS: Record<
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus],
  string
> = {
  [ApplicationStatus.APPLIED]: "Applied",
  [ApplicationStatus.SHORTLISTED]: "Shortlisted",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "Interview Scheduled",
  [ApplicationStatus.SELECTED]: "Selected",
  [ApplicationStatus.REJECTED]: "Rejected",
  [ApplicationStatus.WITHDRAWN]: "Withdrawn",
};

export const STATUS_COLORS: Record<
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus],
  string
> = {
  [ApplicationStatus.APPLIED]:
    "bg-blue-50 text-blue-700 border border-blue-200",
  [ApplicationStatus.SHORTLISTED]:
    "bg-amber-50 text-amber-700 border border-amber-200",
  [ApplicationStatus.INTERVIEW_SCHEDULED]:
    "bg-purple-50 text-purple-700 border border-purple-200",
  [ApplicationStatus.SELECTED]:
    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  [ApplicationStatus.REJECTED]:
    "bg-red-50 text-red-600 border border-red-200",
  [ApplicationStatus.WITHDRAWN]:
    "bg-slate-100 text-slate-500 border border-slate-200",
};

export const STATUS_DOT_COLORS: Record<
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus],
  string
> = {
  [ApplicationStatus.APPLIED]: "bg-blue-500",
  [ApplicationStatus.SHORTLISTED]: "bg-amber-500",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "bg-purple-500",
  [ApplicationStatus.SELECTED]: "bg-emerald-500",
  [ApplicationStatus.REJECTED]: "bg-red-500",
  [ApplicationStatus.WITHDRAWN]: "bg-slate-400",
};

export const ROW_BG_CLASSES: Record<
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus],
  string
> = {
  [ApplicationStatus.APPLIED]: "bg-blue-50/40",
  [ApplicationStatus.SHORTLISTED]: "bg-amber-50/40",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "bg-purple-50/40",
  [ApplicationStatus.SELECTED]: "bg-emerald-50/40",
  [ApplicationStatus.REJECTED]: "bg-red-50/40",
  [ApplicationStatus.WITHDRAWN]: "bg-slate-50",
};

export const ROW_BG_HOVER_CLASSES: Record<
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus],
  string
> = {
  [ApplicationStatus.APPLIED]: "hover:bg-blue-50/70",
  [ApplicationStatus.SHORTLISTED]: "hover:bg-amber-50/70",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "hover:bg-purple-50/70",
  [ApplicationStatus.SELECTED]: "hover:bg-emerald-50/70",
  [ApplicationStatus.REJECTED]: "hover:bg-red-50/70",
  [ApplicationStatus.WITHDRAWN]: "hover:bg-slate-100/60",
};

export const ALL_STATUSES = Object.values(ApplicationStatus);