import api from "@/api/axios";
import type {
  EmailLog,
  EmailTemplate,
} from "../types/email.types";

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  const { data } = await api.get<{ data: EmailTemplate[] }>(
    "/admin/email-templates"
  );

  return data.data;
};

export const createEmailTemplate = async (
  payload: {
    name: string;
    event: string;
    subject: string;
    body: string;
  }
): Promise<EmailTemplate> => {
  const { data } = await api.post<{ data: EmailTemplate }>(
    "/admin/email-templates",
    payload
  );

  return data.data;
};

export const updateEmailTemplate = async (
  id: string,
  payload: {
    subject?: string;
    body?: string;
  }
): Promise<EmailTemplate> => {
  const { data } = await api.put<{ data: EmailTemplate }>(
    `/admin/email-templates/${id}`,
    payload
  );

  return data.data;
};

export const deleteEmailTemplate = async (id: string) => {
  await api.delete(`/admin/email-templates/${id}`);
};

export const toggleEmailTemplate = async (
  id: string,
  isActive: boolean
) => {
  await api.patch(`/admin/email-templates/${id}/toggle`, {
    isActive,
  });
};

export const sendTestEmail = async (
  id: string,
  email: string
) => {
  await api.post(`/admin/email-templates/${id}/test`, {
    email,
  });
};

export const getEmailLogs = async (): Promise<EmailLog[]> => {
  const { data } = await api.get<{ data: EmailLog[] }>(
    "/admin/email-logs"
  );

  return data.data;
};