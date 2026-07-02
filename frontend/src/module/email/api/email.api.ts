import api from "@/api/axios";
import { EMAIL_ROUTES } from "../constant/email.routes"; 
import type { EmailLog, EmailTemplate } from "../types/email.types";

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  const { data } = await api.get<{ data: EmailTemplate[] }>(
    EMAIL_ROUTES.EMAIL_TEMPLATES,
  );
  return data.data;
};

export const createEmailTemplate = async (payload: {
  name: string;
  event: string;
  subject: string;
  body: string;
}): Promise<EmailTemplate> => {
  const { data } = await api.post<{ data: EmailTemplate }>(
    EMAIL_ROUTES.EMAIL_TEMPLATES,
    payload,
  );
  return data.data;
};

export const updateEmailTemplate = async (
  id: string,
  payload: {
    subject?: string;
    body?: string;
  },
): Promise<EmailTemplate> => {
  const { data } = await api.put<{ data: EmailTemplate }>(
    EMAIL_ROUTES.EMAIL_TEMPLATE(id),
    payload,
  );
  return data.data;
};

export const deleteEmailTemplate = async (id: string): Promise<void> => {
  await api.delete(EMAIL_ROUTES.EMAIL_TEMPLATE(id));
};

export const toggleEmailTemplate = async (
  id: string,
  isActive: boolean,
): Promise<void> => {
  await api.patch(EMAIL_ROUTES.TOGGLE_EMAIL_TEMPLATE(id), {
    isActive,
  });
};

export const sendTestEmail = async (
  id: string,
  email: string,
): Promise<void> => {
  await api.post(EMAIL_ROUTES.TEST_EMAIL_TEMPLATE(id), {
    email,
  });
};

export const getEmailLogs = async (): Promise<EmailLog[]> => {
  const { data } = await api.get<{ data: EmailLog[] }>(EMAIL_ROUTES.EMAIL_LOGS);
  return data.data;
};
