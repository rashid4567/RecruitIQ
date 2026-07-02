import api from "@/api/axios";
import { RESUME_ROUTES } from "../constants/resume.routes";
import type { Resume } from "../types/resume.types";

export const uploadResume = async (file: File): Promise<Resume> => {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await api.post<{
    data: Resume;
  }>(RESUME_ROUTES.UPLOAD, formData);
  return data.data;
};

export const getMyResume = async (): Promise<Resume> => {
  const { data } = await api.get<{
    data: Resume;
  }>(RESUME_ROUTES.MY_RESUME);
  return data.data;
};

export const getResumeDownloadUrl = async (
  resumeId: string,
): Promise<string> => {
  const { data } = await api.get<{
    data: string;
  }>(RESUME_ROUTES.DOWNLOAD(resumeId));
  return data.data;
};
export const deleteResume = async (): Promise<void> => {
  await api.delete(RESUME_ROUTES.MY_RESUME);
};
