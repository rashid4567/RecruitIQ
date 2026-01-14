export interface CandidateListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "Active" | "Blocked" | "All";
}
