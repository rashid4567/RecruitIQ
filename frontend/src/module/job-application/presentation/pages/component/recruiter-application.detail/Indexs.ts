import { ApplicationStatus } from "@/module/job-application/domain/entity/job-application.entity";
import type { DS } from "./Index";

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function fmt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function fmtFull(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mapStatus(s?: string): DS {
  switch (s) {
    case ApplicationStatus.SHORTLISTED:
      return "Shortlisted";
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return "Interview Scheduled";
    case ApplicationStatus.SELECTED:
      return "Selected";
    case ApplicationStatus.REJECTED:
      return "Rejected";
    case ApplicationStatus.WITHDRAWN:
      return "Withdrawn";
    default:
      return "Applied";
  }
}
