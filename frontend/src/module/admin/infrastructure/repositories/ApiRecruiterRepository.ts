import api from "@/api/axios";
import { Recruiter } from "../../domain/entities/recruiter.entity";
import type { RecruiterRepository } from "../../domain/repositories/recruiter.repository";
import type { RecruiterApiDto } from "../dto/recruiterApi.dto";
import type { VerificationStatus } from "../../domain/entities/recruiter.entity";

export class ApiRecruiterRepository implements RecruiterRepository {

  async getRecruiters(query: {
    page: number;
    limit: number;
    search?: string;
    verificationStatus?: VerificationStatus;
    isActive?: boolean;
  }): Promise<{ recruiters: Recruiter[]; total: number }> {

    const { data } = await api.get<{
      data: {
        recruiters: RecruiterApiDto[];
        pagination: { total: number };
      };
    }>("/admin/recruiters", { params: query });

    return {
      recruiters: data.data.recruiters.map(
        (r) =>
          new Recruiter({
            id: r.id,
            name: r.name,
            email: r.email,
            isActive: r.isActive,
            companyName: r.companyName,
            verificationStatus: r.verificationStatus,
            subscriptionStatus: r.subscriptionStatus,
            jobPostsUsed: r.jobPostsUsed,
            joinedDate: r.joinedDate,
          }),
      ),
      total: data.data.pagination.total,
    };
  }

  async getProfile(recruiterId: string): Promise<Recruiter> {
    const { data } = await api.get<{
      data: RecruiterApiDto;
    }>(`/admin/recruiters/${recruiterId}`);

    const r = data.data;

    return new Recruiter({
      id: r.id,
      name: r.name,
      email: r.email,
      isActive: r.isActive,
      companyName: r.companyName,
      verificationStatus: r.verificationStatus,
      subscriptionStatus: r.subscriptionStatus,
      jobPostsUsed: r.jobPostsUsed,
      joinedDate: r.joinedDate,
    });
  }

  async updateVerificationStatus(
    recruiterId: string,
    status: VerificationStatus,
  ): Promise<void> {

    if (status === "verified") {
      await api.patch(`/admin/recruiters/${recruiterId}/verify`);
      return;
    }

    if (status === "rejected") {
      await api.patch(`/admin/recruiters/${recruiterId}/reject`);
      return;
    }

    throw new Error(`Invalid verification status: ${status}`);
  }
}
