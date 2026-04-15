import api from "@/api/axios";
import { Recruiter } from "../../domain/entities/recruiter.entity";
import type { RecruiterRepository } from "../../domain/repositories/recruiter.repository";
import type { RecruiterApiDto } from "../dto/recruiterApi.dto";
import type { VerificationStatus } from "../../domain/entities/recruiter.entity";

// Helper to map a raw DTO → Recruiter domain entity (all fields)
function mapDtoToRecruiter(r: RecruiterApiDto): Recruiter {
  return new Recruiter({
    id: r.id,
    name: r.name,
    email: r.email,
    isActive: r.isActive,
    verificationStatus: r.verificationStatus,
    subscriptionStatus: r.subscriptionStatus,
    jobPostsUsed: r.jobPostsUsed,
    joinedDate: r.joinedDate,

    // Extended profile
    companyName: r.companyName,
    companyWebsite: r.companyWebsite,
    companySize: r.companySize,
    industry: r.industry,
    designation: r.designation,
    location: r.location,
    linkedinUrl: r.linkedinUrl,
    bio: r.bio,
  });
}

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
      recruiters: data.data.recruiters.map(mapDtoToRecruiter),
      total: data.data.pagination.total,
    };
  }

  async getProfile(recruiterId: string): Promise<Recruiter> {
    const { data } = await api.get<{ data: RecruiterApiDto }>(
      `/admin/recruiters/${recruiterId}`
    );
    return mapDtoToRecruiter(data.data);
  }

  async updateVerificationStatus(
    recruiterId: string,
    status: VerificationStatus
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

  async toggleActiveStatus(
    recruiterId: string,
    isActive: boolean
  ): Promise<void> {
    await api.patch(`/admin/recruiters/${recruiterId}/status`, { isActive });
  }
}