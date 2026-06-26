import { Trophy, ShieldCheck, AlertCircle, XCircle } from "lucide-react";
import {
  ApplicationStatus,
  ApplicationRecommendation,
} from "../../../types/jobApplication.types"

export type DS =
  | "Applied"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected"
  | "Withdrawn";

export type ModalAction =
  | "shortlist"
  | "interview"
  | "select"
  | "reject"
  | null;

export interface ModalConfig {
  title: string;
  description: string;
  confirmLabel: string;
  confirmClass: string;
  Icon: React.ElementType;
  iconClass: string;
  requireReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
}

export type RecruiterApplicationStatus =
  | typeof ApplicationStatus.SHORTLISTED
  | typeof ApplicationStatus.INTERVIEW_SCHEDULED
  | typeof ApplicationStatus.SELECTED
  | typeof ApplicationStatus.REJECTED;

export interface UpdateApplicationStatusDTO {
  applicationId: string;
  status: RecruiterApplicationStatus;
  rejectionReason?: string;
}

export const PIPELINE: DS[] = [
  "Applied",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
];

export const SM: Record<
  DS,
  { color: string; bg: string; border: string; dot: string; ring: string }
> = {
  Applied: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
    ring: "ring-blue-200",
  },
  Shortlisted: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
  },
  "Interview Scheduled": {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    ring: "ring-amber-200",
  },
  Selected: {
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
    ring: "ring-violet-200",
  },
  Rejected: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    ring: "ring-red-200",
  },
  Withdrawn: {
    color: "text-slate-500",
    bg: "bg-slate-100",
    border: "border-slate-200",
    dot: "bg-slate-400",
    ring: "ring-slate-200",
  },
};

export const RM: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    bar: string;
    fill: string;
    pct: number;
    Icon: React.ElementType;
  }
> = {
  [ApplicationRecommendation.STRONG_MATCH]: {
    label: "Strong Match",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    bar: "bg-emerald-100",
    fill: "bg-emerald-500",
    pct: 95,
    Icon: Trophy,
  },
  [ApplicationRecommendation.GOOD_MATCH]: {
    label: "Good Match",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    bar: "bg-blue-100",
    fill: "bg-blue-500",
    pct: 72,
    Icon: ShieldCheck,
  },
  [ApplicationRecommendation.PARTIAL_MATCH]: {
    label: "Partial Match",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    bar: "bg-amber-100",
    fill: "bg-amber-400",
    pct: 45,
    Icon: AlertCircle,
  },
  [ApplicationRecommendation.POOR_MATCH]: {
    label: "Poor Match",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    bar: "bg-red-100",
    fill: "bg-red-500",
    pct: 18,
    Icon: XCircle,
  },
};

export const ACTION_TO_STATUS: Record<
  Exclude<ModalAction, null>,
  RecruiterApplicationStatus
> = {
  shortlist: ApplicationStatus.SHORTLISTED,
  interview: ApplicationStatus.INTERVIEW_SCHEDULED,
  select: ApplicationStatus.SELECTED,
  reject: ApplicationStatus.REJECTED,
};
