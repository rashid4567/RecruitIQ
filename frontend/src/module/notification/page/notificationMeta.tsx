import type { ReactNode } from "react";
import {
  Award,
  Ban,
  BadgeCheck,
  Briefcase,
  BriefcaseBusiness,
  Calendar,
  CalendarClock,
  CheckCircle,
  Clock,
  CircleAlert,
  Crown,
  FileText,
  Handshake,
  PlayCircle,
  RefreshCw,
  Send,
  Star,
  TrendingUp,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";

import type { NotificationType } from "../types/notification.types";

export type NotificationCategory =
  | "progress"
  | "success"
  | "attention"
  | "danger"
  | "premium"
  | "verified";

export type NotificationPriority = "low" | "medium" | "high";

export const categoryStyles: Record<
  NotificationCategory,
  {
    fg: string;
    bg: string;
    ring: string;
    gradientFrom: string;
    gradientTo: string;
    label: string;
  }
> = {
  progress: {
    fg: "#2F5DE0",
    bg: "#EAF0FE",
    ring: "#C6D7FC",
    gradientFrom: "#4A7BFF",
    gradientTo: "#2F5DE0",
    label: "In Progress",
  },
  success: {
    fg: "#12805C",
    bg: "#E8F6F0",
    ring: "#BFE9D8",
    gradientFrom: "#16A879",
    gradientTo: "#12805C",
    label: "Success",
  },
  attention: {
    fg: "#B4690E",
    bg: "#FBF0DF",
    ring: "#F2D6A6",
    gradientFrom: "#D98A2E",
    gradientTo: "#B4690E",
    label: "Needs Attention",
  },
  danger: {
    fg: "#C4331F",
    bg: "#FBEAE7",
    ring: "#F3C6BC",
    gradientFrom: "#E0574A",
    gradientTo: "#C4331F",
    label: "Action Required",
  },
  premium: {
    fg: "#6B3FA0",
    bg: "#F1EAFA",
    ring: "#DBC5F0",
    gradientFrom: "#8B5FC7",
    gradientTo: "#6B3FA0",
    label: "Premium",
  },
  verified: {
    fg: "#0E7C86",
    bg: "#E6F5F6",
    ring: "#BCE4E7",
    gradientFrom: "#14A0AC",
    gradientTo: "#0E7C86",
    label: "Verified",
  },
};

export const priorityStyles: Record<
  NotificationPriority,
  { dot: boolean; pulse: boolean; glow: boolean }
> = {
  low: { dot: false, pulse: false, glow: false },
  medium: { dot: true, pulse: false, glow: false },
  high: { dot: true, pulse: true, glow: true },
};

interface Meta {
  icon: ReactNode;
  category: NotificationCategory;
  eyebrow: string;
  priority: NotificationPriority;
  actionLabel: string;
}

const iconProps = { size: 18, strokeWidth: 2 };

export const notificationMeta: Record<NotificationType, Meta> = {
  JOB_APPLIED: {
    icon: <FileText {...iconProps} />,
    category: "progress",
    eyebrow: "Application",
    priority: "low",
    actionLabel: "View Application",
  },
  APPLICATION_SHORTLISTED: {
    icon: <Star {...iconProps} />,
    category: "attention",
    eyebrow: "Application",
    priority: "medium",
    actionLabel: "View Application",
  },
  APPLICATION_SELECTED: {
    icon: <Award {...iconProps} />,
    category: "success",
    eyebrow: "Application",
    priority: "high",
    actionLabel: "Review Candidate",
  },
  APPLICATION_REJECTED: {
    icon: <XCircle {...iconProps} />,
    category: "danger",
    eyebrow: "Application",
    priority: "medium",
    actionLabel: "See Details",
  },
  INTERVIEW_SCHEDULED: {
    icon: <Calendar {...iconProps} />,
    category: "progress",
    eyebrow: "Interview",
    priority: "medium",
    actionLabel: "View Interview",
  },
  INTERVIEW_STARTED: {
    icon: <PlayCircle {...iconProps} />,
    category: "success",
    eyebrow: "Interview",
    priority: "high",
    actionLabel: "Join Interview",
  },
  INTERVIEW_CANCELLED: {
    icon: <Ban {...iconProps} />,
    category: "danger",
    eyebrow: "Interview",
    priority: "high",
    actionLabel: "See Details",
  },
  INTERVIEW_RESCHEDULED: {
    icon: <CalendarClock {...iconProps} />,
    category: "attention",
    eyebrow: "Interview",
    priority: "medium",
    actionLabel: "View Interview",
  },
  INTERVIEW_RESCHEDULE_REQUEST_APPROVED: {
    icon: <CheckCircle {...iconProps} />,
    category: "success",
    eyebrow: "Interview",
    priority: "medium",
    actionLabel: "View Interview",
  },
  INTERVIEW_RESCHEDULE_REQUEST_REJECTED: {
    icon: <XCircle {...iconProps} />,
    category: "danger",
    eyebrow: "Interview",
    priority: "medium",
    actionLabel: "See Details",
  },
  SUBSCRIPTION_CREATED: {
    icon: <Crown {...iconProps} />,
    category: "premium",
    eyebrow: "Plan",
    priority: "low",
    actionLabel: "Open Dashboard",
  },
  SUBSCRIPTION_RENEWED: {
    icon: <RefreshCw {...iconProps} />,
    category: "premium",
    eyebrow: "Plan",
    priority: "low",
    actionLabel: "Open Dashboard",
  },
  SUBSCRIPTION_UPGRADED: {
    icon: <TrendingUp {...iconProps} />,
    category: "premium",
    eyebrow: "Plan",
    priority: "medium",
    actionLabel: "Open Dashboard",
  },
  SUBSCRIPTION_EXPIRING: {
    icon: <Clock {...iconProps} />,
    category: "attention",
    eyebrow: "Plan",
    priority: "high",
    actionLabel: "Renew Plan",
  },
  SUBSCRIPTION_EXPIRED: {
    icon: <CircleAlert {...iconProps} />,
    category: "danger",
    eyebrow: "Plan",
    priority: "high",
    actionLabel: "Renew Plan",
  },
  RECRUITER_VERIFIED: {
    icon: <UserCheck {...iconProps} />,
    category: "verified",
    eyebrow: "Account",
    priority: "medium",
    actionLabel: "Open Dashboard",
  },
  RECRUITER_REJECTED: {
    icon: <UserX {...iconProps} />,
    category: "danger",
    eyebrow: "Account",
    priority: "high",
    actionLabel: "See Details",
  },
  JOB_APPROVED: {
    icon: <BriefcaseBusiness {...iconProps} />,
    category: "success",
    eyebrow: "Listing",
    priority: "medium",
    actionLabel: "View Job",
  },
  JOB_REJECTED: {
    icon: <Briefcase {...iconProps} />,
    category: "danger",
    eyebrow: "Listing",
    priority: "high",
    actionLabel: "See Details",
  },
  INTERVIEW_ACCEPTED: {
    icon: <Handshake {...iconProps} />,
    category: "success",
    eyebrow: "Interview",
    priority: "medium",
    actionLabel: "View Interview",
  },
  INTERVIEW_DECLINED: {
    icon: <XCircle {...iconProps} />,
    category: "danger",
    eyebrow: "Interview",
    priority: "high",
    actionLabel: "Review Candidate",
  },
  INTERVIEW_RESCHEDULE_REQUESTED: {
    icon: <Clock {...iconProps} />,
    category: "attention",
    eyebrow: "Interview",
    priority: "high",
    actionLabel: "Review Request",
  },
  OFFER_SENT: {
    icon: <Send {...iconProps} />,
    category: "progress",
    eyebrow: "Offer",
    priority: "medium",
    actionLabel: "Open Offer",
  },
  OFFER_ACCEPTED: {
    icon: <BadgeCheck {...iconProps} />,
    category: "success",
    eyebrow: "Offer",
    priority: "high",
    actionLabel: "Open Offer",
  },
  OFFER_REJECTED: {
    icon: <XCircle {...iconProps} />,
    category: "danger",
    eyebrow: "Offer",
    priority: "high",
    actionLabel: "See Details",
  },
};
