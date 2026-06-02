import api from "@/api/axios";

import { Resume } from "../../domain/entity/Resume.entity";
import type { ResumeRepository } from "../../domain/repository/ResumeRepository";

export class ApiResumeRepository implements ResumeRepository {
  async uploadResume(file: File): Promise<Resume> {
    const formData = new FormData();

    formData.append("resume", file);

    const { data } = await api.post("/candidate/resume/upload", formData);

    return Resume.create(data.data);
  }

  async getMyResume(): Promise<Resume> {
    const { data } = await api.get("/candidate/resume/me");

    return Resume.create(data.data);
  }

  async getDownloadUrl(): Promise<string> {
    const { data } = await api.get("/candidate/resume/download");

    return data.url;
  }

  async deleteResume(): Promise<void> {
    await api.delete("/candidate/resume/me");
  }
}
