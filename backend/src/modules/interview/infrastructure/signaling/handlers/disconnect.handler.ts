import { Socket } from "socket.io";
import { RoomRepository } from "../../../domain/repository/room.repository";
import { SocketEvents } from "../socket.events";

export class DisconnectHandler {
  constructor(private readonly roomRepository: RoomRepository) {}

  register(socket: Socket): void {
    socket.on(SocketEvents.DISCONNECT, () => {
      const room = this.roomRepository.findRoomBySocketId(socket.id);
      if (!room) {
        return;
      }
      this.roomRepository.leave(room.roomId, socket.id);
      socket.to(room.roomId).emit(SocketEvents.USER_LEFT, {
        socketId: socket.id,
      });
    });
  }
}
