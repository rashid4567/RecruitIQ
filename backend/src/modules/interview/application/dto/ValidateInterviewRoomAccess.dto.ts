export interface ValidateInterviewRoomAccessRequestDTO {
  interviewId: string;
  userId: string;
  role: "candidate" | "recruiter";
}

export interface ValidateInterviewRoomAccessResponseDTO {
  interviewId: string;
  roomId: string;
  role: "candidate" | "recruiter";
}