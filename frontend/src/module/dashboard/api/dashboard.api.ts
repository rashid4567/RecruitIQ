import api from "@/api/axios";
import type { RecruiterDashboardResponse } from "../types/recruiter-dashboard.types";
import type { AdminDashboardResponse } from "../types/admin-dashboard.types";

export const getRecruiterDashboard =
  async (): Promise<RecruiterDashboardResponse> => {
    const response = await api.get<{
      success: boolean;
      message: string;
      data: RecruiterDashboardResponse;
    }>("/recruiter/dashboard");
    return response.data.data;
  };

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const response = await api.get("/admin/dashboard");

  return response.data.data;
};
