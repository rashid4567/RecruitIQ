import api from "@/api/axios";

import type { Resume } from "../types/resume.types";

export const uploadResume = async (
  file: File,
): Promise<Resume> => {
  const formData = new FormData();

  formData.append("resume", file);

  const { data } = await api.post<{
    data: Resume;
  }>("/candidate/resume/upload", formData);

  return data.data;
};

export const getMyResume = async (): Promise<Resume> => {
  const { data } = await api.get<{
    data: Resume;
  }>("/candidate/resume/me");

  return data.data;
};

export const getResumeDownloadUrl = async (
  resumeId: string,
): Promise<string> => {
  const { data } = await api.get<{
    data: string;
  }>(`/candidate/resume/${resumeId}/download`);

  return data.data;
};

export const deleteResume = async (): Promise<void> => {
  await api.delete("/candidate/resume/me");
};