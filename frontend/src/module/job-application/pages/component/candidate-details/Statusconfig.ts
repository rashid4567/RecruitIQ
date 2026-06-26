import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";

export function statusToStep(status: ApplicationStatus): number {
  switch (status) {
    case ApplicationStatus.APPLIED:
      return 0;
    case ApplicationStatus.SHORTLISTED:
      return 1;
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return 2;
    case ApplicationStatus.SELECTED:
    case ApplicationStatus.REJECTED:
    case ApplicationStatus.WITHDRAWN:
      return 3;
    default:
      return 0;
  }
}

export function getStatusConfig(status: ApplicationStatus) {
  switch (status) {
    case ApplicationStatus.SELECTED:
      return {
        pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
        bar: "bg-emerald-500",
        label: "Selected",
        progress: 100,
      };
    case ApplicationStatus.REJECTED:
      return {
        pill: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
        bar: "bg-red-400",
        label: "Rejected",
        progress: 100,
      };
    case ApplicationStatus.WITHDRAWN:
      return {
        pill: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
        bar: "bg-slate-300",
        label: "Withdrawn",
        progress: 100,
      };
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return {
        pill: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
        bar: "bg-blue-500",
        label: "Interview Scheduled",
        progress: 75,
      };
    case ApplicationStatus.SHORTLISTED:
      return {
        pill: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
        bar: "bg-amber-400",
        label: "Shortlisted",
        progress: 50,
      };
    default:
      return {
        pill: "bg-blue-50 text-blue-600 border-blue-200",
        dot: "bg-blue-400",
        bar: "bg-blue-400",
        label: "Applied",
        progress: 25,
      };
  }
}