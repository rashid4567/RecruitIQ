export interface RequestInterviewRescheduleRequestDTO {
  interviewId: string;
  candidateId: string;
  reason: string;
}

export interface RequestInterviewRescheduleResponseDTO {
  id: string;
  rescheduleRequested: boolean;
  requestedReason: string;
  rescheduleRequestedAt: Date;
  updatedAt?: Date;
}