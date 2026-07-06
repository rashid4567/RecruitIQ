import { Server, Socket } from "socket.io";
import { RoomRepository } from "../../../domain/repository/room.repository";
import { SocketEvents } from "../socket.events";
import { ChatMessagePayload } from "../socket.types";

export class ChatMessageHandler {
  constructor(private readonly roomRepository: RoomRepository) {}

  register(io: Server, socket: Socket): void {
    socket.on(
      SocketEvents.CHAT_MESSAGE,
      ({ roomId, message }: ChatMessagePayload) => {
        const sender = this.roomRepository.getParticipant(roomId, socket.id);

        if (!sender) {
          console.warn("================================");
          console.warn("[CHAT] Sender not found");
          console.warn({
            roomId,
            socketId: socket.id,
          });
          console.warn("================================");
          return;
        }

        const target = this.roomRepository.getOtherParticipant(
          roomId,
          socket.id,
        );

        if (!target) {
          console.warn("================================");
          console.warn("[CHAT] No participant found");
          console.warn({
            roomId,
            from: socket.id,
          });
          console.warn("================================");
          return;
        }

        io.to(target.socketId).emit(SocketEvents.CHAT_MESSAGE, {
          roomId,
          message,
          senderId: sender.userId,
          senderRole: sender.role,
          sentAt: new Date().toISOString(),
        });
        console.log("================================");
        console.log("[CHAT] Message Sent");
        console.log({
          roomId,
          from: sender.userId,
          to: target.userId,
          role: sender.role,
          message,
        });
        console.log("================================");
      },
    );
  }
}
