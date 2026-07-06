export interface UpdateInterviewNotesRequestDTO {
  interviewId: string;
  recruiterId: string;
  notes: string;
}

export interface UpdateInterviewNotesResponseDTO {
  id: string;
  notes: string;
  updatedAt?: Date;
}