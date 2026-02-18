import { UserId } from "../../../../../shared/value-objects.ts/userId.vo"; 


export interface CandidateListItemDTO {
  id: UserId;
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