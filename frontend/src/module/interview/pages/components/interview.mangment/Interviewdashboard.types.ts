import type { InterviewStatus } from "@/module/interview/types/interview.types";
import type { RecruiterInterviewItem } from "@/module/interview/types/recruiterInterview.types";
export type Tab = "all" | "upcoming" | "today" | "timeline" | "reschedule";
export type StatusFilter = "all" | "not_scheduled" | InterviewStatus;
export type ModeFilter = "all" | "online" | "in_person";

export interface StatusConfig {
  label: string;
  pill: string;
  dot: string;
  bgIcon: string;
}
export interface ScheduleModalState {
  open: boolean;
  applicationId?: string;
  interview?: RecruiterInterviewItem;
}
export interface CancelModalState {
  open: boolean;
  interview?: RecruiterInterviewItem;
}
export type RescheduleDecision = "approve" | "reject";
export interface RescheduleDecisionModalState {
  open: boolean;
  decision: RescheduleDecision;
  interview?: RecruiterInterviewItem;
}