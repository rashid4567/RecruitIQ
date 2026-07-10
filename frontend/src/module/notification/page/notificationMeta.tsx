// notificationMeta.tsx
import type { ReactNode } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  FileText,
  Star,
  UserCheck,
  UserX,
  XCircle,
  Briefcase,
} from "lucide-react";

import type { NotificationType } from "../types/notification.types";

export type NotificationCategory =
  | "progress"
  | "success"
  | "attention"
  | "danger"
  | "premium"
  | "verified";

export const categoryStyles: Record<
  NotificationCategory,
  { fg: string; bg: string; ring: string; label: string }
> = {
  progress: {
    fg: "#2F5DE0",
    bg: "#EAF0FE",
    ring: "#C6D7FC",
    label: "In progress",
  },
  success: {
    fg: "#12805C",
    bg: "#E8F6F0",
    ring: "#BFE9D8",
    label: "Success",
  },
  attention: {
    fg: "#B4690E",
    bg: "#FBF0DF",
    ring: "#F2D6A6",
    label: "Needs attention",
  },
  danger: {
    fg: "#C4331F",
    bg: "#FBEAE7",
    ring: "#F3C6BC",
    label: "Not moving forward",
  },
  premium: {
    fg: "#6B3FA0",
    bg: "#F1EAFA",
    ring: "#DBC5F0",
    label: "Membership",
  },
  verified: {
    fg: "#0E7C86",
    bg: "#E6F5F6",
    ring: "#BCE4E7",
    label: "Verification",
  },
};

interface Meta {
  icon: ReactNode;
  category: NotificationCategory;
  eyebrow: string;
  urgent?: boolean;
}

const iconProps = { size: 18, strokeWidth: 2 };

export const notificationMeta: Record<NotificationType, Meta> = {
  JOB_APPLIED: {
    icon: <FileText {...iconProps} />,
    category: "progress",
    eyebrow: "Application",
  },
  APPLICATION_SHORTLISTED: {
    icon: <Star {...iconProps} />,
    category: "attention",
    eyebrow: "Application",
  },
  APPLICATION_SELECTED: {
    icon: <CheckCircle {...iconProps} />,
    category: "success",
    eyebrow: "Application",
  },
  APPLICATION_REJECTED: {
    icon: <XCircle {...iconProps} />,
    category: "danger",
    eyebrow: "Application",
  },
  INTERVIEW_SCHEDULED: {
    icon: <Calendar {...iconProps} />,
    category: "progress",
    eyebrow: "Interview",
    urgent: true,
  },
  INTERVIEW_STARTED: {
    icon: <Calendar {...iconProps} />,
    category: "success",
    eyebrow: "Interview",
    urgent: true,
  },
  INTERVIEW_CANCELLED: {
    icon: <Calendar {...iconProps} />,
    category: "danger",
    eyebrow: "Interview",
  },
  INTERVIEW_RESCHEDULED: {
    icon: <Calendar {...iconProps} />,
    category: "attention",
    eyebrow: "Interview",
    urgent: true,
  },
  INTERVIEW_RESCHEDULE_REQUEST_APPROVED: {
    icon: <CheckCircle {...iconProps} />,
    category: "success",
    eyebrow: "Interview",
  },
  INTERVIEW_RESCHEDULE_REQUEST_REJECTED: {
    icon: <XCircle {...iconProps} />,
    category: "danger",
    eyebrow: "Interview",
  },
  SUBSCRIPTION_CREATED: {
    icon: <Crown {...iconProps} />,
    category: "premium",
    eyebrow: "Plan",
  },
  SUBSCRIPTION_RENEWED: {
    icon: <Crown {...iconProps} />,
    category: "premium",
    eyebrow: "Plan",
  },
  SUBSCRIPTION_UPGRADED: {
    icon: <Crown {...iconProps} />,
    category: "premium",
    eyebrow: "Plan",
  },
  SUBSCRIPTION_EXPIRING: {
    icon: <Clock {...iconProps} />,
    category: "attention",
    eyebrow: "Plan",
    urgent: true,
  },
  SUBSCRIPTION_EXPIRED: {
    icon: <Clock {...iconProps} />,
    category: "danger",
    eyebrow: "Plan",
  },
  RECRUITER_VERIFIED: {
    icon: <UserCheck {...iconProps} />,
    category: "verified",
    eyebrow: "Account",
  },
  RECRUITER_REJECTED: {
    icon: <UserX {...iconProps} />,
    category: "danger",
    eyebrow: "Account",
  },
  JOB_APPROVED: {
    icon: <Briefcase {...iconProps} />,
    category: "success",
    eyebrow: "Listing",
  },
  JOB_REJECTED: {
    icon: <Briefcase {...iconProps} />,
    category: "danger",
    eyebrow: "Listing",
  },
};