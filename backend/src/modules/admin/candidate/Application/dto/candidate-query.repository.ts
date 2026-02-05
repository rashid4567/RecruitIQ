import { AdminCandidateListItem } from "./admin-candidate-list-item.dto";

export interface AdminCandidateQueryRepository {
  list(input: {
    search?: string;
    status?: boolean,
    skip: number;
    limit: number;
  }): Promise<{
    items: AdminCandidateListItem[];
    total: number;
  }>;
}
