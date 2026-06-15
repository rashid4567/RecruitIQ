import { ApplicationStatus } from "@/module/job-application/domain/entity/job-application.entity";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  SHORTLISTED: "Shortlisted",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  SELECTED: "Selected",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  APPLIED: "bg-blue-50 text-blue-700 border border-blue-200",
  SHORTLISTED: "bg-amber-50 text-amber-700 border border-amber-200",
  INTERVIEW_SCHEDULED: "bg-purple-50 text-purple-700 border border-purple-200",
  SELECTED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  REJECTED: "bg-red-50 text-red-600 border border-red-200",
  WITHDRAWN: "bg-slate-100 text-slate-500 border border-slate-200",
};

export const STATUS_DOT_COLORS: Record<ApplicationStatus, string> = {
  APPLIED: "bg-blue-500",
  SHORTLISTED: "bg-amber-500",
  INTERVIEW_SCHEDULED: "bg-purple-500",
  SELECTED: "bg-emerald-500",
  REJECTED: "bg-red-500",
  WITHDRAWN: "bg-slate-400",
};

export const ROW_BG_CLASSES: Record<ApplicationStatus, string> = {
  APPLIED: "bg-blue-50/40",
  SHORTLISTED: "bg-amber-50/40",
  INTERVIEW_SCHEDULED: "bg-purple-50/40",
  SELECTED: "bg-emerald-50/40",
  REJECTED: "bg-red-50/40",
  WITHDRAWN: "bg-slate-50",
};

export const ROW_BG_HOVER_CLASSES: Record<ApplicationStatus, string> = {
  APPLIED: "hover:bg-blue-50/70",
  SHORTLISTED: "hover:bg-amber-50/70",
  INTERVIEW_SCHEDULED: "hover:bg-purple-50/70",
  SELECTED: "hover:bg-emerald-50/70",
  REJECTED: "hover:bg-red-50/70",
  WITHDRAWN: "hover:bg-slate-100/60",
};

export const ALL_STATUSES = Object.keys(
  ApplicationStatus,
) as ApplicationStatus[];
