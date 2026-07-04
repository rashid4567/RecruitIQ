import { Socket } from "socket.io";

export interface SocketUser {
  userId: string;
  interviewId: string;
  role: "candidate" | "recruiter";
  socket: Socket;
}

export interface RoomParticipant {
  userId: string;
  socketId: string;
  role: "candidate" | "recruiter";
}

export interface Room {
  roomId: string;
  interviewId: string;
  participants: Map<string, RoomParticipant>;
}


export interface JoinRoomPayload {
  roomId: string;
  interviewId: string;
  userId: string;
  role: "candidate" | "recruiter";
}


export interface LeaveRoomPayload {
  roomId: string;
}

export interface OfferPayload {
  roomId: string;
  offer: unknown;
}

export interface AnswerPayload {
  roomId: string;
  answer: unknown;
}

export interface IceCandidatePayload {
  roomId: string;
  candidate: unknown;
}
