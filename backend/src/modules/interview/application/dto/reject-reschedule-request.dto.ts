export interface RejectRescheduleRequestDTO {
  interviewId: string;
  recruiterId: string;
}

export interface RejectRescheduleResponseDTO {
  id: string;
  rescheduleRequested: boolean;
  updatedAt?: Date;
}