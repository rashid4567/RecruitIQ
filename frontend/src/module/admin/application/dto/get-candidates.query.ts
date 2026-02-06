export interface GetCandidatesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status: "All" | "Active" | "Blocked";
}
