import api from "@/api/axios";
import type { CandidateRepository } from "../../domain/repositories/candidate.repository";
import type { GetCandidatesQuery } from "../../application/dto/get-candidates.query";
import type { PaginationCandidate } from "../../application/dto/pagination-candidate.dto";
import { Candidate } from "../../domain/entities/candidates.entity";

interface CandidateListApiDto {
  id: unknown;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

interface CandidateProfileApiDto {
  id: unknown;
  name: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  currentJob?: string;
  experienceYears?: number | { value: number };
  educationLevel?: string;
  skills?: string[];
  preferredJobLocations?: string[];
  bio?: string;
  currentJobLocation?: string;
  gender?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  profileCompleted?: boolean;
}

export class ApiCandidateRepository implements CandidateRepository {
  async getCandidates(query: GetCandidatesQuery): Promise<PaginationCandidate> {
    const cleanedQuery = this.cleanQuery(query);

    const { data } = await api.get<{
      data: {
        candidates: CandidateListApiDto[];
        total: number;
      };
    }>("/admin/candidates", {
      params: cleanedQuery,
    });

    return {
      candidates: data.data.candidates.map((c) => this.toListCandidate(c)),
      total: data.data.total,
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
    if (typeof id === "string") {
      return id;
    }
    if (typeof id === "object" && id !== null) {
      const normalized = id as {
        _id?: string;
        value?: string;
      };
      return normalized._id ?? normalized.value ?? String(id);
    }
    return String(id);
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
      registeredDate: c.createdAt,
    });
  }

  private toProfileCandidate(c: CandidateProfileApiDto): Candidate {
    return new Candidate({
      userId: this.normalizeId(c.id),
      name: c.name,
      email: c.email,
      status: c.isActive ? "Active" : "Blocked",
      registeredDate: c.createdAt ?? "",
      currentJob: c.currentJob,
      experienceYears: Math.max(
        0,
        typeof c.experienceYears === "number"
          ? c.experienceYears
          : (c.experienceYears?.value ?? 0),
      ),
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
