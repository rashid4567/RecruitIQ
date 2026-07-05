import api from "@/api/axios";
import { RECRUITER_INTERVIEW_ROUTES } from "../constants/recruiter-interview.routes";
import type {
  ApproveRescheduleResponse,
  CancelInterviewRequest,
  CancelInterviewResponse,
  EndInterviewResponse,
  GetRecruiterInterviewDetailsResponse,
  GetRecruiterInterviewsResponse,
  RejectRescheduleResponse,
  RescheduleInterviewRequest,
  RescheduleInterviewResponse,
  ScheduleInterviewRequest,
  ScheduleInterviewResponse,
  StartInterviewResponse,
} from "../types/recruiterInterview.types";

export const scheduleInterview = async (
  data: ScheduleInterviewRequest,
): Promise<ScheduleInterviewResponse> => {
  const response = await api.post(RECRUITER_INTERVIEW_ROUTES.INTERVIEWS, data);

  return response.data.data;
};

export const getRecruiterInterviews = async (
  page?: number,
  limit?: number,
): Promise<GetRecruiterInterviewsResponse[]> => {
  const response = await api.get(RECRUITER_INTERVIEW_ROUTES.INTERVIEWS, {
    params: { page, limit },
  });

  return response.data.data;
};

export const getRecruiterInterviewDetails = async (
  interviewId: string,
): Promise<GetRecruiterInterviewDetailsResponse> => {
  const response = await api.get(
    RECRUITER_INTERVIEW_ROUTES.INTERVIEW(interviewId),
  );

  return response.data.data;
};

export const rescheduleInterview = async (
  interviewId: string,
  data: RescheduleInterviewRequest,
): Promise<RescheduleInterviewResponse> => {
  const response = await api.patch(
    RECRUITER_INTERVIEW_ROUTES.RESCHEDULE(interviewId),
    data,
  );

  return response.data.data;
};

export const cancelInterview = async (
  interviewId: string,
  data: CancelInterviewRequest,
): Promise<CancelInterviewResponse> => {
  const response = await api.patch(
    RECRUITER_INTERVIEW_ROUTES.CANCEL(interviewId),
    data,
  );

  return response.data.data;
};

export const startInterview = async (
  interviewId: string,
): Promise<StartInterviewResponse> => {
  const response = await api.patch(
    RECRUITER_INTERVIEW_ROUTES.START(interviewId),
  );

  return response.data.data;
};


export const endInterview = async (
  interviewId: string,
): Promise<EndInterviewResponse> => {
  const response = await api.patch(RECRUITER_INTERVIEW_ROUTES.END(interviewId));

  return response.data.data;
};

export const approveRescheduleRequest = async (
  interviewId: string,
): Promise<ApproveRescheduleResponse> => {
  const response = await api.patch(
    RECRUITER_INTERVIEW_ROUTES.APPROVE_RESCHEDULE(interviewId),
  );

  return response.data.data;
};

export const rejectRescheduleRequest = async (
  interviewId: string,
): Promise<RejectRescheduleResponse> => {
  const response = await api.patch(
    RECRUITER_INTERVIEW_ROUTES.REJECT_RESCHEDULE(interviewId),
  );

  return response.data.data;
};
