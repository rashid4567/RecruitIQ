export interface ApproveRescheduleRequestDTO {
  interviewId: string;
  recruiterId: string;
}

export interface ApproveRescheduleResponseDTO {
  id: string;
  rescheduleRequested: boolean;
  updatedAt?: Date;
}