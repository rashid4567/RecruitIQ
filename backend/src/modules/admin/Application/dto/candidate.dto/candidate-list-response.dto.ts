export interface CandidateListItemDTO {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}


export interface CandidateListResponseDTO {
  candidates: CandidateListItemDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}