export interface BlockJobPostRequestDTO {
  jobId: string;
}

export interface HideJobPostRequestDTO {
  jobId: string;
  recruiterId: string;
}

export interface UnblockJobPostRequestDTO {
  jobId: string;
}

export interface UnHideJobPostRequestDTO {
  jobId: string;
  recruiterId: string;
}
