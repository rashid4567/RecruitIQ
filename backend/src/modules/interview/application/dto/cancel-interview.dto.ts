export interface CancelInterviewRequestDTO {
  interviewId: string;
  recruiterId: string;
  reason: string;
}

export interface CancelInterviewResponseDTO {
  id: string;
  status: string;
  cancelledReason: string;
  cancelledBy: string;
  updatedAt?: Date;
}