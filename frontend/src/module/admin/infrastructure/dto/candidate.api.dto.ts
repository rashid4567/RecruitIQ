export interface CandidateApiDto {
  id: string | { value: string };
  name: string;
  email: string;
  status: boolean;
  location?: string;
  experience?: number;
  applications?: number;
  skills?: string[];
}

export interface CandidateListApiDto {
  candidates: CandidateApiDto[];
  total: number;
}