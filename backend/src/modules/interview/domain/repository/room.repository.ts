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

export interface RoomRepository {
  create(roomId: string, interviewId: string): Room;
  get(roomId: string): Room | undefined;
  delete(roomId: string): void;
  join(roomId: string, participant: RoomParticipant): void;
  leave(roomId: string, socketId: string): void;
  getParticipant(roomId: string, socketId: string): RoomParticipant | undefined;
  getOtherParticipant(
    roomId: string,
    socketId: string,
  ): RoomParticipant | undefined;
  findRoomBySocketId(socketId: string): Room | undefined;
}
