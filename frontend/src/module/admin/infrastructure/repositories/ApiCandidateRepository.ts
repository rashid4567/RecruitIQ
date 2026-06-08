import api from "@/api/axios";
import type { CandidateRepository } from "../../domain/repositories/candidate.repository";
import type { GetCandidatesQuery } from "../../application/dto/get-candidates.query";
import type { PaginationCandidate } from "../../application/dto/pagination-candidate.dto";
import { Candidate } from "../../domain/entities/candidates.entity";
import type {
  CandidateListApiDto,
  CandidateProfileApiDto,
  CandidateResponseApiDto,
} from "../dto/candidateProfile.dto";

export class ApiCandidateRepository implements CandidateRepository {
  async getCandidates(query: GetCandidatesQuery): Promise<PaginationCandidate> {
    const cleanedQuery = this.cleanQuery(query);

    const { data } = await api.get<{
      data: CandidateResponseApiDto;
    }>("/admin/candidates", {
      params: cleanedQuery,
    });

    const pagination = data.data.pagination;

    return {
      candidates: data.data.candidates.map((c) => this.toListCandidate(c)),
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    };
  }

  async getProfile(candidateId: string): Promise<Candidate> {
    const { data } = await api.get<{
      data: CandidateProfileApiDto;
    }>(`/admin/candidates/${candidateId}`);

    return this.toProfileCandidate(data.data);
  }

  async blockCandidate(candidateId: string): Promise<void> {
    if (typeof candidateId !== "string") {
      throw new Error("Invalid candidateId: must be string");
    }
    await api.patch(`/admin/candidates/${candidateId}/block`);
  }

  async unblockCandidate(candidateId: string): Promise<void> {
    if (typeof candidateId !== "string") {
      throw new Error("Invalid candidateId: must be string");
    }
    await api.patch(`/admin/candidates/${candidateId}/unblock`);
  }

  private normalizeId(id: unknown): string {
    if (typeof id === "string") return id;
    if (typeof id === "object" && id !== null) {
      const normalized = id as { _id?: string; value?: string };
      return normalized._id ?? normalized.value ?? String(id);
    }
    return String(id);
  }

  private normalizeExperience(exp?: number | { value: number }): number {
    if (exp === undefined || exp === null) return 0;
    return Math.max(0, typeof exp === "number" ? exp : (exp?.value ?? 0));
  }

  private cleanQuery<T extends object>(query: T): T {
    return Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined),
    ) as T;
  }

  private toListCandidate(c: CandidateListApiDto): Candidate {
    return new Candidate({
      userId: this.normalizeId(c.id),
      name: c.name,
      email: c.email,
      status: c.isActive ? "Active" : "Blocked",
      profileImage: c.profileImage ?? "",
      registeredDate: c.createdAt,
      currentJob: c.currentJob,
      experienceYears: this.normalizeExperience(c.experienceYears),
      educationLevel: c.educationLevel,
      skills: c.skills ?? [],
      preferredJobLocations: c.preferredJobLocations ?? [],
      bio: c.bio,
      currentJobLocation: c.currentJobLocation,
      gender: c.gender,
      linkedinUrl: c.linkedinUrl,
      portfolioUrl: c.portfolioUrl,
      profileCompleted: c.profileCompleted ?? false,
    });
  }

  private toProfileCandidate(c: CandidateProfileApiDto): Candidate {
    return new Candidate({
      userId: this.normalizeId(c.id),
      name: c.name,
      email: c.email,
      status: c.isActive ? "Active" : "Blocked",
      profileImage: c.profileImage ?? "",
      registeredDate: c.createdAt ?? "",
      currentJob: c.currentJob,
      experienceYears: this.normalizeExperience(c.experienceYears),
      educationLevel: c.educationLevel,
      skills: c.skills ?? [],
      preferredJobLocations: c.preferredJobLocations ?? [],
      bio: c.bio,
      currentJobLocation: c.currentJobLocation,
      gender: c.gender,
      linkedinUrl: c.linkedinUrl,
      portfolioUrl: c.portfolioUrl,
      profileCompleted: c.profileCompleted ?? false,
    });
  }
}
