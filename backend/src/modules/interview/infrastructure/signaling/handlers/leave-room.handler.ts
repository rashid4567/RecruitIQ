import { Server, Socket } from "socket.io";
import { SocketEvents } from "../socket.events";
import { RoomRepository } from "../../../domain/repository/room.repository";
import { LeaveRoomPayload } from "../socket.types";

export class LeaveRoomHandler {
  constructor(private readonly roomRepository: RoomRepository) {}

  register(io: Server, socket: Socket): void {
    socket.on(SocketEvents.LEAVE_ROOM, ({ roomId }: LeaveRoomPayload) => {
      this.roomRepository.leave(roomId, socket.id);
      socket.leave(roomId);
      socket.to(roomId).emit(SocketEvents.USER_LEFT, {
        socketId: socket.id,
      });
    });
  }
}
