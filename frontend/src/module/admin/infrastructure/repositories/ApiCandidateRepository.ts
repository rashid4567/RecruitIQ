import api from "@/api/axios";
import type { GetCandidatesQuery } from "../../application/dto/get-candidates.query";
import type { PaginationCandidate } from "../../application/dto/pagination-candidate.dto";
import type { CandidateRepository } from "../../domain/repositories/candidate.repository";
import { Candidate } from "../../domain/entities/candidates.entity";
import type {
  CandidateApiDto,
  CandidateListApiDto,
} from "../dto/candidate.api.dto";

export class ApiCandidateRepository implements CandidateRepository {
  async getCandidates(
    query: GetCandidatesQuery
  ): Promise<PaginationCandidate> {
    const { data } = await api.get<{ data: CandidateListApiDto }>(
      "/admin/candidates",
      { params: query }
    );

    return {
      candidates: data.data.candidates.map(this.toDomain),
      total: data.data.total,
    };
  }

  async blockCandidate(userId: string): Promise<void> {
    await api.patch(`/admin/candidates/${userId}/block`);
  }

  async unblockCandidate(userId: string): Promise<void> {
    await api.patch(`/admin/candidates/${userId}/unblock`);
  }


  private toDomain(c: CandidateApiDto): Candidate {
    const userId =
      typeof c.id === "string"
        ? c.id
        : typeof c.id?.value === "string"
        ? c.id.value
        : null;

    if (!userId) {
      console.error("Invalid candidate payload:", c);
      throw new Error("Candidate userId is missing or invalid");
    }

    return new Candidate({
      userId,
      name: c.name,
      email: c.email,
      status: c.status ? "Active" : "Blocked",
      registeredDate: "",
      location: c.location,
      experience: c.experience ?? 0,
      applications: c.applications ?? 0,
      skills: c.skills ?? [],
    });
  }
}
