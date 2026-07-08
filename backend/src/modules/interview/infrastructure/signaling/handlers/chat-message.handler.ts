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
          return;
        }

        const target = this.roomRepository.getOtherParticipant(
          roomId,
          socket.id,
        );

        if (!target) {
          return;
        }

        io.to(target.socketId).emit(SocketEvents.CHAT_MESSAGE, {
          roomId,
          message,
          senderId: sender.userId,
          senderRole: sender.role,
          sentAt: new Date().toISOString(),
        });
      },
    );
  }
}
