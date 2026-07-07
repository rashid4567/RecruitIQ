import api from "@/api/axios";
import type { RecruiterDashboardResponse } from "../types/recruiter-dashboard.types";
import type { AdminDashboardResponse } from "../types/admin-dashboard.types";
import { DASHBOARD_ROUTES } from "../constant/dashboard.routes";

export const getRecruiterDashboard =
  async (): Promise<RecruiterDashboardResponse> => {
    const response = await api.get<{
      success: boolean;
      message: string;
      data: RecruiterDashboardResponse;
    }>(DASHBOARD_ROUTES.RECRUITER_DASHBOARD);
    return response.data.data;
  };

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const response = await api.get(DASHBOARD_ROUTES.ADMIN_DASHBOARD);

  return response.data.data;
};
