import type {
  CandidateResponseStatus,
  InterviewMode,
  InterviewStatus,
} from "@/module/interview/types/interview.types";
import type { GetCandidateInterviewDetailsResponse } from "@/module/interview/types/candidateInterview.types";
import type { GetRecruiterInterviewDetailsResponse } from "@/module/interview/types/recruiterInterview.types";

export type LobbyRole = "candidate" | "recruiter";

/**
 * Both GetCandidateInterviewDetailsResponse and
 * GetRecruiterInterviewDetailsResponse already share most of the fields
 * the lobby needs. This normalizes the two into one shape so the UI
 * never has to branch on role for rendering — only for which fields
 * exist. Nothing here invents data: fields absent from a role's API
 * response (job title, company name, participant name) are left
 * undefined and the UI treats them as optional.
 */
export interface LobbyInterviewDetails {
  interviewId: string;
  applicationId: string;
  roomId?: string;
  title: string;
  round: number;
  mode: InterviewMode;
  status: InterviewStatus;
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  candidateResponseStatus?: CandidateResponseStatus;
  rescheduleRequested: boolean;
  requestedReason?: string;
  canJoin: boolean;
}

const JOINABLE_STATUSES: InterviewStatus[] = ["SCHEDULED", "RESCHEDULED", "ONGOING"];

export function normalizeCandidateDetails(
  details: GetCandidateInterviewDetailsResponse,
): LobbyInterviewDetails {
  return {
    interviewId: details.id,
    applicationId: details.applicationId,
    roomId: details.roomId,
    title: details.title,
    round: details.round,
    mode: details.mode,
    status: details.status,
    scheduledAt: details.scheduledAt,
    durationInMinutes: details.durationInMinutes,
    location: details.location,
    candidateResponseStatus: details.candidateResponseStatus,
    rescheduleRequested: details.rescheduleRequested,
    requestedReason: details.requestedReason,
    canJoin:
      details.canJoin ??
      (JOINABLE_STATUSES.includes(details.status) &&
        details.candidateResponseStatus === "ACCEPTED"),
  };
}

export function normalizeRecruiterDetails(
  details: GetRecruiterInterviewDetailsResponse,
): LobbyInterviewDetails {
  return {
    interviewId: details.interviewId,
    applicationId: details.applicationId,
    roomId: details.roomId,
    title: details.title,
    round: details.round,
    mode: details.mode,
    status: details.interviewStatus,
    scheduledAt: details.scheduledAt,
    durationInMinutes: details.durationInMinutes,
    location: details.location,
    candidateResponseStatus: details.candidateResponseStatus,
    rescheduleRequested: details.rescheduleRequested,
    requestedReason: details.requestedReason,
    canJoin: JOINABLE_STATUSES.includes(details.interviewStatus),
  };
}