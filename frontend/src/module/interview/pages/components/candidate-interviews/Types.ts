import type { GetCandidateInterviewsResponse } from "@/module/interview/types/candidateInterview.types";
import type { InterviewMode, InterviewStatus } from "@/module/interview/types/interview.types";


export type ViewMode = "timeline" | "calendar" | "list";
export type StatusFilter = "ALL" | InterviewStatus;
export type ModeFilter = "ALL" | InterviewMode;

export interface ExpandedState {
  [key: string]: boolean;
}

export interface DecisionModalState {
  open: boolean;
  interview?: GetCandidateInterviewsResponse;
}

export interface RescheduleModalState {
  open: boolean;
  interview?: GetCandidateInterviewsResponse;
}

export interface StatusConfig {
  label: string;
  pill: string;
  dot: string;
  bar: string;
}