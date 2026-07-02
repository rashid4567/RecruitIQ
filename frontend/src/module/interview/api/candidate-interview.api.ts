import api from "@/api/axios";
import { CANDIDATE_INTERVIEW_ROUTES } from "../constants/candidate-interview.routes";
import type {
  AcceptInterviewResponse,
  GetCandidateInterviewDetailsResponse,
  GetCandidateInterviewsResponse,
  JoinInterviewResponse,
  RejectInterviewRequest,
  RejectInterviewResponse,
  RequestInterviewRescheduleRequest,
  RequestInterviewRescheduleResponse,
} from "../types/candidateInterview.types";

export const getCandidateInterviews = async (): Promise<
  GetCandidateInterviewsResponse[]
> => {
  const response = await api.get(CANDIDATE_INTERVIEW_ROUTES.INTERVIEWS);

  return response.data.data.interviews;
};

export const getCandidateInterviewDetails = async (
  interviewId: string,
): Promise<GetCandidateInterviewDetailsResponse> => {
  const response = await api.get(
    CANDIDATE_INTERVIEW_ROUTES.INTERVIEW(interviewId),
  );

  return response.data.data;
};

export const joinInterview = async (
  interviewId: string,
): Promise<JoinInterviewResponse> => {
  const response = await api.patch(
    CANDIDATE_INTERVIEW_ROUTES.JOIN(interviewId),
  );

  return response.data.data;
};

export const acceptInterview = async (
  interviewId: string,
): Promise<AcceptInterviewResponse> => {
  const response = await api.patch(
    CANDIDATE_INTERVIEW_ROUTES.ACCEPT(interviewId),
  );

  return response.data.data;
};

export const rejectInterview = async (
  interviewId: string,
  data: RejectInterviewRequest,
): Promise<RejectInterviewResponse> => {
  const response = await api.patch(
    CANDIDATE_INTERVIEW_ROUTES.REJECT(interviewId),
    data,
  );

  return response.data.data;
};

export const requestInterviewReschedule = async (
  interviewId: string,
  data: RequestInterviewRescheduleRequest,
): Promise<RequestInterviewRescheduleResponse> => {
  const response = await api.patch(
    CANDIDATE_INTERVIEW_ROUTES.REQUEST_RESCHEDULE(interviewId),
    data,
  );

  return response.data.data;
};
