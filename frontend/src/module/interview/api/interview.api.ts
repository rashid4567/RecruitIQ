import api from "@/api/axios";
import type {
  GetRecruiterInterviewsResponse,
  ScheduleInterviewRequest,
  ScheduleInterviewResponse,
} from "../types/interview.types";

export const scheduleInterview = async (
  data: ScheduleInterviewRequest,
): Promise<ScheduleInterviewResponse> => {
  const response = await api.post("/recruiter/interivew", data);
  return response.data.data;
};

export const getRecruiterInterviews = async (
  page?: number,
  limit?: number,
): Promise<GetRecruiterInterviewsResponse[]> => {
  const response = await api.get("/recruiter/interviews", {
    params: {
      page,
      limit,
    },
  });
  return response.data.data;
};

export const getRecruiterInterviewDetails = async (
  interviewId: string,
): Promise<GetRecruiterInterviewsResponse> => {
  const response = await api.get(`/recruiter/interviews/${interviewId}`);
  return response.data.data;
};
