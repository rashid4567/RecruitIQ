export interface CandidateApiDto {
  id: string | { value: string };
  name: string;
  email: string;
  status: boolean;
  location?: string;
  experience?: number;
  applications?: number;
  skills?: string[];
   registeredDate: string
}

export interface CandidateListApiDto {
  candidates: CandidateApiDto[];
  total: number;
}


export interface CandidateProfileApiDto {
 id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt?: string;

  currentJob?: string;
  experienceYears?: number | { value: number }; 
  skills?: string[];
  bio?: string;
  currentJobLocation?: string;
}
