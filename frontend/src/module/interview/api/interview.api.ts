import api from "@/api/axios";
import type {
  ApproveRescheduleResponse,
  CancelInterviewRequest,
  CancelInterviewResponse,
  EndInterviewResponse,
  GetRecruiterInterviewDetailsResponse,
  GetRecruiterInterviewsResponse,
  MarkRecruiterJoinedResponse,
  RejectRescheduleResponse,
  RescheduleInterviewRequest,
  RescheduleInterviewResponse,
  ScheduleInterviewRequest,
  ScheduleInterviewResponse,
  StartInterviewResponse,
} from "../types/recruiterInterview.types";

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

export const scheduleInterview = async (
  data: ScheduleInterviewRequest,
): Promise<ScheduleInterviewResponse> => {
  const response = await api.post("/recruiter/interviews", data);
  return response.data.data;
};

export const getRecruiterInterviews = async (
  page?: number,
  limit?: number,
): Promise<GetRecruiterInterviewsResponse[]> => {
  const response = await api.get("/recruiter/interviews", {
    params: { page, limit },
  });

  return response.data.data;
};

export const getRecruiterInterviewDetails = async (
  interviewId: string,
): Promise<GetRecruiterInterviewDetailsResponse> => {
  const response = await api.get(`/recruiter/interviews/${interviewId}`);
  return response.data.data;
};

export const rescheduleInterview = async (
  interviewId: string,
  data: RescheduleInterviewRequest,
): Promise<RescheduleInterviewResponse> => {
  const response = await api.patch(
    `/recruiter/interviews/${interviewId}/reschedule`,
    data,
  );

  return response.data.data;
};

export const cancelInterview = async (
  interviewId: string,
  data: CancelInterviewRequest,
): Promise<CancelInterviewResponse> => {
  const response = await api.patch(
    `/recruiter/interviews/${interviewId}/cancel`,
    data,
  );

  return response.data.data;
};

export const startInterview = async (
  interviewId: string,
): Promise<StartInterviewResponse> => {
  const response = await api.patch(
    `/recruiter/interviews/${interviewId}/start`,
  );

  return response.data.data;
};

export const markRecruiterJoined = async (
  interviewId: string,
): Promise<MarkRecruiterJoinedResponse> => {
  const response = await api.patch(`/recruiter/interviews/${interviewId}/join`);

  return response.data.data;
};

export const endInterview = async (
  interviewId: string,
): Promise<EndInterviewResponse> => {
  const response = await api.patch(`/recruiter/interviews/${interviewId}/end`);

  return response.data.data;
};

export const approveRescheduleRequest = async (
  interviewId: string,
): Promise<ApproveRescheduleResponse> => {
  const response = await api.patch(
    `/recruiter/interviews/${interviewId}/approve-reschedule`,
  );

  return response.data.data;
};

export const rejectRescheduleRequest = async (
  interviewId: string,
): Promise<RejectRescheduleResponse> => {
  const response = await api.patch(
    `/recruiter/interviews/${interviewId}/reject-reschedule`,
  );

  return response.data.data;
};

export const getCandidateInterviews = async (): Promise<
  GetCandidateInterviewsResponse[]
> => {
  const response = await api.get("/candidate/interviews");
  console.log("candidate interviews :",response.data.data ? response.data.data : "no data is there");
  return response.data.data.interviews;
};

export const getCandidateInterviewDetails = async (
  interviewId: string,
): Promise<GetCandidateInterviewDetailsResponse> => {
  const response = await api.get(`/candidate/interviews/${interviewId}`);

  return response.data.data;
};

export const joinInterview = async (
  interviewId: string,
): Promise<JoinInterviewResponse> => {
  const response = await api.patch(`/candidate/interviews/${interviewId}/join`);

  return response.data.data;
};

export const acceptInterview = async (
  interviewId: string,
): Promise<AcceptInterviewResponse> => {
  const response = await api.patch(
    `/candidate/interviews/${interviewId}/accept`,
  );

  return response.data.data;
};

export const rejectInterview = async (
  interviewId: string,
  data: RejectInterviewRequest,
): Promise<RejectInterviewResponse> => {
  const response = await api.patch(
    `/candidate/interviews/${interviewId}/reject`,
    data,
  );

  return response.data.data;
};

export const requestInterviewReschedule = async (
  interviewId: string,
  data: RequestInterviewRescheduleRequest,
): Promise<RequestInterviewRescheduleResponse> => {
  const response = await api.patch(
    `/candidate/interviews/${interviewId}/request-reschedule`,
    data,
  );

  return response.data.data;
};
