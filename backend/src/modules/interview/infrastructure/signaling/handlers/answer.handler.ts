import { Server, Socket } from "socket.io";
import { RoomRepository } from "../../../domain/repository/room.repository";
import { SocketEvents } from "../socket.events";
import { AnswerPayload } from "../socket.types";

export class AnswerHandler {
  constructor(private readonly roomRepository: RoomRepository) {}

  register(io: Server, socket: Socket): void {
    socket.on(SocketEvents.ANSWER, ({ roomId, answer }: AnswerPayload) => {
      const target = this.roomRepository.getOtherParticipant(roomId, socket.id);

      if (!target) {
        console.log(`[ANSWER] No participant found in room ${roomId}`);
        return;
      }
console.log("================================");
console.log("[ANSWER] Received");
console.log({
  roomId,
  from: socket.id,
});
      io.to(target.socketId).emit(SocketEvents.ANSWER, {
        answer,
        from: socket.id,
      });

      console.log("================================");
console.log("[ANSWER] Received");
console.log({
  roomId,
  from: socket.id,
});
      
      console.log(`[ANSWER] : ${socket.id} -> ${target.socketId}`);
    });
  }
}
