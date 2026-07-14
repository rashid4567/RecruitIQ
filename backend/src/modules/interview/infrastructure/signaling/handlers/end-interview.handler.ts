import { Server, Socket } from "socket.io";
import { RoomRepository } from "../../../domain/repository/room.repository";
import { SocketEvents } from "../socket.events";

export class EndInterviewHandler {
  constructor(private readonly roomRepository: RoomRepository) {}

  register(io: Server, socket: Socket): void {
    socket.on(SocketEvents.END_INTERVIEW, (payload) => {
      io.to(payload.roomId).emit(SocketEvents.END_INTERVIEW, {
        roomId: payload.roomId,
        interviewId: payload.interviewId,
        endedBy: socket.id,
      });

      this.roomRepository.leave(payload.roomId, socket.id);

      socket.leave(payload.roomId);
    });
  }
}
