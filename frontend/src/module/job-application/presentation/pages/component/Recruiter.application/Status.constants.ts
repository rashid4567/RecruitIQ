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

export const ALL_STATUSES = Object.keys(ApplicationStatus) as ApplicationStatus[];