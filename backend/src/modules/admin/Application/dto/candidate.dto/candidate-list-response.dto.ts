export interface CandidateListItemDTO {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  skills: string[];
  preferredJobLocations: string[];

}

export interface CandidateListResponseDTO {
  candidates: CandidateListItemDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}