export interface JoinRoomPayload {
  interviewId: string;
  roomId: string;
  userId: string;
  role: "candidate" | "recruiter";
}

export interface LeaveRoomPayload {
  roomId: string;
}

export interface OfferPayload {
  roomId: string;
  offer: RTCSessionDescriptionInit;
}

export interface AnswerPayload {
  roomId: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  roomId: string;
  candidate: RTCIceCandidateInit;
}

export interface UserJoinedPayload {
  userId: string;
  role: "candidate" | "recruiter";
}

export interface UserLeftPayload {
  socketId: string;
}

export interface RoomJoinedPayload {
  roomId: string;
}

export interface JoinRoomFailedPayload {
  message: string;
}


export interface ChatMessagePayload {
  roomId: string;
  message: string;
}

export interface ChatMessageReceivedPayload {
  roomId: string;
  message: string;
  senderId: string;
  senderRole: "candidate" | "recruiter";
  sentAt: string;
}
