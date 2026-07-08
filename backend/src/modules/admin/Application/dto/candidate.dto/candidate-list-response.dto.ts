export interface CandidateListItemDTO {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  joinedDate?: Date;
  skills: string[];
  preferredJobLocations: string[];
}

export interface CandidateListRequestDTO {
  search?: string;
  limit: number;
  page: number;
  status?: boolean;
}
export interface CandidateListResponseDTO {
  candidates: CandidateListItemDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}